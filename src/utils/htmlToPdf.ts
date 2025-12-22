import { parseDOM } from 'htmlparser2';

export interface HTMLNode {
  type: string;
  name?: string;
  attribs?: Record<string, string>;
  children?: HTMLNode[];
  data?: string;
}

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

export function extractTextFromNode(node: HTMLNode): string {
  if (node.type === 'text') {
    return node.data || '';
  }

  if (node.children) {
    return node.children.map((child) => extractTextFromNode(child)).join(' ');
  }

  return '';
}

export function isHeading(node: HTMLNode): boolean {
  return node.type === 'tag' && /^h[1-6]$/.test(node.name || '');
}

export function isList(node: HTMLNode): boolean {
  return node.type === 'tag' && (node.name === 'ul' || node.name === 'ol');
}

export function isListItem(node: HTMLNode): boolean {
  return node.type === 'tag' && node.name === 'li';
}

export function isLink(node: HTMLNode): boolean {
  return node.type === 'tag' && node.name === 'a';
}

export function isParagraph(node: HTMLNode): boolean {
  return node.type === 'tag' && node.name === 'p';
}

export function isBold(node: HTMLNode): boolean {
  return node.type === 'tag' && (node.name === 'strong' || node.name === 'b');
}

export function isItalic(node: HTMLNode): boolean {
  return node.type === 'tag' && (node.name === 'em' || node.name === 'i');
}

export function getHeadingLevel(node: HTMLNode): number {
  if (isHeading(node) && node.name) {
    const match = node.name.match(/^h(\d+)$/);
    return match ? parseInt(match[1]) : 1;
  }
  return 0;
}

export function isTable(node: HTMLNode): boolean {
  return node.type === 'tag' && node.name === 'table';
}
export function isTableRow(node: HTMLNode): boolean {
  return node.type === 'tag' && node.name === 'tr';
}
export function isTableHeader(node: HTMLNode): boolean {
  return node.type === 'tag' && (node.name === 'th' || node.name === 'thead');
}

export function isTableBody(node: HTMLNode): boolean {
  return node.type === 'tag' && node.name === 'tbody';
}

export function isTableCell(node: HTMLNode): boolean {
  return node.type === 'tag' && (node.name === 'td' || node.name === 'th');
}

export function isImage(node: HTMLNode): boolean {
  return node.type === 'tag' && node.name === 'img';
}

export function isUnderline(node: HTMLNode): boolean {
  return node.type === 'tag' && node.name === 'u';
}


export function isStrikethrough(node: HTMLNode): boolean {
  return node.type === 'tag' && (node.name === 's' || node.name === 'strike');
}

export function getNodeClass(node: HTMLNode): string | undefined {
  return node.attribs?.class;
}

export function isCriteriaTable(node: HTMLNode): boolean {
  return !!(isTable(node) && getNodeClass(node)?.includes('criteria-table'));
}

export function getTextAlign(node: HTMLNode): string | undefined {
  const classStr = getNodeClass(node);
  if (!classStr) return undefined;

  if (classStr.includes('ql-align-right')) return 'right';
  if (classStr.includes('ql-align-center')) return 'center';
  if (classStr.includes('ql-align-justify')) return 'justify';
  if (classStr.includes('ql-align-left')) return 'left';

  return undefined;
}

export function sanitizeHTML(html: string): string {

  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');
}
