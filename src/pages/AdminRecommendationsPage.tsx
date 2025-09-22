import React, { useState } from 'react';
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Typography,
  message,
  Popconfirm,
  Tag,
} from 'antd';
import type { Recommendation } from '@/types';
import { RecommendationStatus } from '@/types';
import { RecommendationField, recommendationFieldTranslations } from '@/types/recommendation';
import {
  useRecommendations,
  useCreateRecommendation,
  useUpdateRecommendation,
  useDeleteRecommendation,
} from '../queries/recommendations';
import dayjs from 'dayjs';
import type { TableProps } from 'antd';
import type { CreateRecommendationPayload } from '@/services/recommendationService.ts';

const { Title } = Typography;
const { Option } = Select;

// Build options from RecommendationField enum and translations
const recommendationFieldOptions = Object.values(RecommendationField) as RecommendationField[];

const statusLabels: Record<RecommendationStatus, { color: string; label: string }> = {
  [RecommendationStatus.ACTIVE]: { color: 'blue', label: 'Активная' },
  [RecommendationStatus.RESOLVED]: { color: 'green', label: 'Выполнена' },
  [RecommendationStatus.INACTIVE]: { color: 'orange', label: 'Неактивная' },
  [RecommendationStatus.ARCHIVED]: { color: 'gray', label: 'В архиве' },
};

const AdminRecommendationsPage: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<Recommendation | null>(null);
  const [form] = Form.useForm();

  const [sortBy, setSortBy] = useState<string | undefined>('createdAt');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC' | undefined>('DESC');

  const { data, isLoading } = useRecommendations({ sortBy, sortOrder });
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
      if (editing) {
        // Update: send only allowed fields for update
        const updatePayload: Record<string, any> = {};
        if (values.title !== undefined) updatePayload.title = values.title;
        if (values.content !== undefined) updatePayload.content = values.content;
        if (values.type !== undefined) updatePayload.type = values.type;
        if (values.status !== undefined) updatePayload.status = values.status;

        await updateMutation.mutateAsync({ id: editing.id, data: updatePayload });
        message.success('Рекомендация обновлена');
      } else {
        // Create: backend accepts title, content, optional type and assignedToId
        const createPayload: CreateRecommendationPayload = {
          title: values.title,
          content: values.content,
        };
        if (values.type) createPayload.type = values.type;

        await createMutation.mutateAsync(createPayload);
        message.success('Рекомендация создана');
      }

      handleCloseModal();
    } catch {
      message.error('Ошибка при сохранении');
    }
  };

  const columns = [
    { title: 'Заголовок', dataIndex: 'title', key: 'title', sorter: true },
    {
      title: 'Тип',
      dataIndex: 'type',
      key: 'type',
      sorter: true,
      render: (val: Recommendation['type']) => {
        // val is a RecommendationField value (string enum)
        return recommendationFieldTranslations[val as RecommendationField] ?? String(val);
      },
    },
    {
      title: 'Создал',
      dataIndex: ['createdBy'],
      key: 'createdBy',
      render: (_: any, record: Recommendation) => {
        const user = record.createdBy;
        if (!user) return '—';
        return `${user.lastName ?? ''} ${user.firstName ?? ''}`.trim() || user.id;
      },
    },
    {
      title: 'Дата создания',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      render: (val: string | Date) => (val ? dayjs(val).format('DD.MM.YYYY') : '—'),
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      render: (val: RecommendationStatus) => {
        const { label, color } = statusLabels[val];
        return <Tag color={color}>{label}</Tag>;
      },
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

  const handleTableChange: TableProps<Recommendation>['onChange'] = (
    _pagination,
    _filters,
    sorter,
  ) => {
    const order = Array.isArray(sorter) ? sorter[0]?.order : sorter?.order;
    const field = Array.isArray(sorter)
      ? (sorter[0]?.field as string | undefined)
      : (sorter?.field as string | undefined);
    setSortBy(field || undefined);
    setSortOrder(order === 'ascend' ? 'ASC' : order === 'descend' ? 'DESC' : undefined);
  };

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
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
          onChange={handleTableChange}
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
          <Form.Item
            name="title"
            label="Заголовок"
            rules={[{ required: true, message: 'Введите заголовок' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="content"
            label="Содержание"
            rules={[{ required: true, message: 'Введите содержание' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="type" label="Тип рекомендации" rules={[{ required: true }]}>
            <Select placeholder="Выберите тип">
              {recommendationFieldOptions.map((field) => (
                <Option key={field} value={field}>
                  {recommendationFieldTranslations[field]}
                </Option>
              ))}
            </Select>
          </Form.Item>
          {/* Status is editable only when editing an existing recommendation */}
          {editing && (
            <Form.Item name="status" label="Статус рекомендации" rules={[{ required: true }]}>
              <Select>
                {Object.entries(statusLabels).map(([key, { label }]) => (
                  <Option key={key} value={key}>
                    {label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default AdminRecommendationsPage;
