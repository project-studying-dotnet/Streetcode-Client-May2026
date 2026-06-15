import { action, makeAutoObservable, observable, runInAction } from 'mobx';
import sourcesApi from '@api/sources/sources.api';
import { SourceCategoryAdmin } from '@models/sources/sources.model';

export default class SourcesAdminStore {
    public srcSourcesMap = new Map<number, SourceCategoryAdmin>();

    public constructor() {
        makeAutoObservable(this, {
            srcSourcesMap: observable,
            fetchSourceCategories: action,
            addSourceCategory: action,
            deleteSourceCategory: action,
            setInternalSourceCategories: action,
            setSource: action,
            updateSourceCategory: action,
        });
    }

    public setSource = (srcCategory: SourceCategoryAdmin) => {
        if (!srcCategory.id) {
            return;
        }

        this.srcSourcesMap.set(srcCategory.id, srcCategory);
    };

    public setInternalSourceCategories(src: SourceCategoryAdmin[]) {
        this.srcSourcesMap.clear();
        src.forEach(this.setSource);
    }

    get getSourcesAdmin() {
        return Array.from(this.srcSourcesMap.values());
    }

    public fetchSourceCategories = async () => {
        try {
            const categories = await sourcesApi.getAllCategories();
            this.setInternalSourceCategories(categories);
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public deleteSourceCategory = async (srcId: number) => {
        try {
            await sourcesApi.deleteCategory(srcId);
            runInAction(() => {
                this.srcSourcesMap.delete(srcId);
            });
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public addSourceCategory = async (sourceItem: SourceCategoryAdmin) => {
        try {
            await sourcesApi.createCategory(sourceItem);
            await this.fetchSourceCategories();
        } catch (e: unknown) {
            console.log(e);
        }
    };

    public updateSourceCategory = async (sourceItem: SourceCategoryAdmin) => {
        try {
            await sourcesApi.updateCategory(sourceItem);
            await this.fetchSourceCategories();
        } catch (e: unknown) {
            console.log(e);
        }
    };
}