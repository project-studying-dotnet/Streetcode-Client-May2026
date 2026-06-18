import { observer } from 'mobx-react-lite';
import { TEMPLATE_CLASS_MAP } from '@constants/template.map';
import './shared-grid.styles.scss';

export const TemplateRenderer = observer(({ template, renderSlot, className }: any) => {
  const config = TEMPLATE_CLASS_MAP[template?.name];

  const slots = config?.slots ?? [];
  const gap = config?.gap ?? 5;
  const templateClass = config?.className || 'template-default';

  return (
    <div 
      className={`preview-grid ${templateClass} ${className || ''}`}
      style={{ gap: `${gap}px` }}
    >
      {slots.map((slot: any, index: number) => (
        <div 
          key={slot.id} 
          className="preview-slot"
          style={{ gridArea: `slot-${index}` }} 
        >
          {renderSlot(slot)}
        </div>
      ))}
    </div>
  );
});