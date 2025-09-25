import React, { useMemo, useState } from 'react';
import { Card, Table, Button, Typography, Space, message, Tag } from 'antd';
import { EyeOutlined, EditOutlined } from '@ant-design/icons';
import { ExpertiseStatus, type Expertise, type SubmitExpertiseDto } from '@/types';
import { useSubmitExpertise, useMyExpertises, useSendForRevision } from '../queries/expertises.ts';
import ViewProgramModal from '@/components/shared/ViewProgramModal';
import { ExpertiseFormModal } from '@/components/shared/ExpertiseFormModal';
import { ExpertisePDFDownloadButton } from '@/components/pdf/expertise';
import type { TableProps } from 'antd';

const statusMap: Record<ExpertiseStatus, { text: string; color: string }> = {
  [ExpertiseStatus.PENDING]: { text: 'Ожидает экспертизы', color: 'default' },
  [ExpertiseStatus.IN_PROGRESS]: { text: 'В процессе', color: 'blue' },
  [ExpertiseStatus.COMPLETED]: { text: 'Завершена', color: 'purple' },
  [ExpertiseStatus.APPROVED]: { text: 'Опубликована', color: 'green' },
  [ExpertiseStatus.REJECTED]: { text: 'Отклонено', color: 'red' },
};

const { Title, Text } = Typography;

export const ExpertisePage: React.FC = () => {
  const [selectedExpertiseId, setSelectedExpertiseId] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [sortBy, setSortBy] = useState<string | undefined>('createdAt');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC' | undefined>('DESC');

  const { data: expertises, isLoading } = useMyExpertises({ sortBy, sortOrder });
  const completeExpertiseMutation = useSubmitExpertise();
  const sendForRevisionMutation = useSendForRevision();

  const selectedExpertise = useMemo(
    () => expertises?.data.find((e) => e.id === selectedExpertiseId),
    [expertises, selectedExpertiseId],
  );

  const columns = [
    {
      title: 'Название программы',
      dataIndex: ['program', 'title'],
      key: 'title',
      sorter: true,
      render: (_: string, record: Expertise) => (
        <div>
          <div>{record.program?.title}</div>
          <Text type="secondary">{record.program?.author?.email}</Text>
        </div>
      ),
    },
    {
      title: 'Номер программы',
      dataIndex: ['program', 'programCode'],
      key: 'programCode',
      sorter: true,
      render: (_: string, record: Expertise) => record.program?.programCode ?? '-',
    },
    {
      title: 'Длительность',
      dataIndex: ['program', 'duration'],
      key: 'duration',
      sorter: true,
      render: (_: number, record: Expertise) => `${record.program?.duration ?? '-'} ч.`,
    },
    {
      title: 'Статус экспертизы',
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      render: (status: Expertise['status']) => {
        const { text, color } = statusMap[status as ExpertiseStatus] || {
          text: status,
          color: 'default',
        };
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Создана',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      render: (_: string, record: Expertise) =>
        record.createdAt
          ? new Date(record.createdAt as unknown as string).toLocaleDateString('ru-RU')
          : '-',
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: unknown, record: Expertise) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedExpertiseId(record.id);
              setIsPreviewOpen(true);
            }}
          >
            Просмотр
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedExpertiseId(record.id);
              setIsEditOpen(true);
            }}
          >
            Экспертиза
          </Button>
          {record.status === ExpertiseStatus.COMPLETED ? (
            <ExpertisePDFDownloadButton id={record.id} />
          ) : (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedExpertiseId(record.id);
                setIsEditOpen(true);
              }}
            >
              Экспертиза
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const handleTableChange: TableProps<Expertise>['onChange'] = (pagination, _filters, sorter) => {
    const order = Array.isArray(sorter) ? sorter[0]?.order : sorter?.order;
    const field = (Array.isArray(sorter) ? sorter[0]?.field : sorter?.field) as string | undefined;

    // keep pagination usage to avoid unused warning
    const _current = pagination?.current;
    const _pageSize = pagination?.pageSize;
    void _current;
    void _pageSize;

    setSortBy(field || undefined);
    setSortOrder(order === 'ascend' ? 'ASC' : order === 'descend' ? 'DESC' : undefined);
  };

  const handleCompleteExpertise = async (data: SubmitExpertiseDto) => {
    if (!selectedExpertise) return;
    try {
      await completeExpertiseMutation.mutateAsync({
        id: selectedExpertise.id,
        data,
      });
      message.success('Экспертиза завершена');
    } catch {
      message.error('Не удалось завершить экспертизу');
    }
  };

  const handleSendForRevision = async (data: { revisionComments: string }) => {
    if (!selectedExpertise) return;
    try {
      await sendForRevisionMutation.mutateAsync({
        id: selectedExpertise.id,
        body: data,
      });
      message.success('Отправлено на доработку');
    } catch {
      message.error('Не удалось отправить на доработку');
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Мои экспертизы</Title>
      <Card>
        <Table
          columns={columns}
          dataSource={expertises?.data || []}
          loading={isLoading}
          rowKey="id"
          onChange={handleTableChange}
          pagination={{
            total: expertises?.total,
            pageSize: expertises?.limit,
            current: expertises?.page,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} из ${total} экспертиз`,
          }}
        />
      </Card>

      {/* Модальное окно предпросмотра PDF */}
      <ViewProgramModal
        open={isPreviewOpen && !!selectedExpertise}
        programId={selectedExpertise?.program?.id ?? null}
        onClose={() => setIsPreviewOpen(false)}
      />

      {/* Новое модальное окно с табличной формой экспертизы */}
      <ExpertiseFormModal
        open={isEditOpen}
        expertise={selectedExpertise ?? null}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleCompleteExpertise}
        onSendForRevision={handleSendForRevision}
      />
    </div>
  );
};
