import React from "react";
import { Document, PDFViewer, Font } from "@react-pdf/renderer";
import { type ExtendedProgram, type Dictionary, type User } from "@/types";
import TimesNewRoman from "@/assets/times.ttf";
import TimesNewRomanBold from "@/assets/times_bold.ttf";
import TimesNewRomanItalic from "@/assets/times-new-roman-italic.ttf";
import { useAuth } from "@/hooks/useAuth";
import { useProgramDictionaries } from "@/hooks/useProgramDictionaries";
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
  AttestationExamplesPage
} from "./pages";
import { useAvailableAuthors } from "@/queries/programs";

Font.register({
  family: "Times-New-Roman",
  fonts: [
    { src: TimesNewRoman, fontWeight: "normal" },
    { src: TimesNewRomanBold, fontWeight: "bold" },
    { src: TimesNewRomanItalic, fontStyle: "italic" },
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
const ProgramPDF: React.FC<{
  program: ExtendedProgram;
  authors: User[];
  user?: User;
  getDictionaryById: (id: string) => Dictionary | undefined;
}> = (props) => {
  return (
    <Document title={props.program.title ?? "Программа"}>
      {pages.map((Page, index) => (
        <Page key={index} {...props}></Page>
      ))}
    </Document>
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
    <div style={{ height: "100vh" }}>
      {program && users.length && (
        <PDFViewer width="100%" height="100%">
          <ProgramPDF {...{ program, authors, getDictionaryById }} />
        </PDFViewer>
      )}
    </div>
  );
};

export default ProgramPDFViewer;
