export const replaceFirstTermOccurrence = (
  html: string,
  word: string,
  termId: number
): string | null => {
  const normalizedWord = word.trim();

  if (!normalizedWord) {
    return null;
  }

  const escapedWord = normalizedWord.replace(
    /[.*+?^${}()|[\]\\]/g,
    '\\$&'
  );

  const regex = new RegExp(escapedWord, 'i');

  if (!regex.test(html)) {
    return null;
  }

  return html.replace(
    regex,
    `<term data-id="${termId}" class="term-linked">${normalizedWord}</term>`
  );
};


export const removeTermTag = (
  html: string,
  word: string
): { updatedHtml: string; termId: number | null } => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  let foundId: number | null = null;

doc.querySelectorAll('term').forEach((node) => {

  const element = node as HTMLElement;
  
  if (element.textContent?.trim().toLowerCase() === word.trim().toLowerCase()) {
    const idAttr = element.dataset.id;
    foundId = idAttr ? parseInt(idAttr, 10) : null;
    
    element.replaceWith(document.createTextNode(element.textContent || ''));
  }
});
  return {
    updatedHtml: doc.body.innerHTML,
    termId: foundId,
  };
};