import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import useMobx from '@/app/stores/root-store';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { GalleryListProps } from '@models/media/image.model';
import { SortableImageCard } from './SortableImageCard';
import { AddButtonCard } from './AddButtonCard';
import './GalleryList.styles.scss';

export const GalleryList: React.FC<GalleryListProps> = observer(({
  onUpload,
  onDelete,
  onEdit
}) => {
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const { imagesStore } = useMobx();
  const images = imagesStore.getImageArray;

  console.log("GalleryList_images", images);

  return (
    <div className="gallery-list">
      <AddButtonCard onUpload={onUpload} />
      <SortableContext items={images.map(img => `img_${img.id}`)} strategy={rectSortingStrategy}>
        {images.map((img) => (
          <SortableImageCard
            key={img.id}
            image={img}
            onDelete={(id) => onDelete(Number(id))}
            onEdit={onEdit}
            isConfirming={confirmingId === String(img.id)}
            onConfirmRequest={() => setConfirmingId(String(img.id))}
            onCancelRequest={() => setConfirmingId(null)}
          />
        ))}
      </SortableContext>
    </div>
  );
});

