import React from 'react';
import { observer } from 'mobx-react-lite'; 
import { useModalContext } from '@stores/root-store'; 
import './TemplateGrid.styles.scss';

export const TemplateGrid = observer(() => { 
  const { templateStore } = useModalContext();
  const { activeTemplate } = templateStore;
if (!activeTemplate) {
    return <div>Загрузка шаблонов...</div>; 
  }
  return (
   <div className={`template-grid-container preview-grid ${activeTemplate.name}`}>
      
      {activeTemplate.slots.map((slot) => (
        <div 
          key={slot.id} 
          className="preview-slot" 
          onDrop={() => console.log(`Drop to ${slot.id}`)}
          onDragOver={(e) => e.preventDefault()} 
        >
        </div>
      ))}
      
    </div>
  );
});