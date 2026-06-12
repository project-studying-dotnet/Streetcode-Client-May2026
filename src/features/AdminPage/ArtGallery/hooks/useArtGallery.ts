import { useState } from 'react';
import { ArtImage } from '../types/gallery.types';

export const useArtGallery = () => {
  const [images, setImages] = useState<ArtImage[]>([]);

  const addImage = (file: File) => {
    const url = URL.createObjectURL(file);

    const newImage: ArtImage = {
      id: crypto.randomUUID(),
      url,
      isPublished: false,
      offset: 4,
    };

    setImages(prev => [...prev, newImage]);
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  return {
    images,
    setImages,
    addImage,
    removeImage,
  };
};