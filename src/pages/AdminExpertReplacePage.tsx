import React, { useState } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Select,
  Typography,
  Space,
  Tag,
  message,
} from "antd";
import { useExpertisesForReplacement, useReplaceExpert } from "../queries/expertises";
import { useUsersByRole } from "../queries/admin";
import { UserRole } from "../types";
import type { Expertise, User } from "../types";

const { Title } = Typography;
const { Option } = Select;

export const AdminExpertReplacePage: React.FC = () => {
  const { data: expertises, isLoading } = useExpertisesForReplacement();
  const [selectedExpertise, setSelectedExpertise] = useState<Expertise | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newExpertId, setNewExpertId] = useState<string | undefined>(undefined);
  const { data: experts, isLoading: isExpertsLoading } = useUsersByRole(UserRole.EXPERT);
  const replaceExpertMutation = useReplaceExpert();

  const openModal = (expertise: Expertise) => {
    setSelectedExpertise(expertise);
    setModalOpen(true);
    setNewExpertId(undefined);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedExpertise(null);
    setNewExpertId(undefined);
  };

  const handleReplace = async () => {
    if (!selectedExpertise || !newExpertId) return;
    try {
      await replaceExpertMutation.mutateAsync({
        expertiseId: selectedExpertise.id,
        oldExpertId: selectedExpertise.expertId,
        newExpertId,
      });
      message.success("Эксперт успешно заменён");
      closeModal();
    } catch (e: any) {
      message.error(e?.response?.data?.message || "Ошибка при замене эксперта");
    }
  };

  const columns = [
    {
      title: "Программа",
      dataIndex: ["program", "title"],
      key: "programTitle",
      render: (_: any, record: Expertise) => record.program?.title || "-",
    },
    {
      title: "Эксперт",
      dataIndex: ["expert", "email"],
      key: "expertEmail",
      render: (_: any, record: Expertise) => {
        const expert = record.expert;
        return expert
          ? `${expert.lastName || ""} ${expert.firstName || ""} (${expert.email})`
          : "-";
      },
    },
    {
      title: "Статус",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const statusMap: Record<string, { color: string; text: string }> = {
          pending: { color: "warning", text: "Ожидает экспертизы" },
          in_progress: { color: "processing", text: "В процессе" },
          completed: { color: "success", text: "Завершена" },
          approved: { color: "success", text: "Одобрена" },
          rejected: { color: "error", text: "Отклонена" },
        };
        const info = statusMap[status] || { color: "default", text: status };
        return <Tag color={info.color}>{info.text}</Tag>;
      },
    },
    {
      title: "Действия",
      key: "actions",
      render: (_: any, record: Expertise) => (
        <Button type="primary" onClick={() => openModal(record)}>
          Заменить эксперта
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <Title level={2}>Замена эксперта</Title>
      </div>
      <Card>
        <Table
          columns={columns}
          dataSource={expertises as Expertise[] || []}
          loading={isLoading}
          rowKey="id"
          pagination={false}
        />
      </Card>
      <Modal
        open={modalOpen}
        onCancel={closeModal}
        title="Замена эксперта"
        onOk={handleReplace}
        okButtonProps={{ disabled: !newExpertId || replaceExpertMutation.isPending }}
        okText="Заменить"
        cancelText="Отмена"
        confirmLoading={replaceExpertMutation.isPending}
        destroyOnHidden
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <div>
            <b>Текущий эксперт:</b> {selectedExpertise?.expert ? `${selectedExpertise.expert.lastName || ""} ${selectedExpertise.expert.firstName || ""} (${selectedExpertise.expert.email})` : "-"}
          </div>
          <div>
            <b>Выберите нового эксперта:</b>
            <Select
              showSearch
              style={{ width: "100%" }}
              placeholder="Выберите эксперта"
              value={newExpertId}
              onChange={setNewExpertId}
              loading={isExpertsLoading}
              filterOption={(input, option) =>
                String(option?.children ?? '').toLowerCase().includes(input.toLowerCase())
              }
            >
              {experts?.filter((u: User) => u.id !== selectedExpertise?.expertId).map((user: User) => (
                <Option key={user.id} value={user.id}>
                  {`${user.lastName || ""} ${user.firstName || ""} (${user.email})`}
                </Option>
              ))}
            </Select>
          </div>
        </Space>
      </Modal>
    </div>
  );
}; 