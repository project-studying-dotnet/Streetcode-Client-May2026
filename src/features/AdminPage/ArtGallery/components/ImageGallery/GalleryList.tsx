import React, { useState } from 'react';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { GalleryListProps } from '../../types/gallery.types';
import { SortableImageCard } from './SortableImageCard';
import { AddButtonCard } from './AddButtonCard';
import './GalleryList.styles.scss';

export const GalleryList: React.FC<GalleryListProps> = ({ 
  images, 
  onUpload, 
  onDelete, 
  onEdit 
}) => {
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  return (
    <div className="gallery-list">
      <AddButtonCard onUpload={onUpload} />
      <SortableContext items={images.map(img => `img_${img.id}`)} strategy={rectSortingStrategy}>
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
  );
};