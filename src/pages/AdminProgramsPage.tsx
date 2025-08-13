import React, { useCallback, useState } from "react";
import {
  Card,
  Table,
  Button,
  Typography,
  Space,
  Modal,
  Descriptions,
  Tooltip,
  Tag,
} from "antd";
import { EyeOutlined, DeleteOutlined, InboxOutlined } from "@ant-design/icons";
import {
  getStatusColor,
  getStatusText,
  usePrograms,
} from "../queries/programs";
import { programService } from "../services/programService";
import {
  type CreateProgramForm,
  type Program,
  ProgramStatus,
} from "../types/program";
import { useQueryClient } from "@tanstack/react-query";
import { useAssignExpertToProgram } from "../queries/expertises";
import { useUsers } from "../queries/admin";

const { Title } = Typography;

export const AdminProgramsPage: React.FC = () => {
  const { data: programs, isLoading } = usePrograms();
  const assignExpertToProgramMutation = useAssignExpertToProgram();
  const { data: users = [] } = useUsers();

  const queryClient = useQueryClient();

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [viewProgram, setViewProgram] = useState<Program | null>(null);

  const getUserById = useCallback(
    (id: string) => users.find((user) => user.id === id),
    [users]
  );

  const handleAssignExpertToProgram = async () => {
    if (!viewProgram) return;

    await assignExpertToProgramMutation.mutateAsync({
      programId: viewProgram.id,
      expertId: "",
    });
  };

  // Архивирование и разархивирование
  const handleArchiveToggle = async (program: Program, checked: boolean) => {
    if (checked) {
      await programService.archiveProgram(program.id);
    } else {
      await programService.unarchiveProgram(program.id);
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

  const columns = [
    {
      title: "Название",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Версия",
      dataIndex: "version",
      key: "version",
    },
    {
      title: "Автор",
      dataIndex: ["author"],
      key: "author",
      render: (author: any) =>
        author ? `${author.lastName || ""} ${author.firstName || ""}` : "-",
    },
    {
      title: "Соавторы",
      key: "coauthors",
      render: (_: any, record: CreateProgramForm) => {
        const authors = [record.author1Id, record.author2Id].map((id) =>
          getUserById(id || "")
        );

        return authors.reduce(
          (acc, author) =>
            author
              ? acc + `${author?.lastName} ${author?.firstName}\n`
              : acc + "",
          ""
        );
      },
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
      key: "actions",
      render: (_: any, record: Program) => (
        <Button
          icon={<EyeOutlined />}
          size="small"
          onClick={() => setViewProgram(record)}
        >
          Просмотр
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
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
            getCheckboxProps: (record: Program) => ({
              checked: record.status === ProgramStatus.ARCHIVED,
            }),
          }}
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
      <Modal
        open={!!viewProgram}
        onCancel={() => setViewProgram(null)}
        title={viewProgram?.title}
        footer={null}
        width={800}
      >
        {viewProgram && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Номер">
              {viewProgram.programCode}
            </Descriptions.Item>
            <Descriptions.Item label="Название">
              {viewProgram.title}
            </Descriptions.Item>
            <Descriptions.Item label="Предмет">
              {viewProgram.competencies || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Версия">
              {viewProgram.version}
            </Descriptions.Item>
            <Descriptions.Item label="Автор">
              {viewProgram.author?.lastName} {viewProgram.author?.firstName}
            </Descriptions.Item>
            <Descriptions.Item label="Соавторы">-</Descriptions.Item>
            <Descriptions.Item label="Экспертизы">
              {viewProgram.expertises && viewProgram.expertises.length > 0 ? (
                <ul>
                  {viewProgram.expertises.map((exp) => (
                    <li key={exp.id}>
                      <b>
                        {exp.expert?.lastName} {exp.expert?.firstName}:
                      </b>{" "}
                      {exp.conclusion || "-"}
                    </li>
                  ))}
                </ul>
              ) : (
                "Нет данных"
              )}
            </Descriptions.Item>
            <Descriptions.Item label="PDF">
              <Tooltip title="Скачивание PDF пока не реализовано">
                <Button disabled>Скачать PDF</Button>
              </Tooltip>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};
