import React from 'react';

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

  return (
    <div className="text-video-form__group mb-17">
      <label className="text-video-form__label"
        htmlFor="main-text-label">
        Основний текст
      </label>

      <div
        id="main-text-editor"
        ref={editorRef}
        aria-roledescription="richtext editor"
        contentEditable
        suppressContentEditableWarning
        className="text-video-form__editor"
        role="textbox"
        tabIndex={0}
        aria-multiline="true"
        aria-labelledby="main-text-label"
        onInput={onEditorChange}
        onMouseUp={onTextSelection}
        onKeyUp={onTextSelection}
      />

      {showToolbar && (
        <div
          className="text-video-form__toolbar"
          style={{
            top: toolbarPosition.top,
            left: toolbarPosition.left,
          }}
        >
          <button
            className={`toolbar-btn toolbar-btn--bold ${activeFormats.bold ? 'active' : ''
              }`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onApplyFormatting('bold')}
          >
            B
          </button>

          <button
            className={`toolbar-btn toolbar-btn--italic ${activeFormats.italic ? 'active' : ''
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