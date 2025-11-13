export function isEmptyHTMLContent(html: string | undefined | null): boolean {
  if (!html) return true;

  const trimmed = html.trim();
  if (trimmed === '') return true;
  if (trimmed === '<p><br></p>' || trimmed === '<p></p>') return true;
  const textOnly = trimmed.replace(/<[^>]*>/g, '').trim();
  return textOnly === '';
}

export function hasAnyContent(fields: Array<string | undefined | null>): boolean {
  return fields.some((field) => !isEmptyHTMLContent(field));
}
