
import { makeAutoObservable } from 'mobx';
import { TEMPLATES_CONFIG } from '../common/constants/templates.constants';

export interface Template {
    id: number;
    name: string;
    gap: number;
    slots: { id: string }[];
}

export default class TemplateStore {
    public templates = TEMPLATES_CONFIG;
    public activeTemplate = this.templates[0];
    public constructor() { 
        makeAutoObservable(this); 
        if (!this.activeTemplate && this.templates.length > 0) {
            this.activeTemplate = this.templates[0];
        }
    }
    public setActiveTemplate = (template: any) => {
        this.activeTemplate = template;
    };
}