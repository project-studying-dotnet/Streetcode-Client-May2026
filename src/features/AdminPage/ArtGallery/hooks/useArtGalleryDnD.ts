import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

export const useArtGalleryDnD = ({
  images,
  setImages,
  templateSlots,
  setTemplateSlots,
  imageTemplateStore,
  removeImage
}: any) => {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    if (
      activeId.startsWith('tmpl_') &&
      overId.startsWith('tmpl_')
    ) {
      const rawActive = activeId.replace('tmpl_', '');
      const rawOver = overId.replace('tmpl_', '');

      const oldIndex =
        imageTemplateStore.savedTemplates.findIndex(
          (t: any) => String(t.id) === rawActive
        );

      const newIndex =
        imageTemplateStore.savedTemplates.findIndex(
          (t: any) => String(t.id) === rawOver
        );

      if (
        oldIndex !== -1 &&
        newIndex !== -1 &&
        oldIndex !== newIndex
      ) {
        imageTemplateStore.reorderTemplates(
          oldIndex,
          newIndex
        );
      }

      return;
    }

    if (
      activeId.startsWith('img_') &&
      overId.startsWith('img_')
    ) {
      const oldIndex = images.findIndex(
        (i: any) => `img_${i.id}` === activeId
      );

      const newIndex = images.findIndex(
        (i: any) => `img_${i.id}` === overId
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        setImages(arrayMove(images, oldIndex, newIndex));
      }

      return;
    }

    if (activeId.startsWith('img_')) {
      const rawActiveId = activeId.replace('img_', '');

      const dragged = images.find(
        (i: any) => String(i.id) === rawActiveId
      );

      const isTargetSlot =
        imageTemplateStore.activeTemplate?.slots.some(
          (s: any) => String(s.id) === overId
        );

      if (isTargetSlot && dragged) {
        setTemplateSlots((prev: any) => ({
          ...prev,
          [overId]: dragged
        }));

        removeImage(dragged.id);
      }

      if (overId === 'gallery') {
        const imgInSlot = Object.values(templateSlots).find(
          (i: any) => i?.id === rawActiveId
        );

        if (imgInSlot) {
          setTemplateSlots((prev: any) => {
            const copy = { ...prev };

            Object.keys(copy).forEach(k => {
              if (copy[k]?.id === rawActiveId) {
                copy[k] = null;
              }
            });

            return copy;
          });

          setImages((prev: any) => [
            ...prev,
            imgInSlot
          ]);
        }
      }
    }
  };

  return {
    handleDragEnd
  };
};