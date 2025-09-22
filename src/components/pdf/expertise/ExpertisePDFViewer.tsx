import React from 'react';
import { PDFViewer, PDFDownloadLink, Font } from '@react-pdf/renderer';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { type Expertise } from '@/types';
import TimesNewRoman from '@/assets/times.ttf';
import TimesNewRomanBold from '@/assets/times_bold.ttf';
import TimesNewRomanItalic from '@/assets/times-new-roman-italic.ttf';
import { PDFDocumentWithPagination } from '../shared/ui/PDFDocumentWithPagination';
import {
  ExpertiseTitlePage,
  ExpertiseCriteriaPage,
  ExpertiseRecommendationsPage,
  ExpertiseConclusionPage,
} from './pages';
import { useExpertise } from '@/queries/expertises.ts';

Font.register({
  family: 'Times-New-Roman',
  fonts: [
    { src: TimesNewRoman, fontWeight: 'normal' },
    { src: TimesNewRomanBold, fontWeight: 'bold' },
    { src: TimesNewRomanItalic, fontStyle: 'italic' },
  ],
});

const pages = [
  ExpertiseTitlePage,
  ExpertiseCriteriaPage,
  ExpertiseRecommendationsPage,
  ExpertiseConclusionPage,
];

// Генератор PDF-документа экспертизы
export const ExpertisePDF: React.FC<{
  expertise: Expertise;
}> = (props) => {
  return (
    <PDFDocumentWithPagination title={`Экспертное заключение`}>
      {pages.map((Page, index) => (
        <Page key={index} {...props}></Page>
      ))}
    </PDFDocumentWithPagination>
  );
};

export const ExpertisePDFViewer: React.FC<{
  expertise: Expertise;
}> = ({ expertise }) => {
  return (
    <div style={{ height: '100vh' }}>
      {expertise && (
        <PDFViewer width="100%" height="100%">
          <ExpertisePDF expertise={expertise} />
        </PDFViewer>
      )}
    </div>
  );
};

// Компонент для скачивания PDF экспертизы
export const ExpertisePDFDownloadButton: React.FC<{
  id: Expertise['id'];
}> = ({ id }) => {
  const { data, isSuccess } = useExpertise(id ?? '');

  if (!isSuccess) {
    return (
      <Button type="link" disabled icon={<DownloadOutlined />}>
        Скачать PDF
      </Button>
    );
  }

  return (
    <PDFDownloadLink document={<ExpertisePDF expertise={data} />} fileName={`экспертиза.pdf`}>
      {({ loading }) => (
        <Button type="link" icon={<DownloadOutlined />} loading={loading}>
          {loading ? 'Генерация PDF экспертизы...' : 'Скачать PDF экспертизы'}
        </Button>
      )}
    </PDFDownloadLink>
  );
};
