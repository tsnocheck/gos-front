import React from 'react';
import { Text, View, Link, Image } from '@react-pdf/renderer';
import { PDFTable } from './PDFTable';
import {
  parseHTMLToPDFStructure,
  sanitizeHTML,
  type HTMLNode,
  isHeading,
  isList,
  isListItem,
  isLink,
  isParagraph,
  isBold,
  isItalic,
  isTable,
  isTableRow,
  isTableHeader,
  isTableCell,
  isImage,
  getHeadingLevel,
} from '@/utils/htmlToPdf';

interface HTMLContentProps {
  html: string;
  style?: any;
}

const HTMLContent: React.FC<HTMLContentProps> = ({ html, style }) => {
  if (!html || html.trim() === '') {
    return null;
  }

  const sanitizedHTML = sanitizeHTML(html);
  const nodes = parseHTMLToPDFStructure(sanitizedHTML);

  // Отрисовка инлайн-узлов внутри Text
  const renderInline = (
    node: HTMLNode,
    index: string | number,
  ): string | React.ReactElement | null => {
    // Текстовый узел
    if (node.type === 'text') {
      return node.data || '';
    }

    // Перенос строки
    if (node.type === 'tag' && node.name === 'br') {
      return '\n';
    }

    // Ссылка
    if (isLink(node)) {
      const href = (node as any).attribs?.href || '';
      return (
        <Link key={index} src={href} style={{ color: 'blue', textDecoration: 'underline' }}>
          {(node.children || []).map((child, childIndex) =>
            renderInline(child, `${index}-${childIndex}`),
          )}
        </Link>
      );
    }

    // Жирный текст
    if (isBold(node)) {
      return (
        <Text key={index} style={{ fontWeight: 'bold' }}>
          {(node.children || []).map((child, childIndex) =>
            renderInline(child, `${index}-${childIndex}`),
          )}
        </Text>
      );
    }

    // Курсив
    if (isItalic(node)) {
      return (
        <Text key={index} style={{ fontStyle: 'italic' }}>
          {(node.children || []).map((child, childIndex) =>
            renderInline(child, `${index}-${childIndex}`),
          )}
        </Text>
      );
    }

    // Изображение
    if (isImage(node)) {
      const src = (node as any).attribs?.src || '';
      return (
        <Image
          key={index}
          src={src}
          style={{
            width: 500,
            height: 300,
            marginVertical: 8,
          }}
        />
      );
    }

    // Спан и прочие инлайн
    if (
      node.type === 'tag' &&
      (node.name === 'span' ||
        node.name === 'strong' ||
        node.name === 'em' ||
        node.name === 'i' ||
        node.name === 'b' ||
        node.name === 'a')
    ) {
      return (node.children || []).map((child, childIndex) =>
        renderInline(child, `${index}-${childIndex}`),
      ) as any;
    }

    // По умолчанию — просто рендерим детей инлайн
    return (node.children || []).map((child, childIndex) =>
      renderInline(child, `${index}-${childIndex}`),
    ) as any;
  };

  // Отрисовка блочных элементов
  const renderBlock = (node: HTMLNode, index: string | number): React.ReactElement | null => {
    // Изображение (блочное)
    if (isImage(node)) {
      const src = (node as any).attribs?.src || '';
      return (
        <View key={index} style={{ marginVertical: 8, textAlign: 'center' }}>
          <Image
            src={src}
            style={{
              width: 500,
              height: 300,
            }}
          />
        </View>
      );
    }

    // Заголовок
    if (isHeading(node)) {
      const level = getHeadingLevel(node);
      const headingStyle = {
        fontSize: level === 1 ? 16 : level === 2 ? 14 : 12,
        fontWeight: 'bold' as const,
        marginTop: 8,
        marginBottom: 4,
      };

      return (
        <Text key={index} style={headingStyle}>
          {(node.children || []).map((child, childIndex) =>
            renderInline(child, `${index}-${childIndex}`),
          )}
        </Text>
      );
    }

    // Параграф
    if (isParagraph(node) || (node.type === 'tag' && node.name === 'div')) {
      return (
        <Text key={index} style={{ marginBottom: 6, textAlign: 'justify' }}>
          {(node.children || []).map((child, childIndex) =>
            renderInline(child, `${index}-${childIndex}`),
          )}
        </Text>
      );
    }

    // Список
    if (isList(node)) {
      return (
        <View key={index} style={{ marginBottom: 8, marginLeft: 10 }}>
          {(node.children || []).map((child, childIndex) =>
            renderBlock(child, `${index}-${childIndex}`),
          )}
        </View>
      );
    }

    // Элемент списка
    if (isListItem(node)) {
      return (
        <Text key={index} style={{ marginBottom: 2, textAlign: 'justify' }}>
          {/* Маркер списка */}
          <Text>• </Text>
          {(node.children || []).map((child, childIndex) =>
            renderInline(child, `${index}-${childIndex}`),
          )}
        </Text>
      );
    }

    // Таблица
    if (isTable(node)) {
      return (
        <PDFTable.Self key={index} style={{ marginBottom: 8 }}>
          {(node.children || []).map((child, childIndex) =>
            renderBlock(child, `${index}-${childIndex}`),
          )}
        </PDFTable.Self>
      );
    }

    // Строка таблицы
    if (isTableRow(node)) {
      return (
        <PDFTable.Tr key={index}>
          {(node.children || []).map((child, childIndex) =>
            renderBlock(child, `${index}-${childIndex}`),
          )}
        </PDFTable.Tr>
      );
    }

    // Заголовок таблицы
    if (isTableHeader(node)) {
      return (
        <PDFTable.Th key={index}>
          {(node.children || []).map((child, childIndex) =>
            renderInline(child, `${index}-${childIndex}`),
          )}
        </PDFTable.Th>
      );
    }

    // Ячейка таблицы
    if (isTableCell(node)) {
      return (
        <PDFTable.Td key={index}>
          {(node.children || []).map((child, childIndex) =>
            renderInline(child, `${index}-${childIndex}`),
          )}
        </PDFTable.Td>
      );
    }

    // Если внутри другие блоки
    if (node.children && node.children.length > 0) {
      return (
        <View key={index}>
          {node.children.map((child, childIndex) => renderBlock(child, `${index}-${childIndex}`))}
        </View>
      );
    }

    // Пусто
    return null;
  };

  return <View style={style}>{nodes.map((node, index) => renderBlock(node, index))}</View>;
};

export default HTMLContent;
