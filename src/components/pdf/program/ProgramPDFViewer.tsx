import React, { useMemo } from "react";
import { Document, PDFViewer, Font } from "@react-pdf/renderer";
import { type CreateProgramForm, type User } from "@/types";
import timesNewRoman from "@/assets/times.ttf";
import { useUsers } from "@/queries/admin";
import { useAuth } from "@/hooks/useAuth";
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
  src: timesNewRoman,
});

// Генератор PDF-документа по шагам
const ProgramPDF: React.FC<{
  program: CreateProgramForm;
  authors: User[];
  user?: User;
}> = ({ program, authors, user }) => {
  const allAuthors = useMemo(
    () => [...authors, user].filter((v) => !!v),
    [authors, user]
  );

  return (
    <Document>
      <TitlePage program={program} />
      <ApprovalPage program={program} allAuthors={allAuthors} />
      <AbbreviationPage program={program} />
      <ExplanatoryPage program={program} />
      <SyllabusPage program={program} />
      <ThematicPage program={program} />
      <EvaluationPage program={program} />
      <OrganizationPage program={program} />
    </Document>
  );
};

export const ProgramPDFViewer: React.FC<{ program: CreateProgramForm }> = ({
  program,
}) => {
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
        <ProgramPDF program={program} authors={coAuthors} user={user} />
      </PDFViewer>
    </div>
  );
};

export default ProgramPDFViewer;
