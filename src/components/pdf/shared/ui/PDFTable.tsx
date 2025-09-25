import { View, Text } from '@react-pdf/renderer';
import type { PropsWithChildren } from 'react';
import { PDFTableStyles, type StyleObject } from '../utils';

type CellProps = PropsWithChildren<{ style?: StyleObject; wrap?: boolean }>;
type RowProps = PropsWithChildren<{ style?: StyleObject; wrap?: boolean; isHeader?: boolean }>;

export const PDFTable: Record<string, React.FC<CellProps | RowProps>> = {
  Self: (props: CellProps) => (
    <View style={[PDFTableStyles.self, props.style || {}]} wrap={true}>
      {props.children}
    </View>
  ),
  Tr: (props: RowProps) => (
    // prevent breaking a single row across pages by default
    // if isHeader is true, mark the row as fixed so it can be repeated on each page
    <View style={[PDFTableStyles.row, props.style || {}]} wrap={props.wrap ?? false}>
      {props.children}
    </View>
  ),
  Th: (props: CellProps) => (
    // prevent splitting header cell content across pages by default
    <View
      style={[PDFTableStyles.col, PDFTableStyles.headerCell, props.style || {}]}
      wrap={props.wrap ?? false}
    >
      <Text style={PDFTableStyles.headerText}>{props.children}</Text>
    </View>
  ),
  Td: (props: CellProps) => (
    // prevent splitting cell content across pages by default
    <View style={[PDFTableStyles.col, props.style || {}]} wrap={props.wrap ?? false}>
      <Text>{props.children}</Text>
    </View>
  ),
};
