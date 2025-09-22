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
  isTableCell,
  isImage,
  isUnderline,
  isStrikethrough,
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
        <Link key={index} src={href} style={{ color: '#1890ff', textDecoration: 'underline' }}>
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

    // Подчеркнутый текст
    if (isUnderline(node)) {
      return (
        <Text key={index} style={{ textDecoration: 'underline' }}>
          {(node.children || []).map((child, childIndex) =>
            renderInline(child, `${index}-${childIndex}`),
          )}
        </Text>
      );
    }

    // Зачеркнутый текст
    if (isStrikethrough(node)) {
      return (
        <Text key={index} style={{ textDecoration: 'line-through' }}>
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
        fontSize: level === 1 ? 18 : level === 2 ? 16 : level === 3 ? 14 : 12,
        fontWeight: 'bold' as const,
        marginTop: level <= 2 ? 12 : 8,
        marginBottom: level <= 2 ? 8 : 4,
        color: '#262626',
      };

      return (
        <Text key={index} style={headingStyle}>
          {(node.children || []).map((child, childIndex) =>
            renderInline(child, `${index}-${childIndex}`),
          )}
        </Text>
      );
    }

    // Параграф с улучшенным форматированием
    if (isParagraph(node) || (node.type === 'tag' && node.name === 'div')) {
      return (
        <Text
          key={index}
          style={{
            marginBottom: 8,
            textAlign: 'justify',
            lineHeight: 1.5,
            fontSize: 10,
          }}
        >
          {(node.children || []).map((child, childIndex) =>
            renderInline(child, `${index}-${childIndex}`),
          )}
        </Text>
      );
    }

    // Список с улучшенным форматированием
    if (isList(node)) {
      const isOrdered = node.name === 'ol';
      return (
        <View key={index} style={{ marginBottom: 8, marginLeft: 15 }}>
          {(node.children || []).map((child, childIndex) => {
            if (isListItem(child)) {
              return (
                <Text
                  key={`${index}-${childIndex}`}
                  style={{
                    marginBottom: 3,
                    textAlign: 'justify',
                    fontSize: 10,
                    lineHeight: 1.4,
                  }}
                >
                  <Text style={{ fontWeight: 'bold' }}>
                    {isOrdered ? `${childIndex + 1}. ` : '• '}
                  </Text>
                  {(child.children || []).map((grandChild, grandChildIndex) =>
                    renderInline(grandChild, `${index}-${childIndex}-${grandChildIndex}`),
                  )}
                </Text>
              );
            }
            return renderBlock(child, `${index}-${childIndex}`);
          })}
        </View>
      );
    }

    // Цитата
    if (node.type === 'tag' && node.name === 'blockquote') {
      return (
        <View
          key={index}
          style={{
            marginVertical: 8,
            marginLeft: 20,
            paddingLeft: 12,
            borderLeft: '2pt solid #d9d9d9',
          }}
        >
          <Text
            style={{
              fontStyle: 'italic',
              fontSize: 10,
              color: '#595959',
            }}
          >
            {(node.children || []).map((child, childIndex) =>
              renderInline(child, `${index}-${childIndex}`),
            )}
          </Text>
        </View>
      );
    }

    // Таблица
    if (isTable(node)) {
      return (
        <View key={index} style={{ marginVertical: 8 }}>
          <PDFTable.Self>
            {(node.children || []).map((child, childIndex) =>
              renderTableElement(child, `${index}-${childIndex}`),
            )}
          </PDFTable.Self>
        </View>
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

  // Специальная функция для рендеринга элементов таблицы
  const renderTableElement = (
    node: HTMLNode,
    index: string | number,
  ): React.ReactElement | null => {
    // Заголовок таблицы (thead)
    if (node.type === 'tag' && node.name === 'thead') {
      return (
        <React.Fragment key={index}>
          {(node.children || []).map((child, childIndex) => {
            if (isTableRow(child)) {
              return (
                <PDFTable.Tr key={`${index}-${childIndex}`} isHeader>
                  {(child.children || []).map((cell, cellIndex) =>
                    renderTableCell(cell, `${index}-${childIndex}-${cellIndex}`, true),
                  )}
                </PDFTable.Tr>
              );
            }
            return null;
          })}
        </React.Fragment>
      );
    }

    // Тело таблицы (tbody)
    if (node.type === 'tag' && node.name === 'tbody') {
      return (
        <React.Fragment key={index}>
          {(node.children || []).map((child, childIndex) => {
            if (isTableRow(child)) {
              return (
                <PDFTable.Tr key={`${index}-${childIndex}`}>
                  {(child.children || []).map((cell, cellIndex) =>
                    renderTableCell(cell, `${index}-${childIndex}-${cellIndex}`, false),
                  )}
                </PDFTable.Tr>
              );
            }
            return null;
          })}
        </React.Fragment>
      );
    }

    // Строка таблицы (если не в thead/tbody)
    if (isTableRow(node)) {
      return (
        <PDFTable.Tr key={index}>
          {(node.children || []).map((child, childIndex) =>
            renderTableCell(child, `${index}-${childIndex}`, false),
          )}
        </PDFTable.Tr>
      );
    }

    return null;
  };

  // Специальная функция для рендеринга ячеек таблицы
  const renderTableCell = (
    node: HTMLNode,
    index: string | number,
    isHeader: boolean,
  ): React.ReactElement | null => {
    if (isTableCell(node)) {
      const CellComponent = isHeader || node.name === 'th' ? PDFTable.Th : PDFTable.Td;
      return (
        <CellComponent key={index}>
          {(node.children || []).map((child, childIndex) =>
            renderInline(child, `${index}-${childIndex}`),
          )}
        </CellComponent>
      );
    }
    return null;
  };

  return <View style={style}>{nodes.map((node, index) => renderBlock(node, index))}</View>;
};

export default HTMLContent;
