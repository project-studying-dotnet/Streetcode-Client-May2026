import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { GalleryListProps, ArtImage } from '../../types/gallery.types';
import { SortableImageCard } from './SortableImageCard';
import { AddButtonCard } from './AddButtonCard';
import './GalleryList.styles.scss';


export const GalleryList: React.FC<GalleryListProps> = ({ 
  images: propImages, 
  onUpload, 
  onDelete, 
  onEdit 
}) => {
  const [images, setImages] = useState<ArtImage[]>(propImages);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  useEffect(() => {
    setImages(propImages);
  }, [propImages]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const newArray = arrayMove(items, oldIndex, newIndex);
        return newArray;
      });
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="gallery-list">
        <AddButtonCard onUpload={onUpload} />
        
        <SortableContext items={images} strategy={rectSortingStrategy}>
          {images.map((img) => (
            <SortableImageCard 
              key={img.id} 
              image={img} 
              onDelete={onDelete} 
              onEdit={onEdit} 
              isConfirming={confirmingId === img.id}
            onConfirmRequest={() => setConfirmingId(img.id)}
            onCancelRequest={() => setConfirmingId(null)}
            />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
};