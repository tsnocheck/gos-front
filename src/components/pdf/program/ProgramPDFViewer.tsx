import React from 'react';
import { PDFViewer, PDFDownloadLink, Font } from '@react-pdf/renderer';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { type ExtendedProgram, type Dictionary, type User } from '@/types';
import TimesNewRoman from '@/assets/times.ttf';
import TimesNewRomanBold from '@/assets/times_bold.ttf';
import TimesNewRomanItalic from '@/assets/times-new-roman-italic.ttf';
import TimesNewRomanItalicBold from '@/assets/times-new-roman-italic-bold.ttf';
import { useAuth } from '@/hooks/useAuth';
import { useProgramDictionaries } from '@/hooks/useProgramDictionaries';
import { PDFDocumentWithPagination } from '../shared/ui/PDFDocumentWithPagination';
import {
  AbbreviationPage,
  ApprovalPage,
  CalendarPage,
  ExplanatoryPage,
  SyllabusPage,
  ThematicPage,
  TitlePage,
  RegulatoryPage,
  LiteraturePage,
  AttestationExamplesPage,
} from './pages';
import { useAvailableAuthors } from '@/queries/programs';

Font.register({
  family: 'Times-New-Roman',
  fonts: [
    { src: TimesNewRoman, fontWeight: 'normal' },
    { src: TimesNewRomanBold, fontWeight: 'bold' },
    { src: TimesNewRomanItalic, fontStyle: 'italic' },
    { src: TimesNewRomanItalicBold, fontStyle: 'italic', fontWeight: 'bold' },
  ],
});

const pages = [
  TitlePage,
  ApprovalPage,
  AbbreviationPage,
  ExplanatoryPage,
  SyllabusPage,
  CalendarPage,
  ThematicPage,
  AttestationExamplesPage,
  RegulatoryPage,
  LiteraturePage,
];

// Генератор PDF-документа по шагам
export const ProgramPDF: React.FC<{
  program: ExtendedProgram;
  authors: User[];
  user?: User;
  getDictionaryById: (id: string) => Dictionary | undefined;
}> = (props) => {
  return (
    <PDFDocumentWithPagination title={props.program.title ?? 'Программа'}>
      {pages.map((Page, index) => (
        <Page key={index} {...props} />
      ))}
    </PDFDocumentWithPagination>
  );
};

export const ProgramPDFViewer: React.FC<{
  program: ExtendedProgram;
}> = ({ program }) => {
  const { getDictionaryById } = useProgramDictionaries();
  const { data: users = [] } = useAvailableAuthors();
  const { user } = useAuth();

  const authors = [
    program.author ?? user!,
    ...users.filter((user) => (program.coAuthorIds || []).includes(user.id)),
  ];

  return (
    <div style={{ height: '100vh' }}>
      {program && authors.length && (
        <PDFViewer width="100%" height="100%">
          <ProgramPDF {...{ program, authors, getDictionaryById }} />
        </PDFViewer>
      )}
    </div>
  );
};

// Компонент для скачивания PDF программы
export const ProgramPDFDownloadButton: React.FC<{
  program: ExtendedProgram;
}> = ({ program }) => {
  const { getDictionaryById } = useProgramDictionaries();
  const { data: availableAuthors = [] } = useAvailableAuthors();
  const { user } = useAuth();

  const authors = [
    program.author ?? user!,
    ...availableAuthors.filter((author) => (program.coAuthorIds || []).includes(author.id)),
  ];

  if (!program || authors.length === 0) {
    return (
      <Button type="link" icon={<DownloadOutlined />} disabled>
        Данные не загружены
      </Button>
    );
  }

  return (
    <PDFDownloadLink
      document={
        <ProgramPDF
          program={program}
          authors={authors}
          user={user}
          getDictionaryById={getDictionaryById}
        />
      }
      fileName={`${program.title || 'Программа'}_v${program.version}.pdf`}
    >
      {({ loading }) => (
        <Button type="link" icon={<DownloadOutlined />} loading={loading} disabled={loading}>
          {loading ? 'Подготовка PDF...' : 'Скачать PDF программы'}
        </Button>
      )}
    </PDFDownloadLink>
  );
};
