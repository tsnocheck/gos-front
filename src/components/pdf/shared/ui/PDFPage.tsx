import { Page, View, Text } from "@react-pdf/renderer";
import type { FC, PropsWithChildren } from "react";
import { PDFStyles, type StyleObject } from "../utils";

type Props = PropsWithChildren<{ ui?: { view?: StyleObject, title?: StyleObject }; title?: string }>;

export const PDFPage: FC<Props> = ({ children, ui, title }) => {
  return (
    <Page size="A4" style={PDFStyles.page}>
      <View style={{ flex: 1, ...ui?.view }}>
        {title && <Text style={{...PDFStyles.sectionTitle, ...ui?.title}}>{title}</Text>}
        {children}
      </View>
    </Page>
  );
};
