import { makeAutoObservable, runInAction } from 'mobx';
import ArtSlideTemplatesApi from '@api/media/art-slide-templates.api';
import { ArtSlideTemplate } from '@models/media/art-slide-template.model';

export default class TemplateStore {
    public TemplateMap = new Map<number, ArtSlideTemplate>();

    public constructor() {
        makeAutoObservable(this);
    }

    public fetchTemplates = async () => {
        try {
            const templates = await ArtSlideTemplatesApi.getAll();
            runInAction(() => {
                templates.forEach(template => {
                    this.TemplateMap.set(template.id, template);
                });
            });
        } catch (error: unknown) {
            console.error("Failed to fetch templates", error);
        }
    };

    get getTemplateArray() {
        return Array.from(this.TemplateMap.values());
    }

   public getTemplateByName = (name: string) => {
        return this.getTemplateArray.find(t => t.name === name);
    };
}