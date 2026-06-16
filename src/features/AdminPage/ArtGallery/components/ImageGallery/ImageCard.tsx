import React from 'react';
import { observer } from 'mobx-react-lite';
import { useModalContext } from '@stores/root-store';
import { ImageCardProps } from '@models/media/image.model';
import { useArtGallery } from '../../hooks/useArtGallery';
import './ImageCard.styles.scss';

export const ImageCard: React.FC<ImageCardProps> = observer(({
  image, attributes, listeners
}) => {
  const { modalStore: { setModal }, imageTemplateStore } = useModalContext();
  const { removeImage } = useArtGallery();

  const art = imageTemplateStore.getArtByImageId(image.id);
  const isMissingData = !art;

  return (
    <div className={`image-card ${isMissingData ? 'card-incomplete' : ''}`}
    >
      {isMissingData && <div className="warning-badge">!</div>}

      <div className="drag-handle" {...attributes} {...listeners}>
        <img src={image.url} alt="art" draggable="false" />
      </div>

      <div className="controls-overlay__item">
        <button onClick={(e) => {
          e.stopPropagation();
          setModal('editImage', undefined, true, {
            ...image,
            onSave: (updatedImage: any) => {
              console.log('saved:', updatedImage);
            }
          });
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
});