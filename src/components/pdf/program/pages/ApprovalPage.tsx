import { Text } from '@react-pdf/renderer';
import { currentYear } from '../../shared/utils';
import type { FC } from 'react';
import type { ProgramPDFProps } from '@/types';
import { PDFPage } from '../../shared/ui/PDFPage';
import { getExpertsFromExpertises } from '@/utils/getExpertsFromExpertises.ts';

export const ApprovalPage: FC<ProgramPDFProps> = ({ program, authors, pageNumber }) => {
  return (
    <PDFPage title="ЛИСТ СОГЛАСОВАНИЯ" pageNumber={pageNumber}>
      <Text style={{ marginBottom: 10, textAlign: 'justify' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Разработчик(и) программы: {'\n'}</Text>
        {authors.map(({ lastName, firstName, middleName }, idx) => (
          <Text key={idx}>
            {(lastName ?? '') + ' ' + (firstName ?? '') + ' ' + (middleName ?? '')}
            {'\n'}
          </Text>
        ))}
      </Text>

      {program?.expertises?.length && (
        <>
          <Text style={{ marginBottom: 5, textAlign: 'justify' }}>
            Дополнительная профессиональная программа повышения квалификации "
            {program.title || 'Название Программы'}", прошла экспертизу:
          </Text>

          {getExpertsFromExpertises(program.expertises).map((expert, index) => (
            <Text style={{ marginBottom: 5 }}>
              Эксперт {index + 1}: {expert.lastName + ' ' + expert.firstName}
            </Text>
          ))}
        </>
      )}

      <Text style={{ textAlign: 'justify' }}>
        Дополнительная профессиональная программа повышения квалификации "
        {program.title || 'Название Программы'}" утверждена Учёным советом Калининградского
        областного института развития образования (протокол № ___ от ______ {currentYear} г.)
      </Text>
    </PDFPage>
  );
};
