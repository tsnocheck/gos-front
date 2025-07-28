import { Text } from "@react-pdf/renderer";
import type { FC } from "react";
import type { CreateProgramForm } from "../../../../types";
import { PDFPage } from "../../shared/ui/PDFPage";
import { PDFStyles } from "../../shared/utils";

export const ExplanatoryPage: FC<{
  program: CreateProgramForm;
}> = ({ program }) => {
  return (
    <PDFPage title="Пояснительная записка">
      <Text style={PDFStyles.block}>Актуальность: {program.relevance}</Text>
      <Text style={PDFStyles.block}>Цель: {program.goal}</Text>
      <Text style={PDFStyles.block}>Стандарт: {program.standard}</Text>
      <Text style={PDFStyles.block}>
        Форма обучения: {program.educationForm}
      </Text>
      <Text style={PDFStyles.block}>Срок освоения: {program.term} ч.</Text>
    </PDFPage>
  );
};
