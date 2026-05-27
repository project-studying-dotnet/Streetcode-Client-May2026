import { useState } from 'react';

type FormatCommand = 'bold' | 'italic';

export const useTextEditor = (
  editorRef: React.RefObject<HTMLDivElement>,
  setFormData: any,
  MAX_TEXT_LENGTH: number,
  setShowToolbar: (v: boolean) => void,
  setToolbarPosition: (pos: { top: number; left: number }) => void,
  setActiveFormats: (v: any) => void
) => {
  const getActiveFormats = () => ({
    bold: document.queryCommandState('bold'),
    italic: document.queryCommandState('italic'),
  });

  const handleEditorChange = () => {
    const el = editorRef.current;
    if (!el) return;

    const html = el.innerHTML;
    const textLength = el.innerText.length;

    if (textLength > MAX_TEXT_LENGTH) {
      el.innerText = el.innerText.slice(0, MAX_TEXT_LENGTH);
      return;
    }

    setFormData((prev: any) => ({
      ...prev,
      textContent: html,
    }));
  };

  const moveCaretOutsideFormatting = () => {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return;

    const editor = editorRef.current;
    if (!editor) return;

    let node = sel.anchorNode;
    if (!node) return;

    let el = node.nodeType === 3 ? node.parentElement : (node as HTMLElement);
    if (!el || !editor.contains(el)) return;

    const parent = el.parentNode;
    if (!parent) return;

    const spacer = document.createTextNode('\u200B');
    parent.insertBefore(spacer, el.nextSibling);

    const range = document.createRange();
    range.setStartAfter(spacer);
    range.collapse(true);

    sel.removeAllRanges();
    sel.addRange(range);
  };

  const applyFormatting = (command: FormatCommand) => {
    const el = editorRef.current;
    if (!el) return;

    el.focus();
    document.execCommand('styleWithCSS', false, 'true');

    document.execCommand(command);

    requestAnimationFrame(() => {
      moveCaretOutsideFormatting();
    });

    setShowToolbar(false);

    setFormData((prev: any) => ({
      ...prev,
      textContent: el.innerHTML,
    }));
  };

  const handleTextSelection = () => {
    requestAnimationFrame(() => {
      const selection = window.getSelection();

      if (!selection || selection.rangeCount === 0 || selection.toString().trim() === '') {
        setShowToolbar(false);
        return;
      }

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      setToolbarPosition({
        top: rect.top + window.scrollY - 50,
        left: rect.left + window.scrollX,
      });

      setShowToolbar(true);
      setActiveFormats(getActiveFormats());
    });
  };

  return {
    handleEditorChange,
    applyFormatting,
    handleTextSelection,
  };
};