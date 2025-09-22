import React, { useState, useEffect } from 'react';
import { Modal, Table, Button, Form, Input, Space, Checkbox } from 'antd';
import type { Expertise, SubmitExpertiseDto, ExpertiseCriterions, Criterion } from '@/types';

const { TextArea } = Input;

interface ExpertiseFormModalProps {
  open: boolean;
  expertise: Expertise | null;
  onClose: () => void;
  onSubmit: (data: SubmitExpertiseDto) => Promise<void>;
  onSendForRevision: (data: { revisionComments: string }) => Promise<void>;
}

interface CriterionData {
  key: string;
  number: string;
  text: string;
  value: boolean;
  comment?: string;
  recommendation?: string;
}

const criteriaConfig = [
  {
    section: '1. Характеристика программы',
    items: [
      {
        key: 'criterion1_1',
        number: '1.1.',
        text: 'Актуальность разработки и реализации программы имеет убедительное и конкретное обоснование, тематика программы соответствует государственной политике в сфере образования',
      },
      {
        key: 'criterion1_2',
        number: '1.2.',
        text: 'Цель и тема программы соответствуют друг другу',
      },
      {
        key: 'criterion1_3',
        number: '1.3.',
        text: 'Профессиональный стандарт или Единый квалификационный справочник должностей соответствуют выбранной категории слушателей, категория слушателей указана корректно',
      },
      {
        key: 'criterion1_4',
        number: '1.4.',
        text: 'Планируемые результаты обучения (в части «знать» и «уметь») соответствуют трудовым действиям (согласно профессиональному стандарту) или должностным обязанностям (согласно Единому квалификационному справочнику должностей)',
      },
      {
        key: 'criterion1_5',
        number: '1.5.',
        text: 'Планируемые результаты обучения по программе соответствуют теме и цели программы',
      },
    ],
  },
  {
    section: '2. Содержание программы',
    items: [
      {
        key: 'criterion2_1',
        number: '2.1.',
        text: 'Содержание программы соответствует теме программы',
      },
      {
        key: 'criterion2_2',
        number: '2.2.',
        text: 'Рабочие программы образовательных модулей соответствуют учебному (тематическому) плану',
      },
      {
        key: 'criterion2_3',
        number: '2.3.',
        text: 'Содержание программы позволяет достигнуть планируемых результатов обучения по программе',
      },
      {
        key: 'criterion2_4',
        number: '2.4.',
        text: 'Формы и виды учебной деятельности слушателей позволяют обеспечить достижение планируемых результатов обучения',
      },
    ],
  },
  {
    section: '3. Формы аттестации и оценочные материалы программы',
    items: [
      {
        key: 'criterion3_1',
        number: '3.1.',
        text: 'Критерии оценки аттестации слушателей по итогам освоения образовательных модулей (программы) описаны подробно и корректно',
      },
      {
        key: 'criterion3_2',
        number: '3.2.',
        text: 'Оценочные материалы по программе позволяют диагностировать достижение планируемых знаний',
      },
      {
        key: 'criterion3_3',
        number: '3.3.',
        text: 'Оценочные материалы по программе позволяют диагностировать достижение планируемых умений',
      },
      {
        key: 'criterion3_4',
        number: '3.4.',
        text: 'Представленные примеры заданий аттестации наглядно демонстрируют, на оценку каких планируемых результатов обучения по программе они направлены',
      },
    ],
  },
  {
    section: '4. Организационно-педагогические условия реализации программы',
    items: [
      {
        key: 'criterion4_1',
        number: '4.1.',
        text: 'Список нормативно-правовых и методических документов согласуется с содержанием программы, ссылки на электронные ресурсы являются рабочими',
      },
      {
        key: 'criterion4_2',
        number: '4.2.',
        text: 'Список основной литературы согласуется с содержанием программы, включает источники не старше пяти лет, ссылки на электронные ресурсы являются рабочими',
      },
      {
        key: 'criterion4_3',
        number: '4.3.',
        text: 'Список дополнительной литературы согласуется с содержанием программы, ссылки на электронные ресурсы являются рабочими',
      },
      {
        key: 'criterion4_4',
        number: '4.4.',
        text: 'Перечень ресурсов электронной поддержки образовательного процесса согласуется с содержанием программы, ссылки на электронные ресурсы являются рабочими',
      },
      {
        key: 'criterion4_5',
        number: '4.5.',
        text: 'Предусмотрены необходимые технические средства обучения для проведения очных занятий и организации дистанционного обучения',
      },
    ],
  },
];

export const ExpertiseFormModal: React.FC<ExpertiseFormModalProps> = ({
  open,
  expertise,
  onClose,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const [criteriaData, setCriteriaData] = useState<CriterionData[]>([]);

  useEffect(() => {
    if (expertise && open) {
      // Преобразуем критерии из expertise в формат для таблицы
      const data: CriterionData[] = [];

      criteriaConfig.forEach((section) => {
        section.items.forEach((item) => {
          const criterion = expertise[item.key as keyof ExpertiseCriterions] as Criterion;
          data.push({
            key: item.key,
            number: item.number,
            text: item.text,
            value: criterion?.value ?? true, // По умолчанию "Да"
            comment: criterion?.comment ?? '',
            recommendation: criterion?.recommendation ?? '',
          });
        });
      });

      setCriteriaData(data);

      // Устанавливаем дополнительные поля формы
      form.setFieldsValue({
        additionalRecommendation: expertise.additionalRecommendation || '',
      });
    }
  }, [expertise, open, form]);

  const handleCriterionChange = (
    key: string,
    field: 'value' | 'comment' | 'recommendation',
    value: boolean | string,
  ) => {
    setCriteriaData((prev) =>
      prev.map((item) => (item.key === key ? { ...item, [field]: value } : item)),
    );
  };

  const handleSubmit = async () => {
    try {
      const formValues = await form.validateFields();

      // Преобразуем данные критериев обратно в формат ExpertiseCriterions
      const criterions: Partial<ExpertiseCriterions> = {};

      criteriaData.forEach((item) => {
        criterions[item.key as keyof ExpertiseCriterions] = {
          value: item.value,
          comment: item.comment || undefined,
          recommendation: item.recommendation || undefined,
        } as Criterion;
      });

      const submitData: SubmitExpertiseDto = {
        ...(criterions as ExpertiseCriterions),
        additionalRecommendation: formValues.additionalRecommendation,
      };

      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  // Создаем расширенные данные с полями для замечаний и рекомендаций
  const expandedData: Array<
    | CriterionData
    | { key: string; isComment?: boolean; isRecommendation?: boolean; parentKey?: string }
  > = [];

  let currentSection = '';
  criteriaConfig.forEach((section) => {
    if (currentSection !== section.section) {
      currentSection = section.section;
      expandedData.push({
        key: `section-${section.section}`,
        number: '',
        text: section.section,
        value: false,
      } as CriterionData);
    }

    section.items.forEach((item) => {
      const criterionData = criteriaData.find((c) => c.key === item.key);
      if (criterionData) {
        expandedData.push(criterionData);

        // Если ответ "нет", добавляем поля для замечаний и рекомендаций
        if (!criterionData.value) {
          expandedData.push({
            key: `${item.key}-comment`,
            isComment: true,
            parentKey: item.key,
          });
          expandedData.push({
            key: `${item.key}-recommendation`,
            isRecommendation: true,
            parentKey: item.key,
          });
        }
      }
    });
  });

  const expandedColumns = [
    {
      title: '№ п/п',
      dataIndex: 'number',
      key: 'number',
      width: 80,
      render: (text: string, record: any) => {
        if (record.isComment) return '';
        if (record.isRecommendation) return '';
        if (!text) return null;
        return <strong>{text}</strong>;
      },
    },
    {
      title: 'Критерий экспертизы программы',
      dataIndex: 'text',
      key: 'text',
      render: (text: string, record: any) => {
        if (record.isComment) {
          const parentData = criteriaData.find((c) => c.key === record.parentKey);
          return (
            <div style={{ marginLeft: 20, marginTop: 8 }}>
              <strong>Замечания:</strong>
              <TextArea
                rows={2}
                value={parentData?.comment || ''}
                onChange={(e) => handleCriterionChange(record.parentKey, 'comment', e.target.value)}
                placeholder="Укажите замечания к данному критерию"
              />
            </div>
          );
        }
        if (record.isRecommendation) {
          const parentData = criteriaData.find((c) => c.key === record.parentKey);
          return (
            <div style={{ marginLeft: 20, marginTop: 8, marginBottom: 8 }}>
              <strong>Рекомендации по исправлению замечаний:</strong>
              <TextArea
                rows={2}
                value={parentData?.recommendation || ''}
                onChange={(e) =>
                  handleCriterionChange(record.parentKey, 'recommendation', e.target.value)
                }
                placeholder="Укажите рекомендации по исправлению"
              />
            </div>
          );
        }

        // Если это заголовок секции
        if (!record.number && text) {
          return <strong style={{ fontSize: '16px' }}>{text}</strong>;
        }

        return text;
      },
    },
    {
      title: 'Да',
      key: 'yes',
      width: 80,
      align: 'center' as const,
      render: (_: unknown, record: any) => {
        if (record.isComment || record.isRecommendation) return null;
        if (!record.number) return null; // Заголовок секции

        return (
          <Checkbox
            checked={record.value}
            onChange={(e) => handleCriterionChange(record.key, 'value', e.target.checked)}
          />
        );
      },
    },
    {
      title: 'Нет',
      key: 'no',
      width: 80,
      align: 'center' as const,
      render: (_: unknown, record: any) => {
        if (record.isComment || record.isRecommendation) return null;
        if (!record.number) return null; // Заголовок секции

        return (
          <Checkbox
            checked={!record.value}
            onChange={(e) => handleCriterionChange(record.key, 'value', !e.target.checked)}
          />
        );
      },
    },
  ];

  return (
    <Modal
      title={`Экспертиза: ${expertise?.program?.title || ''}`}
      open={open}
      onCancel={onClose}
      width={1200}
      footer={null}
      style={{ top: 20 }}
    >
      <Form form={form} layout="vertical">
        <div style={{ marginBottom: 16 }}>
          <Table
            columns={expandedColumns}
            dataSource={expandedData}
            pagination={false}
            size="small"
            rowKey="key"
            bordered
            rowClassName={(record: any) => {
              if (record.isComment || record.isRecommendation) return 'comment-row';
              if (!record.number) return 'section-header-row';
              return '';
            }}
          />
        </div>

        <Form.Item
          name="additionalRecommendation"
          label="Дополнительные рекомендации (по желанию эксперта)"
        >
          <TextArea rows={3} placeholder="Укажите дополнительные рекомендации" />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" onClick={handleSubmit}>
              Завершить экспертизу
            </Button>

            <Button onClick={onClose}>Закрыть</Button>
          </Space>
        </Form.Item>
      </Form>

      <style>
        {`
        .comment-row td {
          background-color: #f9f9f9 !important;
          border-top: none !important;
        }
        .section-header-row td {
          background-color: #e6f7ff !important;
          font-weight: bold;
        }
        `}
      </style>
    </Modal>
  );
};
