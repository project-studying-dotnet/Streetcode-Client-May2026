import React from 'react';
import { observer } from 'mobx-react-lite';
import './shared-grid.styles.scss';

export const TemplateRenderer = observer(({ template, renderSlot, className }: any) => {
  const templateClass = template.name.toLowerCase().replace(/-/g, '-');

  return (
    <div className={`preview-grid ${templateClass} ${className || ''}`}>
      {template.slots.map((slot: any) => (
        <div key={slot.id} className="preview-slot">
          {renderSlot(slot)}
        </div>
      ))}
    </div>
  );
});