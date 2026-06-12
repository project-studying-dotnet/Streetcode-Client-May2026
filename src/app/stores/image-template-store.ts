import { makeAutoObservable } from 'mobx';
import { arrayMove } from '@dnd-kit/sortable';
import { TEMPLATES_CONFIG } from '../common/constants/templates.constants';

export default class ImageTemplateStore {
    public templates = TEMPLATES_CONFIG;
    public activeTemplate = TEMPLATES_CONFIG[0];

    savedTemplates: any[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    public setActiveTemplate = (template: any) => {
        this.activeTemplate = template;
    };

    addTemplate(template: any) {
        this.savedTemplates.push(template);
    }

    reorderTemplates(oldIndex: number, newIndex: number) {
        this.savedTemplates = arrayMove(this.savedTemplates, oldIndex, newIndex);
    }

    updateTemplate(updatedTemplate: any) {
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
}