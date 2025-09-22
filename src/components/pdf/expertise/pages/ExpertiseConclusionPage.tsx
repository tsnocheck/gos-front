import { View, Text } from '@react-pdf/renderer';
import type { FC } from 'react';
import type { Expertise } from '@/types';
import { PDFPage } from '../../shared/ui/PDFPage';

interface ExpertisePDFProps {
  expertise: Expertise;
  pageNumber?: number;
}


export const ExpertiseConclusionPage: FC<ExpertisePDFProps> = ({ expertise, pageNumber }) => {
  const { program, expert } = expertise;

  return (
    <PDFPage title="Заключение эксперта" pageNumber={pageNumber! + 1}>
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 15 }}>
          Экспертное заключение:
        </Text>

        <View
          style={{
            border: '1px solid #ccc',
            padding: 15,
            minHeight: 100,
            marginBottom: 25,
          }}
        >
          <Text style={{ fontSize: 12, lineHeight: 1.5 }}>
            {expertise.conclusion || 'Заключение не предоставлено'}
          </Text>
        </View>

        <View style={{ marginTop: 40, marginBottom: 20 }}>
          <Text style={{ fontSize: 12, marginBottom: 8 }}>
            <Text style={{ fontWeight: 'bold' }}>Программа: </Text>
            {program.title}
          </Text>
          <Text style={{ fontSize: 12, marginBottom: 8 }}>
            <Text style={{ fontWeight: 'bold' }}>Объем программы: </Text>
            {(program as any).hours || 'Не указано'} часов
          </Text>
          <Text style={{ fontSize: 12, marginBottom: 8 }}>
            <Text style={{ fontWeight: 'bold' }}>Категория слушателей: </Text>
            {(program as any).audienceCategory || 'Не указано'}
          </Text>
        </View>

        <View style={{ marginTop: 50, borderTop: '1px solid #ccc', paddingTop: 20 }}>
          <Text style={{ fontSize: 12, marginBottom: 5 }}>
            <Text style={{ fontWeight: 'bold' }}>Эксперт: </Text>
            {expert.lastName} {expert.firstName} {expert.middleName}
          </Text>
          <Text style={{ fontSize: 12, marginBottom: 5 }}>
            <Text style={{ fontWeight: 'bold' }}>Должность: </Text>
            {expert.position || 'Не указано'}
          </Text>
          <Text style={{ fontSize: 12, marginBottom: 5 }}>
            <Text style={{ fontWeight: 'bold' }}>Место работы: </Text>
            {(expert as any).institution || 'Не указано'}
          </Text>
          <Text style={{ fontSize: 12, marginBottom: 15 }}>
            <Text style={{ fontWeight: 'bold' }}>Email: </Text>
            {expert.email}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginTop: 30,
            }}
          >
            <View style={{ width: '40%' }}>
              <Text style={{ fontSize: 12, marginBottom: 5 }}>Подпись эксперта:</Text>
              <View style={{ borderBottom: '1px solid #000', width: '100%', height: 20 }} />
            </View>

            <View style={{ width: '30%' }}>
              <Text style={{ fontSize: 12, marginBottom: 5 }}>Дата:</Text>
              <View style={{ borderBottom: '1px solid #000', width: '100%', height: 20 }} />
            </View>
          </View>
        </View>
      </View>
    </PDFPage>
  );
};
