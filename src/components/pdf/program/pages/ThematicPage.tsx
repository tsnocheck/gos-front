import type { FC } from "react";
import type { ProgramPDFProps } from "@/types";
import { PDFPage } from "../../shared/ui/PDFPage";
import { calcWidth, PDFStyles } from "../../shared/utils";
import { PDFTable } from "../../shared";
import { View, Text } from "@react-pdf/renderer";

const TOTAL_COLS = 13;

export const ThematicPage: FC<ProgramPDFProps> = ({ program }) => {
  const TotalRow: FC = () => {
    const total = (program.topics ?? []).reduce(
      (acc, { lecture, distant, practice }) => {
        acc.lecture += lecture;
        acc.distant += distant;
        acc.practice += practice;
        acc.total += lecture + distant + practice;

        return acc;
      },
      {
        lecture: 0,
        practice: 0,
        distant: 0,
        total: 0,
      }
    );

    return (
      <PDFTable.Tr>
        <PDFTable.Th
          style={{ textAlign: "left", ...calcWidth(5 / TOTAL_COLS) }}
        >
          ИТОГО:
        </PDFTable.Th>
        <PDFTable.Td style={calcWidth(2 / TOTAL_COLS)}>
          {total.lecture || "-"}
        </PDFTable.Td>
        <PDFTable.Td style={calcWidth(2 / TOTAL_COLS)}>
          {total.practice || "-"}
        </PDFTable.Td>
        <PDFTable.Td style={calcWidth(2 / TOTAL_COLS)}>
          {total.distant || "-"}
        </PDFTable.Td>
        <PDFTable.Td style={calcWidth(2 / TOTAL_COLS)}>
          {total.total || "-"}
        </PDFTable.Td>
      </PDFTable.Tr>
    );
  };

  const TopicRows: FC = () => {
    return (program.topics ?? []).map((topic, idx) => (
      <PDFTable.Tr key={idx + 1}>
        <PDFTable.Td style={calcWidth(1 / TOTAL_COLS)}>{idx + 1}.</PDFTable.Td>
        <PDFTable.Td style={calcWidth(4 / TOTAL_COLS)}>
          {topic.name}
        </PDFTable.Td>
        <PDFTable.Td style={calcWidth(2 / TOTAL_COLS)}>
          {topic.lecture || "-"}
        </PDFTable.Td>
        <PDFTable.Td style={calcWidth(2 / TOTAL_COLS)}>
          {topic.practice || "-"}
        </PDFTable.Td>
        <PDFTable.Td style={calcWidth(2 / TOTAL_COLS)}>
          {topic.distant || "-"}
        </PDFTable.Td>
        <PDFTable.Td style={calcWidth(2 / TOTAL_COLS)}>
          {topic.lecture + topic.practice + topic.distant || "-"}
        </PDFTable.Td>
      </PDFTable.Tr>
    ));
  };

  const NetworkRows: FC = () => {
    return (program.network ?? []).map((network, idx) => (
      <PDFTable.Tr key={idx + 1}>
        <PDFTable.Td style={calcWidth(1 / 11)}>{idx + 1}</PDFTable.Td>
        <PDFTable.Td style={calcWidth(3 / 11)}>{network.org}</PDFTable.Td>
        <PDFTable.Td style={calcWidth(4 / 11)}>
          {network.participation}
        </PDFTable.Td>
        <PDFTable.Td style={calcWidth(3 / 11)}>{network.form}</PDFTable.Td>
      </PDFTable.Tr>
    ));
  };

  return (
    <PDFPage
      title="Учебно-тематический план"
      ui={{ title: { marginBottom: 10 } }}
    >
      <PDFTable.Self style={{ marginBottom: 30 }}>
        <PDFTable.Tr>
          <PDFTable.Th style={calcWidth(1 / TOTAL_COLS)}>№ п/п</PDFTable.Th>
          <PDFTable.Th style={calcWidth(4 / TOTAL_COLS)}>Тема</PDFTable.Th>
          <PDFTable.Tr
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              ...calcWidth(6 / TOTAL_COLS),
            }}
          >
            <PDFTable.Th>Формы организации, часы</PDFTable.Th>
            <PDFTable.Tr>
              <PDFTable.Th style={calcWidth(2 / 3)}>Ауд. зан.</PDFTable.Th>
              <PDFTable.Th style={calcWidth(1 / 3)}>Сам. раб.</PDFTable.Th>
            </PDFTable.Tr>
            <PDFTable.Tr>
              <PDFTable.Td style={calcWidth(1 / 3)}>Лекц. зан.</PDFTable.Td>
              <PDFTable.Td style={calcWidth(1 / 3)}>Практ. зан.</PDFTable.Td>
              <PDFTable.Td style={calcWidth(1 / 3)}>Дист. обучение</PDFTable.Td>
            </PDFTable.Tr>
          </PDFTable.Tr>
          <PDFTable.Th style={calcWidth(2 / TOTAL_COLS)}>Всего ч.</PDFTable.Th>
        </PDFTable.Tr>
        <TopicRows />
        <TotalRow />
      </PDFTable.Self>

      {program.networkEnabled && (
        <View style={PDFStyles.block}>
          <Text style={{ textAlign: "center", fontWeight: "bold" }}>
            Сетевая форма реализации программы
          </Text>
          <PDFTable.Self>
            <PDFTable.Tr>
              <PDFTable.Th style={calcWidth(1 / 11)}>№ п/п</PDFTable.Th>
              <PDFTable.Th style={calcWidth(3 / 11)}>
                Наименование организации
              </PDFTable.Th>
              <PDFTable.Th style={calcWidth(4 / 11)}>
                Участие в реализации структурного компонента программы /
                образовательного модуля
              </PDFTable.Th>
              <PDFTable.Th style={calcWidth(3 / 11)}>Форма участия</PDFTable.Th>
            </PDFTable.Tr>
            <NetworkRows />
          </PDFTable.Self>
        </View>
      )}
    </PDFPage>
  );
};
