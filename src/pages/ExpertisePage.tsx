import React, { useState } from "react";
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
} from "antd";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import { type Program, ProgramStatus } from "../types";
import {
  getStatusColor,
  getStatusText,
  useProgram,
} from "../queries/programs.ts";
import {
  useAvailablePrograms,
  useCreateExpertise,
} from "../queries/expertises.ts";
import { useAuth } from "../hooks/useAuth.ts";
import { ProgramPDFViewer } from "@/components/pdf/program/ProgramPDFViewer";

const { Title, Text } = Typography;
const { TextArea } = Input;
// const { Option } = Select;

const criteriaNames = {
  "1": "Актуальность программы",
  "2": "Соответствие нормативным требованиям",
  "3": "Качество содержания",
  "4": "Методическая обоснованность",
  "5": "Практическая направленность",
  "6": "Инновационность",
  "7": "Ресурсное обеспечение",
  "8": "Технологичность",
  "9": "Оценочные материалы",
  "10": "Структурированность",
  "11": "Логическая последовательность",
  "12": "Завершенность",
  "13": "Применимость результатов",
};

export const ExpertisePage: React.FC = () => {
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [isExpertiseModalOpen, setIsExpertiseModalOpen] = useState(false);
  const [form] = Form.useForm();

  const { user } = useAuth();

  const { data: programs, isLoading } = useAvailablePrograms();
  const { data: currentProgram } = useProgram(selectedProgram || "");
  const submitExpertiseMutation = useCreateExpertise();

  const columns = [
    {
      title: "Название программы",
      dataIndex: ["program", "title"],
      key: "title",
      render: (_: string, record: Program) => (
        <div>
          <div>{record.title}</div>
          <Text type="secondary">{record.author?.email}</Text>
        </div>
      ),
    },
    {
      title: "Номер программы",
      dataIndex: ["program", "programCode"],
      key: "programCode",
      render: (code: string) => code,
    },
    {
      title: "Длительность",
      dataIndex: ["program", "duration"],
      key: "duration",
      render: (_: number, record: Program) => `${record?.duration ?? "-"} ч.`,
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
      title: "Дата подачи",
      dataIndex: ["program", "submittedAt"],
      key: "submittedAt",
      render: (_: string, record: Program) =>
        record?.submittedAt
          ? new Date(record.submittedAt).toLocaleDateString("ru-RU")
          : "-",
    },
    {
      title: "Действия",
      key: "actions",
      render: (_: unknown, record: Program) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewProgram(record?.id || "")}
          >
            Просмотр
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleStartExpertise(record?.id || "")}
          >
            Экспертиза
          </Button>
        </Space>
      ),
    },
  ];

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  function handleViewProgram(programId: string) {
    setSelectedProgram(programId);
    setIsPreviewOpen(true);
  }

  function handleStartExpertise(programId: string) {
    setSelectedProgram(programId);
    setIsExpertiseModalOpen(true);
  }

  type FormValues = {
    criteria: Record<string, { score: number; comment?: string }>;
    recommendations?: string;
    conclusion: string;
  };
  const handleSubmitExpertise = async (values: FormValues) => {
    try {
      const expertiseData = {
        criteriaEvaluation: values.criteria,
        additionalRecommendations: values.recommendations,
        conclusion: values.conclusion,
      };

      await submitExpertiseMutation.mutateAsync({
        programId: currentProgram?.id,
        ...expertiseData,
        expertId: user.id,
      });
      message.success("Экспертиза успешно отправлена!");
      setIsExpertiseModalOpen(false);
      form.resetFields();
    } catch {
      message.error("Ошибка при отправке экспертизы");
    }
  };

  // Форма критериев будет добавлена при реализации шага завершения экспертизы

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Экспертиза программ ДПП ПК</Title>
      <Card>
        <Table
          columns={columns}
          dataSource={(programs as unknown as Program[]) || []}
          loading={isLoading}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} из ${total} программ`,
          }}
        />
      </Card>

      {/* Модальное окно предпросмотра PDF */}
      <Modal
        title={`Просмотр программы: ${
          currentProgram?.title ?? ""}`}
        open={isPreviewOpen && !!currentProgram}
        onCancel={() => setIsPreviewOpen(false)}
        footer={null}
        width="90vw"
      >
        {currentProgram && <ProgramPDFViewer program={currentProgram} />}
      </Modal>

      {/* Модальное окно создания экспертизы (назначение себе) */}
      <Modal
        title={`Экспертиза программы: ${currentProgram?.title}`}
        open={isExpertiseModalOpen}
        onCancel={() => {
          setIsExpertiseModalOpen(false);
          form.resetFields();
        }}
        width={800}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmitExpertise}>
          <Form.Item name="recommendations" label="Комментарий (необязательно)">
            <TextArea
              rows={4}
              placeholder="Комментарий к назначению экспертизы..."
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Назначить экспертизу
              </Button>
              <Button
                onClick={() => {
                  setIsExpertiseModalOpen(false);
                  form.resetFields();
                }}
              >
                Отмена
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
