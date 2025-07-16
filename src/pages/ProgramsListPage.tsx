import React from 'react';
import { Card, Table, Button, Typography, Space, Tag } from 'antd';
import { PlusOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { usePrograms } from '../queries/programs';
import type { Program } from '../types';

const { Title } = Typography;

export const ProgramsListPage: React.FC = () => {
  const { data: programs, isLoading } = usePrograms();

  const columns = [
    {
      title: 'Название',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          'draft': { color: 'default', text: 'Черновик' },
          'submitted': { color: 'processing', text: 'На рассмотрении' },
          'approved': { color: 'success', text: 'Одобрено' },
          'rejected': { color: 'error', text: 'Отклонено' },
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
      render: (_: any, record: Program) => (
        <Space>
          <Button icon={<EyeOutlined />} size="small">
            Просмотр
          </Button>
          <Button icon={<EditOutlined />} size="small">
            Редактировать
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>Мои программы</Title>
        <Link to="/programs/constructor">
          <Button type="primary" icon={<PlusOutlined />}>
            Создать программу
          </Button>
        </Link>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={programs?.data || []}
          loading={isLoading}
          rowKey="id"
          pagination={{
            total: programs?.total,
            pageSize: programs?.limit,
            current: programs?.page,
            showSizeChanger: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} из ${total} программ`,
          }}
        />
      </Card>
    </div>
  );
};
