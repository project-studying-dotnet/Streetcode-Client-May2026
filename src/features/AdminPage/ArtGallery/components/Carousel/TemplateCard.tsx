import { useState } from 'react';
import { TemplateRenderer } from '@components/ImageTemplates-grid/TemplateRenderer';
import './TemplateCard.styles.scss';

export const TemplateCard = ({ template, attributes, isActive, listeners, onEdit,onDelete }: any) => {
    const [isHovered, setIsHovered] = useState(false);
    console.log("template", template)
    return (
        <div
            className={`template-card ${isActive ? 'template-active' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {isHovered && (
                // <button
                //     className="edit-btn"
                //     onClick={(e) => {
                //         e.stopPropagation();
                //         onEdit(template);
                //     }}
                // >
                //     ✎
                // </button>

                <div className="controls-overlay__item">
                    <button
                        className="edit-btn"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(template);
                        }}
                    >
                        ✎
                    </button>

                   <button 
                   className="delete-btn"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                            e.stopPropagation();
                            e.nativeEvent.stopImmediatePropagation();
                           onDelete(template.id);
                        }}
                    >
                        🗑️
                         </button>
                </div>
            )}

            <div {...attributes} {...listeners} className="draggable-area">
                <TemplateRenderer
                    className="carousel-preview"
                    template={{
                        name: template.templateName,
                        slots: template.slots
                    }}
                    renderSlot={(slot: any) => {
                        const slotData = template.slots.find((s: any) => s.id === slot.id);
                        const image = slotData?.image;

                        return image?.url ? <img src={image.url} alt="slot" /> : null;
                    }}
                />
            </div>
        </div>
    );
};