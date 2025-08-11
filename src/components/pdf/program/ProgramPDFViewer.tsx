import React, { useMemo } from "react";
import { Document, PDFViewer, Font } from "@react-pdf/renderer";
import { type CreateProgramForm, type Dictionary, type User } from "@/types";
import TimesNewRoman from "@/assets/times.ttf";
import TimesNewRomanBold from "@/assets/times_bold.ttf";
import { useUsers } from "@/queries/admin";
import { useAuth } from "@/hooks/useAuth";
import { useProgramDictionaries } from "@/hooks/useProgramDictionaries";
import {
  AbbreviationPage,
  ApprovalPage,
  EvaluationPage,
  ExplanatoryPage,
  OrganizationPage,
  SyllabusPage,
  ThematicPage,
  TitlePage,
} from "./pages";

Font.register({
  family: "Times-New-Roman",
  fonts: [
    { src: TimesNewRoman, fontWeight: "normal" },
    { src: TimesNewRomanBold, fontWeight: "bold" },
  ],
});

const pages = [
  TitlePage,
  ApprovalPage,
  AbbreviationPage,
  ExplanatoryPage,
  SyllabusPage,
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
}> = ({ program, authors, user, getDictionaryById }) => {
  const allAuthors = useMemo(
    () => [...authors, user].filter((v) => !!v),
    [authors, user]
  );

  const props = useMemo(
    () => ({ program, allAuthors, getDictionaryById }),
    [program, allAuthors, getDictionaryById]
  );

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

  const { data: users = [] } = useUsers();
  const { user } = useAuth();

  const coAuthors = useMemo(() => {
    return users?.filter((user) =>
      [program.author1, program.author2].includes(user.id)
    );
  }, [program.author1, program.author2, users]);

  return (
    <div style={{ height: "100vh" }}>
      <PDFViewer width="100%" height="100%">
        <ProgramPDF
          program={program}
          authors={coAuthors}
          user={user}
          getDictionaryById={getDictionaryById}
        />
      </PDFViewer>
    </div>
  );
};

export default ProgramPDFViewer;
