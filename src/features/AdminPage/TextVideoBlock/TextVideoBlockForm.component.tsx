import React, { useMemo, useRef, useState } from 'react';
import { Form, Input, Button } from 'antd';
import type { InputRef } from 'antd';

import { Props } from './types/types';
import { isYoutubeLink } from './utils/validation';

import RelatedTermApi from '@api/streetcode/text-content/related-terms.api';
import { useTextEditor } from './hooks/useTextEditor';
import { useTextVideoSubmit } from './hooks/useTextVideoSubmit';

import { TrashIcon } from '../../../assets/images/icons/TrashIcon';
import { TextVideoBlock } from '../../../models/streetcode/TextVideoBlock/TextVideoBlock';

import { PreviewText } from './components/previewModal/PreviewText';
import TextEditor from './components/textEditor/TextEditor';
import TermModal from './components/modals/TermModal.component';
import DeleteTermModal from './components/modals/DeleteTermModal.component';

import { replaceFirstTermOccurrence, removeTermTag } from './utils/relatedTerm.utils';
import { getCleanTextLength } from './utils/htmlUtils';

import './TextVideoBlockForm.styles.scss';

import { Term } from '@/models/streetcode/text-contents.model';

const { TextArea } = Input;

const TextVideoBlockForm: React.FC<Props> = ({
  streetcodeId = 4,
}) => {
  const DEFAULT_AUTHORSHIP =
    'Текст підготовлений спільно з';

  const editorRef = useRef<HTMLDivElement>(null);

  const titleInputRef = useRef<InputRef>(null);

  const [formData, setFormData] =
    useState<TextVideoBlock>({
      title: '',
      textContent: '',
      additionalText: '',
      videoUrl: '',
    });

  const [termInputValue, setTermInputValue] =
    useState('');

  const [showTermModal, setShowTermModal] =
    useState(false);

  const [showDeleteTermModal, setShowDeleteTermModal] =
    useState(false);


  const MAX_TEXT_LENGTH = 25000;

  const [showTextPreview, setShowTextPreview] =
    useState(false);

  const [showToolbar, setShowToolbar] =
    useState(false);

  const [videoError, setVideoError] =
    useState<string | null>(null);

  const [toolbarPosition, setToolbarPosition] =
    useState({
      top: 0,
      left: 0,
    });

  const isAuthorChanged =
    formData.additionalText?.trim() !==
    DEFAULT_AUTHORSHIP;


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
    name: keyof TextVideoBlock,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'videoUrl') {
      if (!value) {
        setVideoError(null);
        return;
      }

      setVideoError(isYoutubeLink(value) ? null : 'Тільки посилання на youtube.com');
    }
  };

  const [activeFormats, setActiveFormats] =
    useState({
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

  const { submit, loading } =
    useTextVideoSubmit({
      formData,
      streetcodeId,
      isAuthorChanged,
      setVideoError,
    });

  const focusTitleInput = () => {
    titleInputRef.current?.focus();

    const inputElement =
      titleInputRef.current?.input;

    if (!inputElement) return;

    inputElement.classList.add('error-highlight');

    setTimeout(() => {
      inputElement.classList.remove('error-highlight');
    }, 1000);
  };

  const handleTogglePreview = () => {
    if (!formData.title.trim()) {
      focusTitleInput();
      return;
    }

    setShowTextPreview((prev) => !prev);
  };

  const handleVideoFocus = (
    e: React.FocusEvent<HTMLInputElement>
  ) => {
    if (!formData.title.trim()) {
      e.target.blur();
      focusTitleInput();
    }
  };



  const handleTermModalConfirm = async (
    word: string,
    term: Term | null
  ) => {
    if (!term || !editorRef.current) {
      return;
    }

    const currentHtml = editorRef.current.innerHTML;

    const updatedHtml = replaceFirstTermOccurrence(
      currentHtml,
      word,
      term.id
    );

    if (!updatedHtml) {
      alert(`Термін "${word}" відсутній у тексті`);
      return;
    }

    try {
      await RelatedTermApi.create({
        word,
        termId: term.id,
      });

      editorRef.current.innerHTML = updatedHtml;

      handleChange(
        'textContent',
        updatedHtml
      );

      setShowTermModal(false);
      setTermInputValue('');
      alert(`Термін "${word}" успішно пов'язано!`);
    } catch (error) {
      console.error(error);
      alert('Не вдалося пов’язати термін');
    }
  };


  const handleDeleteTermModalConfirm = async () => {
    if (!editorRef.current) return;

    const currentHtml = editorRef.current.innerHTML;

    const { updatedHtml, termId } = removeTermTag(currentHtml, termInputValue);

    if (!termId) {
      alert("Це слово не має активного зв'язку з терміном у тексті.");
      setShowDeleteTermModal(false);
      return;
    }

    try {
      await RelatedTermApi.delete(termInputValue, termId);

      editorRef.current.innerHTML = updatedHtml;
      handleChange('textContent', updatedHtml);

      alert("Зв'язок успішно видалено!");
      setShowDeleteTermModal(false);
      setTermInputValue('');
    } catch (error) {
      console.error("Помилка при видаленні:", error);
      alert("Не вдалося видалити зв'язок на сервері.");
    }
  };

  return (
    <Form
      layout="vertical"
      className="text-video-form"
    >
      <Form.Item label="Заголовок" name="title">
        <Input
          id="title-input"
          ref={titleInputRef}
          value={formData.title}
          maxLength={50}
          showCount
          className="text-video-form__input text-video-form__input--title"
          onChange={(e) =>
            handleChange(
              'title',
              e.target.value
            )
          }
        />
      </Form.Item>

      <div className="text-video-form__group mb-17">
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
            Символи:{' '}
            {getCleanTextLength(formData.textContent)} / 25000
          </div>
        </div>
      </div>

      <div className="text-video-form__group mb-35">
        <div className="text-video-form__term-wrapper">
          <div className="text-video-form__label text-video-form__label--medium">
            Термін
          </div>

          <Button
            type="primary"
            className="add-button"
          >
            Додати новий термін
          </Button>
        </div>
      </div>

      <div className="text-video-form__group mb-48">
        <label className="text-video-form__label"
          htmlFor="related-term-input">
          Оберіть пов’язаний термін
        </label>

        <div className="text-video-form__input-wrapper">
          <Input
            id="related-term-input"
            placeholder=""
            value={termInputValue}
            onChange={(e) => setTermInputValue(e.target.value)}
            className="text-video-form__input text-video-form__input--term"
          />

          <Button
            type="default"
            className="connect-button"
            onClick={() => setShowTermModal(true)}
          >
            Пов'язати
          </Button>

          <Button
            className="delete-button"
            icon={<TrashIcon />}
            onClick={() => {
              setShowDeleteTermModal(true)
            }}
          />
        </div>
      </div>

      <Form.Item label="Авторство" htmlFor="authorship-textarea">
        <TextArea
          id="authorship-textarea"
          value={formData.additionalText}
          maxLength={200}
          autoSize={{
            minRows: 6,
            maxRows: 12,
          }}
          className="text-video-form__textarea"
          onChange={(e) =>
            handleChange(
              'additionalText',
              e.target.value
            )
          }
        />
        <div className="text-video-form__meta">
          <div className="text-video-form__counter">
            {formData.additionalText?.length ?? 0}/200
          </div>
        </div>
      </Form.Item>

      <Form.Item label="Відео"
        htmlFor="video-url-input">
        <Input
          id="video-url-input"
          value={formData.videoUrl}
          placeholder="Приклад: https://www.youtube.com/watch?v="
          className="text-video-form__input text-video-form__input--link"
          onFocus={handleVideoFocus}
          onChange={(e) =>
            handleChange(
              'videoUrl',
              e.target.value
            )
          }
        />

        {videoError && (
          <span className="text-video-form__error">
            {videoError}
          </span>
        )}
      </Form.Item>

      <div className="text-video-form__actions">
        <Button
          type="default"
          className="show-text-button"
          onClick={handleTogglePreview}
        >
          Переглянути текст
        </Button>

        <Button
          type="primary"
          className="add-button"
          loading={loading}
          onClick={submit}
        >
          Зберегти блок
        </Button>
      </div>

      {showTextPreview &&
        formData.title?.trim() && (
          <PreviewText
            open={showTextPreview}
            onClose={() =>
              setShowTextPreview((prev) => !prev)
            }
            formData={formData}
            youtubeEmbedUrl={youtubeEmbedUrl}
          />
        )}

      <TermModal
        open={showTermModal}
        onClose={() => setShowTermModal(false)}
        onConfirm={handleTermModalConfirm}
        initialValue={termInputValue}
      />
      <DeleteTermModal
        open={showDeleteTermModal}
        onClose={() => setShowDeleteTermModal(false)}
        onConfirm={handleDeleteTermModalConfirm}
      />
    </Form>
  );
};

export default TextVideoBlockForm;