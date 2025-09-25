import { View, Text } from '@react-pdf/renderer';
import type { FC } from 'react';
import type { Expertise, Criterion } from '@/types';
import { PDFPage } from '../../shared/ui/PDFPage';
import { PDFTable } from '@/components/pdf/shared';

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
        key: 'criterion1_1' as keyof Expertise,
      },
      {
        number: '1.2.',
        text: 'Цель и тема программы соответствуют друг другу',
        key: 'criterion1_2' as keyof Expertise,
      },
      {
        number: '1.3.',
        text: 'Профессиональный стандарт или Единый квалификационный справочник должностей соответствуют выбранной категории слушателей, категория слушателей указана корректно',
        key: 'criterion1_3' as keyof Expertise,
      },
      {
        number: '1.4.',
        text: 'Планируемые результаты обучения (в части «знать» и «уметь») соответствуют трудовым действиям (согласно профессиональному стандарту) или должностным обязанностям (согласно Единому квалификационному справочнику должностей)',
        key: 'criterion1_4' as keyof Expertise,
      },
      {
        number: '1.5.',
        text: 'Планируемые результаты обучения по программе соответствуют теме и цели программы',
        key: 'criterion1_5' as keyof Expertise,
      },
    ],
  },
  {
    section: '2. Содержание программы',
    criteria: [
      {
        number: '2.1.',
        text: 'Содержание программы соответствует теме программы',
        key: 'criterion2_1' as keyof Expertise,
      },
      {
        number: '2.2.',
        text: 'Рабочие программы образовательных модулей соответствуют учебному (тематическому) плану',
        key: 'criterion2_2' as keyof Expertise,
      },
      {
        number: '2.3.',
        text: 'Содержание программы позволяет достигнуть планируемых результатов обучения по программе',
        key: 'criterion2_3' as keyof Expertise,
      },
      {
        number: '2.4.',
        text: 'Формы и виды учебной деятельности слушателей позволяют обеспечить достижение планируемых результатов обучения',
        key: 'criterion2_4' as keyof Expertise,
      },
    ],
  },
  {
    section: '3. Формы аттестации и оценочные материалы программы',
    criteria: [
      {
        number: '3.1.',
        text: 'Критерии оценки аттестации слушателей по итогам освоения образовательных модулей (программы) описаны подробно и корректно',
        key: 'criterion3_1' as keyof Expertise,
      },
      {
        number: '3.2.',
        text: 'Оценочные материалы по программе позволяют диагностировать достижение планируемых знаний',
        key: 'criterion3_2' as keyof Expertise,
      },
      {
        number: '3.3.',
        text: 'Оценочные материалы по программе позволяют диагностировать достижение планируемых умений',
        key: 'criterion3_3' as keyof Expertise,
      },
      {
        number: '3.4.',
        text: 'Представленные примеры заданий аттестации наглядно демонстрируют, на оценку каких планируемых результатов обучения по программе они направлены',
        key: 'criterion3_4' as keyof Expertise,
      },
    ],
  },
  {
    section: '4. Организационно-педагогические условия реализации программы',
    criteria: [
      {
        number: '4.1.',
        text: 'Список нормативно-правовых и методических документов согласуется с содержанием программы, ссылки на электронные ресурсы являются рабочими',
        key: 'criterion4_1' as keyof Expertise,
      },
      {
        number: '4.2.',
        text: 'Список основной литературы согласуется с содержанием программы, включает источники не старше пяти лет, ссылки на электронные ресурсы являются рабочими',
        key: 'criterion4_2' as keyof Expertise,
      },
      {
        number: '4.3.',
        text: 'Список дополнительной литературы согласуется с содержанием программы, ссылки на электронные ресурсы являются рабочими',
        key: 'criterion4_3' as keyof Expertise,
      },
      {
        number: '4.4.',
        text: 'Перечень ресурсов электронной поддержки образовательного процесса согласуется с содержанием программы, ссылки на электронные ресурсы являются рабочими',
        key: 'criterion4_4' as keyof Expertise,
      },
      {
        number: '4.5.',
        text: 'Предусмотрены необходимые технические средства обучения для проведения очных занятий и организации дистанционного обучения',
        key: 'criterion4_5' as keyof Expertise,
      },
    ],
  },
];

const renderSectionTable = (section: (typeof criteriaData)[0], expertise: Expertise, showHeader: boolean = false) => (
  <View key={section.section}>
    {/* Заголовок таблицы - только для первой секции */}
    {showHeader && (
      <PDFTable.Tr isHeader>
        <PDFTable.Th style={{ width: '8%' }}>№ п/п</PDFTable.Th>
        <PDFTable.Th style={{ width: '62%' }}>Критерий экспертизы программы</PDFTable.Th>
        <PDFTable.Th style={{ width: '15%' }}>Да</PDFTable.Th>
        <PDFTable.Th style={{ width: '15%' }}>Нет</PDFTable.Th>
      </PDFTable.Tr>
    )}

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
        <Text style={{ fontWeight: 'bold' }}>{section.section}</Text>
      </PDFTable.Td>
    </PDFTable.Tr>

    {/* Критерии секции */}
    {section.criteria.map((criterion, criterionIndex) => {
      const criterionValue = expertise[criterion.key] as Criterion | undefined;
      const hasCommentOrRecommendation = criterionValue && !criterionValue.value && (criterionValue.comment || criterionValue.recommendation);

      return (
        <View key={criterionIndex}>
          <PDFTable.Tr>
            <PDFTable.Td style={{ width: '8%', textAlign: 'center' }}>
              <Text>{criterion.number}</Text>
            </PDFTable.Td>
            <PDFTable.Td style={{ width: '62%', padding: 4 }}>
              <Text>{criterion.text}</Text>
            </PDFTable.Td>
            <PDFTable.Td style={{ width: '15%', textAlign: 'center' }}>
              <Text>{criterionValue?.value === true ? 'V' : ''}</Text>
            </PDFTable.Td>
            <PDFTable.Td style={{ width: '15%', textAlign: 'center' }}>
              <Text>{criterionValue?.value === false ? 'V' : ''}</Text>
            </PDFTable.Td>
          </PDFTable.Tr>

          {/* Отображаем замечания и рекомендации только если value = false */}
          {hasCommentOrRecommendation && (
            <>
              {criterionValue.comment && (
                <PDFTable.Tr>
                  <PDFTable.Td style={{ width: '100%', padding: 4, backgroundColor: '#f9f9f9' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 10 }}>Замечание: </Text>
                    <Text style={{ fontSize: 10, marginTop: 2 }}>{criterionValue.comment}</Text>
                  </PDFTable.Td>
                </PDFTable.Tr>
              )}
              {criterionValue.recommendation && (
                <PDFTable.Tr>
                  <PDFTable.Td style={{ width: '100%', padding: 4, backgroundColor: '#f9f9f9' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 10 }}>Рекомендация: </Text>
                    <Text style={{ fontSize: 10, marginTop: 2 }}>{criterionValue.recommendation}</Text>
                  </PDFTable.Td>
                </PDFTable.Tr>
              )}
            </>
          )}
        </View>
      );
    })}
  </View>
);

export const ExpertiseCriteriaPage: FC<ExpertisePDFProps> = ({ expertise, pageNumber = 1 }) => {
  const firstPageSections = criteriaData.slice(0, 2); // Разделы 1 и 2
  const secondPageSections = criteriaData.slice(2); // Разделы 3 и 4

  return (
    <>
      {/* Первая страница - разделы 1 и 2 с единой таблицей */}
      <PDFPage title="Критерии экспертизы программы" pageNumber={pageNumber}>
        <PDFTable.Self style={{ marginTop: 10 }}>
          {firstPageSections.map((section, index) =>
            renderSectionTable(section, expertise, index === 0)
          )}
        </PDFTable.Self>
      </PDFPage>

      {/* Вторая страница - разделы 3 и 4 с единой таблицей */}
      <PDFPage title="Критерии экспертизы программы (продолжение)" pageNumber={pageNumber + 1}>
        <PDFTable.Self style={{ marginTop: 10 }}>
          {secondPageSections.map((section) =>
            renderSectionTable(section, expertise, false)
          )}
        </PDFTable.Self>
      </PDFPage>
    </>
  );
};
