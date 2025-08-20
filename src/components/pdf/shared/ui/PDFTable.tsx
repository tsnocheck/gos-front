import { View, Text } from "@react-pdf/renderer";
import type { PropsWithChildren } from "react";
import { PDFTableStyles, type StyleObject } from "../utils";

type CellProps = PropsWithChildren<{ style?: StyleObject; wrap?: boolean }>; 

export const PDFTable: Record<string, React.FC<CellProps>> = {
  Self: (props) => (
    <View style={[PDFTableStyles.self, props.style || {}]} wrap={props.wrap}>
      {props.children}
    </View>
  ),
  Tr: (props) => (
    <View style={[PDFTableStyles.row, props.style || {}]} wrap={props.wrap}>
      {props.children}
    </View>
  ),
  Th: (props) => (
    <View style={[PDFTableStyles.col, PDFTableStyles.headerCell, props.style || {}]} wrap={props.wrap}>
      <Text style={PDFTableStyles.headerText}>{props.children}</Text>
    </View>
  ),
  Td: (props) => (
    <View style={[PDFTableStyles.col, props.style || {}]} wrap={props.wrap}>
      <Text>{props.children}</Text>
    </View>
  ),
};
