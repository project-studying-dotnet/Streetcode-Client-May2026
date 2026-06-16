import React, { useState } from 'react';
import { ArtSlideTemplate } from '@models/media/art-slide-template.model';

import { Spin, message } from 'antd';
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor
} from '@dnd-kit/core';

import Image from '@models/media/image.model';
import { useArtGallery } from './hooks/useArtGallery';
import { useArtGalleryDnD } from './hooks/useArtGalleryDnD';

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
  const { modalStore, imageTemplateStore, artSlideStore } = useModalContext();
  const [loading, setLoading] = useState(false);

  const images = imagesStore.getImageArray;
  console.log("Весь объект images:", images);

  const [templateSlots, setTemplateSlots] =
    useState<Record<string, Image | null>>({});

  const [activeId, setActiveId] = useState<string | null>(null);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);



  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }
    })
  );
  const actions = React.useMemo(() => ({
    reorderImages,
    moveImageToTemplate,
    moveImageBackToGallery
  }), [reorderImages, moveImageToTemplate, moveImageBackToGallery]);


  const { handleDragEnd } = useArtGalleryDnD(
    imageTemplateStore,
    imagesStore.getImageArray,
    templateSlots,
    setTemplateSlots,
    actions,
    setActiveId
  );



  // -----------------------------
  // CLEAR ALL SLOTS
  // -----------------------------
  const clearAllSlots = () => {
    const returnedImages = Object.values(templateSlots).filter(
      (img): img is Image => img !== null
    );
    returnedImages.forEach(img => {
      addImageBackToGallery(img);
    });
    setTemplateSlots({});
  };

  // -----------------------------
  // REMOVE FROM SLOT
  // -----------------------------
  const removeImageFromSlot = (imageId: number | undefined) => {
    if (!imageId) return;

    imageTemplateStore.artsMap.delete(imageId);

    const imageObj = Object.values(templateSlots).find(img => img?.id === imageId);

    if (imageObj) {
      moveImageBackToGallery(imageObj);
    }

    setTemplateSlots(prev => {
      const newSlots = { ...prev };
      Object.keys(newSlots).forEach(key => {
        if (newSlots[key]?.id === imageId) {
          newSlots[key] = null;
        }
      });
      return newSlots;
    });
  };


  // -----------------------------
  // EDIT TEMPLATE
  // -----------------------------
  const handleEditTemplate = (template: any) => {
    const isGridOccupied = Object.values(templateSlots).some((slot) => slot !== null);

    if (isGridOccupied) {
      message.warning("Спочатку очистіть або збережіть поточний шаблон, перш ніж редагувати інший!");
      return;
    }
    setEditingTemplateId(template.id);

    const layout = imageTemplateStore.templates.find(
      (t: any) => t.name === template.templateName
    );

    if (layout) {
      imageTemplateStore.setActiveTemplate(layout);
    }

    const slotsMap = template.slots.reduce((acc: any, slot: any) => {
      acc[slot.id] = slot.image || null;
      return acc;
    }, {});

    console.log("Setting template slots for edit:", slotsMap);
    setTemplateSlots(slotsMap);
  };

  // -----------------------------
  // SAVE TEMPLATE
  // -----------------------------
  const handleSave = () => {
    console.log("editingTemplateId", editingTemplateId);
    const slotsArray = Object.entries(templateSlots).map(
      ([slotId, image]) => ({
        id: slotId,
        artId: image ? Number(image.id) : 0,
        image
      })
    );

    if (editingTemplateId) {
      imageTemplateStore.updateTemplate({
        id: Number(editingTemplateId),
        slots: slotsArray,
        templateName: imageTemplateStore.activeTemplate?.name || 'Updated',
        templateId: imageTemplateStore.activeTemplate?.id || 0,
        isSavedToDb: false,
        name: imageTemplateStore.activeTemplate?.name || '',
        gap: imageTemplateStore.activeTemplate?.gap || 0
      });

      setEditingTemplateId(null);
    } else {
      imageTemplateStore.addTemplate({
        id: Number(Date.now()),
        slots: slotsArray,
        templateName:
          imageTemplateStore.activeTemplate?.name || 'Unnamed',
        templateId: imageTemplateStore.activeTemplate?.id || 0,
        isSavedToDb: false,
        name: imageTemplateStore.activeTemplate?.name || '',
        gap: imageTemplateStore.activeTemplate?.gap || 0
      });
    }
    console.log(">>>Current templateSlots:", templateSlots);
    setTemplateSlots({});
  };

  // -----------------------------
  // REMOVE TEMPLATE
  // -----------------------------
  const handleDeleteTemplate = (id: number) => {
    if (editingTemplateId === String(id)) {
      message.error("Спочатку збережіть або скасуйте редагування цього шаблону");
      return;
    }

    const template = imageTemplateStore.savedTemplates.find(t => t.id === id);

    if (template) {
      template.slots.forEach(slot => {
        if (slot.image) {
          addImageBackToGallery(slot.image);
        }
      });

      if (activeId === `tmpl_${id}`) {
        setActiveId(null);
      }

      imageTemplateStore.removeTemplate(id);

      message.success("Шаблон видалено, картинки повернуто в галерею");
    }
  };

  // -----------------------------
  // SAVE TO DB
  // -----------------------------
  const saveToDb = async (templateToSave: ArtSlideTemplate[]) => {
    try {
      console.log("DEBUG: save art:", templateToSave);
      const isInvalid = templateToSave.some(template =>
        template.slots.some(slot => {
          if (slot.image) {
            return !imageTemplateStore.getArtByImageId(slot.image.id);
          }
          return false;
        })
      );

      if (isInvalid) {
        message.error("Будь ласка, заповніть дані для всіх картинок перед збереженням!");
        return;
      }
      setLoading(true);
      try {

        const payload = templateToSave.map((t, index) => ({
          index: index,
          templateId: Number(t.templateId),
          streetcodeId: 1,
          artSlideItems: t.slots.map((slot: any) => {
            const imageId = slot.image?.id;

            const art = imageTemplateStore.getArtByImageId(imageId);
            console.log("<<<<<<<<<ART", art);
            return {
              artId: art ? art.id : 0,
              index: Number.parseInt(String(slot.id).replace('mid', '')) || 0
            };
          })
        }));

        console.log("Sending payload:", payload);
        await artSlideStore.createAllArtSlides(payload);
        templateToSave.forEach((t) => {
          imageTemplateStore.updateTemplateStatus(Number(t.id), { isSavedToDb: true });
        });

      } catch (error) {
        console.error("Save the error :", error);
      } finally {
        setLoading(false);
      }

      templateToSave.forEach((t) => {
        imageTemplateStore.updateTemplateStatus(
          Number(t.id),
          { isSavedToDb: true }
        );
      });
    } catch (e) {
      console.error('Save error details', e);
    }
  };
  if (images && images.length > 0) {
    console.log("URL by first image:", images[0].url);
  } else {
    console.log("The array is still empty, we are waiting for a response from the server..");
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
      <Spin spinning={loading} tip="Збереження даних...">
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
            editingTemplateId={editingTemplateId}
            onSaveToDb={saveToDb}
            onEdit={handleEditTemplate}
            onDelete={handleDeleteTemplate}
          />
        </div>
      </Spin>
    </DndContext>
  );
};