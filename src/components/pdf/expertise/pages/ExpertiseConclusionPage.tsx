import { View, Text } from '@react-pdf/renderer';
import type { FC } from 'react';
import type { Expertise, ExpertiseStatus } from '@/types';
import { PDFPage } from '../../shared/ui/PDFPage';

interface ExpertisePDFProps {
  expertise: Expertise;
  pageNumber?: number;
}

const getStatusText = (status: ExpertiseStatus) => {
  switch (status) {
    case 'approved':
      return 'ОДОБРЕНО';
    case 'rejected':
      return 'ОТКЛОНЕНО';
    case 'completed':
      return 'ЗАВЕРШЕНО';
    case 'in_progress':
      return 'В ПРОЦЕССЕ';
    case 'pending':
      return 'ОЖИДАЕТ ЭКСПЕРТИЗЫ';
    default:
      return 'НЕ ОПРЕДЕЛЕНО';
  }
};

const getStatusColor = (status: ExpertiseStatus) => {
  switch (status) {
    case 'approved':
      return '#00b894';
    case 'rejected':
      return '#e17055';
    case 'completed':
      return '#0984e3';
    default:
      return '#636e72';
  }
};

export const ExpertiseConclusionPage: FC<ExpertisePDFProps> = ({ expertise, pageNumber }) => {
  const { program, expert, status, isRecommendedForApproval } = expertise;

  return (
    <PDFPage title="Заключение эксперта" pageNumber={pageNumber}>
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

        <View
          style={{
            marginBottom: 25,
            padding: 15,
            border: '2px solid ' + getStatusColor(status),
            borderRadius: 5,
            backgroundColor:
              status === 'approved' ? '#f0fff4' : status === 'rejected' ? '#fff5f5' : '#f8f9fa',
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              textAlign: 'center',
              color: getStatusColor(status),
              marginBottom: 10,
            }}
          >
            СТАТУС ЭКСПЕРТИЗЫ: {getStatusText(status)}
          </Text>

          <Text
            style={{
              fontSize: 14,
              fontWeight: 'bold',
              textAlign: 'center',
              color: isRecommendedForApproval ? '#00b894' : '#e17055',
            }}
          >
            {isRecommendedForApproval
              ? 'ПРОГРАММА РЕКОМЕНДУЕТСЯ К ОДОБРЕНИЮ'
              : 'ПРОГРАММА НЕ РЕКОМЕНДУЕТСЯ К ОДОБРЕНИЮ'}
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
