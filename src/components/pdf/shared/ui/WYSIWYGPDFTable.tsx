import React, { type PropsWithChildren } from 'react';
import { View, Text } from '@react-pdf/renderer';
import { StyleSheet } from '@react-pdf/renderer';

// Ширина содержимого страницы (A4 ~595pt - margins 30*2)
const TABLE_WIDTH = 535;

const WYSIWYGTableStyles = StyleSheet.create({
  table: {
    marginTop: 8,
    marginBottom: 8,
    width: TABLE_WIDTH,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: '#000',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  cell: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#000',
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 10,
    lineHeight: 1.25,
    minHeight: 20,
  },
  headerCell: {
    backgroundColor: '#f5f5f5',
  },
  headerText: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 10,
  },
});

// Интерфейс для данных о ячейке
export interface TableCellData {
  content: React.ReactNode;
  colspan?: number;
  rowspan?: number;
  isHeader?: boolean;
  width?: number | string;
}

// Интерфейс для данных о строке
export interface TableRowData {
  cells: TableCellData[];
  isHeader?: boolean;
}

// Интерфейс для данных о колонках
export interface TableColumnData {
  width?: number | string;
}

// Интерфейс для всей таблицы
export interface TableData {
  rows: TableRowData[];
  columns?: TableColumnData[];
}

// Вычисляет количество колонок в таблице
function calculateColumnCount(rows: TableRowData[]): number {
  let maxColumns = 0;
  for (const row of rows) {
    let colCount = 0;
    for (const cell of row.cells) {
      colCount += cell.colspan || 1;
    }
    maxColumns = Math.max(maxColumns, colCount);
  }
  return maxColumns;
}

// Вычисляет ширину колонок
function calculateColumnWidths(columnCount: number, columns?: TableColumnData[]): number[] {
  const widths: number[] = [];
  const baseWidth = TABLE_WIDTH / columnCount;

  for (let i = 0; i < columnCount; i++) {
    if (columns && columns[i] && columns[i].width) {
      const w = columns[i].width;
      if (typeof w === 'number') {
        widths.push(w);
      } else if (typeof w === 'string' && w.endsWith('%')) {
        widths.push((parseFloat(w) / 100) * TABLE_WIDTH);
      } else {
        widths.push(parseFloat(w as string) || baseWidth);
      }
    } else {
      widths.push(baseWidth);
    }
  }

  return widths;
}

// Вычисляет ширину ячейки с учётом colspan
function getCellWidth(startCol: number, colspan: number, columnWidths: number[]): number {
  let width = 0;
  for (let i = startCol; i < startCol + colspan && i < columnWidths.length; i++) {
    width += columnWidths[i];
  }
  return width;
}

// Компонент таблицы (умная версия с предрасчитанными шиинами)
interface SmartTableProps {
  data: TableData;
  style?: any;
}

export const SmartTable: React.FC<SmartTableProps> = ({ data, style }) => {
  const columnCount = calculateColumnCount(data.rows);
  const columnWidths = calculateColumnWidths(columnCount, data.columns);

  // Матрица для отслеживания rowspan
  // rowspanMap[rowIndex][colIndex] = количество оставшихся строк для rowspan
  const rowspanMap: number[][] = [];

  return (
    <View style={[WYSIWYGTableStyles.table, style || {}]} wrap={true}>
      {data.rows.map((row, rowIndex) => {
        // Инициализируем строку в матрице rowspan
        if (!rowspanMap[rowIndex]) {
          rowspanMap[rowIndex] = new Array(columnCount).fill(0);
        }

        let currentCol = 0;
        const renderedCells: React.ReactElement[] = [];

        for (const cell of row.cells) {
          // Пропускаем колонки, занятые rowspan из предыдущих строк
          while (currentCol < columnCount && rowspanMap[rowIndex][currentCol] > 0) {
            // Уменьшаем счётчик rowspan для следующей строки
            if (rowspanMap[rowIndex + 1]) {
              rowspanMap[rowIndex + 1][currentCol] = rowspanMap[rowIndex][currentCol] - 1;
            } else if (rowIndex + 1 < data.rows.length) {
              rowspanMap[rowIndex + 1] = new Array(columnCount).fill(0);
              rowspanMap[rowIndex + 1][currentCol] = rowspanMap[rowIndex][currentCol] - 1;
            }

            // Рендерим пустую ячейку-заглушку (невидимую) для сохранения структуры
            // Но мы используем абсолютные ширины, поэтому просто сдвигаем currentCol
            const spanWidth = getCellWidth(currentCol, 1, columnWidths);
            renderedCells.push(
              <View
                key={`placeholder-${rowIndex}-${currentCol}`}
                style={{
                  width: spanWidth,
                  display: 'none',
                }}
              />,
            );
            currentCol++;
          }

          const colspan = cell.colspan || 1;
          const rowspan = cell.rowspan || 1;
          const cellWidth = getCellWidth(currentCol, colspan, columnWidths);

          // Регистрируем rowspan
          if (rowspan > 1) {
            for (let r = 1; r < rowspan; r++) {
              if (!rowspanMap[rowIndex + r]) {
                rowspanMap[rowIndex + r] = new Array(columnCount).fill(0);
              }
              for (let c = currentCol; c < currentCol + colspan; c++) {
                rowspanMap[rowIndex + r][c] = rowspan - r;
              }
            }
          }

          const isHeader = cell.isHeader || row.isHeader;
          const cellStyle: any[] = [WYSIWYGTableStyles.cell, { width: cellWidth }];
          if (isHeader) {
            cellStyle.push(WYSIWYGTableStyles.headerCell);
          }

          const content =
            typeof cell.content === 'string' || typeof cell.content === 'number' ? (
              <Text
                style={isHeader ? WYSIWYGTableStyles.headerText : { fontSize: 10, lineHeight: 1.3 }}
              >
                {cell.content}
              </Text>
            ) : (
              cell.content
            );

          renderedCells.push(
            <View key={`cell-${rowIndex}-${currentCol}`} style={cellStyle as any} wrap={false}>
              {content}
            </View>,
          );

          currentCol += colspan;
        }

        // Заполняем оставшиеся ячейки в строке (если есть)
        while (currentCol < columnCount) {
          if (rowspanMap[rowIndex][currentCol] > 0) {
            // Пропускаем - ячейка занята rowspan
            if (rowspanMap[rowIndex + 1]) {
              rowspanMap[rowIndex + 1][currentCol] = rowspanMap[rowIndex][currentCol] - 1;
            }
          }
          currentCol++;
        }

        return (
          <View key={`row-${rowIndex}`} style={WYSIWYGTableStyles.row} wrap={false}>
            {renderedCells}
          </View>
        );
      })}
    </View>
  );
};

// Старый API для обратной совместимости
type CellProps = PropsWithChildren<{
  style?: any;
  colspan?: number;
  rowspan?: number;
  width?: string | number;
  hidden?: boolean;
}>;

type RowProps = PropsWithChildren<{
  style?: any;
  isHeader?: boolean;
}>;

export const WYSIWYGPDFTable = {
  Table: (props: PropsWithChildren<{ style?: any }>) => (
    <View style={[WYSIWYGTableStyles.table, props.style || {}]} wrap={true}>
      {props.children}
    </View>
  ),

  Row: (props: RowProps) => (
    <View style={[WYSIWYGTableStyles.row, props.style || {}]} wrap={false}>
      {props.children}
    </View>
  ),

  HeaderCell: (props: CellProps) => {
    const cellStyle: any = { ...WYSIWYGTableStyles.cell, ...WYSIWYGTableStyles.headerCell };

    if (props.width) {
      cellStyle.width = props.width;
      cellStyle.flexGrow = 0;
      cellStyle.flexShrink = 0;
    } else {
      cellStyle.flex = props.colspan || 1;
    }

    const isReactElement = React.isValidElement(props.children);
    const isArrayOfElements =
      Array.isArray(props.children) && props.children.some((child) => React.isValidElement(child));

    return (
      <View style={[cellStyle, props.style || {}]} wrap={false}>
        {isReactElement || isArrayOfElements ? (
          props.children
        ) : (
          <Text style={WYSIWYGTableStyles.headerText}>{props.children}</Text>
        )}
      </View>
    );
  },

  Cell: (props: CellProps) => {
    const cellStyle: any = { ...WYSIWYGTableStyles.cell };

    if (props.width) {
      cellStyle.width = props.width;
      cellStyle.flexGrow = 0;
      cellStyle.flexShrink = 0;
    } else {
      cellStyle.flex = props.colspan || 1;
    }

    const isReactElement = React.isValidElement(props.children);
    const isArrayOfElements =
      Array.isArray(props.children) && props.children.some((child) => React.isValidElement(child));

    return (
      <View style={[cellStyle, props.style || {}]} wrap={false}>
        {isReactElement || isArrayOfElements ? (
          props.children
        ) : (
          <Text style={{ fontSize: 10, lineHeight: 1.3 }}>{props.children}</Text>
        )}
      </View>
    );
  },
};
