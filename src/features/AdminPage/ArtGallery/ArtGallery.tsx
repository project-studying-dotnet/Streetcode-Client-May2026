import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, closestCenter, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { ArtImage } from './types/gallery.types';
import { useArtGallery } from './hooks/useArtGallery';
import { GalleryList } from './components/ImageGallery/GalleryList';
import { TemplateGrid } from './components/TemplateGrid/TemplateGrid';
import { TemplatesHeader } from './components/Templates/TemplatesHeader';
import { useModalContext } from '@/app/stores/root-store';
import { SavedTemplatesCarousel } from './components/Carousel/SavedTemplatesCarousel'

export const ArtGallery: React.FC = () => {
  const { images, setImages, addImage, removeImage } = useArtGallery();
  const [templateSlots, setTemplateSlots] = useState<Record<string, ArtImage | null>>({});
  const [activeImage, setActiveImage] = useState<ArtImage | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);

  const { modalStore, imageTemplateStore } = useModalContext();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 1 } }));

  const clearAllSlots = () => {
    const returnedImages = Object.values(templateSlots).filter((img): img is ArtImage => img !== null);
    setImages(prev => [...prev, ...returnedImages]);
    setTemplateSlots({});
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveImage(null);
    setActiveId(null);

    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId.startsWith('tmpl_') && overId.startsWith('tmpl_')) {
      const rawActive = activeId.replace('tmpl_', '');
      const rawOver = overId.replace('tmpl_', '');

      const oldIndex = imageTemplateStore.savedTemplates.findIndex(t => String(t.id) === rawActive);
      const newIndex = imageTemplateStore.savedTemplates.findIndex(t => String(t.id) === rawOver);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {

        imageTemplateStore.reorderTemplates(oldIndex, newIndex);
      }
      return;
    }


    if (activeId.startsWith('img_') && overId.startsWith('img_')) {
      const oldIndex = images.findIndex(i => `img_${i.id}` === activeId);
      const newIndex = images.findIndex(i => `img_${i.id}` === overId);

      if (oldIndex !== -1 && newIndex !== -1) {
        setImages(arrayMove(images, oldIndex, newIndex));
      }
      return;
    }

    if (activeId.startsWith('img_')) {
      const rawActiveId = activeId.replace('img_', '');
      const dragged = images.find(i => String(i.id) === rawActiveId);

      const isTargetSlot = imageTemplateStore.activeTemplate?.slots.some((s: any) => String(s.id) === overId);

      if (isTargetSlot) {
        if (templateSlots[overId] !== null && templateSlots[overId] !== undefined) {
          console.log("Слот уже занят!");
          return;
        }

        if (dragged) {
          setTemplateSlots(prev => ({ ...prev, [overId]: dragged }));
          removeImage(dragged.id);
        }
      }

      if (imageTemplateStore.activeTemplate?.slots.some((s: any) => String(s.id) === overId)) {
        if (dragged) {
          setTemplateSlots(prev => ({ ...prev, [overId]: dragged }));
          removeImage(dragged.id);
        }
      }

      else if (overId === 'gallery') {
        const imgInSlot = Object.values(templateSlots).find(i => i?.id === rawActiveId);
        if (imgInSlot) {
          setTemplateSlots(prev => {
            const copy = { ...prev };
            Object.keys(copy).forEach(k => { if (copy[k]?.id === rawActiveId) copy[k] = null; });
            return copy;
          });
          setImages((prev: ArtImage[]) => [...prev, imgInSlot]);
        }
      }
    }
  };



const removeImageFromSlot = (slotId: string) => {
  const image = templateSlots[slotId];

  if (!image) return;

  setImages(prev => [...prev, image]);

  setTemplateSlots(prev => ({
    ...prev,
    [slotId]: null
  }));
};

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

  const handleSave = () => {
    if (editingTemplateId) {
      imageTemplateStore.updateTemplate({
        id: editingTemplateId,
        slots: { ...templateSlots },
        templateName: imageTemplateStore.activeTemplate?.name || 'Updated',
        isSavedToDb: false
      });
      setEditingTemplateId(null);
    } else {
      imageTemplateStore.addTemplate({
        id: String(Date.now()),
        slots: { ...templateSlots },
        templateName: imageTemplateStore.activeTemplate?.name || 'Unnamed',
        isSavedToDb: false
      });
    }
    setTemplateSlots({});
  };

  const saveToDb = async (templateToSave: any) => {
    try {
      console.log("Сохраняем конкретный шаблон:", templateToSave);

      // await api.post('/templates', templateToSave);

      imageTemplateStore.updateTemplateStatus(templateToSave.id, { isSavedToDb: true });

    } catch (e) {
      console.error("Помилка при збереженні", e);
    }
  };
  return (
    <DndContext
      onDragStart={(event) => setActiveId(String(event.active.id))}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd

      }>
      <div className="art-gallery-container">
        <GalleryList images={images} onUpload={addImage} onDelete={removeImage} onEdit={console.log} />
        <section className="gallery-section">
          <TemplatesHeader onOpenTemplates={() => modalStore.setModal('templates', undefined, true)} />
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
          reorderTemplates={(oldIdx: number, newIdx: number) => imageTemplateStore.reorderTemplates(oldIdx, newIdx)}
          onSaveToDb={saveToDb}
          onEdit ={handleEditTemplate}

        />
      </div>
    </DndContext>
  );
};