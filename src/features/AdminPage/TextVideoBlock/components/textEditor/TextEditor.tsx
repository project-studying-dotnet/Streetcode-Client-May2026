import React, { useEffect } from 'react';

type FormatCommand = 'bold' | 'italic';

type Props = {
  editorRef: React.RefObject<HTMLDivElement>;
  showToolbar: boolean;
  toolbarPosition: { top: number; left: number };
  activeFormats: { bold: boolean; italic: boolean };

  onEditorChange: () => void;
  onTextSelection: () => void;
  onApplyFormatting: (command: FormatCommand) => void;
};

const TextEditor: React.FC<Props> = ({
  editorRef,
  showToolbar,
  toolbarPosition,
  activeFormats,
  onEditorChange,
  onTextSelection,
  onApplyFormatting,
}) => {
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;

    el.contentEditable = 'true';

    const handleInput = () => onEditorChange();
    const handleSelection = () => onTextSelection();

    el.addEventListener('input', handleInput);
    el.addEventListener('mouseup', handleSelection);
    el.addEventListener('keyup', handleSelection);

    return () => {
      el.removeEventListener('input', handleInput);
      el.removeEventListener('mouseup', handleSelection);
      el.removeEventListener('keyup', handleSelection);
    };
  }, [editorRef, onEditorChange, onTextSelection]);

  return (
    <div className="text-video-form__group">
      <label
        className="text-video-form__label"
        htmlFor="main-text-label"
      >
        Основний текст
      </label>

      <div className="text-video-form__editor-wrapper">
        <div
          id="main-text-editor"
          ref={editorRef}
          className="text-video-form__editor"
          aria-labelledby="main-text-label"
        />
      </div>

      {showToolbar && (
        <div
          className="text-video-form__toolbar"
          style={{
            top: toolbarPosition.top,
            left: toolbarPosition.left,
          }}
        >
          <button
            className={`toolbar-btn toolbar-btn--bold ${
              activeFormats.bold ? 'active' : ''
            }`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onApplyFormatting('bold')}
          >
            B
          </button>

          <button
            className={`toolbar-btn toolbar-btn--italic ${
              activeFormats.italic ? 'active' : ''
            }`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onApplyFormatting('italic')}
          >
            I
          </button>
        </div>
      )}
    </div>
  );
};

export default TextEditor;