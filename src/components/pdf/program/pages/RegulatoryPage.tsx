import type { FC } from 'react';
import type { ProgramPDFProps } from '@/types';
import { PDFPage } from '../../shared/ui/PDFPage';
import HTMLContent from '../../shared/ui/HTMLContent';

export const RegulatoryPage: FC<ProgramPDFProps> = ({ program, pageNumber }) => {
  return (
    <PDFPage title="Нормативно-правовые документы" pageNumber={pageNumber}>
      <HTMLContent html={program.orgPedConditions?.normativeDocuments || ''} />
    </PDFPage>
  );
};
