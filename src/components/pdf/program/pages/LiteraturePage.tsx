import type { FC } from 'react';
import type { ProgramPDFProps } from '@/types';
import { View, Text } from '@react-pdf/renderer';
import { PDFPage } from '../../shared/ui/PDFPage';
import HTMLContent from '../../shared/ui/HTMLContent';
import { hasAnyContent } from '../../shared/utils';

export const LiteraturePage: FC<ProgramPDFProps> = ({ program, pageNumber }) => {
  const { orgPedConditions } = program;

  // Проверяем, есть ли хоть какой-то контент
  const hasContent = hasAnyContent([
    orgPedConditions?.mainLiterature,
    orgPedConditions?.additionalLiterature,
    orgPedConditions?.electronicMaterials,
    orgPedConditions?.internetResources,
    orgPedConditions?.equipment,
    orgPedConditions?.personnelProvision,
  ]);

  // Не отображаем страницу, если нет контента
  if (!hasContent) {
    return null;
  }

  return (
    <PDFPage title="Список литературы" pageNumber={pageNumber}>
      {orgPedConditions?.mainLiterature && (
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>
            Список основной литературы
          </Text>
          <HTMLContent html={orgPedConditions.mainLiterature} />
        </View>
      )}

      {orgPedConditions?.additionalLiterature && (
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>
            Список дополнительной литературы
          </Text>
          <HTMLContent html={orgPedConditions.additionalLiterature} />
        </View>
      )}

      {orgPedConditions?.electronicMaterials && (
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>
            Электронные учебные материалы
          </Text>
          <HTMLContent html={orgPedConditions.electronicMaterials} />
        </View>
      )}

      {orgPedConditions?.internetResources && (
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>
            Интернет-ресурсы
          </Text>
          <HTMLContent html={orgPedConditions.internetResources} />
        </View>
      )}

      {orgPedConditions?.equipment && (
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>
            Технические средства обучения
          </Text>
          <HTMLContent html={orgPedConditions.equipment} />
        </View>
      )}

      {orgPedConditions?.personnelProvision && (
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>
            Кадровое обеспечение
          </Text>
          <HTMLContent html={orgPedConditions.personnelProvision} />
        </View>
      )}
    </PDFPage>
  );
};
