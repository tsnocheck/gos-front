import type { FC } from 'react';
import type { ProgramPDFProps } from '@/types';
import { View, Text } from '@react-pdf/renderer';
import { PDFPage } from '../../shared/ui/PDFPage';
import HTMLContent from '../../shared/ui/HTMLContent';

export const LiteraturePage: FC<ProgramPDFProps> = ({ program }) => {
  const { orgPedConditions } = program;

  return (
    <PDFPage title="Список литературы">
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>
          Список основной литературы
        </Text>
        <HTMLContent html={orgPedConditions?.mainLiterature || ''} />
      </View>

      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>
          Список дополнительной литературы
        </Text>
        <HTMLContent html={orgPedConditions?.additionalLiterature || ''} />
      </View>

      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>
          Электронные учебные материалы
        </Text>
        <HTMLContent html={orgPedConditions?.electronicMaterials || ''} />
      </View>

      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>
          Интернет-ресурсы
        </Text>
        <HTMLContent html={orgPedConditions?.internetResources || ''} />
      </View>
    </PDFPage>
  );
};
