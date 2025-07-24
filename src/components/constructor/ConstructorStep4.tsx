import React, { useState, useEffect } from "react";
import { Table, Button, Input, Form, Typography, Space, Popconfirm } from "antd";
import type { CreateProgramForm, Abbreviation } from "../../types/program";

const { Title } = Typography;

interface Props {
  value: CreateProgramForm;
  onChange: (data: Partial<CreateProgramForm>) => void;
}

const ConstructorStep4: React.FC<Props> = ({ value, onChange }) => {
  const [form] = Form.useForm();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [abbreviations, setAbbreviations] = useState<Abbreviation[]>(value.abbreviations || []);

  useEffect(() => {
    onChange({ abbreviations });
    // eslint-disable-next-line
  }, [abbreviations]);

  const handleAdd = (values: Abbreviation) => {
    setAbbreviations((prev) => [...prev, values]);
    form.resetFields();
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    form.setFieldsValue(abbreviations[index]);
  };

  const handleSaveEdit = (values: Abbreviation) => {
    setAbbreviations((prev) => prev.map((item, idx) => (idx === editingIndex ? values : item)));
    setEditingIndex(null);
    form.resetFields();
  };

  const handleDelete = (index: number) => {
    setAbbreviations((prev) => prev.filter((_, idx) => idx !== index));
  };

  return (
    <div>
      <Title level={4}>Список сокращений</Title>
      <Form
        form={form}
        layout="inline"
        onFinish={editingIndex === null ? handleAdd : handleSaveEdit}
        style={{ marginBottom: 16 }}
      >
        <Form.Item
          name="abbreviation"
          rules={[{ required: true, message: "Введите аббревиатуру" }]}
        >
          <Input placeholder="Аббревиатура" />
        </Form.Item>
        <Form.Item
          name="fullname"
          rules={[{ required: true, message: "Введите расшифровку" }]}
        >
          <Input placeholder="Расшифровка" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {editingIndex === null ? "Добавить" : "Сохранить"}
          </Button>
          {editingIndex !== null && (
            <Button style={{ marginLeft: 8 }} onClick={() => { setEditingIndex(null); form.resetFields(); }}>
              Отмена
            </Button>
          )}
        </Form.Item>
      </Form>
      <Table
        dataSource={abbreviations}
        rowKey={(_, i) => String(i)}
        pagination={false}
        columns={[
          { title: "Аббревиатура", dataIndex: "abbreviation" },
          { title: "Расшифровка", dataIndex: "fullname" },
          {
            title: "Действия",
            render: (_, __, idx) => (
              <Space>
                <Button size="small" onClick={() => handleEdit(idx)}>Изменить</Button>
                <Popconfirm title="Удалить?" onConfirm={() => handleDelete(idx)}>
                  <Button size="small" danger>Удалить</Button>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />
    </div>
  );
};

export default ConstructorStep4; 