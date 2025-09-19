import type { FC } from 'react';
import type { ProgramPDFProps } from '@/types';
import { View, Text } from '@react-pdf/renderer';
import { PDFPage } from '../../shared/ui/PDFPage';
import HTMLContent from '../../shared/ui/HTMLContent';

export const AttestationExamplesPage: FC<ProgramPDFProps> = ({ program }) => {
  const nonIntermediate =
    program.attestations?.filter((a) => a.moduleCode === 'open' || a.moduleCode === 'close') ?? [];

  if (nonIntermediate.length === 0) {
    return (
      <PDFPage title="Оценочные материалы">
        <Text>Примеры заданий не указаны</Text>
      </PDFPage>
    );
  }

  return (
    <PDFPage title="Оценочные материалы">
      {nonIntermediate.map((attestation, index) => (
        <View key={index} style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 }}>
            {attestation.name}
          </Text>

          <Text style={{ marginBottom: 4 }}>
            {attestation.name} представлена в форме {attestation.form}
          </Text>
          {attestation.requirements && (
            <Text style={{ marginBottom: 4 }}>{attestation.requirements}</Text>
          )}
          <Text style={{ marginBottom: 4 }}>
            На прохождение даётся{' '}
            {(attestation.lecture || 0) + (attestation.practice || 0) + (attestation.distant || 0)}{' '}
            академических ч.
          </Text>
          {attestation.attempts ? (
            <Text style={{ marginBottom: 8 }}>
              Количество попыток на прохождение - {attestation.attempts}
            </Text>
          ) : null}

          {attestation.criteria && (
            <>
              <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginTop: 6 }}>
                Критерии оценивания
              </Text>
              <Text style={{ marginBottom: 8 }}>{attestation.criteria}</Text>
            </>
          )}

          {attestation.examples && (
            <>
              <Text
                style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginBottom: 4 }}
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
