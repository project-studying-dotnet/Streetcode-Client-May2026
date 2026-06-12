import { makeAutoObservable } from 'mobx';
import { arrayMove } from '@dnd-kit/sortable';

export default class TemplateStore {
    savedTemplates: any[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    setSavedTemplates(templates: any[]) {
        this.savedTemplates = templates;
    }
    reorderTemplates(oldIndex: number, newIndex: number) {
        this.savedTemplates = arrayMove(this.savedTemplates, oldIndex, newIndex);
    }

    addTemplate(template: any) {
        this.savedTemplates.push(template);
    }
    updateTemplateStatus(id: number, status: Partial<{ isSavedToDb: boolean }>) {
        const template = this.savedTemplates.find(t => t.id === id);
        if (template) {
            Object.assign(template, status);
        }
    }
}