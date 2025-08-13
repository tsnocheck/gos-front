import React, { useMemo, useState } from "react";
import { Card, Table, Button, Typography, Tag, Space, message } from "antd";
import { CheckOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import {
  getStatusColor,
  getStatusText,
  useMyPrograms,
  useSubmitForExpertise,
} from "../queries/programs";
import { ProgramStatus, type Program, type User } from "../types";
import type { ProgramQueryParams } from "@/services/programService";

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
  });

  const { data: programs, isLoading } = useMyPrograms(params);

  const submitForExpertiseMutation = useSubmitForExpertise();

  const handleSubmitForExpertise = async (id: string) => {
    try {
      await submitForExpertiseMutation.mutateAsync(id);
      message.success("Программа успешно отправлена на экспертизу");
    } catch {
      message.error("Не удалось отправить программу на экспертизу");
    }
  };

  const columns = [
    {
      title: "Название",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Автор",
      dataIndex: ["author"],
      key: "author",
      render: (author: User) => {
        return (
          <div>
            <div>{author.lastName + " " + author.firstName}</div>
            <Text type="secondary">{author.email}</Text>
          </div>
        );
      },
    },
    {
      title: "Версия",
      dataIndex: ["version"],
      key: "version",
    },
    {
      title: "Статус",
      dataIndex: "status",
      key: "status",
      render: (status: ProgramStatus) => {
        return (
          <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
        );
      },
    },
    {
      title: "Действия",
      dataIndex: "id",
      key: "actions",
      render: (id: string, data: Program) => (
        <Space>
          {[ProgramStatus.DRAFT, ProgramStatus.REJECTED].includes(
            data.status
          ) && (
            <Button
              href={`/programs/constructor/${id}`}
              icon={<EditOutlined />}
            >
              Редактировать
            </Button>
          )}
          {[ProgramStatus.DRAFT, ProgramStatus.REJECTED].includes(
            data.status
          ) && (
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

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
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
          pagination={{
            total: programs?.total,
            pageSize: programs?.limit || 10,
            current: params.page,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} из ${total} программ`,
            onChange: (page) => setParams({ ...params, page }),
          }}
        />
      </Card>
    </div>
  );
};
