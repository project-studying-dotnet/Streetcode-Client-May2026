import { makeAutoObservable, runInAction } from 'mobx';
import factsApi from '@api/streetcode/text-content/facts.api';
import { ModelState } from '@models/enums/model-state';
import { Fact, FactCreate, FactUpdate } from '@models/streetcode/text-contents.model';

import { ImageDetails } from '@/models/media/image.model';

const getFactIndex = (fact: Fact): number => fact.index ?? 0;

export default class FactsStore {
    public factMap = new Map<number, Fact>();

    public factImageDetailsMap = new Map<number, ImageDetails>();

    public adminStreetcodeId: number | null = null;

    private tempIdCounter = -1;

    public constructor() {
        makeAutoObservable(this);
    }

    public setAdminStreetcodeId = (streetcodeId: number | null) => {
        this.adminStreetcodeId = streetcodeId;
    };

    public getNextTempId = (): number => {
        const id = this.tempIdCounter;
        this.tempIdCounter -= 1;
        return id;
    };

    private setInternalMap = (facts: Fact[]) => {
        [...facts]
            .sort((a, b) => getFactIndex(a) - getFactIndex(b))
            .forEach((item, index) => {
                const updatedItem: FactUpdate = {
                    ...item,
                    index,
                    isPersisted: true,
                    modelState: ModelState.Updated,
                };

                this.setItem(updatedItem);
            });
    };

    public setImageDetails = (fact: FactCreate, imageDetailId: number) => {
        this.factImageDetailsMap.set(fact.imageId, {
            id: imageDetailId,
            imageId: fact.imageId,
            alt: fact.imageDescription,
            title: '',
        });
    };

    public addFact = (fact: Fact) => {
        const factToUpdate: FactUpdate = {
            ...fact,
            modelState: ModelState.Created,
        };

        this.setItem(factToUpdate);
    };

    public deleteFactFromMap = (factId: number) => {
        const fact = this.factMap.get(factId) as FactUpdate;
        if (fact && fact.isPersisted) {
            const factToUpdate: FactUpdate = {
                ...fact,
                modelState: ModelState.Deleted,
            };
            this.setItem(factToUpdate);
        } else {
            this.factMap.delete(factId);
        }
    };

    public updateFactInMap = (fact: FactUpdate) => {
        this.setItem(fact);
        this.factImageDetailsMap.set(
            fact.imageId,
            { id: 0, imageId: fact.imageId, alt: fact.imageDescription, title: '' },
        );
    };

    private setItem = (fact: Fact) => {
        this.factMap.set(fact.id, fact);
    };

    get getFactArray() {
        return (Array.from(this.factMap.values()) as FactUpdate[])
            .filter((item: FactUpdate) => item.modelState !== ModelState.Deleted)
            .sort((a, b) => getFactIndex(a) - getFactIndex(b));
    }

    public reorderFacts = (sourceIndex: number, destinationIndex: number) => {
        const facts = [...this.getFactArray];
        const [removed] = facts.splice(sourceIndex, 1);
        facts.splice(destinationIndex, 0, removed);

        runInAction(() => {
            facts.forEach((fact, index) => {
                this.setItem({ ...fact, index });
            });
        });
    };

    public persistFactsOrder = async (): Promise<boolean> => {
        const streetcodeId = this.adminStreetcodeId;
        if (!streetcodeId) {
            return false;
        }

        const facts = this.getFactArray.filter((f) => f.id > 0);

        try {
            for (let index = 0; index < facts.length; index += 1) {
                const fact = facts[index];
                await factsApi.update({
                    ...fact,
                    index,
                    streetcodeId,
                } as Fact);
                runInAction(() => {
                    this.setItem({ ...fact, index });
                });
            }
            return true;
        } catch {
            await this.fetchFactsByStreetcodeId(streetcodeId);
            return false;
        }
    };

    public addFactToCreate = (fact: FactCreate, streetcodeId: number) => {
        const factToAdd: FactUpdate = {
            ...fact,
            id: this.getNextTempId(),
            streetcodeId,
            index: this.getFactArray.length,
            modelState: ModelState.Created,
            isPersisted: false,
        };
        this.setItem(factToAdd);
        return factToAdd;
    };

    public saveAdminFact = async (
        payload: FactCreate,
        streetcodeId: number,
        existingFactId?: number,
    ): Promise<Fact | undefined> => {
        const index = existingFactId !== undefined
            ? getFactIndex(this.factMap.get(existingFactId) as Fact)
            : this.getFactArray.length;

        if (existingFactId !== undefined && existingFactId > 0) {
            const existing = this.factMap.get(existingFactId) as FactUpdate;
            const factToUpdate: Fact = {
                ...existing,
                ...payload,
                id: existingFactId,
                index,
                streetcodeId,
            };
            await this.updateFact(factToUpdate);
            return this.factMap.get(existingFactId);
        }

        const factToCreate: Fact = {
            id: 0,
            title: payload.title,
            factContent: payload.factContent,
            imageId: payload.imageId,
            image: payload.image,
            imageDescription: payload.imageDescription,
            index,
            streetcodeId,
        } as Fact;

        try {
            const created = await factsApi.create(factToCreate);
            const updatedItem: FactUpdate = {
                ...created,
                index: created.index ?? index,
                imageDescription: payload.imageDescription,
                isPersisted: true,
                modelState: ModelState.Updated,
                streetcodeId,
            };
            this.setItem(updatedItem);
            if (payload.imageDescription) {
                this.setImageDetails(payload, created.imageId);
            }
            return created;
        } catch {
            return undefined;
        }
    };

    get getFactArrayToUpdate() {
        return (Array.from(this.factMap.values()) as FactUpdate[])
            .map((item: FactUpdate) => {
                if (item.modelState === ModelState.Created) {
                    return { ...item, id: 0 };
                }
                return item;
            });
    }

    public fetchFactsByStreetcodeId = async (streetcodeId: number): Promise<Fact[]> => {
        try {
            const facts = await factsApi.getFactsByStreetcodeId(streetcodeId);
            this.factMap.clear();
            this.setInternalMap(facts);
            return facts;
        } catch (error: unknown) {}
        return Array<Fact>(0);
    };

    public deleteAdminFact = async (factId: number) => {
        if (factId > 0) {
            await factsApi.delete(factId);
            runInAction(() => {
                this.factMap.delete(factId);
            });
            await this.reindexFactsAfterDelete();
            return;
        }

        runInAction(() => {
            this.factMap.delete(factId);
        });
    };

    private reindexFactsAfterDelete = async () => {
        const streetcodeId = this.adminStreetcodeId;
        if (!streetcodeId) {
            return;
        }

        runInAction(() => {
            this.getFactArray.forEach((fact, index) => {
                this.setItem({ ...fact, index });
            });
        });

        await this.persistFactsOrder();
    };

    public createFact = async (fact: Fact) => {
        try {
            await factsApi.create(fact);
            this.setItem(fact);
        } catch (error: unknown) { /* empty */ }
    };

    public updateFact = async (fact: Fact) => {
        try {
            await factsApi.update(fact);
            runInAction(() => {
                const updatedFact = {
                    ...this.factMap.get(fact.id),
                    ...fact,
                };
                this.setItem(updatedFact as Fact);
            });
        } catch (error: unknown) { /* empty */ }
    };

    public deleteFact = async (factId: number) => {
        try {
            await factsApi.delete(factId);
            runInAction(() => {
                this.factMap.delete(factId);
            });
        } catch (error: unknown) { /* empty */ }
    };
}
