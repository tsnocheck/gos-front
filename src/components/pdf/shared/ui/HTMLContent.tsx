import React from 'react';
import { Text, View, Link, Image } from '@react-pdf/renderer';
import {
  SmartTable,
  type TableData,
  type TableRowData,
  type TableCellData,
  type TableColumnData,
} from './WYSIWYGPDFTable';
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
  getTextAlign,
} from '@/utils/htmlToPdf';

interface HTMLContentProps {
  html: string;
  style?: any;
}

const CONTENT_MAX_WIDTH = 530; // page width (A4 ~595) minus horizontal padding (30 * 2)
const PAGE_MAX_HEIGHT = 720; // A4 usable height (842 - vertical paddings)

// Улучшенная функция масштабирования изображений
// Гарантирует, что изображение всегда вписывается на страницу
// Optional attribute: data-fullwidth="true" — force width stretch to CONTENT_MAX_WIDTH (with proportional height).
function buildImageStyle(node: HTMLNode) {
  const attribs: any = (node as any).attribs || {};
  const forceFull = attribs['data-fullwidth'] === 'true';
  const attrW = parseInt(attribs.width || attribs['data-width'], 10);
  const attrH = parseInt(attribs.height || attribs['data-height'], 10);

  // Если оба размера указаны
  if (!isNaN(attrW) && attrW > 0 && !isNaN(attrH) && attrH > 0) {
    let scale;

    if (forceFull) {
      // Принудительно растянуть на всю ширину
      scale = CONTENT_MAX_WIDTH / attrW;
    } else {
      // Вычисляем масштаб, чтобы вписать в доступное пространство
      const scaleByWidth = CONTENT_MAX_WIDTH / attrW;
      const scaleByHeight = PAGE_MAX_HEIGHT / attrH;
      // Берём меньший масштаб, чтобы изображение вписалось в оба лимита
      scale = Math.min(scaleByWidth, scaleByHeight);
      // Не увеличиваем маленькие изображения
      if (scale > 1) scale = 1;
    }

    return { width: Math.round(attrW * scale), height: Math.round(attrH * scale) };
  }

  // Только ширина указана
  if (!isNaN(attrW) && attrW > 0) {
    if (forceFull) {
      return {
        width: CONTENT_MAX_WIDTH, // высота будет пропорциональной
      };
    }
    return { width: Math.min(attrW, CONTENT_MAX_WIDTH) };
  }

  // Только высота указана
  if (!isNaN(attrH) && attrH > 0) {
    return { height: Math.min(attrH, PAGE_MAX_HEIGHT), maxWidth: CONTENT_MAX_WIDTH };
  }

  // Без указания размеров: ограничиваем максимальными значениями
  // Это гарантирует, что даже большие изображения будут вписаны
  // Используем более агрессивный лимит для безопасности
  return { maxWidth: CONTENT_MAX_WIDTH - 20, maxHeight: PAGE_MAX_HEIGHT - 60 };
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

    // Изображения НЕ рендерим инлайном внутри <Text>, чтобы избежать наложения. Обрабатываются в блочном рендеринге и в параграфах отдельно.
    if (isImage(node)) {
      return null; // сигнал параграфному рендеру, что здесь был img (он обработает отдельно)
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
      const imgStyle = buildImageStyle(node);
      return (
        <View key={index} style={{ marginVertical: 12, alignItems: 'center' }} wrap={true}>
          <Image src={src} style={imgStyle as any} />
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
      // Получаем выравнивание из класса Quill
      const alignValue = getTextAlign(node) || 'left';
      const alignment = (
        ['left', 'center', 'right', 'justify'].includes(alignValue) ? alignValue : 'left'
      ) as 'left' | 'center' | 'right' | 'justify';

      // Собираем текстовые фрагменты и отделяем изображения как блоки
      const parts: React.ReactElement[] = [];
      let buffer: (string | React.ReactElement)[] = [];
      const flushBuffer = () => {
        if (buffer.length) {
          parts.push(
            <Text
              key={`p-text-${parts.length}`}
              style={{ marginBottom: 0, textAlign: alignment, lineHeight: 1.5, fontSize: 12 }}
            >
              {buffer as any}
            </Text>,
          );
          buffer = [];
        }
      };
      (node.children || []).forEach((child, childIndex) => {
        if (isImage(child)) {
          flushBuffer();
          const src = (child as any).attribs?.src || '';
          const imgStyle = buildImageStyle(child);
          parts.push(
            <View
              key={`p-img-${childIndex}`}
              style={{ marginVertical: 10, alignItems: 'center' }}
              wrap={true}
            >
              <Image src={src} style={imgStyle as any} />
            </View>,
          );
        } else {
          const rendered = renderInline(child, `${childIndex}`);
          if (rendered !== null && rendered !== undefined) buffer.push(rendered as any);
        }
      });
      flushBuffer();

      if (!parts.length) return null;
      return (
        <View key={index} style={{ marginBottom: 8 }}>
          {parts}
        </View>
      );
    }

    // Список с улучшенным форматированием
    if (isList(node)) {
      const isOrdered = node.name === 'ol';
      const alignValue = getTextAlign(node) || 'left';
      const alignment = (
        ['left', 'center', 'right', 'justify'].includes(alignValue) ? alignValue : 'left'
      ) as 'left' | 'center' | 'right' | 'justify';

      return (
        <View key={index} style={{ marginBottom: 8, marginLeft: 15 }}>
          {(node.children || []).map((child, childIndex) => {
            if (isListItem(child)) {
              return (
                <Text
                  key={`${index}-${childIndex}`}
                  style={{
                    marginBottom: 3,
                    textAlign: alignment,
                    fontSize: 12,
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
              fontSize: 12,
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

    // Таблица - используем SmartTable для корректного отображения
    if (isTable(node)) {
      const tableData = parseTableToData(node);
      return <SmartTable key={index} data={tableData} style={{ marginVertical: 8 }} />;
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

  // Парсит HTML таблицу в структуру TableData для SmartTable
  const parseTableToData = (tableNode: HTMLNode): TableData => {
    const rows: TableRowData[] = [];
    const columns: TableColumnData[] = [];

    // Извлекаем информацию о колонках из colgroup
    const colgroupNode = (tableNode.children || []).find(
      (child) => child.type === 'tag' && child.name === 'colgroup',
    );
    if (colgroupNode) {
      (colgroupNode.children || []).forEach((col) => {
        if (col.type === 'tag' && col.name === 'col') {
          const attribs = (col as any).attribs || {};
          const width =
            attribs.width || attribs.style?.match(/width:\s*(\d+(?:\.\d+)?(?:px|%)?)/)?.[1];
          columns.push({ width: width ? parseFloat(width) : undefined });
        }
      });
    }

    // Обрабатываем thead
    const theadNode = (tableNode.children || []).find(
      (child) => child.type === 'tag' && child.name === 'thead',
    );
    if (theadNode) {
      (theadNode.children || []).forEach((row) => {
        if (isTableRow(row)) {
          rows.push(parseTableRow(row, true));
        }
      });
    }

    // Обрабатываем tbody
    const tbodyNode = (tableNode.children || []).find(
      (child) => child.type === 'tag' && child.name === 'tbody',
    );
    if (tbodyNode) {
      (tbodyNode.children || []).forEach((row) => {
        if (isTableRow(row)) {
          rows.push(parseTableRow(row, false));
        }
      });
    }

    // Обрабатываем строки напрямую в table (без thead/tbody)
    (tableNode.children || []).forEach((child) => {
      if (isTableRow(child)) {
        const hasThCells = (child.children || []).some((c) => c.name === 'th');
        rows.push(parseTableRow(child, hasThCells));
      }
    });

    return { rows, columns: columns.length > 0 ? columns : undefined };
  };

  // Парсит строку таблицы
  const parseTableRow = (rowNode: HTMLNode, isHeader: boolean): TableRowData => {
    const cells: TableCellData[] = [];

    (rowNode.children || []).forEach((cellNode) => {
      if (isTableCell(cellNode)) {
        cells.push(parseTableCellData(cellNode, isHeader || cellNode.name === 'th'));
      }
    });

    return { cells, isHeader };
  };

  // Парсит ячейку таблицы в TableCellData
  const parseTableCellData = (cellNode: HTMLNode, isHeader: boolean): TableCellData => {
    const attribs = (cellNode as any).attribs || {};
    const colspan = attribs.colspan ? parseInt(attribs.colspan, 10) : undefined;
    const rowspan = attribs.rowspan ? parseInt(attribs.rowspan, 10) : undefined;

    // Рендерим содержимое ячейки
    const content = renderCellContent(cellNode);

    return {
      content,
      colspan,
      rowspan,
      isHeader,
    };
  };

  // Рендерит содержимое ячейки таблицы
  const renderCellContent = (cellNode: HTMLNode): React.ReactNode => {
    const children = cellNode.children || [];

    // Проверяем, есть ли блочные элементы
    const hasBlockElements = children.some(
      (child) =>
        child.type === 'tag' &&
        (child.name === 'p' ||
          child.name === 'div' ||
          child.name === 'ul' ||
          child.name === 'ol' ||
          child.name === 'blockquote'),
    );

    if (hasBlockElements) {
      return children.map((child, childIndex) => {
        // Для параграфов
        if (child.type === 'tag' && (child.name === 'p' || child.name === 'div')) {
          return (
            <Text key={childIndex} style={{ fontSize: 10, lineHeight: 1.3 }}>
              {(child.children || []).map((grandChild, grandChildIndex) =>
                renderInline(grandChild, `cell-${childIndex}-${grandChildIndex}`),
              )}
            </Text>
          );
        }
        // Для списков
        if (child.type === 'tag' && (child.name === 'ul' || child.name === 'ol')) {
          const isOrdered = child.name === 'ol';
          return (
            <View key={childIndex} style={{ marginLeft: 10 }}>
              {(child.children || []).map((listItem, listItemIndex) => {
                if (isListItem(listItem)) {
                  return (
                    <Text key={listItemIndex} style={{ fontSize: 10, marginBottom: 2 }}>
                      {isOrdered ? `${listItemIndex + 1}. ` : '• '}
                      {(listItem.children || []).map((listChild, listChildIndex) =>
                        renderInline(listChild, `list-${listItemIndex}-${listChildIndex}`),
                      )}
                    </Text>
                  );
                }
                return null;
              })}
            </View>
          );
        }
        return renderInline(child, `inline-${childIndex}`);
      });
    }

    // Просто inline контент
    return (
      <Text style={{ fontSize: 10, lineHeight: 1.3 }}>
        {children.map((child, childIndex) => renderInline(child, `inline-${childIndex}`))}
      </Text>
    );
  };

  return <View style={style}>{nodes.map((node, index) => renderBlock(node, index))}</View>;
};

export default HTMLContent;
