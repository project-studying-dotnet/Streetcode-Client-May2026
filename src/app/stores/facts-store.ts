import { makeAutoObservable, runInAction } from 'mobx';
import factsApi from '@api/streetcode/text-content/facts.api';
import ImagesApi from '@api/media/images.api';
import { ModelState } from '@models/enums/model-state';
import {
    Fact, FactAdminSavePayload, FactCreate, FactUpdate,
} from '@models/streetcode/text-contents.model';

import { ImageDetails } from '@/models/media/image.model';

const getFactIndex = (fact: Fact): number => fact.index ?? 0;

const isFactUpdate = (fact: Fact): fact is FactUpdate => 'modelState' in fact;

const toFactUpdate = (fact: Fact, overrides: Partial<FactUpdate> = {}): FactUpdate => ({
    ...(fact as FactUpdate),
    ...overrides,
});

const mergeFactWithApiResponse = (
    original: Fact,
    response: Fact,
    overrides: Partial<FactUpdate> = {},
): FactUpdate => toFactUpdate(
    { ...original, ...response, id: original.id },
    overrides,
);

const logFactsStoreError = (operation: string, error: unknown) => {
    if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error(`[FactsStore] ${operation}`, error);
    }
};

const toErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
        return error.message;
    }
    return 'Сталася невідома помилка';
};

export default class FactsStore {
    public factMap = new Map<number, Fact>();

    public factImageDetailsMap = new Map<number, ImageDetails>();

    public adminStreetcodeId: number | null = null;

    public isLoading = false;

    public isSaving = false;

    public lastError: string | null = null;

    private tempIdCounter = -1;

    public constructor() {
        makeAutoObservable(this);
    }

    public clearError = () => {
        this.lastError = null;
    };

    public setAdminStreetcodeId = (streetcodeId: number | null) => {
        this.adminStreetcodeId = streetcodeId;
    };

    public getNextTempId = (): number => {
        const id = this.tempIdCounter;
        this.tempIdCounter -= 1;
        return id;
    };

    private readonly syncImageDetailsFromFact = (fact: FactUpdate) => {
        if (!fact.imageId || !fact.imageDescription) {
            return;
        }

        this.factImageDetailsMap.set(fact.imageId, {
            id: fact.image?.imageDetails?.id ?? 0,
            imageId: fact.imageId,
            alt: fact.imageDescription,
            title: fact.image?.imageDetails?.title ?? '',
        });
    };

    private readonly applyIndexes = (facts: FactUpdate[]) => {
        facts.forEach((fact, index) => {
            this.setItem({ ...fact, index });
        });
    };

    private readonly removeStaleAdminFacts = (activeFactIds: number[]) => {
        const streetcodeId = this.adminStreetcodeId;
        if (!streetcodeId) {
            return;
        }

        const activeIds = new Set(activeFactIds);

        runInAction(() => {
            Array.from(this.factMap.entries()).forEach(([id, fact]) => {
                if (fact.streetcodeId !== streetcodeId) {
                    return;
                }

                if (id <= 0 || !activeIds.has(id)) {
                    this.factMap.delete(id);
                }
            });
        });
    };

    private setInternalMap = (facts: Fact[]) => {
        const sortedFacts = [...facts].sort((a, b) => getFactIndex(a) - getFactIndex(b));

        runInAction(() => {
            sortedFacts.forEach((item, index) => {
                const updatedItem = toFactUpdate(item, {
                    index,
                    isPersisted: true,
                    modelState: ModelState.Updated,
                });
                this.setItem(updatedItem);
                this.syncImageDetailsFromFact(updatedItem);
            });
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
        const factToUpdate = toFactUpdate(fact, {
            modelState: ModelState.Created,
        });

        this.setItem(factToUpdate);
    };

    public deleteFactFromMap = (factId: number) => {
        const fact = this.factMap.get(factId);
        if (!fact) {
            return;
        }

        if (isFactUpdate(fact) && fact.isPersisted) {
            this.setItem(toFactUpdate(fact, {
                modelState: ModelState.Deleted,
            }));
            return;
        }

        runInAction(() => {
            this.factMap.delete(factId);
        });
    };

    public updateFactInMap = (fact: FactUpdate) => {
        runInAction(() => {
            this.setItem(fact);
            this.syncImageDetailsFromFact(fact);
        });
    };

    private setItem = (fact: Fact) => {
        this.factMap.set(fact.id, fact);
    };

    get getFactArray(): FactUpdate[] {
        return Array.from(this.factMap.values())
            .filter((item): item is FactUpdate => (
                !isFactUpdate(item) || item.modelState !== ModelState.Deleted
            ))
            .sort((a, b) => getFactIndex(a) - getFactIndex(b));
    }

    public reorderFacts = (sourceIndex: number, destinationIndex: number): boolean => {
        const facts = [...this.getFactArray];
        const [removed] = facts.splice(sourceIndex, 1);

        if (!removed) {
            return false;
        }

        facts.splice(destinationIndex, 0, removed);

        runInAction(() => {
            this.applyIndexes(facts);
        });

        return true;
    };

    public persistFactsOrder = async (): Promise<boolean> => {
        const streetcodeId = this.adminStreetcodeId;
        if (!streetcodeId) {
            return false;
        }

        const facts = this.getFactArray.filter((f) => f.id > 0);
        const activeFactIds = facts.map((f) => f.id);

        this.isSaving = true;
        this.lastError = null;

        try {
            await Promise.all(
                facts.map(async (fact, index) => {
                    const factToUpdate: Fact = {
                        ...fact,
                        index,
                        streetcodeId,
                    };
                    const updated = await factsApi.update(factToUpdate);
                    runInAction(() => {
                        this.setItem(mergeFactWithApiResponse(fact, updated, {
                            index,
                            streetcodeId,
                            isPersisted: true,
                            modelState: ModelState.Updated,
                        }));
                    });
                }),
            );
            this.removeStaleAdminFacts(activeFactIds);
            return true;
        } catch (error: unknown) {
            logFactsStoreError('persistFactsOrder', error);
            runInAction(() => {
                this.lastError = toErrorMessage(error);
            });
            await this.fetchFactsByStreetcodeId(streetcodeId);
            return false;
        } finally {
            runInAction(() => {
                this.isSaving = false;
            });
        }
    };

    public addFactToCreate = (fact: FactCreate, streetcodeId: number) => {
        const factToAdd = toFactUpdate(fact, {
            id: this.getNextTempId(),
            streetcodeId,
            index: this.getFactArray.length,
            modelState: ModelState.Created,
            isPersisted: false,
        });
        this.setItem(factToAdd);
        return factToAdd;
    };

    public saveAdminFact = async (
        payload: FactAdminSavePayload,
        streetcodeId: number,
        existingFactId?: number,
    ): Promise<Fact> => {
        this.isSaving = true;
        this.lastError = null;

        try {
            const existingFact = typeof existingFactId === 'number'
                ? this.factMap.get(existingFactId)
                : undefined;
            const index = existingFact
                ? getFactIndex(existingFact)
                : this.getFactArray.length;

            if (typeof existingFactId === 'number' && existingFactId > 0) {
                const existing = this.factMap.get(existingFactId);
                if (!existing) {
                    throw new Error('Факт для редагування не знайдено');
                }

                const factToUpdate: Fact = {
                    ...existing,
                    ...payload,
                    id: existingFactId,
                    index,
                    streetcodeId,
                };
                const updated = await this.updateFact(factToUpdate);
                return updated;
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
            };

            const created = await factsApi.create(factToCreate);
            const updatedItem = toFactUpdate(created, {
                index: created.index ?? index,
                imageDescription: payload.imageDescription,
                isPersisted: true,
                modelState: ModelState.Updated,
                streetcodeId,
            });

            runInAction(() => {
                this.setItem(updatedItem);
                if (payload.imageDescription) {
                    this.setImageDetails(payload, created.imageId);
                } else {
                    this.syncImageDetailsFromFact(updatedItem);
                }
            });

            return created;
        } catch (error: unknown) {
            logFactsStoreError('saveAdminFact', error);
            runInAction(() => {
                this.lastError = toErrorMessage(error);
            });
            throw error;
        } finally {
            runInAction(() => {
                this.isSaving = false;
            });
        }
    };

    get getFactArrayToUpdate() {
        return this.getFactArray.map((item) => (
            item.modelState === ModelState.Created
                ? { ...item, id: 0 }
                : item
        ));
    }

    public fetchFactsByStreetcodeId = async (streetcodeId: number): Promise<Fact[]> => {
        this.isLoading = true;
        this.lastError = null;

        try {
            const facts = await factsApi.getFactsByStreetcodeId(streetcodeId);
            runInAction(() => {
                this.factMap.clear();
                this.setInternalMap(facts);
            });
            return facts;
        } catch (error: unknown) {
            logFactsStoreError('fetchFactsByStreetcodeId', error);
            runInAction(() => {
                this.lastError = toErrorMessage(error);
            });

            if (this.adminStreetcodeId === streetcodeId) {
                throw error;
            }

            return [];
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    };

    public fetchAdminFactsWithImages = async (streetcodeId: number): Promise<FactUpdate[]> => {
        const facts = await this.fetchFactsByStreetcodeId(streetcodeId);

        try {
            await Promise.all(
                facts.map(async (fact) => {
                    if (!fact.imageId || fact.image) {
                        return;
                    }

                    const image = await ImagesApi.getById(fact.imageId);
                    runInAction(() => {
                        this.updateFactInMap(toFactUpdate(fact, { image }));
                    });
                }),
            );
        } catch (error: unknown) {
            logFactsStoreError('fetchAdminFactsWithImages', error);
            runInAction(() => {
                this.lastError = toErrorMessage(error);
            });
            throw error;
        }

        return this.getFactArray;
    };

    public deleteAdminFact = async (factId: number) => {
        this.isSaving = true;
        this.lastError = null;

        try {
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
        } catch (error: unknown) {
            logFactsStoreError('deleteAdminFact', error);
            runInAction(() => {
                this.lastError = toErrorMessage(error);
            });
            throw error;
        } finally {
            runInAction(() => {
                this.isSaving = false;
            });
        }
    };

    private readonly reindexFactsAfterDelete = async () => {
        const streetcodeId = this.adminStreetcodeId;
        if (!streetcodeId) {
            return;
        }

        runInAction(() => {
            this.applyIndexes(this.getFactArray);
        });

        await this.persistFactsOrder();
    };

    public createFact = async (fact: Fact) => {
        try {
            const created = await factsApi.create(fact);
            runInAction(() => {
                this.setItem(created);
            });
        } catch (error: unknown) {
            logFactsStoreError('createFact', error);
            throw error;
        }
    };

    public updateFact = async (fact: Fact): Promise<Fact> => {
        try {
            const updated = await factsApi.update(fact);
            const merged = mergeFactWithApiResponse(fact, updated, {
                isPersisted: true,
                modelState: ModelState.Updated,
            });
            runInAction(() => {
                this.setItem(merged);
                this.syncImageDetailsFromFact(merged);
            });
            return updated;
        } catch (error: unknown) {
            logFactsStoreError('updateFact', error);
            throw error;
        }
    };

    public deleteFact = async (factId: number) => {
        try {
            await factsApi.delete(factId);
            runInAction(() => {
                this.factMap.delete(factId);
            });
        } catch (error: unknown) {
            logFactsStoreError('deleteFact', error);
            throw error;
        }
    };
}
