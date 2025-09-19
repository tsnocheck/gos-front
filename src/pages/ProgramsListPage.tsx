import React, { useState } from 'react';
import { Card, Table, Button, Typography, Tag, Space, message, Modal, Form, Input } from 'antd';
import {
  CheckOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  RollbackOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import {
  getStatusColor,
  getStatusText,
  useMyPrograms,
  useSubmitForExpertise,
} from '../queries/programs';
import { ProgramStatus, type Program, type User } from '@/types';
import type { ProgramQueryParams } from '@/services/programService';
import ViewProgramModal from '@/components/shared/ViewProgramModal';
import { useResubmitAfterRevision } from '@/queries/programs';
import type { TableProps } from 'antd';

const { Title, Text } = Typography;

export const ProgramsListPage: React.FC = () => {
  const [params, setParams] = useState<ProgramQueryParams>({
    page: 1,
    limit: 10,
    status: [
      ProgramStatus.DRAFT,
      ProgramStatus.IN_REVIEW,
      ProgramStatus.APPROVED,
      ProgramStatus.REJECTED,
      ProgramStatus.SUBMITTED,
    ],
    sortBy: 'createdAt',
    sortOrder: 'DESC',
  });

  const { data: programs, isLoading } = useMyPrograms(params);
  const [viewProgram, setViewProgram] = useState<Program | null>(null);
  const [resubmitOpen, setResubmitOpen] = useState(false);
  const [resubmitProgram, setResubmitProgram] = useState<Program | null>(null);
  const resubmitMutation = useResubmitAfterRevision();

  const submitForExpertiseMutation = useSubmitForExpertise();

  const handleSubmitForExpertise = async (id: string) => {
    try {
      await submitForExpertiseMutation.mutateAsync(id);
      message.success('Программа успешно отправлена на экспертизу');
    } catch {
      message.error('Не удалось отправить программу на экспертизу');
    }
  };

  const columns: TableProps<Program>['columns'] = [
    {
      title: 'Название',
      dataIndex: 'title',
      key: 'title',
      sorter: true,
    },
    {
      title: 'Автор',
      dataIndex: ['author'],
      key: 'author',
      render: (author: User) => {
        return (
          <div>
            <div>{author.lastName + ' ' + author.firstName}</div>
            <Text type="secondary">{author.email}</Text>
          </div>
        );
      },
    },
    {
      title: 'Версия',
      dataIndex: ['version'],
      key: 'version',
      sorter: true,
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
      dataIndex: 'id',
      key: 'actions',
      render: (id: string, data: Program) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => setViewProgram(data)}>
            Просмотр
          </Button>
          {data.status === ProgramStatus.REJECTED && (
            <>
              <Button
                icon={<InfoCircleOutlined />}
                onClick={() => {
                  Modal.info({
                    title: 'Причины отклонения',
                    content: (
                      <div style={{ whiteSpace: 'pre-wrap' }}>
                        {data.rejectionReason || 'Причины не указаны'}
                      </div>
                    ),
                    okText: 'Закрыть',
                  });
                }}
              >
                Причины
              </Button>
              <Button
                type="primary"
                icon={<RollbackOutlined />}
                onClick={() => {
                  setResubmitProgram(data);
                  setResubmitOpen(true);
                }}
              >
                Повторная отправка
              </Button>
            </>
          )}
          {[ProgramStatus.DRAFT, ProgramStatus.REJECTED].includes(data.status) && (
            <Button href={`/programs/constructor/${id}`} icon={<EditOutlined />}>
              Редактировать
            </Button>
          )}
          {[ProgramStatus.DRAFT, ProgramStatus.REJECTED].includes(data.status) && (
            <Button
              onClick={() => handleSubmitForExpertise(id)}
              icon={<CheckOutlined />}
              variant="solid"
              color="primary"
            >
              Отправить на экспертизу
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const handleTableChange: TableProps<Program>['onChange'] = (pagination, _filters, sorter) => {
    const order = Array.isArray(sorter) ? sorter[0]?.order : sorter?.order;
    const field = Array.isArray(sorter) ? (sorter[0]?.field as string | undefined) : (sorter?.field as string | undefined);

    setParams((prev) => ({
      ...prev,
      page: pagination.current || 1,
      limit: pagination.pageSize || prev.limit,
      sortBy: field || prev.sortBy,
      sortOrder: order === 'ascend' ? 'ASC' : order === 'descend' ? 'DESC' : prev.sortOrder,
    }));
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
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
          onChange={handleTableChange}
          pagination={{
            total: programs?.total,
            pageSize: programs?.limit || 10,
            current: params.page,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} из ${total} программ`,
            onChange: (page, pageSize) => setParams({ ...params, page, limit: pageSize }),
          }}
        />
      </Card>
      <ViewProgramModal
        open={!!viewProgram}
        program={viewProgram}
        onClose={() => setViewProgram(null)}
      />
      <Modal
        title={`Повторная отправка: ${resubmitProgram?.title ?? ''}`}
        open={resubmitOpen}
        onCancel={() => setResubmitOpen(false)}
        onOk={async () => {
          const formValues =
            (document.getElementById('resubmit-form') as any)?.__form?.getFieldsValue?.() || {};
          try {
            if (!resubmitProgram) return;
            await resubmitMutation.mutateAsync({
              id: resubmitProgram.id,
              data: formValues,
            });
            message.success('Программа повторно отправлена');
            setResubmitOpen(false);
          } catch {
            message.error('Не удалось повторно отправить программу');
          }
        }}
        okText="Отправить"
      >
        <Form id="resubmit-form" layout="vertical">
          <Form.Item
            name="revisionNotes"
            label="Что было исправлено"
            rules={[{ required: true, message: 'Опишите внесенные изменения' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="changesSummary" label="Краткое описание изменений">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
