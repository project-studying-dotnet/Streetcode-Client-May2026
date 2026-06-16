import { DragEndEvent } from '@dnd-kit/core';
import { TEMPLATE_CLASS_MAP } from '@constants/template.map';
import Image from '@models/media/image.model';

export const useArtGalleryDnD = (
  imageTemplateStore: any,
  images: Image[],
  templateSlots: Record<string, Image | null>,
  setTemplateSlots: React.Dispatch<React.SetStateAction<Record<string, Image | null>>>,
  actions: {
    reorderImages: (oldIdx: number, newIdx: number) => void;
    moveImageToTemplate: (id: number) => void;
    moveImageBackToGallery: (img: Image) => void;
  },
  setActiveId: React.Dispatch<React.SetStateAction<string | null>> // если используешь
) => {

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId?.(null);

    if (!over || !active) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const templateName = imageTemplateStore.activeTemplate?.name;

    const config = templateName
      ? TEMPLATE_CLASS_MAP[templateName]
      : null;

    const slotsToCheck =
      imageTemplateStore.activeTemplate?.slots ||
      config?.slots ||
      [];

    const isSlot = slotsToCheck.some(
      (s: any) => String(s.id) === overId
    );

    // -------------------------
    // reorder templates
    // -------------------------
    if (activeId.startsWith('tmpl_') && overId.startsWith('tmpl_')) {
      const rawActive = activeId.replace('tmpl_', '');
      const rawOver = overId.replace('tmpl_', '');

      const oldIndex = imageTemplateStore.savedTemplates.findIndex(
        (t: any) => String(t.id) === rawActive
      );

      const newIndex = imageTemplateStore.savedTemplates.findIndex(
        (t: any) => String(t.id) === rawOver
      );

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        imageTemplateStore.reorderTemplates(oldIndex, newIndex);
      }
      return;
    }

    // -------------------------
    // reorder images in gallery
    // -------------------------
    if (activeId.startsWith('img_') && overId.startsWith('img_')) {
      const oldIndex = images.findIndex(
        i => `img_${i.id}` === activeId
      );

      const newIndex = images.findIndex(
        i => `img_${i.id}` === overId
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        actions.reorderImages(oldIndex, newIndex);
      }
      return;
    }

    // -------------------------
    // drag image → slot
    // -------------------------
    if (activeId.startsWith('img_')) {
      const rawActiveId = activeId.replace('img_', '');

      const dragged = images.find(
        i => String(i.id) === rawActiveId
      );

      if (isSlot && dragged) {
        if (templateSlots[overId]) {
          console.log('The slot is already occupied!');
          return;
        }

        setTemplateSlots(prev => ({
          ...prev,
          [overId]: dragged
        }));

        actions.moveImageToTemplate(dragged.id);

        return;
      }

      // -------------------------
      // return image from slot to gallery
      // -------------------------
      if (overId === 'gallery') {
        const imgInSlot = Object.values(templateSlots).find(
          i => String(i?.id) === rawActiveId
        );

        if (imgInSlot) {
          setTemplateSlots(prev => {
            const copy = { ...prev };

            Object.keys(copy).forEach(k => {
              if (copy[k]?.id === imgInSlot.id) {
                copy[k] = null;
              }
            });

            return copy;
          });

          actions.moveImageBackToGallery(imgInSlot);
        }
      }
    }
  };

  return { handleDragEnd };
};