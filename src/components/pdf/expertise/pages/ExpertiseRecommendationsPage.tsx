import { View, Text } from '@react-pdf/renderer';
import type { FC } from 'react';
import type { Expertise } from '@/types';
import { PDFPage } from '../../shared/ui/PDFPage';

interface ExpertisePDFProps {
  expertise: Expertise;
  pageNumber?: number;
}

export const ExpertiseRecommendationsPage: FC<ExpertisePDFProps> = ({ expertise, pageNumber }) => {
  return (
    <PDFPage title="Рекомендации эксперта" pageNumber={pageNumber! + 1}>
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>
          Общий отзыв эксперта:
        </Text>
        <View
          style={{
            border: '1px solid #ccc',
            padding: 10,
            minHeight: 80,
            marginBottom: 20,
          }}
        >
          <Text style={{ fontSize: 12, lineHeight: 1.4 }}>
            {expertise.generalFeedback || 'Отзыв не предоставлен'}
          </Text>
        </View>

        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>
          Рекомендации по улучшению программы:
        </Text>
        <View
          style={{
            border: '1px solid #ccc',
            padding: 10,
            minHeight: 80,
            marginBottom: 20,
          }}
        >
          <Text style={{ fontSize: 12, lineHeight: 1.4 }}>
            {expertise.recommendations || 'Рекомендации не предоставлены'}
          </Text>
        </View>

        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>
          Дополнительные рекомендации:
        </Text>
        <View
          style={{
            border: '1px solid #ccc',
            padding: 10,
            minHeight: 80,
            marginBottom: 20,
          }}
        >
          <Text style={{ fontSize: 12, lineHeight: 1.4 }}>
            {expertise.additionalRecommendation || 'Дополнительные рекомендации не предоставлены'}
          </Text>
        </View>

        {expertise.revisionComments && (
          <>
            <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>
              Комментарии для доработки:
            </Text>
            <View
              style={{
                border: '1px solid #ff6b6b',
                padding: 10,
                minHeight: 60,
                backgroundColor: '#fff5f5',
                marginBottom: 20,
              }}
            >
              <Text style={{ fontSize: 12, lineHeight: 1.4, color: '#d63031' }}>
                {expertise.revisionComments}
              </Text>
            </View>
          </>
        )}

        <View style={{ marginTop: 30 }}>
          <Text style={{ fontSize: 12, marginBottom: 5 }}>
            Круг доработки: {expertise.revisionRound}
          </Text>
          {expertise.reviewedAt && (
            <Text style={{ fontSize: 12, marginBottom: 5 }}>
              Дата завершения экспертизы:{' '}
              {new Date(expertise.reviewedAt).toLocaleDateString('ru-RU')}
            </Text>
          )}
          {expertise.sentForRevisionAt && (
            <Text style={{ fontSize: 12, marginBottom: 5 }}>
              Дата отправки на доработку:{' '}
              {new Date(expertise.sentForRevisionAt).toLocaleDateString('ru-RU')}
            </Text>
          )}
        </View>
      </View>
    </PDFPage>
  );
};
