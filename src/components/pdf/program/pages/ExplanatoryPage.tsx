import { Text } from '@react-pdf/renderer';
import { useCallback, type FC } from 'react';
import { Standard, standards, type ProgramPDFProps } from '@/types';
import { PDFPage, PDFTable, PDFList, PDFStyles } from '../../shared';

export const ExplanatoryPage: FC<ProgramPDFProps> = ({ program, getDictionaryById }) => {
  const isProfessionalStandard = [Standard.PROFESSIONAL, Standard.BOTH].includes(program.standard!);

  const isEksStandard = [Standard.EKS, Standard.BOTH].includes(program.standard!);

  const getValueFromDictionary = useCallback(
    (id: string) => getDictionaryById(id)?.value ?? id,
    [getDictionaryById],
  );

  const ProfessionalStandardCols: FC = useCallback(() => {
    return (
      <>
        <PDFTable.Td style={{ flex: 1 }}>
          <PDFList items={(program.functions ?? []).map(getValueFromDictionary)} />
        </PDFTable.Td>
        <PDFTable.Td style={{ flex: 1 }}>
          <PDFList items={(program.actions ?? []).map(getValueFromDictionary)} />
        </PDFTable.Td>
      </>
    );
  }, [program, getValueFromDictionary]);

  const EksStandardCols: FC = useCallback(() => {
    return (
      <PDFTable.Td style={{ flex: 1 }}>
        <PDFList items={(program.duties ?? []).map(getValueFromDictionary)} />
      </PDFTable.Td>
    );
  }, [program, getValueFromDictionary]);

  return (
    <PDFPage title="Пояснительная записка">
      <Text style={PDFStyles.block}>
        <Text style={PDFStyles.bold}>Актуальность разработки программы:</Text> {program.relevance}
      </Text>
      <Text style={PDFStyles.block}>
        <Text style={PDFStyles.bold}>Цель реализации программы:</Text> {program.goal}
      </Text>

      {program.educationForm && (
        <Text style={PDFStyles.block}>
          <Text style={PDFStyles.bold}>Форма обучения:</Text>{' '}
          {getValueFromDictionary(program.educationForm)}
        </Text>
      )}

      <Text style={PDFStyles.bold}>{standards[program.standard!] ?? ''}</Text>
      <PDFTable.Self
        style={{
          marginBottom: 12,
        }}
      >
        <PDFTable.Tr>
          {isProfessionalStandard && (
            <>
              <PDFTable.Th style={{ flex: 1 }}>Трудовые функции</PDFTable.Th>
              <PDFTable.Th style={{ flex: 1 }}>Трудовые действия</PDFTable.Th>
            </>
          )}
          {isEksStandard && <PDFTable.Th style={{ flex: 1 }}>Трудовые обязанности</PDFTable.Th>}
        </PDFTable.Tr>

        <PDFTable.Tr>
          {isProfessionalStandard && <ProfessionalStandardCols />}
          {isEksStandard && <EksStandardCols />}
        </PDFTable.Tr>

        <PDFTable.Tr>
          {program.know && <PDFTable.Th style={{ flex: 1 }}>Знать</PDFTable.Th>}
          {program.can && <PDFTable.Th style={{ flex: 1 }}>Уметь</PDFTable.Th>}
        </PDFTable.Tr>

        <PDFTable.Tr>
          {program.know && (
            <PDFTable.Td style={{ flex: 1 }}>
              <PDFList items={program.know} />
            </PDFTable.Td>
          )}
          {program.can && (
            <PDFTable.Td style={{ flex: 1 }}>
              <PDFList items={program.can} />
            </PDFTable.Td>
          )}
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
