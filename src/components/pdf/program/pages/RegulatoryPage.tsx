import type { FC } from 'react';
import type { ProgramPDFProps } from '@/types';
import { PDFPage } from '../../shared/ui/PDFPage';
import HTMLContent from '../../shared/ui/HTMLContent';
import { isEmptyHTMLContent } from '../../shared/utils';

export const RegulatoryPage: FC<ProgramPDFProps> = ({ program, pageNumber }) => {
  const content = program.orgPedConditions?.normativeDocuments;

  // Не отображаем страницу, если нет контента
  if (isEmptyHTMLContent(content)) {
    return null;
  }

  return (
    <PDFPage title="Нормативно-правовые документы" pageNumber={pageNumber}>
      <HTMLContent html={content!} />
    </PDFPage>
  );
};
