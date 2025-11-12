import React from 'react';
import { Text, View, Link, Image } from '@react-pdf/renderer';
import { WYSIWYGPDFTable } from './WYSIWYGPDFTable';
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

const CONTENT_MAX_WIDTH = 530;
const PAGE_MAX_HEIGHT = 720;
function buildImageStyle(node: HTMLNode) {
  const attribs: any = (node as any).attribs || {};
  const forceFull = attribs['data-fullwidth'] === 'true';
  const attrW = parseInt(attribs.width || attribs['data-width'], 10);
  const attrH = parseInt(attribs.height || attribs['data-height'], 10);
  if (!isNaN(attrW) && attrW > 0 && !isNaN(attrH) && attrH > 0) {
    let scale;

    if (forceFull) {

      scale = CONTENT_MAX_WIDTH / attrW;
    } else {

      const scaleByWidth = CONTENT_MAX_WIDTH / attrW;
      const scaleByHeight = PAGE_MAX_HEIGHT / attrH;

      scale = Math.min(scaleByWidth, scaleByHeight);

      if (scale > 1) scale = 1;
    }

    return { width: Math.round(attrW * scale), height: Math.round(attrH * scale) };
  }
  if (!isNaN(attrW) && attrW > 0) {
    if (forceFull) {
      return {
        width: CONTENT_MAX_WIDTH,
      };
    }
    return { width: Math.min(attrW, CONTENT_MAX_WIDTH) };
  }
  if (!isNaN(attrH) && attrH > 0) {
    return { height: Math.min(attrH, PAGE_MAX_HEIGHT), maxWidth: CONTENT_MAX_WIDTH };
  }
  return { maxWidth: CONTENT_MAX_WIDTH - 20, maxHeight: PAGE_MAX_HEIGHT - 60 };
}

const HTMLContent: React.FC<HTMLContentProps> = ({ html, style }) => {
  if (!html || html.trim() === '') {
    return null;
  }

  const sanitizedHTML = sanitizeHTML(html);
  const nodes = parseHTMLToPDFStructure(sanitizedHTML);
  const renderInline = (
    node: HTMLNode,
    index: string | number,
  ): string | React.ReactElement | null => {

    if (node.type === 'text') {
      return node.data || '';
    }
    if (node.type === 'tag' && node.name === 'br') {
      return '\n';
    }
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
    if (isBold(node)) {
      return (
        <Text key={index} style={{ fontWeight: 'bold' }}>
          {(node.children || []).map((child, childIndex) =>
            renderInline(child, `${index}-${childIndex}`),
          )}
        </Text>
      );
    }
    if (isItalic(node)) {
      return (
        <Text key={index} style={{ fontStyle: 'italic' }}>
          {(node.children || []).map((child, childIndex) =>
            renderInline(child, `${index}-${childIndex}`),
          )}
        </Text>
      );
    }
    if (isUnderline(node)) {
      return (
        <Text key={index} style={{ textDecoration: 'underline' }}>
          {(node.children || []).map((child, childIndex) =>
            renderInline(child, `${index}-${childIndex}`),
          )}
        </Text>
      );
    }
    if (isStrikethrough(node)) {
      return (
        <Text key={index} style={{ textDecoration: 'line-through' }}>
          {(node.children || []).map((child, childIndex) =>
            renderInline(child, `${index}-${childIndex}`),
          )}
        </Text>
      );
    }
    if (isImage(node)) {
      return null;
    }
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
    return (node.children || []).map((child, childIndex) =>
      renderInline(child, `${index}-${childIndex}`),
    ) as any;
  };
  const renderBlock = (node: HTMLNode, index: string | number): React.ReactElement | null => {

    if (isImage(node)) {
      const src = (node as any).attribs?.src || '';
      const imgStyle = buildImageStyle(node);
      return (
        <View key={index} style={{ marginVertical: 12, alignItems: 'center' }} wrap={true}>
          <Image src={src} style={imgStyle as any} />
        </View>
      );
    }
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
    if (isParagraph(node) || (node.type === 'tag' && node.name === 'div')) {

      const alignValue = getTextAlign(node) || 'left';
      const alignment = (
        ['left', 'center', 'right', 'justify'].includes(alignValue) ? alignValue : 'left'
      ) as 'left' | 'center' | 'right' | 'justify';
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
    if (isTable(node)) {
      return (
        <WYSIWYGPDFTable.Table key={index} style={{ marginVertical: 8 }}>
          {(node.children || []).map((child, childIndex) =>
            renderTableElement(child, `${index}-${childIndex}`),
          )}
        </WYSIWYGPDFTable.Table>
      );
    }
    if (node.children && node.children.length > 0) {
      return (
        <View key={index}>
          {node.children.map((child, childIndex) => renderBlock(child, `${index}-${childIndex}`))}
        </View>
      );
    }
    return null;
  };
  const renderTableElement = (
    node: HTMLNode,
    index: string | number,
  ): React.ReactElement | null => {

    if (node.type === 'tag' && node.name === 'colgroup') {
      return null;
    }
    if (node.type === 'tag' && node.name === 'thead') {
      return (
        <React.Fragment key={index}>
          {(node.children || []).map((child, childIndex) => {
            if (isTableRow(child)) {
              return (
                <WYSIWYGPDFTable.Row key={`${index}-${childIndex}`} isHeader>
                  {(child.children || []).map((cell, cellIndex) =>
                    renderTableCell(cell, `${index}-${childIndex}-${cellIndex}`, true),
                  )}
                </WYSIWYGPDFTable.Row>
              );
            }
            return null;
          })}
        </React.Fragment>
      );
    }
    if (node.type === 'tag' && node.name === 'tbody') {
      return (
        <React.Fragment key={index}>
          {(node.children || []).map((child, childIndex) => {
            if (isTableRow(child)) {
              return (
                <WYSIWYGPDFTable.Row key={`${index}-${childIndex}`}>
                  {(child.children || []).map((cell, cellIndex) =>
                    renderTableCell(cell, `${index}-${childIndex}-${cellIndex}`, false),
                  )}
                </WYSIWYGPDFTable.Row>
              );
            }
            return null;
          })}
        </React.Fragment>
      );
    }
    if (isTableRow(node)) {

      const hasThCells = (node.children || []).some((child) => child.name === 'th');
      return (
        <WYSIWYGPDFTable.Row key={index} isHeader={hasThCells}>
          {(node.children || []).map((child, childIndex) =>
            renderTableCell(child, `${index}-${childIndex}`, hasThCells),
          )}
        </WYSIWYGPDFTable.Row>
      );
    }

    return null;
  };
  const renderTableCell = (
    node: HTMLNode,
    index: string | number,
    isHeader: boolean,
  ): React.ReactElement | null => {
    if (isTableCell(node)) {
      const CellComponent =
        isHeader || node.name === 'th' ? WYSIWYGPDFTable.HeaderCell : WYSIWYGPDFTable.Cell;
      const attribs = (node as any).attribs || {};
      const colspan = attribs.colspan ? parseInt(attribs.colspan, 10) : undefined;
      const width = attribs.width || attribs['data-width'] || undefined;
      const dataRow = attribs['data-row'];
      const cellStyle: any = {};
      if (dataRow) {
        const widthMatch = dataRow.match(/width:\s*(\d+(?:\.\d+)?)(px|%)?/);
        if (widthMatch) {
          const widthValue = parseFloat(widthMatch[1]);
          const widthUnit = widthMatch[2] || 'px';
          if (widthUnit === '%') {
            cellStyle.width = `${widthValue}%`;
          } else {

            cellStyle.width = widthValue * 0.75;
          }
        }
      }

      const hasBlockElements = (node.children || []).some(
        (child) =>
          child.type === 'tag' &&
          (child.name === 'p' ||
            child.name === 'div' ||
            child.name === 'ul' ||
            child.name === 'ol' ||
            child.name === 'blockquote'),
      );

      const cellContent = hasBlockElements
        ? (node.children || []).map((child, childIndex) => {

            if (child.type === 'tag' && (child.name === 'p' || child.name === 'div')) {
              return (
                <Text key={`${index}-${childIndex}`} style={{ fontSize: 10, lineHeight: 1.3 }}>
                  {(child.children || []).map((grandChild, grandChildIndex) =>
                    renderInline(grandChild, `${index}-${childIndex}-${grandChildIndex}`),
                  )}
                </Text>
              );
            }

            if (child.type === 'tag' && (child.name === 'ul' || child.name === 'ol')) {
              const isOrdered = child.name === 'ol';
              return (
                <View key={`${index}-${childIndex}`} style={{ marginLeft: 10 }}>
                  {(child.children || []).map((listItem, listItemIndex) => {
                    if (isListItem(listItem)) {
                      return (
                        <Text
                          key={`${index}-${childIndex}-${listItemIndex}`}
                          style={{ fontSize: 10, marginBottom: 2 }}
                        >
                          {isOrdered ? `${listItemIndex + 1}. ` : '• '}
                          {(listItem.children || []).map((listChild, listChildIndex) =>
                            renderInline(
                              listChild,
                              `${index}-${childIndex}-${listItemIndex}-${listChildIndex}`,
                            ),
                          )}
                        </Text>
                      );
                    }
                    return null;
                  })}
                </View>
              );
            }
            return renderInline(child, `${index}-${childIndex}`);
          })
        : (node.children || []).map((child, childIndex) =>
            renderInline(child, `${index}-${childIndex}`),
          );

      return (
        <CellComponent
          key={index}
          colspan={colspan}
          width={width || cellStyle.width}
          style={cellStyle}
        >
          {cellContent}
        </CellComponent>
      );
    }
    return null;
  };

  return <View style={style}>{nodes.map((node, index) => renderBlock(node, index))}</View>;
};

export default HTMLContent;
