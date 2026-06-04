import { useArtGallery } from './hooks/useArtGallery';
import { GalleryList } from './components/ImageGallery/GalleryList';
import './ArtGallery.styles.scss';
import { TemplatesHeader } from './components/Templates/TemplatesHeader';
import { TemplateGrid } from './components/TemplateGrid/TemplateGrid';
import { useModalContext } from '@/app/stores/root-store';

export const ArtGallery = () => {

  const { images, addImage } = useArtGallery();
  const { modalStore: { setModal } } = useModalContext();

  const handleOpenTemplates = () => {
      setModal('templates', undefined, true);
  };

  return (
    <div className="art-gallery-container">
      <h2>Арт-галерея</h2>

      <div className="gallery-viewport">
        <GalleryList
          images={images} onUpload={addImage} onDelete={console.log} onEdit={console.log}
        />
      </div>
      <section className="gallery-section">
        <TemplatesHeader onOpenTemplates={handleOpenTemplates} />
        <TemplateGrid /> 
      </section>
    </div>
  );
};

