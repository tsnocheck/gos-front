import React, { useState } from 'react';
import { Table, Button, Form, Typography, Space, Popconfirm } from 'antd';
import type { ExtendedProgram, Abbreviation } from '@/types';
import RecommendationSuggestionInput from '../shared/RecommendationSuggestionInput';
import { RecommendationField } from '@/types/recommendation';

const { Title } = Typography;

interface Props {
  value: ExtendedProgram;
  onChange: (data: ExtendedProgram) => void;
}

const ConstructorStep4: React.FC<Props> = ({ value, onChange }) => {
  const [form] = Form.useForm();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const abbreviations = value.abbreviations || [];

  // Сортируем аббревиатуры для отображения в таблице
  const sortedAbbreviations = [...abbreviations].sort((a, b) =>
    a.abbreviation.localeCompare(b.abbreviation, 'ru'),
  );

  const handleAdd = (values: Abbreviation) => {
    onChange({ abbreviations: [...abbreviations, values] });
    form.resetFields();
  };

  const handleEdit = (index: number) => {
    // Получаем элемент из отсортированного массива
    const itemToEdit = sortedAbbreviations[index];
    // Находим индекс этого элемента в исходном массиве
    const originalIndex = abbreviations.findIndex(
      (item) =>
        item.abbreviation === itemToEdit.abbreviation && item.fullname === itemToEdit.fullname,
    );
    setEditingIndex(originalIndex);
    form.setFieldsValue(itemToEdit);
  };

  const handleSaveEdit = (values: Abbreviation) => {
    onChange({
      abbreviations: abbreviations.map((item, idx) => (idx === editingIndex ? values : item)),
    });
    setEditingIndex(null);
    form.resetFields();
  };

  const handleDelete = (index: number) => {
    // Получаем элемент из отсортированного массива
    const itemToDelete = sortedAbbreviations[index];
    // Находим индекс этого элемента в исходном массиве и удаляем
    onChange({
      abbreviations: abbreviations.filter(
        (item) =>
          !(
            item.abbreviation === itemToDelete.abbreviation &&
            item.fullname === itemToDelete.fullname
          ),
      ),
    });
  };

  return (
    <div>
      <Title level={4}>Список сокращений и условных обозначений</Title>
      <Form
        form={form}
        layout="inline"
        onFinish={editingIndex === null ? handleAdd : handleSaveEdit}
        style={{ marginBottom: 16 }}
      >
        <Form.Item
          name="abbreviation"
          rules={[{ required: true, message: 'Введите аббревиатуру' }]}
        >
          <RecommendationSuggestionInput
            placeholder="Аббревиатура"
            type={RecommendationField.ABBREVIATION}
          />
        </Form.Item>
        <Form.Item name="fullname" rules={[{ required: true, message: 'Введите расшифровку' }]}>
          <RecommendationSuggestionInput
            placeholder="Расшифровка"
            type={RecommendationField.FULLNAME}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {editingIndex === null ? 'Добавить' : 'Сохранить'}
          </Button>
          {editingIndex !== null && (
            <Button
              style={{ marginLeft: 8 }}
              onClick={() => {
                setEditingIndex(null);
                form.resetFields();
              }}
            >
              Отмена
            </Button>
          )}
        </Form.Item>
      </Form>

      <Table
        dataSource={sortedAbbreviations}
        rowKey={(_, i) => String(i)}
        pagination={false}
        columns={[
          { title: 'Аббревиатура', dataIndex: 'abbreviation' },
          { title: 'Расшифровка', dataIndex: 'fullname' },
          {
            title: 'Действия',
            render: (_, __, idx) => (
              <Space>
                <Button size="small" onClick={() => handleEdit(idx)}>
                  Изменить
                </Button>
                <Popconfirm title="Удалить?" onConfirm={() => handleDelete(idx)}>
                  <Button size="small" danger>
                    Удалить
                  </Button>
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
