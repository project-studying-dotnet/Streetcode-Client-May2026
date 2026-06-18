import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useModalContext } from '@stores/root-store';
import { TemplateRenderer } from '@components/ImageTemplates-grid/TemplateRenderer';
import { DroppableSlot } from './DroppableSlot';
import './TemplateGrid.styles.scss';

export const TemplateGrid = observer(({
  slots,
  onClearAll,
  onSave,
  onRemoveSlot
}: any) => {
  const { imageTemplateStore } = useModalContext();

  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const isTemplateFilled = slots && Object.values(slots).some((image) => image !== null);

  useEffect(() => {
    imageTemplateStore.fetchTemplates();
  }, [imageTemplateStore]);

  useEffect(() => {
    if (!isTemplateFilled) {
      setIsEditing(false);
    }
  }, [isTemplateFilled]);

  if (!imageTemplateStore.activeTemplate) {
    return <div>Download templates...</div>;
  }

  console.log("imageTemplateStore",imageTemplateStore);
  return (
    <div className="template-grid-wrapper">

      <TemplateRenderer
        template={imageTemplateStore.activeTemplate}
        renderSlot={(slot: any) => (
          <DroppableSlot
            slot={slot}
            image={slots[slot.id]}
            onRemove={() => onRemoveSlot(slots[slot.id]?.id)}
            isEditing={isEditing}
          />
        )}
      />

      {isTemplateFilled && (
        <div className="template-actions">
          <button
            className="dots-menu"
            onClick={() => setShowMenu(!showMenu)}
          >
            ⋮
          </button>

          {showMenu && (
            <div className="menu-overlay">
              <button
                onClick={() => {
                  setIsEditing(true);
                  setShowMenu(false);
                }}
              >
                Редагувати
              </button>

              <button
                onClick={() => {
                  onClearAll();
                  setShowMenu(false);
                  setIsEditing(false);
                }}
              >
                Видалити все
              </button>

              <button
                onClick={() => {
                  onSave();
                  setShowMenu(false);
                  setIsEditing(false);
                }}
                className="save-btn"
              >
                Зберегти
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
});