import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, Rate, Typography, Space, message, Tag, Row, Col } from 'antd';
import { EyeOutlined, EditOutlined } from '@ant-design/icons';
import {type Expertise, type ExpertiseForm, ExpertiseStatus} from '../types';
import { useExpertise, useExpertises } from '../queries/expertises';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const criteriaNames = {
  '1': 'Актуальность программы',
  '2': 'Соответствие нормативным требованиям',
  '3': 'Качество содержания',
  '4': 'Методическая обоснованность',
  '5': 'Практическая направленность',
  '6': 'Инновационность',
  '7': 'Ресурсное обеспечение',
  '8': 'Технологичность',
  '9': 'Оценочные материалы',
  '10': 'Структурированность',
  '11': 'Логическая последовательность',
  '12': 'Завершенность',
  '13': 'Применимость результатов'
};

export const ExpertisePage: React.FC = () => {
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [isExpertiseModalOpen, setIsExpertiseModalOpen] = useState(false);
  const [form] = Form.useForm();
  
  const { data: expertises, isLoading } = useExpertises();
  const { data: currentExpertise } = useExpertise(selectedProgram || '');

  const columns = [
    {
      title: 'Название программы',
      dataIndex: ['program', 'title'],
      key: 'title',
      render: (_: string, record: Expertise) => (
        <div>
          <div>{record.program?.title}</div>
          <Text type="secondary">{record.expert?.email}</Text>
        </div>
      ),
    },
    {
      title: 'Номер программы',
      dataIndex: ['program', 'programCode'],
      key: 'programCode',
      render: (code: string) => code,
    },
    {
      title: 'Длительность',
      dataIndex: ['program', 'duration'],
      key: 'duration',
      render: (_: number, record: Expertise) => `${record.program?.duration ?? '-'} ч.`,
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: ExpertiseStatus) => {
        const statusMap = {
          'draft': { color: 'default', text: 'Черновик' },
          [ExpertiseStatus.PENDING]: { color: 'warning', text: 'Ожидает экспертизы' },
          [ExpertiseStatus.IN_PROGRESS]: { color: 'processing', text: 'В процессе экспертизы' },
          [ExpertiseStatus.COMPLETED]: { color: 'success', text: 'Завершена' },
          [ExpertiseStatus.APPROVED]: { color: 'success', text: 'Одобрена' },
          [ExpertiseStatus.REJECTED]: { color: 'error', text: 'Отклонена' },
        };
        const statusInfo = statusMap[status] || { color: 'default', text: status };
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      },
    },
    {
      title: 'Дата подачи',
      dataIndex: ['program', 'submittedAt'],
      key: 'submittedAt',
      render: (_: string, record: Expertise) => record.program?.submittedAt ? new Date(record.program.submittedAt).toLocaleDateString('ru-RU') : '-',
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: unknown, record: Expertise) => (
        <Space>
          <Button 
            icon={<EyeOutlined />} 
            onClick={() => handleViewProgram(record.program?.id || '')}
          >
            Просмотр
          </Button>
          <Button 
            type="primary"
            icon={<EditOutlined />} 
            onClick={() => handleStartExpertise(record.program?.id || '')}
          >
            Экспертиза
          </Button>
        </Space>
      ),
    },
  ];

  function handleViewProgram(programId: string) {
    setSelectedProgram(programId);
    // Открыть модальное окно просмотра программы
  }

  function handleStartExpertise(programId: string) {
    setSelectedProgram(programId);
    setIsExpertiseModalOpen(true);
  }

  const handleSubmitExpertise = async (values: any) => {
    try {
      const expertiseData: ExpertiseForm = {
        criteriaEvaluation: values.criteria,
        additionalRecommendations: values.recommendations,
        conclusion: values.conclusion
      };

      // await submitExpertise(selectedProgram!, expertiseData);
      message.success('Экспертиза успешно отправлена!');
      setIsExpertiseModalOpen(false);
      form.resetFields();
    } catch {
      message.error('Ошибка при отправке экспертизы');
    }
  }

  const renderCriteriaForm = () => {
    return Object.entries(criteriaNames).map(([key, name]) => (
      <Card key={key} size="small" style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col span={16}>
            <Text strong>{name}</Text>
          </Col>
          <Col span={8}>
            <Form.Item
              name={['criteria', key, 'score']}
              rules={[{ required: true, message: 'Оцените критерий' }]}
              style={{ margin: 0 }}
            >
              <Rate />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name={['criteria', key, 'comment']}
          style={{ marginTop: 8, marginBottom: 0 }}
        >
          <TextArea
            placeholder="Комментарий по критерию (необязательно)"
            rows={2}
          />
        </Form.Item>
      </Card>
    ));
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Экспертиза программ ДПП ПК</Title>
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
              `${range[0]}-${range[1]} из ${total} программ`,
          }}
        />
      </Card>

      {/* Модальное окно экспертизы */}
      <Modal
        title={`Экспертиза программы: ${currentExpertise?.program.title}`}
        open={isExpertiseModalOpen}
        onCancel={() => {
          setIsExpertiseModalOpen(false);
          form.resetFields();
        }}
        width={800}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmitExpertise}
        >
          <Title level={4}>Оценка по критериям</Title>
          <Text type="secondary">
            Оцените каждый критерий по 5-балльной шкале и при необходимости оставьте комментарии.
          </Text>
          
          <div style={{ marginTop: 16, marginBottom: 24 }}>
            {renderCriteriaForm()}
          </div>

          <Form.Item
            name="recommendations"
            label="Дополнительные рекомендации"
          >
            <TextArea
              rows={4}
              placeholder="Общие рекомендации по улучшению программы..."
            />
          </Form.Item>

          <Form.Item
            name="conclusion"
            label="Заключение"
            rules={[{ required: true, message: 'Выберите заключение' }]}
          >
            <Select placeholder="Выберите итоговое заключение">
              <Option value="approved">Одобрить программу</Option>
              <Option value="approved_with_conditions">Одобрить с условиями</Option>
              <Option value="requires_revision">Требует доработки</Option>
              <Option value="rejected">Отклонить</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit"
              >
                Отправить экспертизу
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
