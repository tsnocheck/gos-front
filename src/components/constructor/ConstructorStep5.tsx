import React, { useCallback, useMemo } from "react";
import { Form, Input, Select, Table, Typography } from "antd";
import { standards, type ExtendedProgram } from "@/types";
import { useProgramDictionaries } from "@/hooks/useProgramDictionaries";

const { Title } = Typography;

interface Props {
  value: ExtendedProgram;
  onChange: (data: ExtendedProgram) => void;
}

const ConstructorStep5: React.FC<Props> = ({ value, onChange }) => {
  const [form] = Form.useForm<ExtendedProgram>();

  const selectedFunctions = Form.useWatch<string[] | undefined>(
    "functions",
    form
  );

  const {
    functions,
    getActions,
    categories,
    educationForms,
    duties,
    getDictionaryById,
  } = useProgramDictionaries();

  const actions = useMemo(
    () => getActions(selectedFunctions ?? []),
    [selectedFunctions]
  );

  const handleValuesChange = useCallback(
    (changedValues: ExtendedProgram) => {
      if (changedValues.functions) form.setFieldValue("actions", []);

      onChange(form.getFieldsValue());
    },
    [form, onChange]
  );

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
        <Select
          placeholder="Выберите стандарт"
          options={Object.entries(standards).map(([value, label]) => ({
            value,
            label,
          }))}
        />
      </Form.Item>

      {(value.standard === "professional-standard" ||
        value.standard === "both") && (
        <div style={{ display: "flex", width: "100%", gap: 20 }}>
          <Form.Item
            name="functions"
            label="Трудовые функции"
            style={{ flex: 1 }}
          >
            <Select
              mode="tags"
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
              mode="tags"
              options={actions?.map((a) => ({
                value: a.id,
                label: a.value,
              }))}
              disabled={!selectedFunctions?.length}
            />
          </Form.Item>
        </div>
      )}

      {(value.standard === "eks" || value.standard === "both") && (
        <Form.Item name="duties" label="Должностные обязанности">
          <Select
            mode="tags"
            options={duties?.map((d) => ({ value: d.id, label: d.value }))}
          />
        </Form.Item>
      )}

      <Form.Item name="know" label="Знать">
        <Select
          mode="tags"
          style={{ width: "100%" }}
          placeholder="Введите знания"
        />
      </Form.Item>

      <Form.Item name="can" label="Уметь">
        <Select
          mode="tags"
          style={{ width: "100%" }}
          placeholder="Введите умения"
        />
      </Form.Item>

      <Table
        bordered
        pagination={false}
        style={{ marginBottom: 10 }}
        columns={[
          ...(value.standard === "professional-standard" ||
          value.standard === "both"
            ? [
                { title: "Трудовые функции", dataIndex: "functions" },
                { title: "Трудовые действия", dataIndex: "actions" },
              ]
            : []),

          ...(value.standard === "eks" || value.standard === "both"
            ? [{ title: "Должностные обязанности", dataIndex: "duties" }]
            : []),

          { title: "Знать", dataIndex: "know" },
          { title: "Уметь", dataIndex: "can" },
        ]}
        dataSource={[
          {
            key: 1,
            functions: value.functions?.map((id) => (
              <p style={{ marginBottom: 1 }}>
                &bull; {getDictionaryById(id)?.value ?? id}
              </p>
            )),
            actions: value.actions?.map((id) => (
              <p style={{ marginBottom: 1 }}>
                &bull; {getDictionaryById(id)?.value ?? id}
              </p>
            )),
            duties: value.duties?.map((id) => (
              <p style={{ marginBottom: 1 }}>
                &bull; {getDictionaryById(id)?.value ?? id}
              </p>
            )),
            know: value.know?.map((value) => (
              <p style={{ marginBottom: 1 }}>&bull; {value}</p>
            )),
            can: value.can?.map((value) => (
              <p style={{ marginBottom: 1 }}>&bull; {value}</p>
            )),
          },
        ]}
      />

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
