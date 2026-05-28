import { makeAutoObservable } from 'mobx';
import StreetcodesApi from '@api/streetcode/streetcodes.api';
import Streetcode from '@models/streetcode/streetcode-types.model';

import { StreetcodeCatalogRecord } from '@/models/streetcode/streetcode-types.model';

export default class StreetcodesCatalogStore {
    public catalog = new Array<StreetcodeCatalogRecord>();

    public streetcodesMap = new Map<number, Streetcode>();

    public streetcode: Streetcode = null;

    constructor() {
        makeAutoObservable(this);
    }

    public fetchCatalogStreetcodes = async (page: number, count = 8) => {
        try {
            const array = await StreetcodesApi.getAllCatalog(page, count);
            if (this.catalog.length === 0
                || !array.some((item) => item.id === this.catalog.at(0)?.id)) {
                this.catalog = this.catalog.concat(array);
            }
        } catch (error) { }
    };

    get getCatalogStreetcodesArray() {
        return this.catalog;
    }

    public createStreetcode = async (streetcode: Streetcode) => {
        try {
            return await StreetcodesApi.create(streetcode).then((created) => {
                this.streetcodesMap.set(created.id, created);
                return created;
            });
        } catch (error: unknown) {
            return undefined;
        }
    };

    public updateStreetcode = async (streetcode: Streetcode) => {
        try {
            return await StreetcodesApi.update(streetcode).then((updated) => {
                this.streetcodesMap.set(updated.id, updated);
                return updated;
            });
        } catch (error: unknown) {
            return undefined;
        }
    };

    public static deleteStreetcode = async (id: number) => {
        try {
            await StreetcodesApi.delete(id);
        } catch (error: unknown) {
            return null;
        }
    };
}
