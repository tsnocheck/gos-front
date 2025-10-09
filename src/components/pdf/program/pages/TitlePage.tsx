import { View, Text } from '@react-pdf/renderer';
import { currentYear } from '../../shared/utils';
import type { FC } from 'react';
import type { ProgramPDFProps } from '@/types';
import { PDFPage } from '../../shared/ui/PDFPage';

export const TitlePage: FC<ProgramPDFProps> = ({ program, getDictionaryById, pageNumber }) => {
  const getInstitutionName = () => {
    if (program.customInstitution) {
      return program.customInstitution;
    }

    if (program.institution && program.institution !== 'other') {
      const institution = getDictionaryById(program.institution);
      return institution?.description || institution?.value || program.institution;
    }

    return '';
  };

  const institutionName = getInstitutionName();

  return (
    <PDFPage
      ui={{ view: { justifyContent: 'center' } }}
      showPageNumber={false}
      pageNumber={pageNumber}
    >
      <Text style={{ textAlign: 'center', marginBottom: 60 }}>{institutionName}</Text>

      <View style={{ flexGrow: 1, paddingTop: 50 }}>
        <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>
          Дополнительная профессиональная программа {'\n'} повышения квалификации
        </Text>
        <Text style={{ textAlign: 'center', marginTop: 8, fontWeight: 'bold' }}>
          «{program.title || 'Название программы'}»
        </Text>
      </View>

      <View style={{ position: 'absolute', bottom: '40%', right: 50 }}>
        <Text>Программа обсуждена и утверждена</Text>
        <Text>на заседании Учёного совета</Text>
        <Text>__________________ {currentYear} г. (Протокол № ___)</Text>
        <Text style={{ marginTop: 10 }}>Председатель Учёного совета{'\n'}___________ /Имя/</Text>
      </View>

      <View style={{ textAlign: 'center' }}>
        <Text>Калининград</Text>
        <Text>{currentYear}</Text>
      </View>
    </PDFPage>
  );
};
