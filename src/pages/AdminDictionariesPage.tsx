import React, { useState } from 'react';
import { Card, Typography, Table, Button, Space, Modal, Form, Input, Popconfirm, message, Select, Tag } from 'antd';
import type { Dictionary } from '../types/dictionary';
import { DictionaryType, DictionaryStatus } from '../types/dictionary';
import { useDictionariesByType, useCreateDictionary, useUpdateDictionary, useDeleteDictionary } from '../queries/dictionaries';

const { Title } = Typography;

const DICTIONARY_LIST = [
  { type: DictionaryType.INSTITUTIONS, label: 'Справочник учреждений' },
  { type: DictionaryType.SUBDIVISIONS, label: 'Справочник подразделений' },
  { type: DictionaryType.LABOR_FUNCTIONS, label: 'Справочник трудовых функций и действий' },
  { type: DictionaryType.JOB_RESPONSIBILITIES, label: 'Справочник должностных обязанностей' },
  { type: DictionaryType.STUDENT_CATEGORIES, label: 'Справочник категорий слушателей' },
  { type: DictionaryType.EDUCATION_FORMS, label: 'Справочник форм обучения' },
  { type: DictionaryType.SUBJECTS, label: 'Справочник учебных предметов' },
  { type: DictionaryType.EXPERT_ALGORITHMS, label: 'Справочник алгоритмов назначения экспертов' },
  { type: DictionaryType.KOIRO_SUBDIVISIONS, label: 'Справочник подразделений КОИРО' },
  { type: DictionaryType.KOIRO_MANAGERS, label: 'Справочник руководителей КОИРО' },
];

export const AdminDictionariesPage: React.FC = () => {
  const [openType, setOpenType] = useState<DictionaryType | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<Dictionary | null>(null);
  const [form] = Form.useForm();

  // Для модалки
  const { data, isLoading } = useDictionariesByType(openType as DictionaryType);
  const createMutation = useCreateDictionary();
  const updateMutation = useUpdateDictionary();
  const deleteMutation = useDeleteDictionary();

  const handleOpen = (type: DictionaryType) => {
    setOpenType(type);
    setModalVisible(true);
    setEditing(null);
  };

  const handleClose = () => {
    setModalVisible(false);
    setOpenType(null);
    setEditing(null);
    form.resetFields();
  };

  const handleEdit = (record: Dictionary) => {
    setEditing(record);
    form.setFieldsValue({
      value: record.value,
      description: record.description,
      sortOrder: record.sortOrder,
      status: record.status,
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      message.success('Запись удалена');
    } catch {
      message.error('Ошибка при удалении');
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        await updateMutation.mutateAsync({ id: editing.id, data: values });
        message.success('Запись обновлена');
      } else {
        await createMutation.mutateAsync({ type: openType!, ...values });
        message.success('Запись создана');
      }
      setEditing(null);
      form.resetFields();
    } catch {
      message.error('Ошибка при сохранении');
    }
  };

  // Колонки для таблицы справочников
  const mainColumns = [
    {
      title: 'Справочник',
      dataIndex: 'label',
      key: 'label',
    },
    {
      title: '',
      key: 'actions',
      render: (_: unknown, record: { type: DictionaryType }) => (
        <Button type="primary" onClick={() => handleOpen(record.type)}>
          Открыть
        </Button>
      ),
      width: 120,
    },
  ];

  // Колонки для модалки
  const getColumns = (_: DictionaryType, onEdit: (record: Dictionary) => void) => [
    { title: 'Значение', dataIndex: 'value', key: 'value' },
    { title: 'Описание', dataIndex: 'description', key: 'description' },
    { title: 'Порядок', dataIndex: 'sortOrder', key: 'sortOrder' },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          active: { color: 'green', text: 'Активен' },
          inactive: { color: 'red', text: 'Неактивен' },
        };
        const info = statusMap[status as 'active' | 'inactive'] || { color: 'default', text: status };
        return <Tag color={info.color}>{info.text}</Tag>;
      },
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: unknown, record: Dictionary) => (
        <Space>
          <Button onClick={() => onEdit(record)}>Редактировать</Button>
          <Popconfirm title="Удалить запись?" onConfirm={() => handleDelete(record.id)} okText="Да" cancelText="Нет">
            <Button danger>Удалить</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>Справочники системы</Title>
      </div>
      <Card>
        <Table
          columns={mainColumns}
          dataSource={DICTIONARY_LIST}
          rowKey="type"
          pagination={false}
        />
      </Card>
      <Modal
        open={modalVisible}
        onCancel={handleClose}
        title={DICTIONARY_LIST.find(d => d.type === openType)?.label}
        width={800}
        footer={null}
        destroyOnHidden
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Button onClick={handleClose}>Назад</Button>
          <Button type="primary" onClick={() => { setEditing(null); form.resetFields(); }}>
            Добавить запись
          </Button>
        </div>
        <Table
          loading={isLoading}
          dataSource={data || []}
          columns={getColumns(openType!, handleEdit)}
          rowKey="id"
          pagination={false}
          style={{ marginBottom: 24 }}
        />
        <Form form={form} layout="vertical" onFinish={handleOk} initialValues={{ value: '', description: '', sortOrder: 0, status: 'active' }}>
          <Form.Item name="value" label="Значение" required>
            <Input /> 
          </Form.Item>
          <Form.Item name="description" label="Описание">
            <Input />
          </Form.Item>
          <Form.Item getValueFromEvent={e => +e.target.value} name="sortOrder" label="Порядок">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="status" label="Статус">
            <Select>
              <Select.Option value={DictionaryStatus.ACTIVE}>Активен</Select.Option>
              <Select.Option value={DictionaryStatus.INACTIVE}>Неактивен</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
              {editing ? 'Сохранить изменения' : 'Добавить'}
            </Button>
            {editing && <Button onClick={() => { setEditing(null); form.resetFields(); }}>Отмена</Button>}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminDictionariesPage; 