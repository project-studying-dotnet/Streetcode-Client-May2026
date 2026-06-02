export const sanitizeEditorHtml = (html: string): string => {
  if (!html) return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const spans = doc.querySelectorAll('span');
  spans.forEach((span) => {
    if (span.classList.contains('term-linked')) {
      return;
    }
    
    const style = span.style;
    const isBold = style.fontWeight === 'bold' || style.fontWeight === '700';
    const isItalic = style.fontStyle === 'italic';
    
    if (isBold || isItalic) {
      let wrapper: HTMLElement | null = null;
      
      if (isBold && isItalic) {
        wrapper = doc.createElement('b');
        const i = doc.createElement('i');
        wrapper.appendChild(i);
        i.append(...Array.from(span.childNodes));
      } else if (isBold) {
        wrapper = doc.createElement('b');
        wrapper.append(...Array.from(span.childNodes));
      } else if (isItalic) {
        wrapper = doc.createElement('i');
        wrapper.append(...Array.from(span.childNodes));
      }

      if (wrapper) {
        span.parentNode?.replaceChild(wrapper, span);
        return; 
      }
    }
    const parent = span.parentNode;
    while (span.firstChild) {
      parent?.insertBefore(span.firstChild, span);
    }
    parent?.removeChild(span);
  });

  doc.querySelectorAll('*').forEach((el) => {
    if (el.tagName !== 'TERM') {
        el.removeAttribute('style');
    }
  });

  return doc.body.innerHTML;
};


export const getCleanTextLength = (html: string): number => {
  if (!html) return 0;
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const allElements = doc.body.querySelectorAll('*');
  allElements.forEach((el) => {
    if (!el.textContent?.trim() && el.tagName !== 'BR') {
      el.remove();
    }
  });

  let cleanText = doc.body.textContent || '';

  cleanText = cleanText.replace(/[\u200B-\u200D\uFEFF]/g, '');
  cleanText = cleanText.replace(/\u00A0/g, ' ');

  return cleanText.length;
};