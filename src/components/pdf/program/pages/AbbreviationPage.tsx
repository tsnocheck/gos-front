import { Text, View } from "@react-pdf/renderer";
import type { FC } from "react";
import type { CreateProgramForm } from "../../../../types";
import { PDFPage } from "../../shared/ui/PDFPage";

export const AbbreviationPage: FC<{
  program: CreateProgramForm;
}> = ({ program }) => {
  return (
    <PDFPage title="СПИСОК СОКРАЩЕНИЙ И УСЛОВНЫХ ОБОЗНАЧЕНИЙ">
      <View
        style={{
          border: program.abbreviations?.length
            ? "1pt solid black"
            : "1px solid white",
          flexDirection: "column",
          fontSize: 12
        }}
      >
        {program.abbreviations?.length ? (
          program.abbreviations.map((item, idx) => (
            <View
              key={idx}
              style={{
                flexDirection: "row",
                borderTop: idx ? "1pt solid black" : "none",
              }}
            >
              <View
                style={{
                  width: "35%",
                  borderRight: "1pt solid black",
                  paddingHorizontal: 6,
                }}
              >
                <Text style={{ fontWeight: "bold" }}>{item.abbreviation}</Text>
              </View>
              <View style={{ width: "65%", paddingHorizontal: 6 }}>
                <Text>{item.fullname}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text>Нет сокращений</Text>
        )}
      </View>
    </PDFPage>
  );
};
