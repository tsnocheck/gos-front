import React, { useEffect, useState } from "react";
import { Form, Input, Select, Typography } from "antd";

const { Title } = Typography;
const { Option } = Select;

const standards = [
  { value: "professional-standard", label: "Профессиональный стандарт" },
  { value: "eks", label: "ЕКС" },
  { value: "both", label: "Проф. стандарт + ЕКС" },
];
const functionsList = ["Функция 1", "Функция 2", "Функция 3"];
const actionsList = ["Действие 1", "Действие 2", "Действие 3"];
const dutiesList = ["Обязанность 1", "Обязанность 2", "Обязанность 3"];
const categoriesList = ["Категория 1", "Категория 2", "Категория 3"];
const educationForms = ["Очная", "Очно-заочная", "Дистанционная"];

interface Props {
  value: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

const ConstructorStep5: React.FC<Props> = ({ value, onChange }) => {
  const [form] = Form.useForm();
  const [standard, setStandard] = useState(value.standard as string || "");

  useEffect(() => {
    onChange(form.getFieldsValue());
    // eslint-disable-next-line
  }, [form, standard]);

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={value}
      onValuesChange={() => onChange(form.getFieldsValue())}
    >
      <Title level={4}>Пояснительная записка</Title>
      <Form.Item name="relevance" label="Актуальность разработки программы">
        <Input.TextArea rows={2} />
      </Form.Item>
      <Form.Item name="goal" label="Цель реализации программы">
        <Input.TextArea rows={2} />
      </Form.Item>
      <Form.Item name="standard" label="Проф. стандарт/ЕКС">
        <Select onChange={setStandard} placeholder="Выберите стандарт">
          {standards.map((s) => (
            <Option key={s.value} value={s.value}>{s.label}</Option>
          ))}
        </Select>
      </Form.Item>
      {(standard === "professional-standard" || standard === "both") && (
        <>
          <Form.Item name="functions" label="Трудовые функции">
            <Select mode="multiple" options={functionsList.map(f => ({ value: f, label: f }))} />
          </Form.Item>
          <Form.Item name="actions" label="Трудовые действия">
            <Select mode="multiple" options={actionsList.map(a => ({ value: a, label: a }))} />
          </Form.Item>
        </>
      )}
      {(standard === "eks" || standard === "both") && (
        <Form.Item name="duties" label="Должностные обязанности">
          <Select mode="multiple" options={dutiesList.map(d => ({ value: d, label: d }))} />
        </Form.Item>
      )}
      <Form.Item name="know" label="Знать">
        <Input.TextArea rows={2} />
      </Form.Item>
      <Form.Item name="can" label="Уметь">
        <Input.TextArea rows={2} />
      </Form.Item>
      <Form.Item name="category" label="Категория слушателей">
        <Select options={categoriesList.map(c => ({ value: c, label: c }))} />
      </Form.Item>
      <Form.Item name="educationForm" label="Форма обучения">
        <Select options={educationForms.map(f => ({ value: f, label: f }))} />
      </Form.Item>
      <Form.Item name="term" label="Срок освоения программы (часы)">
        <Input type="number" min={1} style={{ width: 120 }} />
      </Form.Item>
    </Form>
  );
};

export default ConstructorStep5; 