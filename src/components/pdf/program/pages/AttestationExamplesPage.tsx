import type { FC } from "react";
import type { ProgramPDFProps } from "@/types";
import { View, Text } from "@react-pdf/renderer";
import { PDFPage } from "../../shared/ui/PDFPage";
import HTMLContent from "../../shared/ui/HTMLContent";

export const AttestationExamplesPage: FC<ProgramPDFProps> = ({ program }) => {
  const { attestations } = program;

  if (!attestations || attestations.length === 0) {
    return (
      <PDFPage title="Примеры заданий аттестации">
        <Text>Примеры заданий не указаны</Text>
      </PDFPage>
    );
  }

  return (
    <PDFPage title="Примеры заданий аттестации">
      {attestations.map((attestation, index) => (
        <View key={index} style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>
            {attestation.name}
          </Text>
          
          <View style={{ marginLeft: 16, marginBottom: 8 }}>
            <Text style={{ fontSize: 12, marginBottom: 4 }}>
              Форма: {attestation.form}
            </Text>
            
            {attestation.moduleCode && attestation.moduleCode !== 'none' && (
              <Text style={{ fontSize: 12, marginBottom: 4 }}>
                Модуль: {attestation.moduleCode}
              </Text>
            )}
            
            <Text style={{ fontSize: 12, marginBottom: 8 }}>
              Часы: Лекции: {attestation.lecture}, Практика: {attestation.practice}, Дистанционно: {attestation.distant}
            </Text>
          </View>

          {attestation.examples && (
            <View style={{ marginLeft: 16 }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>
                Примеры заданий:
              </Text>
              <HTMLContent html={attestation.examples} />
            </View>
          )}
        </View>
      ))}
    </PDFPage>
  );
};
