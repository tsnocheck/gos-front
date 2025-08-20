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
    return node.children.map(child => extractTextFromNode(child)).join(' ');
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
