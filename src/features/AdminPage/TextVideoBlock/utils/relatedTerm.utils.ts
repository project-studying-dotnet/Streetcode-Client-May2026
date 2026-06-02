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
    // Сравниваем текст внутри тега с введенным словом
    if (node.textContent?.trim().toLowerCase() === word.trim().toLowerCase()) {
      // Запоминаем ID для API
      const idAttr = node.getAttribute('data-id');
      foundId = idAttr ? parseInt(idAttr, 10) : null;
      
      // Заменяем тег <term> на обычный текстовый узел (unwrap)
      node.replaceWith(document.createTextNode(node.textContent || ''));
    }
  });

  return {
    updatedHtml: doc.body.innerHTML,
    termId: foundId,
  };
};