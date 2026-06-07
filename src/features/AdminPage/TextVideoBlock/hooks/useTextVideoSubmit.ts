import { useState } from 'react';
import TextsApi from '@api/streetcode/text-content/texts.api';
import VideosApi from '@api/media/videos.api';
import { validateForm } from '../../../../app/common/utils/text-video-block/validation';
import { TextCreateDTO, VideoCreateDTO } from '../types/types';
import { extractApiError } from '../../../../app/common/utils/text-video-block/extractApiError';
import { sanitizeEditorHtml } from '../../../../app/common/utils/text-video-block/htmlUtils';

type Params = {
  formData: any;
  streetcodeId: number;
  isAuthorChanged: boolean;
  setVideoError: (v: string | null) => void;
};

export const useTextVideoSubmit = ({
  formData,
  streetcodeId,
  isAuthorChanged,
  setVideoError,
}: Params) => {
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const submit = async () => {
    setLoading(true);
    setSubmitError(null);
    setVideoError(null);

    const validation = validateForm(formData);
    if (!validation.isValid) {
      if (validation.error === 'Тільки посилання на youtube.com') {
        setVideoError(validation.error);
      }
      setLoading(false);
      return;
    }

    const textPayload: TextCreateDTO = {
      title: formData.title,
      textContent: sanitizeEditorHtml(formData.textContent),
      streetcodeId,
      additionalText: isAuthorChanged
        ? formData.additionalText ?? null
        : null,
    };

    const videoPayload: VideoCreateDTO = {
      title: formData.title,
      url: formData.videoUrl,
      streetcodeId,
    };

    try {
      const results = await Promise.allSettled([
        TextsApi.create(textPayload),
        VideosApi.create(videoPayload),
      ]);

      const errorMessages: string[] = results
        .map((result, index) => {
          if (result.status === 'fulfilled') return null;
          
          const type = index === 0 ? 'Текст' : 'Відео';
          const errorText = extractApiError(result.reason);
          return `${type}: ${errorText}`;
        })
        .filter((msg): msg is string => msg !== null);

      if (errorMessages.length > 0) {
        const finalError = errorMessages.join('\n');
        setSubmitError(finalError);
        alert(`Помилки:\n\n${finalError}`);
      } else {
        alert('Дані успішно збережені!');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Невідома помилка';
      setSubmitError(message);
      console.error('Submit critical error:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    submit,
    loading,
    submitError,
  };
};

