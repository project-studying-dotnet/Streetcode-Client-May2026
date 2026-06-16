import { useState } from 'react';
import { TemplateRenderer } from '@components/ImageTemplates-grid/TemplateRenderer';

import { useModalContext } from '@/app/stores/root-store';
import './TemplateCard.styles.scss';

export const TemplateCard = ({ template, attributes, isActive, listeners, onEdit, onDelete }: any) => {
    const [isHovered, setIsHovered] = useState(false);
    const { modalStore: { setModal }, imageTemplateStore } = useModalContext();


    console.log("template", template)
    return (
        <button
            className={`template-card ${isActive ? 'template-active' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {isHovered && (
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
                            setModal('deleteImageTemplates', undefined, true, {
                                onConfirm: () => onDelete(template.id)
                            });
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

                        const art = image ? imageTemplateStore.getArtByImageId(image.id) : null;

                        if (!image?.url) return null;
                        return (
                            <div className="slot-wrapper">
                                <img src={image.url} alt="slot" />

                                {art && (
                                    <div className="art-info-tooltip">
                                        <div className="art-title">{art.title}</div>
                                        <div className="art-desc">{art.description}</div>
                                    </div>
                                )}
                            </div>
                        );
                    }}
                />
            </div>
        </button>
    );
};