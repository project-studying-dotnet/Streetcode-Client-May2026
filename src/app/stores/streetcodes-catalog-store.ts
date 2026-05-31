import { makeAutoObservable } from 'mobx';
import StreetcodesApi from '@api/streetcode/streetcodes.api';
import Streetcode from '@models/streetcode/streetcode-types.model';

import { StreetcodeCatalogRecord } from '@/models/streetcode/streetcode-types.model';

interface StreetcodesResponse {
    pages: number;
    streetcodes: Streetcode[];
}

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

    public createStreetcode = async (streetcode: Streetcode) => StreetcodesApi.create(streetcode).then((created) => {
        this.streetcodesMap.set(created.id, created);
        return created;
    });

    public updateStreetcode = async (streetcode: Streetcode) => StreetcodesApi.update(streetcode).then((updated) => {
        this.streetcodesMap.set(updated.id, updated);
        return updated;
    });

    public static readonly deleteStreetcode = async (id: number) => {
        await StreetcodesApi.delete(id);
    };

    public fetchStreetcodesAll = async () => {
        const response: StreetcodesResponse = await StreetcodesApi.getAll();
        this.setInternalMap(response.streetcodes);
    };

    get getStreetcodesArray() {
        return Array.from(this.streetcodesMap.values());
    }

    public setInternalMap(streetcodes: Streetcode[]) {
        this.streetcodesMap.clear();
        streetcodes.forEach(this.setItem);
    }

    public setItem = (streetcode: Streetcode) => {
        this.streetcodesMap.set(streetcode.id, streetcode);
    };
}
