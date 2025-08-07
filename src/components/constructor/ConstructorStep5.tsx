import React, { useCallback, useEffect, useState } from "react";
import { Form, Input, Select, Typography } from "antd";
import {
  useActionsByFunctions,
  useDictionariesByType,
} from "@/queries/dictionaries";
import { DictionaryType, type CreateProgramForm } from "@/types";

const { Title } = Typography;
const { Option } = Select;

const standards = [
  { value: "professional-standard", label: "Профессиональный стандарт" },
  { value: "eks", label: "ЕКС" },
  { value: "both", label: "Проф. стандарт + ЕКС" },
];
const dutiesList = ["Обязанность 1", "Обязанность 2", "Обязанность 3"];

interface Props {
  value: Partial<CreateProgramForm>;
  onChange: (data: Partial<CreateProgramForm>) => void;
}

const ConstructorStep5: React.FC<Props> = ({ value, onChange }) => {
  const [form] = Form.useForm<Partial<CreateProgramForm>>();
  const [standard, setStandard] = useState((value.standard as string) || "");

  const selectedFunctions = Form.useWatch<string[]>("functions", form);

  const { data: functions } = useDictionariesByType(
    DictionaryType.LABOR_FUNCTIONS
  );

  const { data: categories } = useDictionariesByType(
    DictionaryType.STUDENT_CATEGORIES
  );

  const { data: educationForms } = useDictionariesByType(
    DictionaryType.EDUCATION_FORMS
  );

  const { data: actions } = useActionsByFunctions(selectedFunctions);

  const onValuesChange = useCallback(() => {
    onChange({
      ...form.getFieldsValue(),
      functions: selectedFunctions?.map(
        (id) => functions?.find((f) => id === f.id)?.value ?? ""
      ),
    });
  }, [form, functions, onChange, selectedFunctions]);

  useEffect(() => form.setFieldValue("actions", []), [form, selectedFunctions]);

  useEffect(() => {
    onValuesChange();
  }, [form, onValuesChange, standard]);

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={value}
      onValuesChange={onValuesChange}
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
            <Option key={s.value} value={s.value}>
              {s.label}
            </Option>
          ))}
        </Select>
      </Form.Item>
      {(standard === "professional-standard" || standard === "both") && (
        <>
          <Form.Item name="functions" label="Трудовые функции">
            <Select
              mode="multiple"
              options={functions?.map((f) => ({
                value: f.id,
                label: f.value,
              }))}
            />
          </Form.Item>
          <Form.Item name="actions" label="Трудовые действия">
            <Select
              mode="multiple"
              options={actions?.map((a) => ({ value: a.value }))}
            />
          </Form.Item>
        </>
      )}
      {(standard === "eks" || standard === "both") && (
        <Form.Item name="duties" label="Должностные обязанности">
          <Select
            mode="multiple"
            options={dutiesList.map((d) => ({ value: d, label: d }))}
          />
        </Form.Item>
      )}
      <Form.Item name="know" label="Знать">
        <Input.TextArea rows={2} />
      </Form.Item>
      <Form.Item name="can" label="Уметь">
        <Input.TextArea rows={2} />
      </Form.Item>
      <Form.Item name="category" label="Категория слушателей">
        <Select
          options={categories?.map((c) => ({ value: c.value, label: c.value }))}
        />
      </Form.Item>
      <Form.Item name="educationForm" label="Форма обучения">
        <Select
          options={educationForms?.map((f) => ({
            value: f.value,
            label: f.value,
          }))}
        />
      </Form.Item>
      <Form.Item name="term" label="Срок освоения программы (часы)">
        <Input type="number" min={1} style={{ width: 120 }} />
      </Form.Item>
    </Form>
  );
};

export default ConstructorStep5;
