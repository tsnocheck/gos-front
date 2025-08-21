import React, { useMemo, useState } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Typography,
  Space,
  message,
  Tag,
  Checkbox,
  Rate,
} from "antd";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import {
  ExpertiseStatus,
  type CompleteExpertiseDto,
  type Expertise,
} from "../types";
import {
  useCompleteExpertise,
  useMyExpertises,
  useUpdateExpertise,
} from "../queries/expertises.ts";
import { ProgramPDFViewer } from "@/components/pdf/program/ProgramPDFViewer";

const statusMap: Record<ExpertiseStatus, { text: string; color: string }> = {
  [ExpertiseStatus.PENDING]: { text: "Ожидает экспертизы", color: "default" },
  [ExpertiseStatus.IN_PROGRESS]: { text: "В процессе", color: "blue" },
  [ExpertiseStatus.COMPLETED]: { text: "Завершена", color: "purple" },
  [ExpertiseStatus.APPROVED]: { text: "Одобрено", color: "green" },
  [ExpertiseStatus.REJECTED]: { text: "Отклонено", color: "red" },
};

const { Title, Text } = Typography;
// const { Option } = Select;

// const criteriaNames = {
//   "1": "Актуальность программы",
//   "2": "Соответствие нормативным требованиям",
//   "3": "Качество содержания",
//   "4": "Методическая обоснованность",
//   "5": "Практическая направленность",
//   "6": "Инновационность",
//   "7": "Ресурсное обеспечение",
//   "8": "Технологичность",
//   "9": "Оценочные материалы",
//   "10": "Структурированность",
//   "11": "Логическая последовательность",
//   "12": "Завершенность",
//   "13": "Применимость результатов",
// };

export const ExpertisePage: React.FC = () => {
  const [selectedExpertiseId, setSelectedExpertiseId] = useState<string | null>(
    null
  );
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [form] = Form.useForm();

  const { data: expertises, isLoading } = useMyExpertises();
  const updateExpertiseMutation = useUpdateExpertise();
  const completeExpertiseMutation = useCompleteExpertise();

  const selectedExpertise = useMemo(
    () => expertises?.data.find((e) => e.id === selectedExpertiseId),
    [expertises, selectedExpertiseId]
  );

  const columns = [
    {
      title: "Название программы",
      dataIndex: ["program", "title"],
      key: "title",
      render: (_: string, record: Expertise) => (
        <div>
          <div>{record.program?.title}</div>
          <Text type="secondary">{record.program?.author?.email}</Text>
        </div>
      ),
    },
    {
      title: "Номер программы",
      dataIndex: ["program", "programCode"],
      key: "programCode",
      render: (_: string, record: Expertise) =>
        record.program?.programCode ?? "-",
    },
    {
      title: "Длительность",
      dataIndex: ["program", "duration"],
      key: "duration",
      render: (_: number, record: Expertise) =>
        `${record.program?.duration ?? "-"} ч.`,
    },
    {
      title: "Статус экспертизы",
      dataIndex: "status",
      key: "status",
      render: (status: Expertise["status"]) => {
        const { text, color } = statusMap[status as ExpertiseStatus] || {
          text: status,
          color: "default",
        };
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Создана",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (_: string, record: Expertise) =>
        record.createdAt
          ? new Date(record.createdAt as unknown as string).toLocaleDateString(
              "ru-RU"
            )
          : "-",
    },
    {
      title: "Действия",
      key: "actions",
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
              form.setFieldsValue({
                generalFeedback: record.generalFeedback,
                recommendations: record.recommendations,
                conclusion: record.conclusion,
                relevanceScore: record.relevanceScore,
                contentQualityScore: record.contentQualityScore,
                methodologyScore: record.methodologyScore,
                practicalValueScore: record.practicalValueScore,
                innovationScore: record.innovationScore,
                expertComments: record.expertComments,
                isRecommendedForApproval: record.isRecommendedForApproval,
              });
            }}
          >
            Экспертиза
          </Button>
        </Space>
      ),
    },
  ];

  const handleUpdateExpertise = async (values: Record<string, unknown>) => {
    if (!selectedExpertise) return;
    try {
      await updateExpertiseMutation.mutateAsync({
        id: selectedExpertise.id,
        data: values,
      });
      message.success("Изменения сохранены");
      setIsEditOpen(false);
    } catch {
      message.error("Не удалось сохранить изменения");
    }
  };

  const handleCompleteExpertise = async (values: CompleteExpertiseDto) => {
    if (!selectedExpertise) return;
    try {
      await completeExpertiseMutation.mutateAsync({
        id: selectedExpertise.id,
        data: values,
      });
      message.success("Экспертиза завершена");
      setIsEditOpen(false);
    } catch {
      message.error("Не удалось завершить экспертизу");
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
          pagination={{
            total: expertises?.total,
            pageSize: expertises?.limit,
            current: expertises?.page,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} из ${total} экспертиз`,
          }}
        />
      </Card>

      {/* Модальное окно предпросмотра PDF */}
      <Modal
        title={`Просмотр программы: ${selectedExpertise?.program?.title ?? ""}`}
        open={isPreviewOpen && !!selectedExpertise}
        onCancel={() => setIsPreviewOpen(false)}
        footer={null}
        width="90vw"
      >
        {selectedExpertise?.program && (
          <ProgramPDFViewer program={selectedExpertise.program} />
        )}
      </Modal>

      {/* Модальное окно редактирования экспертизы */}
      <Modal
        title={`Экспертиза: ${selectedExpertise?.program?.title ?? ""}`}
        open={isEditOpen}
        onCancel={() => setIsEditOpen(false)}
        width={800}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdateExpertise}>
          <Form.Item name="generalFeedback" label="Общий отзыв">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="recommendations" label="Рекомендации">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="conclusion" label="Заключение">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="expertComments" label="Комментарии эксперта">
            <Input.TextArea rows={3} />
          </Form.Item>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <Form.Item name="relevanceScore" label="Актуальность (0-10)">
              <Rate count={10} />
            </Form.Item>
            <Form.Item
              name="contentQualityScore"
              label="Качество содержания (0-10)"
            >
              <Rate count={10} />
            </Form.Item>
            <Form.Item name="methodologyScore" label="Методология (0-10)">
              <Rate count={10} />
            </Form.Item>
            <Form.Item
              name="practicalValueScore"
              label="Практическая ценность (0-10)"
            >
              <Rate count={10} />
            </Form.Item>
            <Form.Item name="innovationScore" label="Инновационность (0-10)">
              <Rate count={10} />
            </Form.Item>
            <Form.Item name="isRecommendedForApproval" valuePropName="checked">
              <Checkbox>Рекомендуется к одобрению</Checkbox>
            </Form.Item>
          </div>

          <Form.Item>
            <Space>
              {selectedExpertise?.status !== ExpertiseStatus.APPROVED && (
                <>
                  <Button
                    type="primary"
                    onClick={() => handleUpdateExpertise(form.getFieldsValue())}
                  >
                    Сохранить
                  </Button>
                  <Button
                    type="primary"
                    variant="solid"
                    color="green"
                    onClick={() =>
                      handleCompleteExpertise(form.getFieldsValue())
                    }
                  >
                    Завершить экспертизу
                  </Button>
                </>
              )}
              <Button onClick={() => setIsEditOpen(false)}>Закрыть</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
