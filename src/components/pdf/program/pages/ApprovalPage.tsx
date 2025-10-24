import { Text } from '@react-pdf/renderer';
import { currentYear } from '../../shared/utils';
import type { FC } from 'react';
import type { ProgramPDFProps } from '@/types';
import { PDFPage } from '../../shared/ui/PDFPage';
import { getExpertsFromExpertises } from '@/utils/getExpertsFromExpertises.ts';

export const ApprovalPage: FC<ProgramPDFProps> = ({ program, authors, pageNumber }) => {
  // Получаем вид программы или используем значение по умолчанию
  const programType =
    program.type || 'Дополнительная профессиональная программа повышения квалификации';

  // Формируем список всех авторов (включая вручную введенных соавторов)
  const allAuthors = [
    ...authors.map((author) => ({
      name: `${author.lastName ?? ''} ${author.firstName ?? ''} ${author.middleName ?? ''}`.trim(),
      isUser: true,
    })),
  ];

  // Добавляем вручную введенных соавторов (которые не являются объектами User)
  if (program.coAuthorIds) {
    program.coAuthorIds.forEach((id) => {
      // Проверяем, не является ли это уже существующим автором
      const isExistingAuthor = authors.some((author) => author.id === id);
      if (!isExistingAuthor && id) {
        // Это вручную введенное имя
        allAuthors.push({
          name: id,
          isUser: false,
        });
      }
    });
  }

  return (
    <PDFPage title="ЛИСТ СОГЛАСОВАНИЯ" pageNumber={pageNumber}>
      <Text style={{ marginBottom: 10, textAlign: 'justify' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Разработчик(и) программы: {'\n'}</Text>
        {allAuthors.map((author, idx) => (
          <Text key={idx}>
            {author.name}
            {'\n'}
          </Text>
        ))}
      </Text>

      {program?.expertises?.length && (
        <>
          <Text style={{ marginBottom: 5, textAlign: 'justify' }}>
            {programType} "{program.title || 'Название Программы'}", прошла экспертизу:
          </Text>

          {getExpertsFromExpertises(program.expertises).map((expert, index) => (
            <Text style={{ marginBottom: 5 }} key={index}>
              Эксперт {index + 1}: {expert.lastName + ' ' + expert.firstName}
            </Text>
          ))}
        </>
      )}

      <Text style={{ textAlign: 'justify' }}>
        {programType} "{program.title || 'Название Программы'}" утверждена Учёным советом
        Калининградского областного института развития образования (протокол № ___ от ______{' '}
        {currentYear} г.)
      </Text>
    </PDFPage>
  );
};
