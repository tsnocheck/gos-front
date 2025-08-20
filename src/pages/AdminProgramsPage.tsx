import React, { useCallback, useState } from "react";
import {
  Card,
  Table,
  Button,
  Typography,
  Space,
  Modal,
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
import { useUsers } from "../queries/admin";
import { ProgramPDFViewer } from "@/components/pdf/program/ProgramPDFViewer";
import type { ColumnsType } from "antd/es/table";

const { Title } = Typography;

export const AdminProgramsPage: React.FC = () => {
  const { data: programs, isLoading } = usePrograms();
  const { data: users = [] } = useUsers();

  const queryClient = useQueryClient();

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [viewProgram, setViewProgram] = useState<Partial<CreateProgramForm> | null>(null);

  const getUserById = useCallback(
    (id: string) => users.find((user) => user.id === id),
    [users]
  );


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

  const columns: ColumnsType<Partial<CreateProgramForm>> = [
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
      render: (author?: Program["author"]) =>
        author ? `${author.lastName || ""} ${author.firstName || ""}` : "-",
    },
    {
      title: "Соавторы",
      key: "coauthors",
      render: (_, { coAuthorIds }: Partial<CreateProgramForm>) => {
        const authors = (coAuthorIds ?? []).map((id) => getUserById(id));

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
      render: (_, record: Program) => (
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
        width="90vw"
      >
        {viewProgram && (
          <ProgramPDFViewer
            program={viewProgram}
          />
        )}
      </Modal>
    </div>
  );
};
