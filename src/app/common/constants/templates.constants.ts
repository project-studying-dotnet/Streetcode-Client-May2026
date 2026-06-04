// constants/templates.constants.ts

export interface SlotConfig {
  id: string;
}

export interface TemplateConfig {
  id: number;
  name: string; 
  gap: number;
  slots: SlotConfig[];
}

export const TEMPLATES_CONFIG: TemplateConfig[] = [
  { id: 1, name: 'main-big', gap: 5, slots: [{id: 'big'}] },
  { id: 2, name: 'medium', gap: 5, slots: [{id: 'mid1'}] },
  { id: 3, name: 'two-medium', gap: 5, slots: [{id: 'mid1'}, {id: 'mid2'}] },
  { id: 4, name: 'mid-plus-two-small', gap: 4, slots: [{id: 'mid'}, {id: 's1'}, {id: 's2'}] },
  { id: 5, name: 'four-small', gap: 4, slots: [{id: 's1'}, {id: 's2'}, {id: 's3'}, {id: 's4'}] }
];