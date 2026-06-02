import { useState } from 'react';
import TextsApi from '@api/streetcode/text-content/texts.api';
import VideosApi from '@api/media/videos.api';
import { validateForm } from '../utils/validation';
import { TextCreateDTO, VideoCreateDTO } from '../types/types';
import { extractApiError } from '../utils/extractApiError';
import { sanitizeEditorHtml } from '../utils/htmlUtils';

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

      const errorMessages: string[] = [];

      for (const [index, result] of results.entries()) {
        const type = index === 0 ? 'Текст' : 'Відео';

        if (result.status === 'rejected') {
          const error = result.reason;
          const errorText = extractApiError(error);

          errorMessages.push(`${type}: ${errorText}`);
        }
      }

      if (errorMessages.length) {
        const finalError = errorMessages.join('\n');

        setSubmitError(finalError);

        alert(`Помилки:\n\n${finalError}`);
      } else {
        alert('Дані успішно збережені!');
      }
    } catch (e) {
      setSubmitError('Критична помилка');
      alert('Критична помилка');
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

