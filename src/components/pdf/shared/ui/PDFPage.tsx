import { Page, View, Text } from "@react-pdf/renderer";
import type { FC } from "react";
import { PDFStyles, type StyleObject } from "../utils";

interface PDFPageProps {
  children?: React.ReactNode;
  ui?: { view?: StyleObject };
  title?: string;
}

export const PDFPage: FC<PDFPageProps> = ({ children, ui, title }) => {
  return (
    <Page size="A4" style={PDFStyles.page}>
      <View style={{ flex: 1, ...ui }}>
        {title && <Text style={PDFStyles.sectionTitle}>{title}</Text>}
        {children}
        </View>
    </Page>
  );
};
