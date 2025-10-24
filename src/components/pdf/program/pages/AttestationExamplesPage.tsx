import type { FC } from 'react';
import type { ProgramPDFProps } from '@/types';
import { View, Text } from '@react-pdf/renderer';
import { PDFPage } from '../../shared/ui/PDFPage';
import HTMLContent from '../../shared/ui/HTMLContent';
import { isEmptyHTMLContent } from '../../shared/utils';

export const AttestationExamplesPage: FC<ProgramPDFProps> = ({ program, pageNumber }) => {
  const nonIntermediate =
    program.attestations?.filter((a) => a.moduleCode === 'open' || a.moduleCode === 'close') ?? [];

  // Проверяем, есть ли у аттестаций какой-либо контент (примеры или критерии)
  const hasContent = nonIntermediate.some(
    (a) =>
      !isEmptyHTMLContent(a.examples) ||
      !isEmptyHTMLContent(a.criteria) ||
      !isEmptyHTMLContent(a.requirements),
  );

  // Не отображаем страницу, если нет аттестаций или контента
  if (nonIntermediate.length === 0 || !hasContent) {
    return null;
  }

  return (
    <PDFPage title="Оценочные материалы" pageNumber={pageNumber}>
      {nonIntermediate.map((attestation, index) => (
        <View key={index} style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 }}>
            {attestation.name}
          </Text>

          {attestation.requirements && (
            <Text style={{ marginBottom: 4, textAlign: 'justify' }}>
              {attestation.requirements}
            </Text>
          )}
          {attestation.attempts ? (
            <Text style={{ marginBottom: 8, textAlign: 'justify' }}>
              Количество попыток на прохождение - {attestation.attempts}
            </Text>
          ) : null}

          {attestation.criteria && (
            <>
              <Text style={{ fontSize: 12, fontWeight: 'bold', textAlign: 'center', marginTop: 6 }}>
                Критерии оценивания
              </Text>
              <HTMLContent
                style={{ marginBottom: 8, textAlign: 'justify' }}
                html={attestation.criteria}
              />
            </>
          )}

          {attestation.examples && (
            <>
              <Text
                style={{ fontSize: 12, fontWeight: 'bold', textAlign: 'center', marginBottom: 4 }}
              >
                Пример задания
              </Text>
              <HTMLContent html={attestation.examples} />
            </>
          )}
        </View>
      ))}
    </PDFPage>
  );
};
