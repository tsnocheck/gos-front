import React, { useState } from 'react';
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Select,
  DatePicker,
  Space,
  Table,
  Typography,
  message,
  Popconfirm,
  Tag,
} from 'antd';
import type { Recommendation } from '../types/recommendation';
import { RecommendationType, RecommendationStatus } from '../types/recommendation';
import {
  useRecommendations,
  useCreateRecommendation,
  useUpdateRecommendation,
  useDeleteRecommendation,
} from '../queries/recommendations';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;

const typeLabels: Record<RecommendationType, string> = {
  general: 'Общие',
  content: 'Содержание',
  methodology: 'Методология',
  structure: 'Структура',
  assessment: 'Оценка',
};

const statusLabels: Record<RecommendationStatus, { color: string; label: string }> = {
  active: { color: 'blue', label: 'Активная' },
  resolved: { color: 'green', label: 'Выполнена' },
  ignored: { color: 'orange', label: 'Проигнорирована' },
  archived: { color: 'gray', label: 'В архиве' },
};

const priorityLabels = {
  1: 'Высокий',
  2: 'Средний',
  3: 'Низкий',
};

const AdminRecommendationsPage: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<Recommendation | null>(null);
  const [form] = Form.useForm();

  const { data, isLoading } = useRecommendations();
  const createMutation = useCreateRecommendation();
  const updateMutation = useUpdateRecommendation();
  const deleteMutation = useDeleteRecommendation();

  const handleOpenModal = () => {
    setEditing(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setEditing(null);
    form.resetFields();
    setModalVisible(false);
  };

  const handleEdit = (record: Recommendation) => {
    setEditing(record);
    form.setFieldsValue({
      ...record,
      dueDate: record.dueDate ? dayjs(record.dueDate) : undefined,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      message.success('Рекомендация удалена');
    } catch {
      message.error('Ошибка при удалении');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        dueDate: values.dueDate ? values.dueDate.toISOString() : null,
      };

      if (editing) {
        await updateMutation.mutateAsync({ id: editing.id, data: payload });
        message.success('Рекомендация обновлена');
      } else {
        await createMutation.mutateAsync(payload);
        message.success('Рекомендация создана');
      }

      handleCloseModal();
    } catch {
      message.error('Ошибка при сохранении');
    }
  };

  const columns = [
    { title: 'Заголовок', dataIndex: 'title', key: 'title' },
    { title: 'Тип', dataIndex: 'type', key: 'type', render: (val: RecommendationType) => typeLabels[val] },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (val: RecommendationStatus) => {
        const { label, color } = statusLabels[val];
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: 'Приоритет',
      dataIndex: 'priority',
      key: 'priority',
      render: (val: number) => priorityLabels[val as 1 | 2 | 3],
    },
    {
      title: 'Срок',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (val: string | Date) => (val ? dayjs(val).format('DD.MM.YYYY') : '—'),
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: unknown, record: Recommendation) => (
        <Space>
          <Button onClick={() => handleEdit(record)}>Редактировать</Button>
          <Popconfirm
            title="Удалить рекомендацию?"
            onConfirm={() => handleDelete(record.id)}
            okText="Да"
            cancelText="Нет"
          >
            <Button danger>Удалить</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>Рекомендательная система</Title>
        <Button type="primary" onClick={handleOpenModal}>
          Добавить рекомендацию
        </Button>
      </div>
      <Card>
        <Table
          loading={isLoading}
          dataSource={data?.data || []}
          columns={columns}
          rowKey="id"
          pagination={false}
        />
      </Card>
      <Modal
        open={modalVisible}
        onCancel={handleCloseModal}
        title={editing ? 'Редактировать рекомендацию' : 'Добавить рекомендацию'}
        onOk={handleSubmit}
        okText={editing ? 'Сохранить' : 'Добавить'}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Заголовок" rules={[{ required: true, message: 'Введите заголовок' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="content" label="Содержание" rules={[{ required: true, message: 'Введите содержание' }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="type" label="Тип рекомендации" rules={[{ required: true }]}>
            <Select placeholder="Выберите тип">
              {Object.entries(typeLabels).map(([key, label]) => (
                <Option key={key} value={key}>{label}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="status" label="Статус рекомендации" rules={[{ required: true }]}>
            <Select>
              {Object.entries(statusLabels).map(([key, { label }]) => (
                <Option key={key} value={key}>{label}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="priority" label="Приоритет" rules={[{ required: true }]}>
            <Select>
              <Option value={1}>Высокий</Option>
              <Option value={2}>Средний</Option>
              <Option value={3}>Низкий</Option>
            </Select>
          </Form.Item>
          <Form.Item name="dueDate" label="Срок выполнения">
            <DatePicker format="DD.MM.YYYY" style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminRecommendationsPage;
