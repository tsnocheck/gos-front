import { View, Text } from '@react-pdf/renderer';
import type { FC } from 'react';
import type { Expertise } from '@/types';
import { PDFPage } from '../../shared/ui/PDFPage';
import { PDFTable } from '../../shared/ui/PDFTable';

interface ExpertisePDFProps {
  expertise: Expertise;
  pageNumber?: number;
}

const criteriaData = [
  {
    section: '1. Характеристика программы',
    criteria: [
      {
        number: '1.1.',
        text: 'Актуальность разработки и реализации программы имеет убедительное и конкретное обоснование, тематика программы соответствует государственной политике в сфере образования',
        key: 'criterion1_1',
      },
      {
        number: '1.2.',
        text: 'Цель и тема программы соответствуют друг другу',
        key: 'criterion1_2',
      },
      {
        number: '1.3.',
        text: 'Профессиональный стандарт или Единый квалификационный справочник должностей соответствуют выбранной категории слушателей, категория слушателей указана корректно',
        key: 'criterion1_3',
      },
      {
        number: '1.4.',
        text: 'Планируемые результаты обучения (в части «знать» и «уметь») соответствуют трудовым действиям (согласно профессиональному стандарту) или должностным обязанностям (согласно Единому квалификационному справочнику должностей)',
        key: 'criterion1_4',
      },
      {
        number: '1.5.',
        text: 'Планируемые результаты обучения по программе соответствуют теме и цели программы',
        key: 'criterion1_5',
      },
    ],
  },
  {
    section: '2. Содержание программы',
    criteria: [
      {
        number: '2.1.',
        text: 'Содержание программы соответствует теме программы',
        key: 'criterion2_1',
      },
      {
        number: '2.2.',
        text: 'Рабочие программы образовательных модулей соответствуют учебному (тематическому) плану',
        key: 'criterion2_2',
      },
      {
        number: '2.3.',
        text: 'Содержание программы позволяет достигнуть планируемых результатов обучения по программе',
        key: 'criterion2_3',
      },
      {
        number: '2.4.',
        text: 'Формы и виды учебной деятельности слушателей позволяют обеспечить достижение планируемых результатов обучения',
        key: 'criterion2_4',
      },
    ],
  },
  {
    section: '3. Формы аттестации и оценочные материалы программы',
    criteria: [
      {
        number: '3.1.',
        text: 'Критерии оценки аттестации слушателей по итогам освоения образовательных модулей (программы) описаны подробно и корректно',
        key: 'criterion3_1',
      },
      {
        number: '3.2.',
        text: 'Оценочные материалы по программе позволяют диагностировать достижение планируемых знаний',
        key: 'criterion3_2',
      },
      {
        number: '3.3.',
        text: 'Оценочные материалы по программе позволяют диагностировать достижение планируемых умений',
        key: 'criterion3_3',
      },
      {
        number: '3.4.',
        text: 'Представленные примеры заданий аттестации наглядно демонстрируют, на оценку каких планируемых результатов обучения по программе они направлены',
        key: 'criterion3_4',
      },
    ],
  },
  {
    section: '4. Организационно-педагогические условия реализации программы',
    criteria: [
      {
        number: '4.1.',
        text: 'Список нормативно-правовых и методических документов согласуется с содержанием программы, ссылки на электронные ресурсы являются рабочими',
        key: 'criterion4_1',
      },
      {
        number: '4.2.',
        text: 'Список основной литературы согласуется с содержанием программы, включает источники не старше пяти лет, ссылки на электронные ресурсы являются рабочими',
        key: 'criterion4_2',
      },
      {
        number: '4.3.',
        text: 'Список дополнительной литературы согласуется с содержанием программы, ссылки на электронные ресурсы являются рабочими',
        key: 'criterion4_3',
      },
      {
        number: '4.4.',
        text: 'Перечень ресурсов электронной поддержки образовательного процесса согласуется с содержанием программы, ссылки на электронные ресурсы являются рабочими',
        key: 'criterion4_4',
      },
      {
        number: '4.5.',
        text: 'Предусмотрены необходимые технические средства обучения для проведения очных занятий и организации дистанционного обучения',
        key: 'criterion4_5',
      },
    ],
  },
];

export const ExpertiseCriteriaPage: FC<ExpertisePDFProps> = ({ expertise, pageNumber }) => {
  return (
    <PDFPage title="Критерии экспертизы программы" pageNumber={pageNumber}>
      <PDFTable.Self style={{ marginTop: 10 }}>
        {/* Заголовок таблицы */}
        <PDFTable.Tr isHeader>
          <PDFTable.Th style={{ width: '8%' }}>№ п/п</PDFTable.Th>
          <PDFTable.Th style={{ width: '62%' }}>Критерий экспертизы программы</PDFTable.Th>
          <PDFTable.Th style={{ width: '15%' }}>Да</PDFTable.Th>
          <PDFTable.Th style={{ width: '15%' }}>Нет</PDFTable.Th>
        </PDFTable.Tr>

        {criteriaData.map((section, sectionIndex) => (
          <View key={sectionIndex}>
            {/* Заголовок секции */}
            <PDFTable.Tr>
              <PDFTable.Td
                style={{
                  width: '100%',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  backgroundColor: '#f0f0f0',
                  padding: 8,
                }}
              >
                {section.section}
              </PDFTable.Td>
            </PDFTable.Tr>

            {/* Критерии секции */}
            {section.criteria.map((criterion, criterionIndex) => {
              const criterionValue = expertise[criterion.key as keyof Expertise] as {
                value: boolean;
                comment?: string;
              };

              return (
                <PDFTable.Tr key={criterionIndex}>
                  <PDFTable.Td style={{ width: '8%', textAlign: 'center' }}>
                    {criterion.number}
                  </PDFTable.Td>
                  <PDFTable.Td style={{ width: '62%', padding: 4 }}>{criterion.text}</PDFTable.Td>
                  <PDFTable.Td style={{ width: '15%', textAlign: 'center' }}>
                    {criterionValue?.value ? '✓' : ''}
                  </PDFTable.Td>
                  <PDFTable.Td style={{ width: '15%', textAlign: 'center' }}>
                    {!criterionValue?.value ? '✓' : ''}
                  </PDFTable.Td>
                </PDFTable.Tr>
              );
            })}

            {/* Добавляем поля для замечаний и рекомендаций после каждой секции */}
            <PDFTable.Tr>
              <PDFTable.Td style={{ width: '100%', padding: 8 }}>
                <Text style={{ fontWeight: 'bold' }}>Замечания: </Text>
                <Text style={{ marginTop: 4 }}>
                  {section.criteria
                    .filter((c) => {
                      const criterionValue = expertise[c.key as keyof Expertise] as {
                        value: boolean;
                        comment?: string;
                      };
                      return criterionValue?.comment;
                    })
                    .map((c) => {
                      const criterionValue = expertise[c.key as keyof Expertise] as {
                        value: boolean;
                        comment?: string;
                      };
                      return `${c.number} ${criterionValue.comment}`;
                    })
                    .join('; ') || 'Замечаний нет'}
                </Text>
              </PDFTable.Td>
            </PDFTable.Tr>

            <PDFTable.Tr>
              <PDFTable.Td style={{ width: '100%', padding: 8 }}>
                <Text style={{ fontWeight: 'bold' }}>Рекомендации по исправлению замечаний: </Text>
                <Text style={{ marginTop: 4 }}>
                  {section.criteria
                    .filter((c) => {
                      const criterionValue = expertise[c.key as keyof Expertise] as {
                        value: boolean;
                        recommendation?: string;
                      };
                      return criterionValue?.recommendation;
                    })
                    .map((c) => {
                      const criterionValue = expertise[c.key as keyof Expertise] as {
                        value: boolean;
                        recommendation?: string;
                      };
                      return `${c.number} ${criterionValue.recommendation}`;
                    })
                    .join('; ') || 'Рекомендаций нет'}
                </Text>
              </PDFTable.Td>
            </PDFTable.Tr>
          </View>
        ))}
      </PDFTable.Self>
    </PDFPage>
  );
};
