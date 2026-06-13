import React from 'react';
import { useModalContext } from '@stores/root-store';
import { ImageCardProps } from '@models/media/image.model';
import { useArtGallery } from '../../hooks/useArtGallery';
import './ImageCard.styles.scss';

export const ImageCard: React.FC<ImageCardProps> = ({
  image, attributes, listeners
}) => {
  const { modalStore: { setModal } } = useModalContext();
  const { removeImage } = useArtGallery();

  return (
    <div className="image-card"
      onDragStart={(e) => e.preventDefault()}
    >
      <div className="drag-handle" {...attributes} {...listeners}>
        <img src={image.url} alt="art" draggable="false" />
      </div>

      <div className="controls-overlay__item">
        <button onClick={(e) => {
          e.stopPropagation();
          setModal('editImage', undefined, true, image);
        }}>🔍</button>

        <button onClick={(e) => {
          e.stopPropagation();
          const imageWithAction = {
            ...image,
            onConfirm: () => removeImage(image.id)
          };
          setModal('deleteImage', undefined, true, imageWithAction);
        }}>🗑️</button>
      </div>
    </div>
  );
};