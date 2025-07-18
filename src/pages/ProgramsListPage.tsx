import React from 'react';
import { Card, Table, Button, Typography, Space, Tag } from 'antd';
import { PlusOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { usePrograms } from '../queries/programs';
import { type Program, ProgramStatus } from '../types';

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
          title: 'Номер программы',
          dataIndex: ['programCode'],
          key: 'programCode',
          render: (code: string) => code,
      },
      {
          title: 'Автор',
          dataIndex: ['author', 'email'],
          key: 'title',
      },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: ProgramStatus) => {
          const statusMap = new Map([
              [ProgramStatus.DRAFT, { color: 'default', text: 'Черновик' }],
              [ProgramStatus.IN_REVIEW, { color: 'processing', text: 'На рассмотрении' }],
              [ProgramStatus.APPROVED, { color: 'success', text: 'Одобрено' }],
              [ProgramStatus.REJECTED, { color: 'error', text: 'Отклонено' }],
          ])
        const statusInfo = statusMap.get(status) || { color: 'default', text: status };
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      },
    },
    {
      title: 'Дата создания',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('ru-RU'),
    },
    // {
    //   title: 'Действия',
    //   key: 'actions',
    //   render: (_: any, record: Program) => (
    //     <Space>
    //       <Button icon={<EyeOutlined />} size="small">
    //         Просмотр
    //       </Button>
    //       <Button icon={<EditOutlined />} size="small">
    //         Редактировать
    //       </Button>
    //     </Space>
    //   ),
    // },
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
