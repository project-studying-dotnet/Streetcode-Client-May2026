import { makeAutoObservable, runInAction } from 'mobx';
import { arrayMove } from '@dnd-kit/sortable';
import ArtSlideTemplatesApi from '@api/media/art-slide-templates.api';
import { ArtSlideTemplate } from '@models/media/art-slide-template.model';

export default class ImageTemplateStore {
    public TemplateMap = new Map<number, ArtSlideTemplate>();
    public activeTemplate: ArtSlideTemplate | null = null;
    public savedTemplates: ArtSlideTemplate[] = [];

    private isLoaded = false;
    public artsMap = new Map<number, any>();

    constructor() {
        makeAutoObservable(this);
    }

    get templates() {
        return Array.from(this.TemplateMap.values());
    }
    public setArtForImage = (imageId: number, art: any) => {
        runInAction(() => {
            this.artsMap.set(imageId, art);
        });
    }

    public getArtByImageId = (imageId: number) => {
        return this.artsMap.get(imageId);
    }

    public fetchTemplates = async () => {
        if (this.isLoaded) return;

        try {
            const data = await ArtSlideTemplatesApi.getAll();
            runInAction(() => {
                data.forEach(template => {
                    this.TemplateMap.set(template.id, template);
                });
                this.isLoaded = true;

                if (!this.activeTemplate && data.length > 0) {
                    this.activeTemplate = data[0];
                }
            });
        } catch (error: unknown) {
            console.error("Failed to fetch templates", error);
        }
    };

    public setActiveTemplate = (template: ArtSlideTemplate) => {
        this.activeTemplate = template;
    };

    public updateSlotWithArt = (imageId: number, art: any) => {
        runInAction(() => {
            const updateFunction = (template: ArtSlideTemplate) => {
                template.slots.forEach((slot: any) => {
                    if (slot.image?.id === imageId) {
                        slot.artId = art.id;
                        slot.art = art;
                    }
                });
            };

            this.templates.forEach(updateFunction);
            this.savedTemplates.forEach(updateFunction);
        });
    };

    addTemplate(template: ArtSlideTemplate) {
        this.savedTemplates.push(template);
    }

    reorderTemplates(oldIndex: number, newIndex: number) {
        this.savedTemplates = arrayMove(this.savedTemplates, oldIndex, newIndex);
    }

    updateTemplate(updatedTemplate: ArtSlideTemplate) {
        const index = this.savedTemplates.findIndex(t => t.id === updatedTemplate.id);
        if (index !== -1) {
            this.savedTemplates[index] = updatedTemplate;
        }
    }

    updateTemplateStatus(id: number, status: Partial<{ isSavedToDb: boolean }>) {
        const template = this.savedTemplates.find(t => t.id === id);
        if (template) {
            Object.assign(template, status);
        }
    }

    removeTemplate(id: number) {
        this.savedTemplates = this.savedTemplates.filter(t => t.id !== id);
    }
}