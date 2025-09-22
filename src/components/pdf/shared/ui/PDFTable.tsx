import { View, Text } from '@react-pdf/renderer';
import type { PropsWithChildren } from 'react';
import { PDFTableStyles, type StyleObject } from '../utils';

type CellProps = PropsWithChildren<{ style?: StyleObject; wrap?: boolean }>;
type RowProps = PropsWithChildren<{ style?: StyleObject; wrap?: boolean; isHeader?: boolean }>;

export const PDFTable: Record<string, React.FC<CellProps | RowProps>> = {
  Self: (props: CellProps) => (
    <View style={[PDFTableStyles.self, props.style || {}]} wrap={props.wrap}>
      {props.children}
    </View>
  ),
  Tr: (props: RowProps) => (
    <View
      style={[
        PDFTableStyles.row,
        props.isHeader && PDFTableStyles.headerRow,
        props.style || {}
      ]}
      wrap={props.wrap}
    >
      {props.children}
    </View>
  ),
  Th: (props: CellProps) => (
    <View
      style={[PDFTableStyles.col, PDFTableStyles.headerCell, props.style || {}]}
      wrap={props.wrap}
    >
      <Text style={PDFTableStyles.headerText}>{props.children}</Text>
    </View>
  ),
  Td: (props: CellProps) => (
    <View style={[PDFTableStyles.col, PDFTableStyles.dataCell, props.style || {}]} wrap={props.wrap}>
      <Text style={PDFTableStyles.dataText}>{props.children}</Text>
    </View>
  ),
};
