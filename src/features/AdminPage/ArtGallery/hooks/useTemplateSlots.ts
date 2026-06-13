import { ArtImage } from '@models/media/image.model';

export const useTemplateSlots = (
  templateSlots: Record<string, ArtImage | null>,
  setTemplateSlots: React.Dispatch<
    React.SetStateAction<Record<string, ArtImage | null>>
  >,
  setImages: React.Dispatch<React.SetStateAction<ArtImage[]>>
) => {
  const clearAllSlots = () => {
    const returnedImages = Object.values(templateSlots).filter(
      (img): img is ArtImage => img !== null
    );

    setImages(prev => [...prev, ...returnedImages]);
    setTemplateSlots({});
  };

  const removeImageFromSlot = (slotId: string) => {
    const image = templateSlots[slotId];

    if (!image) return;

    setImages(prev => [...prev, image]);

    setTemplateSlots(prev => ({
      ...prev,
      [slotId]: null
    }));
  };

  return {
    clearAllSlots,
    removeImageFromSlot
  };
};