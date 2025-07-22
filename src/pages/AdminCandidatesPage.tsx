import React, { useState } from "react";
import {
  Card,
  Table,
  Typography,
  Button,
  Space,
  Modal,
  Tag,
  message,
  Descriptions,
  Popconfirm,
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  MailOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  useCandidates,
  useApproveCandidate,
  useRejectCandidate,
  useInviteCandidate,
  useDeleteCandidate,
} from "../queries/candidates";
import { CandidateStatus, type Candidate } from "../types/user";

const { Title } = Typography;

const getFullName = (candidate: Candidate) =>
  [candidate.lastName, candidate.firstName, candidate.middleName]
    .filter(Boolean)
    .join(" ") || "не указано";

const statusMap: Record<CandidateStatus, { color: string; text: string }> = {
  pending: { color: "warning", text: "Ожидает приглашения" },
  invited: { color: "processing", text: "Приглашён" },
  registered: { color: "success", text: "Зарегистрирован" },
  rejected: { color: "error", text: "Отклонён" },
};

export const AdminCandidatesPage: React.FC = () => {
  const { data: candidates = [], isLoading } = useCandidates();
  const [viewCandidate, setViewCandidate] = useState<Candidate | null>(null);
  const approveMutation = useApproveCandidate();
  const rejectMutation = useRejectCandidate();
  const inviteMutation = useInviteCandidate();
  const deleteMutation = useDeleteCandidate();

  const handleApprove = async (id: string) => {
    try {
      await approveMutation.mutateAsync(id);
      message.success("Кандидат одобрен и создан пользователь");
    } catch (e: any) {
      message.error(
        e?.response?.data?.message || "Ошибка при одобрении кандидата"
      );
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectMutation.mutateAsync(id);
      message.success("Кандидат отклонён");
    } catch (e: any) {
      message.error(
        e?.response?.data?.message || "Ошибка при отклонении кандидата"
      );
    }
  };

  const handleInvite = async (id: string) => {
    try {
      await inviteMutation.mutateAsync(id);
      message.success("Приглашение отправлено");
    } catch (e: any) {
      message.error(
        e?.response?.data?.message || "Ошибка при отправке приглашения"
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      message.success("Кандидат удалён");
    } catch (e: any) {
      message.error(
        e?.response?.data?.message || "Ошибка при удалении кандидата"
      );
    }
  };

  const columns = [
    {
      title: "ФИО",
      key: "fullName",
      render: (_: unknown, record: Candidate) => getFullName(record),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email: string) => email || "не указано",
    },
    {
      title: "Телефон",
      dataIndex: "phone",
      key: "phone",
      render: (phone: string) => phone || "не указано",
    },
    {
      title: "Учреждение",
      dataIndex: "organization",
      key: "organization",
      render: (org: string) => org || "не указано",
    },
    {
      title: "Должность",
      dataIndex: "position",
      key: "position",
      render: (pos: string) => pos || "не указано",
    },
    {
      title: "Роли",
      dataIndex: "proposedRoles",
      key: "proposedRoles",
      render: (roles: string[]) => (
        <>
          {roles.map((role) => {
            const roleMap = {
              admin: { color: "red", text: "Администратор" },
              expert: { color: "blue", text: "Эксперт" },
              author: { color: "green", text: "Автор" },
            };
            const roleInfo = roleMap[role as keyof typeof roleMap] || {
              color: "default",
              text: role,
            };
            return (
              <Tag key={role} color={roleInfo.color}>
                {roleInfo.text}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Статус",
      dataIndex: "status",
      key: "status",
      render: (status: CandidateStatus) => {
        const info = statusMap[status] || { color: "default", text: status };
        return <Tag color={info.color}>{info.text}</Tag>;
      },
    },
    {
      title: "Действия",
      key: "actions",
      render: (_: unknown, record: Candidate) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => setViewCandidate(record)}
          />
          {record.status === "pending" && (
            <Button
              type="primary"
              icon={<MailOutlined />}
              loading={inviteMutation.isPending}
              onClick={() => handleInvite(record.id)}
            />
          )}
          {record.status === "pending" && (
            <Button
              variant="solid"
              type="primary"
              color="green"
              icon={<CheckOutlined />}
              loading={approveMutation.isPending}
              onClick={() => handleApprove(record.id)}
            />
          )}
          {record.status === CandidateStatus.PENDING ||
          record.status === CandidateStatus.INVITED ? (
            <Button
              danger
              icon={<CloseOutlined />}
              loading={rejectMutation.isPending}
              onClick={() => handleReject(record.id)}
            />
          ) : null}
          <Popconfirm
            title="Удалить кандидата?"
            onConfirm={() => handleDelete(record.id)}
            okText="Да"
            cancelText="Нет"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              loading={deleteMutation.isPending}
            />
          </Popconfirm>
        </Space>
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
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 24,
        }}
      >
        <Title level={2}>Кандидаты в авторы</Title>
      </div>
      <Card>
        <Table
          rowKey="id"
          loading={isLoading}
          dataSource={candidates}
          columns={columns}
          pagination={false}
        />
      </Card>
      <Modal
        open={!!viewCandidate}
        onCancel={() => setViewCandidate(null)}
        title={viewCandidate ? getFullName(viewCandidate) : "Кандидат"}
        footer={null}
        width={600}
      >
        {viewCandidate && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Email">
              {viewCandidate.email}
            </Descriptions.Item>
            <Descriptions.Item label="Телефон">
              {viewCandidate.phone || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Организация">
              {viewCandidate.organization || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Должность">
              {viewCandidate.position || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Роли">
              {viewCandidate.proposedRoles &&
              viewCandidate.proposedRoles.length > 0
                ? viewCandidate.proposedRoles.map((r) => <Tag key={r}>{r}</Tag>)
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Комментарий">
              {viewCandidate.comment || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Статус">
              <Tag color={statusMap[viewCandidate.status]?.color || "default"}>
                {statusMap[viewCandidate.status]?.text || viewCandidate.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Создан">
              {new Date(viewCandidate.createdAt).toLocaleString("ru-RU")}
            </Descriptions.Item>
            <Descriptions.Item label="Обновлён">
              {new Date(viewCandidate.updatedAt).toLocaleString("ru-RU")}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};
