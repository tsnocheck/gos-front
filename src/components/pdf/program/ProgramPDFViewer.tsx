import React from "react";
import { Document, PDFViewer, Font } from "@react-pdf/renderer";
import { type CreateProgramForm, type Dictionary, type User } from "@/types";
import TimesNewRoman from "@/assets/times.ttf";
import TimesNewRomanBold from "@/assets/times_bold.ttf";
import TimesNewRomanItalic from "@/assets/times-new-roman-italic.ttf";
import { useAuth } from "@/hooks/useAuth";
import { useProgramDictionaries } from "@/hooks/useProgramDictionaries";
import {
  AbbreviationPage,
  ApprovalPage,
  CalendarPage,
  EvaluationPage,
  ExplanatoryPage,
  OrganizationPage,
  SyllabusPage,
  ThematicPage,
  TitlePage,
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
  EvaluationPage,
  OrganizationPage,
];

// Генератор PDF-документа по шагам
const ProgramPDF: React.FC<{
  program: CreateProgramForm;
  authors: User[];
  user?: User;
  getDictionaryById: (id: string) => Dictionary | undefined;
}> = ({ program, authors, getDictionaryById }) => {
  const props = { program, authors, getDictionaryById };

  return (
    <Document title={program.title ?? "Программа"}>
      {pages.map((Page, index) => (
        <Page key={index} {...props}></Page>
      ))}
    </Document>
  );
};

export const ProgramPDFViewer: React.FC<{ program: CreateProgramForm }> = ({
  program,
}) => {
  const { getDictionaryById } = useProgramDictionaries();
  const { data: users = [] } = useAvailableAuthors();
  const { user } = useAuth();

  const authors = [
    program.author ?? user!,
    ...users.filter((user) =>
      [program.author1Id, program.author2Id].includes(user.id)
    ),
  ];

  return (
    <div style={{ height: "100vh" }}>
      {program && users.length && (
        <PDFViewer width="100%" height="100%">
          <ProgramPDF
            program={program}
            authors={authors}
            getDictionaryById={getDictionaryById}
          />
        </PDFViewer>
      )}
    </div>
  );
};

export default ProgramPDFViewer;
