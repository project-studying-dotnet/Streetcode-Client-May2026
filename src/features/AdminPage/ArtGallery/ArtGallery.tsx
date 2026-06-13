import React, { useState, useEffect } from 'react';
import { TEMPLATE_CLASS_MAP } from '@constants/template.map';
import { observer } from 'mobx-react-lite';
import {
  DndContext,
  DragEndEvent,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor
} from '@dnd-kit/core';

import { arrayMove } from '@dnd-kit/sortable';

import { ArtImage } from '@models/media/image.model';
import { useArtGallery } from './hooks/useArtGallery';

import { GalleryList } from './components/ImageGallery/GalleryList';
import { TemplateGrid } from './components/TemplateGrid/TemplateGrid';
import { TemplatesHeader } from './components/Templates/TemplatesHeader';
import { SavedTemplatesCarousel } from './components/Carousel/SavedTemplatesCarousel';

import useMobx, { useModalContext } from '@/app/stores/root-store';

export const ArtGallery: React.FC = () => {
  const {
    addImage,
    removeImage,
    addImageBackToGallery,
    moveImageBackToGallery,
    moveImageToTemplate,
    reorderImages } = useArtGallery();

  const { imagesStore } = useMobx();
  const { modalStore, imageTemplateStore } = useModalContext();

  const images = imagesStore.getImageArray;

  const [templateSlots, setTemplateSlots] =
    useState<Record<string, ArtImage | null>>({});

  const [activeId, setActiveId] = useState<string | null>(null);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);



  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 1 }
    })
  );




  // -----------------------------
  // CLEAR ALL SLOTS
  // -----------------------------
  const clearAllSlots = () => {
    const returnedImages = Object.values(templateSlots).filter(
      (img): img is ArtImage => img !== null
    );
    returnedImages.forEach(img => {
      addImageBackToGallery(img);
    });
    setTemplateSlots({});
  };

  // -----------------------------
  // REMOVE FROM SLOT
  // -----------------------------
  const removeImageFromSlot = (imageId: number) => {
    console.log('Current slots:', templateSlots);
    console.log('Searching for ID:', imageId);


    const slotId = Object.keys(templateSlots).find(key => {
      const slotItem = templateSlots[key];
      return slotItem !== null && Number(slotItem.id) === Number(imageId);
    });

    if (!slotId) {
      console.warn('Слот с такой картинкой не найден');
      return;
    }

    const image = templateSlots[slotId];
    if (image) {
      console.log('Возвращаем картинку:', image);

      moveImageBackToGallery(image);

      setTemplateSlots(prev => ({ ...prev, [slotId]: null }));
    }
  };


  // -----------------------------
  // DRAG END
  // -----------------------------
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || !active) return;

    const activeId = String(active.id);
    const overId = String(over.id);

  const templateName = imageTemplateStore.activeTemplate?.name;

  const config = templateName ? TEMPLATE_CLASS_MAP[templateName] : null;

  const slotsToCheck = imageTemplateStore.activeTemplate?.slots || config?.slots || [];

  const isSlot = slotsToCheck.some((s: any) => String(s.id) === overId);

    // -------------------------
    // reorder templates
    // -------------------------
    if (activeId.startsWith('tmpl_') && overId.startsWith('tmpl_')) {
      const rawActive = activeId.replace('tmpl_', '');
      const rawOver = overId.replace('tmpl_', '');

      const oldIndex = imageTemplateStore.savedTemplates.findIndex(
        t => String(t.id) === rawActive
      );

      const newIndex = imageTemplateStore.savedTemplates.findIndex(
        t => String(t.id) === rawOver
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
        reorderImages(oldIndex, newIndex);
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

      // const isSlot =
      //   imageTemplateStore.activeTemplate?.slots.some(
      //     (s: any) => String(s.id) === overId
      //   );

      if (isSlot && dragged) {
        if (templateSlots[overId]) {
          console.log('Слот уже занят!');
          return;
        }

        setTemplateSlots(prev => ({
          ...prev,
          [overId]: dragged
        }));

        moveImageToTemplate(dragged.id);

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

          moveImageBackToGallery(imgInSlot);
        }
      }
    }
  };



  // -----------------------------
  // EDIT TEMPLATE
  // -----------------------------
  const handleEditTemplate = (template: any) => {
    setEditingTemplateId(template.id);

    const layout = imageTemplateStore.templates.find(
      (t: any) => t.name === template.templateName
    );

    if (layout) {
      imageTemplateStore.setActiveTemplate(layout);
    }

    setTemplateSlots({ ...template.slots });
  };

  // -----------------------------
  // SAVE TEMPLATE
  // -----------------------------
  const handleSave = () => {
    if (editingTemplateId) {
      imageTemplateStore.updateTemplate({
        id: editingTemplateId,
        slots: { ...templateSlots },
        templateName:
          imageTemplateStore.activeTemplate?.name || 'Updated',
        isSavedToDb: false
      });

      setEditingTemplateId(null);
    } else {
      imageTemplateStore.addTemplate({
        id: String(Date.now()),
        slots: { ...templateSlots },
        templateName:
          imageTemplateStore.activeTemplate?.name || 'Unnamed',
        isSavedToDb: false
      });
    }

    setTemplateSlots({});
  };

  // -----------------------------
  // SAVE TO DB
  // -----------------------------
  const saveToDb = async (templateToSave: any) => {
    try {
      console.log('Сохраняем шаблон:', templateToSave);

      imageTemplateStore.updateTemplateStatus(
        templateToSave.id,
        { isSavedToDb: true }
      );
    } catch (e) {
      console.error('Ошибка сохранения', e);
    }
  };
console.log("Состояние стора:", imagesStore); 
console.log("Массив картинок прямо сейчас:", images);

if (images && images.length > 0) {
  console.log("URL первой картинки:", images[0].url);
} else {
  console.log("Массив еще пуст, ждем ответа от сервера...");
}
  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <DndContext
      onDragStart={event =>
        setActiveId(String(event.active.id))
      }
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="art-gallery-container">

        <GalleryList
          images={images}
          onUpload={addImage}
          onDelete={removeImage}
          onEdit={console.log}
        />

        <section className="gallery-section">
          <TemplatesHeader
            onOpenTemplates={() =>
              modalStore.setModal('templates', undefined, true)
            }
          />

          <TemplateGrid
            slots={templateSlots}
            setSlots={setTemplateSlots}
            onClearAll={clearAllSlots}
            onSave={handleSave}
            onRemoveSlot={removeImageFromSlot}
          />
        </section>

        <SavedTemplatesCarousel
          savedTemplates={imageTemplateStore.savedTemplates}
          reorderTemplates={(oldIdx: number, newIdx: number) =>
            imageTemplateStore.reorderTemplates(oldIdx, newIdx)
          }
          onSaveToDb={saveToDb}
          onEdit={handleEditTemplate}
        />
      </div>
    </DndContext>
  );
};