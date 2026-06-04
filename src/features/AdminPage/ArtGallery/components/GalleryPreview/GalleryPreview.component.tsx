import React from 'react';
import ArtGallerySlide from '@streetcode/ArtGalleryBlock/ArtGalleryListOfItem/ArtGallerySlide.component';
import { toIndexedArts } from '../../hooks/useArtGallery';
import { ArtImage } from '../../types/gallery.types';
import './GalleryPreview.styles.scss';

interface Props {
  images: ArtImage[];
}


export const GalleryPreview = ({ images }: Props) => {
  if (!images.length) {
    return null;
  }

  return (
    <div className="gallery-preview">
      <ArtGallerySlide artGalleryList={toIndexedArts(images)} isAdminPage />
    </div>
  );
};
