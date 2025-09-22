import { Text } from '@react-pdf/renderer';
import type { FC } from 'react';
import type { ProgramPDFProps } from '@/types';
import { PDFPage } from '../../shared/ui/PDFPage';
import { calcWidth, PDFTable } from '../../shared';

export const AbbreviationPage: FC<ProgramPDFProps> = ({ program, pageNumber }) => {
  return (
    <PDFPage
      title="СПИСОК СОКРАЩЕНИЙ И УСЛОВНЫХ ОБОЗНАЧЕНИЙ"
      pageNumber={pageNumber}
    >
      {program.abbreviations?.length ? (
        <PDFTable.Self>
          {program.abbreviations.map((item, idx) => (
            <PDFTable.Tr key={idx}>
              <PDFTable.Th style={calcWidth(1 / 5)}>{item.abbreviation}</PDFTable.Th>
              <PDFTable.Td style={calcWidth(4 / 5)}>{item.fullname}</PDFTable.Td>
            </PDFTable.Tr>
          ))}
        </PDFTable.Self>
      ) : (
        <Text>Нет сокращений</Text>
      )}
    </PDFPage>
  );
};
