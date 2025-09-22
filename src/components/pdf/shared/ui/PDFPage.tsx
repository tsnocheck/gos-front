import { Page, View, Text } from '@react-pdf/renderer';
import type { FC, PropsWithChildren } from 'react';
import { PDFStyles, type StyleObject } from '../utils';

type Props = PropsWithChildren<{
  ui?: { view?: StyleObject; title?: StyleObject };
  title?: string;
  showPageNumber?: boolean;
  pageNumber?: number;
}>;

export const PDFPage: FC<Props> = ({ children, ui, title, showPageNumber = true, pageNumber }) => {
  return (
    <Page size="A4" style={PDFStyles.page}>
      <View style={{ flex: 1, ...ui?.view }}>
        {title && <Text style={{ ...PDFStyles.sectionTitle, ...ui?.title }}>{title}</Text>}
        {children}
      </View>
      {showPageNumber && pageNumber && (
        <Text
          style={{
            position: 'absolute',
            bottom: 30,
            right: 0,
            left: 0,
            textAlign: 'center',
            fontSize: 10,
          }}
          fixed
        >
          {pageNumber}
        </Text>
      )}
    </Page>
  );
};
