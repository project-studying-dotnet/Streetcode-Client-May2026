import useMobx, { useModalContext } from '@/app/stores/root-store';

const toBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};


export const useArtGallery = () => {
  const { imagesStore } = useMobx();
  const { artStore, imageTemplateStore } = useModalContext();


  const addImage = async (file: File) => {
    const localUrl = URL.createObjectURL(file);
    const base64 = await toBase64(file);
    await imagesStore.createImage({
      baseFormat: base64.split(',')[1],
      mimeType: file.type,
      extension: file.name.split('.').pop() || 'jpg',
      title: file.name
    }, localUrl);
  };

  const removeImage = async (id: number) => {
    const art = imageTemplateStore.getArtByImageId(id);

    if (art) {
      await artStore.deleteArt(art.id);
      imageTemplateStore.artsMap.delete(id);
    }
    await imagesStore.deleteImage(id);
  };

  return {
    images: imagesStore.getImageArray,
    addImage,
    removeImage,
    addImageBackToGallery: imagesStore.addImageBackToGallery,
    moveImageToTemplate: imagesStore.moveImageToTemplate,
    moveImageBackToGallery: imagesStore.moveImageBackToGallery,
    reorderImages: imagesStore.reorderImages
  };
};

