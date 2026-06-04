import { useState } from 'react';
import { getImageSize } from 'react-image-size';
import { IndexedArt } from '@models/media/art.model';
import { ArtImage } from '../types/gallery.types';

// Та же формула, что на витрине (ArtGalleryBlock.component.tsx):
// вертикальные -> medium (2), узкие горизонтальные -> small (1), широкие -> large (4).
const calcOffset = (width: number, height: number): number => {
  if (width <= height) return 2;
  if (width > height && height <= 300) return 1;
  return 4;
};

// Маппинг рабочей модели админки в формат витринного рендера ArtGallerySlide.
export const toIndexedArts = (images: ArtImage[]): IndexedArt[] => images.map((image, i) => ({
  index: i + 1,
  sequenceNumber: i,
  imageHref: image.url,
  title: image.title ?? '',
  description: image.description ?? '',
  offset: image.offset,
}));

export const useArtGallery = () => {
  const [images, setImages] = useState<ArtImage[]>([]);

  const addImage = async (file: File) => {
    const url = URL.createObjectURL(file); // В реальности здесь будет URL от API
    let offset = 4;
    try {
      const { width, height } = await getImageSize(url);
      offset = calcOffset(width, height);
    } catch { /* если размеры не прочитались — оставляем large по умолчанию */ }

    const newImage: ArtImage = {
      id: Date.now().toString(),
      url,
      isPublished: false,
      offset,
    };
    setImages((prev) => [...prev, newImage]);
  };

  const deleteImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id || img.isPublished));
  };

  const updateImage = (updatedImage: ArtImage) => {
    setImages((prev) => prev.map((img) => (img.id === updatedImage.id ? updatedImage : img)));
  };

  return { images, addImage, deleteImage, updateImage };
};
