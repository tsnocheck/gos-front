import { Text, View } from "@react-pdf/renderer";
import type { FC } from "react";
import type { CreateProgramForm } from "../../../../types";
import { PDFPage } from "../../shared/ui/PDFPage";
import { PDFStyles } from "../../shared/utils";

export const SyllabusPage: FC<{
  program: CreateProgramForm;
}> = ({ program }) => {
  return (
    <PDFPage title="Учебный план">
      {program.modules?.map((m, i) => (
        <View key={i} style={PDFStyles.block}>
          <Text>Модуль: {m.name}</Text>
          <Text>
            Лекции: {m.lecture} | Практика: {m.practice} | Дистанционно:{" "}
            {m.distant} | Всего: {m.total}
          </Text>
        </View>
      ))}
      {program.attestations?.map((a, i) => (
        <View key={i} style={PDFStyles.block}>
          <Text>Аттестация: {a.name}</Text>
          <Text>
            Форма: {a.form} | Всего часов: {a.total}
          </Text>
        </View>
      ))}
    </PDFPage>
  );
};
