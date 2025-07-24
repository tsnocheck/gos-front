import React, { useState } from "react";
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
import { usePrograms } from "../queries/programs";
import { programService } from "../services/programService";
import { type Program, ProgramStatus } from "../types/program";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAssignExpertToProgram } from "../queries/expertises";
import { useUsersByRole } from "../queries/admin";
import { UserRole } from "../types";

const { Title } = Typography;

export const AdminProgramsPage: React.FC = () => {
  const { data: programs, isLoading } = usePrograms();
  const assignExpertToProgramMutation = useAssignExpertToProgram()
  const { data: availableExperts } = useUsersByRole(UserRole.EXPERT)
  
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [viewProgram, setViewProgram] = useState<Program | null>(null);

  const handleAssignExpertToProgram = async () => {
    if (!viewProgram) return;

    await assignExpertToProgramMutation.mutateAsync({ programId: viewProgram.id, expertId: '' })
  }

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
      title: "Номер",
      dataIndex: "programCode",
      key: "programCode",
    },
    {
      title: "Название",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Предмет",
      dataIndex: "competencies",
      key: "competencies",
      render: (val: string) => val || "-",
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
      dataIndex: "coauthors",
      key: "coauthors",
      render: (_: any, record: Program) => record.competencies || "-", // TODO: заменить на реальных соавторов, если появятся
    },
    {
      title: "Статус",
      dataIndex: "status",
      key: "status",
      render: (status: ProgramStatus) => {
        const statusMap = new Map([
          [ProgramStatus.ARCHIVED, { color: "default", text: "Архивирован" }],
          [ProgramStatus.DRAFT, { color: "default", text: "Черновик" }],
          [
            ProgramStatus.IN_REVIEW,
            { color: "processing", text: "На рассмотрении" },
          ],
          [ProgramStatus.APPROVED, { color: "success", text: "Одобрено" }],
          [ProgramStatus.REJECTED, { color: "error", text: "Отклонено" }],
        ]);
        const statusInfo = statusMap.get(status) || {
          color: "default",
          text: status,
        };
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
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
