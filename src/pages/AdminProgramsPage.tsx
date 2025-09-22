import React, { useCallback, useState } from 'react';
import { Card, Table, Button, Typography, Space, Tag } from 'antd';
import { EyeOutlined, DeleteOutlined, InboxOutlined } from '@ant-design/icons';
import { getStatusColor, getStatusText, usePrograms } from '../queries/programs';
import { programService } from '../services/programService';
import { type ExtendedProgram, type Program, ProgramStatus } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import { useUsers } from '../queries/admin';
import type { ColumnsType } from 'antd/es/table';
import type { TableProps } from 'antd';
import ProgramDetailsModal from '@/components/shared/ProgramDetailsModal.tsx';

const { Title } = Typography;

export const AdminProgramsPage: React.FC = () => {
  const [sortBy, setSortBy] = useState<string | undefined>('createdAt');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC' | undefined>('DESC');

  const { data: programs, isLoading } = usePrograms({ sortBy, sortOrder });
  const { data: users = [] } = useUsers();

  const queryClient = useQueryClient();

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [viewProgramId, setViewProgramId] = useState<string | null>(null);

  const getUserById = useCallback((id: string) => users.find((user) => user.id === id), [users]);

  // Архивирование и разархивирование
  const handleArchiveToggle = async (program: ExtendedProgram, checked: boolean) => {
    if (checked) {
      await programService.archiveProgram(program.id!);
    } else {
      await programService.unarchiveProgram(program.id!);
    }
    await queryClient.invalidateQueries();
  };

  // Массовое архивирование/разархивирование
  const handleBulkArchive = async (checked: boolean) => {
    for (const id of selectedRowKeys) {
      const program = (programs?.data || []).find((p) => p.id === id);
      if (program) {
        await handleArchiveToggle(program, checked);
      }
    }
    setSelectedRowKeys([]);
  };

  const columns: ColumnsType<ExtendedProgram> = [
    {
      title: 'Название',
      dataIndex: 'title',
      key: 'title',
      sorter: true,
    },
    {
      title: 'Версия',
      dataIndex: 'version',
      key: 'version',
      sorter: true,
    },
    {
      title: 'Автор',
      dataIndex: ['author'],
      key: 'author',
      render: (author?: Program['author']) =>
        author ? `${author.lastName || ''} ${author.firstName || ''}` : '-',
    },
    {
      title: 'Соавторы',
      key: 'coauthors',
      render: (_, { coAuthorIds }) => {
        const authors = (coAuthorIds ?? []).map((id) => getUserById(id));

        return authors.reduce(
          (acc, author) => (author ? acc + `${author?.lastName} ${author?.firstName}\n` : acc + ''),
          '',
        );
      },
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: ProgramStatus) => {
        return <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>;
      },
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record) => (
        <Button icon={<EyeOutlined />} size="small" onClick={() => setViewProgramId(record.id!)}>
          Просмотр
        </Button>
      ),
    },
  ];

  const handleTableChange: TableProps<ExtendedProgram>['onChange'] = (
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
        <Title level={2}>
          <InboxOutlined /> Программы ДПП ПК
        </Title>
        <Space>
          <Button
            type="primary"
            icon={<DeleteOutlined />}
            disabled={selectedRowKeys.length === 0}
            onClick={() => handleBulkArchive(true)}
          >
            В архив
          </Button>
          <Button
            type="default"
            disabled={selectedRowKeys.length === 0}
            onClick={() => handleBulkArchive(false)}
          >
            Из архива
          </Button>
        </Space>
      </div>
      <Card>
        <Table
          columns={columns}
          dataSource={programs?.data || []}
          loading={isLoading}
          rowKey="id"
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          onChange={handleTableChange}
          pagination={{
            total: programs?.total,
            pageSize: programs?.limit,
            current: programs?.page,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} из ${total} программ`,
          }}
        />
      </Card>
      <ProgramDetailsModal
        open={!!viewProgramId}
        programId={viewProgramId}
        onClose={() => setViewProgramId(null)}
      />
    </div>
  );
};
