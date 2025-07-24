import React, { useState } from "react";
import {
  Card,
  Steps,
  Button,
  Form,
  Input,
  Select,
  InputNumber,
  Space,
  Typography,
  message,
  Spin,
  Tooltip,
  Descriptions,
} from "antd";
import { InfoCircleOutlined, SaveOutlined } from "@ant-design/icons";
import { useCreateProgram } from "../queries/programs";
import {
  useDictionaryTypes,
  useDictionariesByType,
} from "../queries/dictionaries";
import { DictionaryType, type Dictionary } from "../types/dictionary";
import type { CreateProgramForm } from "../types";

const { Title } = Typography;
const { Option } = Select;

const LabelWithTooltip: React.FC<{ label: string; tooltipKey: string }> = ({
  label,
  tooltipKey,
}) => (
  <span>
    {label}
    <Tooltip title={`Рекомендации по ${tooltipKey}`}>
      <InfoCircleOutlined style={{ color: "#1890ff" }} />
    </Tooltip>
  </span>
);

const DynamicDictionaryField: React.FC<{
  form: any;
  typeName: string;
  label: string;
  name: string;
}> = ({ form, typeName, label, name }) => {
  const DICTIONARY_LIST = [
    { type: DictionaryType.INSTITUTIONS, label: "Справочник учреждений" },
    { type: DictionaryType.SUBDIVISIONS, label: "Справочник подразделений" },
    {
      type: DictionaryType.LABOR_FUNCTIONS,
      label: "Справочник трудовых функций и действий",
    },
    {
      type: DictionaryType.JOB_RESPONSIBILITIES,
      label: "Справочник должностных обязанностей",
    },
    {
      type: DictionaryType.STUDENT_CATEGORIES,
      label: "Справочник категорий слушателей",
    },
    { type: DictionaryType.EDUCATION_FORMS, label: "Справочник форм обучения" },
    { type: DictionaryType.SUBJECTS, label: "Справочник учебных предметов" },
    {
      type: DictionaryType.EXPERT_ALGORITHMS,
      label: "Справочник алгоритмов назначения экспертов",
    },
    {
      type: DictionaryType.KOIRO_SUBDIVISIONS,
      label: "Справочник подразделений КОИРО",
    },
    {
      type: DictionaryType.KOIRO_MANAGERS,
      label: "Справочник руководителей КОИРО",
    },
  ];

  const selectedType = Form.useWatch<DictionaryType>(typeName, form);
  const dynamicDictQuery = useDictionariesByType(selectedType);

  return (
    <>
      <Form.Item
        name={typeName}
        label={`Тип словаря: ${label}`}
        rules={[{ required: true }]}
      >
        <Select placeholder="Выберите тип словаря">
          {DICTIONARY_LIST?.map((dt) => (
            <Option key={dt.type} value={dt.type}>
              {dt.label}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name={name}
        label={<LabelWithTooltip label={label} tooltipKey={label} />}
        rules={[{ required: true }]}
      >
        <Select
          mode="multiple"
          placeholder={`Выберите ${label}`}
          loading={dynamicDictQuery.isLoading}
        >
          {dynamicDictQuery.data?.map((d: Dictionary) => (
            <Option key={d.id} value={d.value}>
              {d.value}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </>
  );
};

const fieldLabels: Record<string, string> = {
  title: "Название программы",
  description: "Описание программы",
  programCode: "Код программы",
  duration: "Длительность (часы)",
  targetAudienceType: "Тип словаря: Целевая аудитория",
  targetAudience: "Целевая аудитория",
  content: "Содержание",
  learningOutcomes: "Результаты обучения",
  competencies: "Компетенции",
  methodology: "Методология",
  assessment: "Оценка результатов",
  materials: "Материалы",
  requirements: "Требования",
  nprContent: "Нормативно-правовой раздел",
  pmrContent: "Предметно-методический раздел",
  vrContent: "Вариативный раздел",
};

export const ProgramConstructorPage: React.FC = () => {
  const [form] = Form.useForm();

  const dictTypesQuery = useDictionaryTypes();

  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState<CreateProgramForm>({
    title: "",
  });

  const createProgram = useCreateProgram(() => {
    message.success("Программа успешно создана!");
    form.resetFields();
    setFormData({ title: "" });
    setCurrentStep(0);
  });

  const steps = [
    { title: "Основная информация" },
    { title: "Содержание и структура" },
    { title: "Методология и оценка" },
    { title: "Нормативно-правовой раздел" },
    { title: "Предметно-методический раздел" },
    { title: "Вариативный раздел" },
    { title: "Проверка и создание" },
  ];

  const handleNext = async () => {
    try {
      await form.validateFields();
      setFormData({ ...formData, ...form.getFieldsValue() });
      setCurrentStep((step) => step + 1);
    } catch {
      message.error("Пожалуйста, заполните все обязательные поля");
    }
  };

  const handlePrev = () => setCurrentStep((step) => step - 1);

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      createProgram.mutate(formData);
    } catch {
      message.error("Ошибка при отправке формы");
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <Form.Item
              name="title"
              label={
                <LabelWithTooltip
                  label="Название программы "
                  tooltipKey="Название"
                />
              }
              rules={[{ required: true }]}
            >
              <Input placeholder="Введите название" />
            </Form.Item>
            <Form.Item
              name="description"
              label={
                <LabelWithTooltip
                  label="Описание программы "
                  tooltipKey="Описание"
                />
              }
              rules={[{ required: true }]}
            >
              <Input.TextArea rows={4} placeholder="Краткое описание" />
            </Form.Item>
            <Form.Item
              name="programCode"
              label={
                <LabelWithTooltip label="Код программы " tooltipKey="Код" />
              }
            >
              <Input placeholder="IT-EDU-2025" />
            </Form.Item>
            <Form.Item
              name="duration"
              label={
                <LabelWithTooltip
                  label="Длительность (часы) "
                  tooltipKey="Длительность"
                />
              }
              rules={[{ required: true }]}
            >
              <InputNumber
                min={1}
                style={{ width: "100%" }}
                placeholder="Часы"
              />
            </Form.Item>
            <DynamicDictionaryField
              form={form}
              typeName="targetAudienceType"
              name="targetAudience"
              label="Целевая аудитория "
            />
          </>
        );
      case 1:
        return (
          <>
            <Form.Item
              name="content"
              label={
                <LabelWithTooltip label="Содержание" tooltipKey="Содержание" />
              }
              rules={[{ required: true }]}
            >
              <Input.TextArea rows={4} placeholder="Основные темы" />
            </Form.Item>
            <Form.Item
              name="learningOutcomes"
              label={
                <LabelWithTooltip
                  label="Результаты обучения"
                  tooltipKey="Результаты обучения"
                />
              }
              rules={[{ required: true }]}
            >
              <Input.TextArea rows={4} placeholder="Компетенции" />
            </Form.Item>
          </>
        );
      case 2:
        return (
          <>
            <Form.Item
              name="competencies"
              label={
                <LabelWithTooltip
                  label="Компетенции"
                  tooltipKey="Компетенции"
                />
              }
              rules={[{ required: true }]}
            >
              <Input.TextArea rows={4} placeholder="Ключевые компетенции" />
            </Form.Item>
            <Form.Item
              name="methodology"
              label={
                <LabelWithTooltip
                  label="Методология"
                  tooltipKey="Методология"
                />
              }
              rules={[{ required: true }]}
            >
              <Input.TextArea rows={4} placeholder="Методы" />
            </Form.Item>
            <Form.Item
              name="assessment"
              label={
                <LabelWithTooltip
                  label="Оценка результатов"
                  tooltipKey="Оценка результатов"
                />
              }
              rules={[{ required: true }]}
            >
              <Input.TextArea rows={4} placeholder="Критерии" />
            </Form.Item>
            <Form.Item
              name="materials"
              label={
                <LabelWithTooltip label="Материалы" tooltipKey="Материалы" />
              }
            >
              <Input.TextArea rows={4} placeholder="Ресурсы" />
            </Form.Item>
            <Form.Item
              name="requirements"
              label={
                <LabelWithTooltip label="Требования" tooltipKey="Требования" />
              }
            >
              <Input.TextArea rows={4} placeholder="Предварительные знания" />
            </Form.Item>
          </>
        );
      case 3:
        return (
          <Form.Item
            name="nprContent"
            label={
              <LabelWithTooltip
                label="Нормативно-правовой раздел"
                tooltipKey="НПР"
              />
            }
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={4} placeholder="Нормативные документы" />
          </Form.Item>
        );
      case 4:
        return (
          <Form.Item
            name="pmrContent"
            label={
              <LabelWithTooltip
                label="Предметно-методический раздел"
                tooltipKey="ПМР"
              />
            }
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={4} placeholder="Методические указания" />
          </Form.Item>
        );
      case 5:
        return (
          <Form.Item
            name="vrContent"
            label={
              <LabelWithTooltip label="Вариативный раздел" tooltipKey="ВР" />
            }
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={4} placeholder="Дополнительные модули" />
          </Form.Item>
        );
      case 6: {
        return (
          <Card>
            <Title level={4}>Проверьте данные программы</Title>
            <Descriptions bordered column={1}>
              {Object.entries(formData).map(([key, val]) => (
                <Descriptions.Item key={key} label={fieldLabels[key] || key}>
                  {val}
                </Descriptions.Item>
              ))}
            </Descriptions>
          </Card>
        );
      }
      default:
        return null;
    }
  };

  if (dictTypesQuery.isLoading) return <Spin size="large" />;

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Создание программы</Title>
      <Steps
        current={currentStep}
        items={steps}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr)",
          gap: "1rem",
          marginBottom: 24,
        }}
      />
      <Form form={form} layout="vertical">
        {renderStep()}
      </Form>
      <div style={{ marginTop: 24, textAlign: "right" }}>
        <Space>
          {currentStep > 0 && <Button onClick={handlePrev}>Назад</Button>}
          {currentStep < steps.length - 1 && (
            <Button type="primary" onClick={handleNext}>
              Далее
            </Button>
          )}
          {currentStep === steps.length - 1 && (
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={createProgram.isLoading}
              onClick={handleSubmit}
            >
              Создать программу
            </Button>
          )}
        </Space>
      </div>
    </div>
  );
};
