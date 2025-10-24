/**
 * Проверяет, является ли HTML контент пустым
 * @param html - HTML строка для проверки
 * @returns true, если контент пустой или содержит только пробелы/пустые теги
 */
export function isEmptyHTMLContent(html: string | undefined | null): boolean {
  if (!html) return true;

  const trimmed = html.trim();
  if (trimmed === '') return true;

  // Проверяем на пустые параграфы Quill редактора
  if (trimmed === '<p><br></p>' || trimmed === '<p></p>') return true;

  // Удаляем все HTML теги и проверяем, остался ли текст
  const textOnly = trimmed.replace(/<[^>]*>/g, '').trim();
  return textOnly === '';
}

/**
 * Проверяет, есть ли хоть какое-то заполненное поле в объекте
 * @param fields - массив значений для проверки
 * @returns true, если хотя бы одно поле не пустое
 */
export function hasAnyContent(fields: Array<string | undefined | null>): boolean {
  return fields.some((field) => !isEmptyHTMLContent(field));
}
