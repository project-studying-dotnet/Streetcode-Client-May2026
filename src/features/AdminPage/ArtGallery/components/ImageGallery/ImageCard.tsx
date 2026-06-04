import React from 'react';
import { useModalContext } from '@stores/root-store';
import { ImageCardProps } from '../../types/gallery.types';
import './ImageCard.styles.scss';

export const ImageCard: React.FC<ImageCardProps> = ({ 
  image, attributes, listeners 
}) => {
  const { modalStore: { setModal } } = useModalContext();

  return (
    <div className="image-card">
      <img src={image.url} alt="art" {...attributes} {...listeners} />

      <div className="controls-overlay__item">
        <button onClick={(e) => { 
            e.stopPropagation(); 
           setModal('editImage', undefined, true, image);
        }}>🔍</button>
        
       <button onClick={(e) => { 
    e.stopPropagation(); 
    // Теперь это будет вызывать модалку именно для картинки
    setModal('deleteImage', undefined, true, image); 
}}>🗑️</button>
      </div>
    </div>
  );
};