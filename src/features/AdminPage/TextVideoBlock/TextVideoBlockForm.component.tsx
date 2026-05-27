import React, { useState, useRef, useMemo } from 'react';
import { Props } from './types';
import { isYoutubeLink } from './validation';
import { Button } from '../../../app/common/components/Button/Button';
import { TrashIcon } from '../../../assets/images/icons/TrashIcon';
import { TextVideoBlock } from '../../../models/streetcode/TextVideoBlock/TextVideoBlock';
import { PreviewModal } from './PreviewModal';
import TextEditor from './TextEditor';
import { useTextEditor } from './useTextEditor';
import { useTextVideoSubmit } from './useTextVideoSubmit';

import './TextVideoBlockForm.styles.scss';


const TextVideoBlockForm: React.FC<Props> = ({ streetcodeId = 3 }) => {
  const DEFAULT_AUTHORSHIP = 'Текст підготовлений спільно з';

  const editorRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<TextVideoBlock>({
    title: '',
    textContent: '',
    additionalText: '',
    videoUrl: ''
  });
  const MAX_TEXT_LENGTH = 25000;
  const [showTextPreview, setShowTextPreview] = useState(false);

  const [showToolbar, setShowToolbar] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);

  const [toolbarPosition, setToolbarPosition] = useState({
    top: 0,
    left: 0,
  });
  const isAuthorChanged =
    (formData.additionalText ?? '').trim() !== DEFAULT_AUTHORSHIP;

  const youtubeEmbedUrl = useMemo(() => {
    if (!formData.videoUrl) return '';

    const regExp =
      /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/;

    const match = formData.videoUrl.match(regExp);

    return match?.[1]
      ? `https://www.youtube.com/embed/${match[1]}`
      : '';
  }, [formData.videoUrl]);



  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === 'videoUrl') {
      if (!value) {
        setVideoError(null);
        return;
      }

      if (!isYoutubeLink(value)) {
        setVideoError('Тільки посилання на youtube.com');
      } else {
        setVideoError(null);
      }
    }
  };

  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
  });

  const {
    handleEditorChange,
    applyFormatting,
    handleTextSelection,
  } = useTextEditor(
    editorRef,
    setFormData,
    MAX_TEXT_LENGTH,
    setShowToolbar,
    setToolbarPosition,
    setActiveFormats
  );

  const {
    submit,
    loading,
    submitError,
  } = useTextVideoSubmit({
    formData,
    streetcodeId,
    isAuthorChanged,
    setVideoError,
  });

  const handleOpenPreview = () => {
    if (!formData.title?.trim()) {
      titleInputRef.current?.focus();
      titleInputRef.current?.classList.add('error-highlight');
      setTimeout(() => titleInputRef.current?.classList.remove('error-highlight'), 1000);
      return;
    }
    setShowTextPreview(true);
  };

  return (
    <div className="text-video-form">
      <div className="text-video-form__group mb-24 ">
        <label className="text-video-form__label">Заголовок</label>
        <div className="text-video-form__input-wrapper">
          <input
            ref={titleInputRef}
            type="text"
            name="title"
            maxLength={50}
            value={formData.title}
            onChange={handleChange}
            className="text-video-form__input"
          />
          <div className="text-video-form__counter">{formData.title.length}/50</div>
        </div>
      </div>

      <div className="text-video-form__group  mb-17">
        <TextEditor
          editorRef={editorRef}
          showToolbar={showToolbar}
          toolbarPosition={toolbarPosition}
          activeFormats={activeFormats}
          onEditorChange={handleEditorChange}
          onTextSelection={handleTextSelection}
          onApplyFormatting={applyFormatting}
        />
        <div className="text-video-form__meta">
          <div className="text-video-form__counter">
            Символи: {formData.textContent.length ?? 0}/25000
          </div>
        </div>
      </div>

      <div className="text-video-form__group mb-35">
        <div className="text-video-form__term-wrapper">
          <label className="text-video-form__label text-video-form__label--medium">
            Термін
          </label>
          <Button
            label="Додати новий термін"
            variant="red"
            padding="17"
            onClick={() => console.log('Додати термін')}
          />
        </div>
      </div>
      <div className="text-video-form__group mb-48">
        <label className="text-video-form__label">
          Оберіть пов’язаний термін
        </label>
        <div className="text-video-form__input-wrapper">
          <input
            type="text"
            className="text-video-form__input"
            placeholder=""
          />
          <Button
            label="Пов’язати"
            variant="white"
            padding="17"
            onClick={() => console.log('Пов’язати')}
          />
          <Button
            icon={<TrashIcon />}
            variant="icon-red"
            padding="17"
            onClick={() => console.log('Видалити')}
          />
        </div>
        <Button
          label="Переглянути текст"
          variant="white"
          padding="17"
          onClick={handleOpenPreview}
        />
      </div>


      <div className="text-video-form__group mb-17">
        <label className="text-video-form__label">Авторство</label>
        <textarea
          name="additionalText"
          maxLength={200}
          value={formData.additionalText}
          onChange={handleChange}
          className="text-video-form__textarea"
        />
        <div className="text-video-form__meta">
          <div className="text-video-form__counter">
            Символи: {formData.additionalText?.length ?? 0}/200
          </div>
        </div>
      </div>

      <div className="text-video-form__group">
        <label className="text-video-form__label">Відео</label>
        <input
          type="text"
          name="videoUrl"
          value={formData.videoUrl}
          onChange={handleChange}
          className="text-video-form__input"
          onFocus={(e) => {
            if (!formData.title.trim()) {
              e.target.blur();
              titleInputRef.current?.focus();
              titleInputRef.current?.classList.add('error-highlight');
              setTimeout(() => titleInputRef.current?.classList.remove('error-highlight'), 1500);
            }
          }}
          placeholder="Приклад: https://www.youtube.com/watch?-827IonKDHI567 "
        />
        <Button
          label="Переглянути текст"
          variant="white"
          padding="17"
          onClick={handleOpenPreview}
        />
        <div className="text-video-form__actions" style={{ marginTop: '20px' }}>
          <Button
            label={loading ? 'Збереження...' : 'Зберегти блок'}
            variant="red"
            padding="17"
            disabled={loading}
            onClick={submit}
          />
        </div>

        {showTextPreview && formData.title?.trim() && (
          <PreviewModal
            open={showTextPreview}
            onClose={() => setShowTextPreview(false)}
            formData={formData}
            youtubeEmbedUrl={youtubeEmbedUrl}
          />
        )}

        {videoError && (
          <span className="text-video-form__error">
            {videoError}
          </span>
        )}
      </div>
    </div >
  );
};

export default TextVideoBlockForm;