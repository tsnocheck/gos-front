import { View, Text } from '@react-pdf/renderer';
import { currentYear } from '../../shared/utils';
import type { FC } from 'react';
import type { Expertise } from '@/types';
import { PDFPage } from '../../shared/ui/PDFPage';

interface ExpertisePDFProps {
  expertise: Expertise;
  pageNumber?: number;
}

export const ExpertiseTitlePage: FC<ExpertisePDFProps> = ({ expertise, pageNumber }) => {
  const { program, expert, position } = expertise;

  return (
    <PDFPage
      ui={{ view: { justifyContent: 'center' } }}
      showPageNumber={false}
      pageNumber={pageNumber}
    >
      <Text style={{ textAlign: 'center', marginBottom: 60 }}>
        {program.customInstitution ? program.customInstitution : program.institution}
      </Text>

      <View style={{ flexGrow: 1, paddingTop: 50 }}>
        <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>
          ЭКСПЕРТНОЕ ЗАКЛЮЧЕНИЕ
        </Text>
        <Text style={{ textAlign: 'center', marginTop: 20 }}>
          на дополнительную профессиональную программу {'\n'} повышения квалификации
        </Text>
        <Text style={{ textAlign: 'center', marginTop: 8, fontSize: 14, fontWeight: 'bold' }}>
          "{program.title || 'Название программы'}"
        </Text>
      </View>

      <View style={{ marginTop: 40, marginBottom: 40 }}>
        <Text style={{ marginBottom: 10 }}>
          Эксперт: {expert.lastName} {expert.firstName} {expert.middleName}
        </Text>
        <Text style={{ marginBottom: 10 }}>Должность: {expert.position || 'Не указано'}</Text>
        <Text style={{ marginBottom: 10 }}>
          Место работы: {(expert as any).institution || 'Не указано'}
        </Text>
        {position && (
          <Text style={{ marginBottom: 10 }}>
            Позиция эксперта:{' '}
            {position === 'first'
              ? 'Первый эксперт'
              : position === 'second'
                ? 'Второй эксперт'
                : 'Третий эксперт'}
          </Text>
        )}
      </View>

      <View style={{ textAlign: 'center' }}>
        <Text>Калининград</Text>
        <Text>{currentYear}</Text>
      </View>
    </PDFPage>
  );
};
