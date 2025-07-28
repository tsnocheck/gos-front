import { Text, View } from "@react-pdf/renderer";
import type { FC } from "react";
import type { CreateProgramForm } from "../../../../types";
import { PDFPage } from "../../shared/ui/PDFPage";
import { PDFStyles } from "../../shared/utils";

export const ThematicPage: FC<{
  program: CreateProgramForm;
}> = ({ program }) => {
  return (
    <PDFPage title="Учебно-тематический план">
      {program.topics?.map((t, i) => (
        <View key={i} style={PDFStyles.block}>
          <Text>{t.name}</Text>
          <Text>
            Лекции: {t.lecture}, Практика: {t.practice}, Дистанционно:{" "}
            {t.distant}
          </Text>
        </View>
      ))}
    </PDFPage>
  );
};
