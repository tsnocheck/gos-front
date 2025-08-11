import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Form, Input, Select, Typography } from "antd";
import { standards, type CreateProgramForm } from "@/types";
import { useProgramDictionaries } from "@/hooks/useProgramDictionaries";

const { Title } = Typography;
const { Option } = Select;

interface Props {
  value: Partial<CreateProgramForm>;
  onChange: (data: Partial<CreateProgramForm>) => void;
}

const ConstructorStep5: React.FC<Props> = ({ value, onChange }) => {
  const [form] = Form.useForm<Partial<CreateProgramForm>>();
  const [standard, setStandard] = useState(value.standard || "");

  const selectedFunctions = Form.useWatch<string[] | undefined>(
    "functions",
    form
  );

  const { functions, getActions, categories, educationForms, duties } =
    useProgramDictionaries();

  const actions = useMemo(
    () => getActions(selectedFunctions ?? []),
    [selectedFunctions]
  );

  const handleValuesChange = useCallback(
    (changedValues?: Partial<CreateProgramForm>) => {
      if (changedValues?.functions) form.setFieldValue("actions", []);

      onChange(form.getFieldsValue());
    },
    [form, functions, onChange, selectedFunctions]
  );

  useEffect(() => handleValuesChange(), []);

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={value}
      onValuesChange={handleValuesChange}
    >
      <Title level={4}>Характеристика программы</Title>
      <Form.Item name="relevance" label="Актуальность разработки программы">
        <Input.TextArea rows={2} />
      </Form.Item>
      <Form.Item name="goal" label="Цель реализации программы">
        <Input.TextArea rows={2} />
      </Form.Item>
      <Form.Item name="standard" label="Проф. стандарт/ЕКС">
        <Select onChange={setStandard} placeholder="Выберите стандарт">
          {Object.entries(standards).map(([value, label]) => (
            <Option key={value} value={value}>
              {label}
            </Option>
          ))}
        </Select>
      </Form.Item>
      {(standard === "professional-standard" || standard === "both") && (
        <div style={{ display: "flex", width: "100%", gap: 20 }}>
          <Form.Item
            name="functions"
            label="Трудовые функции"
            style={{ flex: 1 }}
          >
            <Select
              mode="multiple"
              options={functions?.map((f) => ({
                value: f.id,
                label: f.value,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="actions"
            label="Трудовые действия"
            style={{ flex: 1 }}
          >
            <Select
              mode="multiple"
              options={actions?.map((a) => ({
                value: a.id,
                label: a.value,
              }))}
              disabled={!selectedFunctions?.length}
            />
          </Form.Item>
        </div>
      )}
      {(standard === "eks" || standard === "both") && (
        <Form.Item name="duties" label="Должностные обязанности">
          <Select
            mode="multiple"
            options={duties?.map((d) => ({ value: d.id, label: d.value }))}
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
          options={categories?.map((c) => ({ value: c.id, label: c.value }))}
        />
      </Form.Item>
      <Form.Item name="educationForm" label="Форма обучения">
        <Select
          options={educationForms?.map((f) => ({
            value: f.id,
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
