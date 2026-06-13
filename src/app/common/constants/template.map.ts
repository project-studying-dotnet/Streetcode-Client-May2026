export interface SlotConfig {
  id: string;
}

export interface TemplateConfig {
  id: number;      
  className: string;
  gap: number;
  slots: SlotConfig[];
}

export const TEMPLATE_CLASS_MAP: Record<string, TemplateConfig> = {
  // 1 слот
  'OneToFour': { id: 3, className: 'template-single-large', gap: 5, slots: [{id: 'big'}] },
  'OneToTwo': { id: 4, className: 'template-single-medium', gap: 5, slots: [{id: 'mid1'}] },

  // 2 слота
  'OneToTwoAndThreeToFour': { id: 5, className: 'template-two-horizontal', gap: 5, slots: [{id: 'mid1'}, {id: 'mid2'}] },

  // 3 слота
  'OneToTwoAndThreeToFourAndFive': { id: 9, className: 'template-three-mixed', gap: 5, slots: [{id: 'mid'}, {id: 's1'}, {id: 's2'}] },

  // 4 слота
  'OneAndTwoAndThreeAndFour': { id: 8, className: 'template-four-grid', gap: 5, slots: [{id: 's1'}, {id: 's2'}, {id: 's3'}, {id: 's4'}] },
  'OneAndTwoAndThreeToFour': { id: 7, className: 'template-four-sidebar-left', gap: 5, slots: [{id: 'mid1'}, {id: 's1'}, {id: 's2'}, {id: 's3'}] },
  'OneToFourAndFiveAndSix': { id: 6, className: 'template-four-sidebar-right', gap: 5, slots: [{id: 'mid1'}, {id: 's1'}, {id: 's2'}, {id: 's3'}] },

  // 5 слотов
  'OneToFourAndFiveToSix': { id: 0, className: 'template-five-mixed', gap: 5, slots: [{id: 'mid1'}, {id: 's1'}, {id: 's2'}, {id: 's3'}, {id: 's4'}] },
  'OneAndTwoAndThreeToFourAndFive': { id: 11, className: 'template-five-grid', gap: 5, slots: [{id: 's1'}, {id: 's2'}, {id: 's3'}, {id: 's4'}, {id: 's5'}] },
  'OneAndTwoAndThreeAndFourAndFive': { id: 13, className: 'template-five-complex', gap: 5, slots: [{id: 's1'}, {id: 's2'}, {id: 's3'}, {id: 's4'}, {id: 's5'}] },

  // 6 слотов
  'OneAndTwoAndThreeAndFourAndFiveAndSix': { id: 2, className: 'template-six-grid', gap: 5, slots: [{id: 's1'}, {id: 's2'}, {id: 's3'}, {id: 's4'}, {id: 's5'}, {id: 's6'}] },
  'OneToTwoAndThreeToFourAndFiveToSix': { id: 1, className: 'template-six-compact', gap: 5, slots: [{id: 's1'}, {id: 's2'}, {id: 's3'}, {id: 's4'}, {id: 's5'}, {id: 's6'}] },
  'OneAndTwoAndThreeToFourAndFiveToSix': { id: 10, className: 'template-six-mixed', gap: 5, slots: [{id: 's1'}, {id: 's2'}, {id: 's3'}, {id: 's4'}, {id: 's5'}, {id: 's6'}] },
  'OneAndTwoAndThreeToFourAndFiveAndSix': { id: 12, className: 'template-six-large', gap: 5, slots: [{id: 's1'}, {id: 's2'}, {id: 's3'}, {id: 's4'}, {id: 's5'}, {id: 's6'}] },
};