import { Text } from "@react-pdf/renderer";
import { useCallback, type FC } from "react";
import { Standard, standards, type ProgramPDFProps } from "@/types";
import { PDFPage, PDFTable, PDFList, PDFStyles } from "../../shared";

export const ExplanatoryPage: FC<ProgramPDFProps> = ({
  program,
  getDictionaryById,
}) => {
  const isProfessionalStandard = [
    Standard.PROFESSIONAL,
    Standard.BOTH,
  ].includes(program.standard!);

  const isEksStandard = [Standard.EKS, Standard.BOTH].includes(
    program.standard!
  );

  const getValueFromDictionary = useCallback(
    (id: string) => getDictionaryById(id)?.value ?? "",
    [getDictionaryById]
  );

  const ProfessionalStandardCols: FC = useCallback(() => {
    return (
      <>
        <PDFTable.Td>
          <PDFList
            items={(program.functions ?? []).map(getValueFromDictionary)}
          />
        </PDFTable.Td>
        <PDFTable.Td>
          <PDFList
            items={(program.actions ?? []).map(getValueFromDictionary)}
          />
        </PDFTable.Td>
      </>
    );
  }, [program, getValueFromDictionary]);

  const EksStandardCols: FC = useCallback(() => {
    return (
      <PDFTable.Td>
        <PDFList items={(program.duties ?? []).map(getValueFromDictionary)} />
      </PDFTable.Td>
    );
  }, [program, getValueFromDictionary]);

  return (
    <PDFPage title="Характеристика программы">
      <Text style={PDFStyles.block}>
        <Text style={PDFStyles.bold}>Актуальность разработки программы:</Text>{" "}
        {program.relevance}
      </Text>
      <Text style={PDFStyles.block}>
        <Text style={PDFStyles.bold}>Цель реализации программы:</Text>{" "}
        {program.goal}
      </Text>

      {program.educationForm && (
        <Text style={PDFStyles.block}>
          <Text style={PDFStyles.bold}>Форма обучения:</Text>{" "}
          {getValueFromDictionary(program.educationForm)}
        </Text>
      )}

      <Text style={PDFStyles.bold}>{standards[program.standard!] ?? ""}</Text>
      <PDFTable.Self
        style={{
          borderWidth:
            isEksStandard ||
            isProfessionalStandard ||
            program.know ||
            program.can
              ? 1
              : "0px",
        }}
      >
        <PDFTable.Tr>
          {isProfessionalStandard && (
            <>
              <PDFTable.Th>Трудовые функции</PDFTable.Th>
              <PDFTable.Th>Трудовые действия</PDFTable.Th>
            </>
          )}
          {isEksStandard && <PDFTable.Th>Трудовые обязанности</PDFTable.Th>}
          {program.know && <PDFTable.Th>Знать</PDFTable.Th>}
          {program.can && <PDFTable.Th>Уметь</PDFTable.Th>}
        </PDFTable.Tr>

        <PDFTable.Tr>
          {isProfessionalStandard && <ProfessionalStandardCols />}
          {isEksStandard && <EksStandardCols />}
          {program.know && <PDFTable.Td>{program.know}</PDFTable.Td>}
          {program.can && <PDFTable.Td>{program.can}</PDFTable.Td>}
        </PDFTable.Tr>
      </PDFTable.Self>

      {program.category && (
        <Text style={PDFStyles.block}>
          <Text style={PDFStyles.bold}>Категория слушателей: </Text>
          {getValueFromDictionary(program.category)}
        </Text>
      )}

      {program.term && (
        <Text style={PDFStyles.block}>
          <Text style={PDFStyles.bold}>Срок освоения: </Text>
          {program.term} ч.
        </Text>
      )}
    </PDFPage>
  );
};
