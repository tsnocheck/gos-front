import React from 'react';
import {Button, Card, Space, Table, Tag, Typography} from 'antd';
import {CheckOutlined, DeleteOutlined} from '@ant-design/icons';
import {type User, UserStatus} from '../types';
import {useAdmin} from "../hooks/useAdmin.ts";
import {useUsers} from "../queries/admin.ts";

const { Title } = Typography;

export const AdminArchivePage: React.FC = () => {
  const { data: users, isLoading } = useUsers();
  const { unarchiveUser } = useAdmin();

  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'ФИО',
      key: 'fullName',
      render: (record: User) => 
        `${record.lastName || ''} ${record.firstName || ''} ${record.middleName || ''}`.trim() || 'Не указано',
    },
    {
      title: 'Роли',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles: string[]) => (
        <>
          {roles.map(role => {
            const roleMap = {
              'admin': { color: 'red', text: 'Администратор' },
              'expert': { color: 'blue', text: 'Эксперт' },
              'author': { color: 'green', text: 'Автор' },
            };
            const roleInfo = roleMap[role as keyof typeof roleMap] || { color: 'default', text: role };
            return <Tag key={role} color={roleInfo.color}>{roleInfo.text}</Tag>;
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
          'active': { color: 'success', text: 'Активен' },
          'inactive': { color: 'warning', text: 'Неактивен' },
          'archived': { color: 'default', text: 'Архивирован' },
        };
        const statusInfo = statusMap[status as keyof typeof statusMap] || { color: 'default', text: status };
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      },
    },
    {
      title: 'Дата создания',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('ru-RU'),
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: any, record: User) => (
        <Space style={{ display: 'flex', justifyContent: 'start' }}>
          <Button
              type={'primary'}
              onClick={() => unarchiveUser(record.id)}
            icon={<CheckOutlined />}
          >
            Убрать из архива
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
        <Title level={2}><DeleteOutlined /> Архив</Title>
      </div>
      
      <Card>
        <Table
          columns={columns}
          dataSource={users?.filter((item) => item.status === UserStatus.ARCHIVED)}
          loading={isLoading}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} из ${total} пользователей`,
          }}
        />
      </Card>
    </div>
  );
};
