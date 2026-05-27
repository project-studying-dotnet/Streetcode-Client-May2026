import { TextVideoBlock } from '../../../models/streetcode/TextVideoBlock/TextVideoBlock';

  export const isYoutubeLink = (url: string) => {
    const value = url.trim();

    if (!value) return false;

    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/i;

    return youtubeRegex.test(value);
  };


  export const validateAuthor = (text?: string) => {
    if ((text ?? '').length > 200) {
      return false;
    }
    return true;
  };

//   export const validateForm = (
//   formData: TextVideoBlock,
//   setVideoError: (value: string | null) => void
// ) => {
//   if (!formData.title.trim()) return false;

//   if (!formData.textContent.trim()) return false;

//   if (formData.videoUrl.trim() && !isYoutubeLink(formData.videoUrl)) {
//     setVideoError('Тільки посилання на youtube.com');
//     return false;
//   }

//   return true;
// };

export const validateForm = (formData: TextVideoBlock): { isValid: boolean; error: string | null } => {
  if (!formData.title.trim()) return { isValid: false, error: 'Заголовок обов’язковий' };
  if (!formData.textContent.trim()) return { isValid: false, error: 'Текст обов’язковий' };
  
  if (formData.videoUrl.trim() && !isYoutubeLink(formData.videoUrl)) {
    return { isValid: false, error: 'Тільки посилання на youtube.com' };
  }
  
  if (!validateAuthor(formData.additionalText)) {
    return { isValid: false, error: 'Текст автора занадто довгий' };
  }

  return { isValid: true, error: null };
};
