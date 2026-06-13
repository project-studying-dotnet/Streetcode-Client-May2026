import { useDroppable } from '@dnd-kit/core';
import './TemplateGrid.styles.scss';


export const DroppableSlot = ({ slot, image, onRemove, isEditing }: any) => {
  const { setNodeRef } = useDroppable({ id: String(slot.id) });

  return (
    <div ref={setNodeRef} className="slot-content">
      {image && (
        <>
          <img src={image.url} alt="art" className="slot-image" />

          {isEditing && (
            <button
              className="remove-slot-btn"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(slot.id);
              }}
            >
              🗑️
            </button>
          )}
        </>
      )}
    </div>
  );
};
