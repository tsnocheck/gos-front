import { parseDOM } from 'htmlparser2';

export interface HTMLNode {
  type: string;
  name?: string;
  attribs?: Record<string, string>;
  children?: HTMLNode[];
  data?: string;
}

/**
 * Конвертирует HTML строку в структуру для PDF
 */
export function parseHTMLToPDFStructure(html: string): HTMLNode[] {
  if (!html || html.trim() === '') {
    return [];
  }

  try {
    const dom = parseDOM(html, { decodeEntities: true });
    return dom || [];
  } catch (error) {
    console.error('Ошибка парсинга HTML:', error);
    return [];
  }
}

/**
 * Извлекает текст из HTML узла
 */
export function extractTextFromNode(node: HTMLNode): string {
  if (node.type === 'text') {
    return node.data || '';
  }

  if (node.children) {
    return node.children.map((child) => extractTextFromNode(child)).join(' ');
  }

  return '';
}

/**
 * Проверяет, является ли узел заголовком
 */
export function isHeading(node: HTMLNode): boolean {
  return node.type === 'tag' && /^h[1-6]$/.test(node.name || '');
}

/**
 * Проверяет, является ли узел списком
 */
export function isList(node: HTMLNode): boolean {
  return node.type === 'tag' && (node.name === 'ul' || node.name === 'ol');
}

/**
 * Проверяет, является ли узел элементом списка
 */
export function isListItem(node: HTMLNode): boolean {
  return node.type === 'tag' && node.name === 'li';
}

/**
 * Проверяет, является ли узел ссылкой
 */
export function isLink(node: HTMLNode): boolean {
  return node.type === 'tag' && node.name === 'a';
}

/**
 * Проверяет, является ли узел параграфом
 */
export function isParagraph(node: HTMLNode): boolean {
  return node.type === 'tag' && node.name === 'p';
}

/**
 * Проверяет, является ли узел жирным текстом
 */
export function isBold(node: HTMLNode): boolean {
  return node.type === 'tag' && (node.name === 'strong' || node.name === 'b');
}

/**
 * Проверяет, является ли узел курсивом
 */
export function isItalic(node: HTMLNode): boolean {
  return node.type === 'tag' && (node.name === 'em' || node.name === 'i');
}

/**
 * Получает уровень заголовка
 */
export function getHeadingLevel(node: HTMLNode): number {
  if (isHeading(node) && node.name) {
    const match = node.name.match(/^h(\d+)$/);
    return match ? parseInt(match[1]) : 1;
  }
  return 0;
}

/**
 * Проверяет, является ли узел таблицей
 */
export function isTable(node: HTMLNode): boolean {
  return node.type === 'tag' && node.name === 'table';
}

/**
 * Проверяет, является ли узел строкой таблицы
 */
export function isTableRow(node: HTMLNode): boolean {
  return node.type === 'tag' && node.name === 'tr';
}

/**
 * Проверяет, является ли узел заголовком таблицы
 */
export function isTableHeader(node: HTMLNode): boolean {
  return node.type === 'tag' && (node.name === 'th' || node.name === 'thead');
}

/**
 * Проверяет, является ли узел телом таблицы
 */
export function isTableBody(node: HTMLNode): boolean {
  return node.type === 'tag' && node.name === 'tbody';
}

/**
 * Проверяет, является ли узел ячейкой таблицы
 */
export function isTableCell(node: HTMLNode): boolean {
  return node.type === 'tag' && (node.name === 'td' || node.name === 'th');
}

/**
 * Проверяет, является ли узел изображением
 */
export function isImage(node: HTMLNode): boolean {
  return node.type === 'tag' && node.name === 'img';
}

/**
 * Проверяет, является ли узел подчеркнутым текстом
 */
export function isUnderline(node: HTMLNode): boolean {
  return node.type === 'tag' && node.name === 'u';
}

/**
 * Проверяет, является ли узел зачеркнутым текстом
 */
export function isStrikethrough(node: HTMLNode): boolean {
  return node.type === 'tag' && (node.name === 's' || node.name === 'strike');
}

/**
 * Извлекает CSS-класс из узла
 */
export function getNodeClass(node: HTMLNode): string | undefined {
  return node.attribs?.class;
}

/**
 * Проверяет, является ли таблица таблицей критериев
 */
export function isCriteriaTable(node: HTMLNode): boolean {
  return !!(isTable(node) && getNodeClass(node)?.includes('criteria-table'));
}

/**
 * Получает выравнивание текста из атрибутов класса Quill
 * Возвращает: 'left' | 'center' | 'right' | 'justify' | undefined
 */
export function getTextAlign(node: HTMLNode): string | undefined {
  const classStr = getNodeClass(node);
  if (!classStr) return undefined;

  if (classStr.includes('ql-align-right')) return 'right';
  if (classStr.includes('ql-align-center')) return 'center';
  if (classStr.includes('ql-align-justify')) return 'justify';
  if (classStr.includes('ql-align-left')) return 'left';

  return undefined;
}

/**
 * Очищает HTML от потенциально опасных тегов
 */
export function sanitizeHTML(html: string): string {
  // Удаляем script и style теги
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');
}
