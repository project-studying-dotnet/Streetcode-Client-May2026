import  { useState } from 'react';
import { TemplateRenderer } from '@components/ImageTemplates-grid/TemplateRenderer';
import './TemplateCard.styles.scss';

export const TemplateCard = ({ template, attributes, listeners, onEdit }: any) => {
    const [isHovered, setIsHovered] = useState(false);
console.log("template", template)
    return (
        <div 
            className="template-card"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {isHovered && (
                <button 
                    className="edit-btn" 
                    onClick={(e) => {
                        e.stopPropagation(); 
                        onEdit(template);
                    }}
                >
                    ✎
                </button>
            )}

            <div {...attributes} {...listeners} className="draggable-area">
                <TemplateRenderer
                    className="carousel-preview"
                    template={{ 
                        name: template.templateName, 
                        slots: Object.entries(template.slots).map(([id]) => ({ id })) 
                    }}
                    renderSlot={(slot: any) => {
                        const image = template.slots[slot.id];
                        return image?.url ? <img src={image.url} alt="slot" /> : null;
                    }}
                />
            </div>
        </div>
    );
};