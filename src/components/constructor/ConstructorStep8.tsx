import React, { useEffect } from "react";
import { Form, Input, Typography } from "antd";

const { Title } = Typography;

interface Props {
  value: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

const ConstructorStep8: React.FC<Props> = ({ value, onChange }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    onChange(form.getFieldsValue());
    // eslint-disable-next-line
  }, [form]);

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={value}
      onValuesChange={() => onChange(form.getFieldsValue())}
    >
      <Title level={4}>Формы аттестации и оценочные материалы</Title>
      <Form.Item name="requirements" label="Описание требований к выполнению">
        <Input.TextArea rows={3} />
      </Form.Item>
      <Form.Item name="criteria" label="Критерии оценивания">
        <Input.TextArea rows={3} />
      </Form.Item>
      <Form.Item name="examples" label="Примеры заданий (2–3 примера)">
        <Input.TextArea rows={3} />
      </Form.Item>
      <Form.Item name="attempts" label="Количество попыток">
        <Input type="number" min={1} style={{ width: 120 }} />
      </Form.Item>
    </Form>
  );
};

export default ConstructorStep8; 