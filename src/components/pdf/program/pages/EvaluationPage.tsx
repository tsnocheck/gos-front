import { Text } from "@react-pdf/renderer";
import type { FC } from "react";
import type { CreateProgramForm } from "../../../../types";
import { PDFPage } from "../../shared/ui/PDFPage";
import { PDFStyles } from "../../shared/utils";

export const EvaluationPage: FC<{
  program: CreateProgramForm;
}> = ({ program }) => {
  return (
    <PDFPage title="Оценочные материалы">
      <Text style={PDFStyles.block}>Требования: {program.requirements}</Text>
      <Text style={PDFStyles.block}>Критерии: {program.criteria}</Text>
      <Text style={PDFStyles.block}>Примеры заданий: {program.examples}</Text>
      <Text style={PDFStyles.block}>Попыток: {program.attempts}</Text>
    </PDFPage>
  );
};
