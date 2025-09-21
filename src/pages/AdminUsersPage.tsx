import React, { useState } from 'react';
import {
  Button,
  Card,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import {
  AlertOutlined,
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { type User, UserStatus } from '../types';
import { useAdmin } from '../hooks/useAdmin.ts';
import { useUsers } from '../queries/admin.ts';
import type { TableProps } from 'antd';

const { Title } = Typography;
const { Option } = Select;

export const AdminUsersPage: React.FC = () => {
  const [sortBy, setSortBy] = useState<string | undefined>('lastName');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC' | undefined>('ASC');

  const { data: users, isLoading } = useUsers({ sortBy, sortOrder });
  const {
    activateUser,
    deactivateUser,
    createUser,
    deleteUser,
    updateUser,
    archiveUser,
    unarchiveUser,
    sendInvitation,
  } = useAdmin();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: true,
    },
    {
      title: 'ФИО',
      key: 'fullName',
      sorter: true,
      render: (record: User) =>
        `${record.lastName || ''} ${record.firstName || ''} ${record.middleName || ''}`.trim() ||
        'Не указано',
    },
    {
      title: 'Роли',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles: string[]) => (
        <>
          {roles.map((role) => {
            const roleMap = {
              admin: { color: 'red', text: 'Администратор' },
              expert: { color: 'blue', text: 'Эксперт' },
              author: { color: 'green', text: 'Автор' },
            };
            const roleInfo = roleMap[role as keyof typeof roleMap] || {
              color: 'default',
              text: role,
            };
            return (
              <Tag key={role} color={roleInfo.color}>
                {roleInfo.text}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          active: { color: 'success', text: 'Активен' },
          inactive: { color: 'warning', text: 'Неактивен' },
          archived: { color: 'default', text: 'Архивирован' },
        };
        const statusInfo = statusMap[status as keyof typeof statusMap] || {
          color: 'default',
          text: status,
        };
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      },
    },
    {
      title: 'Дата создания',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      render: (date: string) => new Date(date).toLocaleDateString('ru-RU'),
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: any, record: User) => (
        <Space style={{ display: 'flex', justifyContent: 'center' }}>
          <Button icon={<EditOutlined />} onClick={() => handleEditUser(record)}>
            Редактировать
          </Button>
          {record.status === 'active' ? (
            <Button icon={<StopOutlined />} onClick={() => handleDeactivateUser(record.id)}>
              Деактивировать
            </Button>
          ) : (
            <Button icon={<CheckOutlined />} onClick={() => handleActivateUser(record.id)}>
              Активировать
            </Button>
          )}
          <Button danger icon={<DeleteOutlined />} onClick={() => handleDeleteUser(record.id)}>
            Удалить
          </Button>
        </Space>
      ),
    },
  ];

  const handleTableChange: TableProps<User>['onChange'] = (_pagination, _filters, sorter) => {
    const order = Array.isArray(sorter) ? sorter[0]?.order : sorter?.order;
    const field = Array.isArray(sorter)
      ? (sorter[0]?.field as string | undefined)
      : (sorter?.field as string | undefined);
    setSortBy(field || undefined);
    setSortOrder(order === 'ascend' ? 'ASC' : order === 'descend' ? 'DESC' : undefined);
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setIsCreateModalOpen(true);
    form.resetFields();
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsCreateModalOpen(true);
    form.setFieldsValue({ ...user });
  };

  const handleSubmitUser = async (values: any) => {
    try {
      if (editingUser) {
        await updateUser(editingUser.id, values);
        message.success('Пользователь успешно обновлен!');
      } else {
        await createUser(values);
        message.success('Пользователь успешно создан!');
      }
      setIsCreateModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error('Ошибка при сохранении пользователя');
    }
  };

  const handleArchiveUser = async () => {
    try {
      if (!editingUser) return;

      switch (editingUser?.status) {
        case UserStatus.ARCHIVED:
          {
            await unarchiveUser(editingUser.id);
            message.success('Пользователь убран из архива');
          }
          break;
        default: {
          await archiveUser(editingUser?.id);
          message.success('Пользователь архивирован');
        }
      }
      setIsCreateModalOpen(false);
    } catch {
      message.error('Ошибка при архивации пользователя');
    }
  };

  const handleActivateUser = async (userId: string) => {
    try {
      await activateUser(userId);
      message.success('Пользователь активирован');
    } catch (error) {
      message.error('Ошибка при активации пользователя');
    }
  };

  const handleDeactivateUser = async (userId: string) => {
    try {
      await deactivateUser(userId);
      message.success('Пользователь деактивирован');
    } catch (error) {
      message.error('Ошибка при деактивации пользователя');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    Modal.confirm({
      title: 'Подтверждение удаления',
      content: 'Вы уверены, что хотите удалить этого пользователя?',
      okText: 'Удалить',
      cancelText: 'Отмена',
      onOk: async () => {
        try {
          await deleteUser(userId);
          message.success('Пользователь удален');
        } catch (error) {
          message.error('Ошибка при удалении пользователя');
        }
      },
    });
  };

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
          flexWrap: 'wrap',
          marginBottom: 24,
        }}
      >
        <Title level={2}>Управление пользователями</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateUser}>
          Создать пользователя
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={users}
          loading={isLoading}
          rowKey="id"
          onChange={handleTableChange}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} из ${total} пользователей`,
          }}
        />
      </Card>

      {/* Модальное окно создания/редактирования */}
      <Modal
        title={editingUser ? 'Редактирование пользователя' : 'Создание пользователя'}
        open={isCreateModalOpen}
        onCancel={() => {
          setIsCreateModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmitUser}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Введите email' },
              { type: 'email', message: 'Некорректный email' },
            ]}
          >
            <Input />
          </Form.Item>

          {!editingUser && (
            <Form.Item
              name="password"
              label="Пароль"
              rules={[
                { required: true, message: 'Введите пароль' },
                {
                  min: 6,
                  message: 'Пароль должен содержать минимум 6 символов',
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
          )}

          <Form.Item name="lastName" label="Фамилия">
            <Input />
          </Form.Item>

          <Form.Item name="firstName" label="Имя">
            <Input />
          </Form.Item>

          <Form.Item name="middleName" label="Отчество">
            <Input />
          </Form.Item>

          <Form.Item name="phone" label="Телефон">
            <Input />
          </Form.Item>

          <Form.Item name="position" label="Должность">
            <Input />
          </Form.Item>

          <Form.Item name="workplace" label="Место работы">
            <Input />
          </Form.Item>

          <Form.Item name="department" label="Подразделение">
            <Input />
          </Form.Item>

          <Form.Item
            name="roles"
            label="Роли"
            rules={[{ required: true, message: 'Выберите роли' }]}
          >
            <Select mode="multiple" placeholder="Выберите роли">
              <Option value="admin">Администратор</Option>
              <Option value="expert">Эксперт</Option>
              <Option value="author">Автор</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="Статус"
            rules={[{ required: true, message: 'Выберите статус' }]}
          >
            <Select>
              <Option value="active">Активен</Option>
              <Option value="inactive">Неактивен</Option>
              <Option value="archived">Архивирован</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space style={{ display: 'flex', flexWrap: 'wrap' }}>
              <Button type="primary" htmlType="submit">
                {editingUser ? 'Обновить' : 'Создать'}
              </Button>
              {editingUser && (
                <>
                  <Button
                    type={'primary'}
                    variant={'solid'}
                    color={'purple'}
                    icon={<AlertOutlined />}
                    onClick={() => sendInvitation(editingUser?.id)}
                  >
                    Сбросить пароль
                  </Button>
                  <Button type="default" icon={<DeleteOutlined />} onClick={handleArchiveUser}>
                    {editingUser.status !== UserStatus.ARCHIVED ? 'В архив' : 'Убрать из архива'}
                  </Button>
                </>
              )}
              <Button onClick={() => setIsCreateModalOpen(false)}>Отмена</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
