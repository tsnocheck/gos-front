import { View, Text } from "@react-pdf/renderer";
import type { PropsWithChildren } from "react";
import { PDFTableStyles, type StyleObject } from "../utils";

export const PDFTable: Record<
  string,
  React.FC<PropsWithChildren<{ style?: StyleObject }>>
> = {
  Self: (props) => (
    <View style={[PDFTableStyles.self, props.style || {}]}>
      {props.children}
    </View>
  ),
  Tr: (props) => (
    <View style={[PDFTableStyles.row, props.style || {}]}>
      {props.children}
    </View>
  ),
  Th: (props) => (
    <Text
      style={[PDFTableStyles.col, PDFTableStyles.header, props.style || {}]}
    >
      {props.children}
    </Text>
  ),
  Td: (props) => (
    <View style={[PDFTableStyles.col, props.style || {}]}>
      <Text>{props.children}</Text>
    </View>
  ),
};
