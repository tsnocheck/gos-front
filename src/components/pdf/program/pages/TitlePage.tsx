import { View, Text } from "@react-pdf/renderer";
import { currentYear } from "../../shared/utils";
import type { FC } from "react";
import type { CreateProgramForm } from "../../../../types";
import { PDFPage } from "../../shared/ui/PDFPage";

export const TitlePage: FC<{ program: CreateProgramForm }> = ({ program }) => {
  return (
    <PDFPage ui={{ view: { justifyContent: "center" } }}>
      <Text style={{ textAlign: "center", marginBottom: 60 }}>
        { program.customInstitution ? program.customInstitution : program.institution }
      </Text>

      <View style={{ flexGrow: 1, paddingTop: 50 }}>
        <Text style={{ textAlign: "center" }}>
          Дополнительная профессиональная программа повышения квалификации
        </Text>
        <Text style={{ textAlign: "center", marginTop: 8 }}>
          "{program.title || "Название программы"}"
        </Text>
      </View>

      <View style={{ position: "absolute", bottom: "40%", right: 50 }}>
        <Text>Программа обсуждена и утверждена</Text>
        <Text>на заседании Учёного совета</Text>
        <Text>__________________ {currentYear} г. (Протокол № ___)</Text>
        <Text style={{ marginTop: 10 }}>
          Председатель Учёного совета{"\n"}___________ /Имя/
        </Text>
      </View>

      <View style={{ textAlign: "center" }}>
        <Text>Калининград</Text>
        <Text>{currentYear}</Text>
      </View>
    </PDFPage>
  );
};
