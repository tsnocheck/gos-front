import React, { useState } from 'react';
import { Card, Steps, Button, Form, Input, Select, InputNumber, Space, Typography, Row, Col, message } from 'antd';
import { PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { useCreateProgram } from '../queries/programs';
import type { CreateProgramForm } from '../types';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface ProgramFormData {
  title: string;
  description: string;
  category: string;
  duration: number;
  targetAudience: string;
  prerequisites: string;
  learningOutcomes: string[];
  sections: ProgramSection[];
}

interface ProgramSection {
  id: string;
  title: string;
  description: string;
  duration: number;
  topics: string[];
  materials: string[];
}

export const ProgramConstructorPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [formData, setFormData] = useState<Partial<ProgramFormData>>({
    learningOutcomes: [],
    sections: []
  });
  
  const createProgram = useCreateProgram(() => {
    // Callback выполнится после успешного создания программы
    message.success('Программа успешно создана!');
    form.resetFields();
    setFormData({ learningOutcomes: [], sections: [] });
    setCurrentStep(0);
  });

  const steps = [
    {
      title: 'Основная информация',
      description: 'Название, описание, категория программы'
    },
    {
      title: 'Параметры программы',
      description: 'Длительность, аудитория, требования'
    },
    {
      title: 'Результаты обучения',
      description: 'Компетенции и навыки'
    },
    {
      title: 'Структура программы',
      description: 'Разделы и модули'
    },
    {
      title: 'Проверка и создание',
      description: 'Финальная проверка данных'
    }
  ];

  const addLearningOutcome = () => {
    const outcomes = formData.learningOutcomes || [];
    setFormData({
      ...formData,
      learningOutcomes: [...outcomes, '']
    });
  };

  const updateLearningOutcome = (index: number, value: string) => {
    const outcomes = [...(formData.learningOutcomes || [])];
    outcomes[index] = value;
    setFormData({
      ...formData,
      learningOutcomes: outcomes
    });
  };

  const removeLearningOutcome = (index: number) => {
    const outcomes = formData.learningOutcomes?.filter((_, i) => i !== index) || [];
    setFormData({
      ...formData,
      learningOutcomes: outcomes
    });
  };

  const addSection = () => {
    const sections = formData.sections || [];
    const newSection: ProgramSection = {
      id: Date.now().toString(),
      title: '',
      description: '',
      duration: 0,
      topics: [],
      materials: []
    };
    setFormData({
      ...formData,
      sections: [...sections, newSection]
    });
  };

  const updateSection = (index: number, field: keyof ProgramSection, value: any) => {
    const sections = [...(formData.sections || [])];
    sections[index] = { ...sections[index], [field]: value };
    setFormData({
      ...formData,
      sections
    });
  };

  const removeSection = (index: number) => {
    const sections = formData.sections?.filter((_, i) => i !== index) || [];
    setFormData({
      ...formData,
      sections
    });
  };

  const handleNext = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      setFormData({ ...formData, ...values });
      setCurrentStep(currentStep + 1);
    } catch (error) {
      message.error('Пожалуйста, заполните все обязательные поля');
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    try {
      console.log('Current formData:', formData);
      
      // Проверяем что все данные заполнены
      if (!formData.title || !formData.description || !formData.duration || 
          !formData.targetAudience || !formData.prerequisites || 
          !formData.learningOutcomes || formData.learningOutcomes.length === 0) {
        message.error('Пожалуйста, заполните все шаги формы');
        return;
      }

      const programData: CreateProgramForm = {
        title: formData.title,
        description: formData.description,
        duration: formData.duration,
        targetAudience: formData.targetAudience,
        requirements: formData.prerequisites,
        learningOutcomes: formData.learningOutcomes.join('\n'),
        content: formData.sections?.map(section => 
          `${section.title}: ${section.description}`
        ).join('\n\n') || ''
      };

      console.log('Program data to submit:', programData);
      
      // Отключаем кнопку во время отправки
      if (createProgram.isPending) {
        return;
      }

      createProgram.mutate(programData);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      message.error('Ошибка при создании программы');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item
                name="title"
                label="Название программы"
                rules={[{ required: true, message: 'Введите название программы' }]}
              >
                <Input placeholder="Например: Цифровые технологии в образовании" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="description"
                label="Описание программы"
                rules={[{ required: true, message: 'Введите описание программы' }]}
              >
                <TextArea 
                  rows={4} 
                  placeholder="Подробное описание целей и содержания программы"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Категория"
                rules={[{ required: true, message: 'Выберите категорию' }]}
              >
                <Select placeholder="Выберите категорию">
                  <Option value="it">Информационные технологии</Option>
                  <Option value="management">Менеджмент</Option>
                  <Option value="education">Образование</Option>
                  <Option value="healthcare">Здравоохранение</Option>
                  <Option value="other">Прочее</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        );

      case 1:
        return (
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="duration"
                label="Длительность (часы)"
                rules={[{ required: true, message: 'Укажите длительность' }]}
              >
                <InputNumber min={16} max={500} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="targetAudience"
                label="Целевая аудитория"
                rules={[{ required: true, message: 'Укажите целевую аудиторию' }]}
              >
                <TextArea 
                  rows={3} 
                  placeholder="Кто должен пройти эту программу?"
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="prerequisites"
                label="Требования к слушателям"
                rules={[{ required: true, message: 'Укажите требования' }]}
              >
                <TextArea 
                  rows={3} 
                  placeholder="Какие знания и навыки необходимы?"
                />
              </Form.Item>
            </Col>
          </Row>
        );

      case 2:
        return (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Button 
                type="dashed" 
                onClick={addLearningOutcome} 
                icon={<PlusOutlined />}
                block
              >
                Добавить результат обучения
              </Button>
            </div>
            {formData.learningOutcomes?.map((outcome, index) => (
              <Card 
                key={index}
                size="small" 
                style={{ marginBottom: 16 }}
                extra={
                  <Button 
                    type="text" 
                    danger 
                    onClick={() => removeLearningOutcome(index)}
                  >
                    Удалить
                  </Button>
                }
              >
                <Input
                  value={outcome}
                  onChange={(e) => updateLearningOutcome(index, e.target.value)}
                  placeholder="После прохождения программы слушатель будет способен..."
                />
              </Card>
            ))}
          </div>
        );

      case 3:
        return (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Button 
                type="dashed" 
                onClick={addSection} 
                icon={<PlusOutlined />}
                block
              >
                Добавить раздел программы
              </Button>
            </div>
            {formData.sections?.map((section, index) => (
              <Card 
                key={section.id}
                style={{ marginBottom: 16 }}
                title={`Раздел ${index + 1}`}
                extra={
                  <Button 
                    type="text" 
                    danger 
                    onClick={() => removeSection(index)}
                  >
                    Удалить раздел
                  </Button>
                }
              >
                <Row gutter={16}>
                  <Col span={24}>
                    <Input
                      value={section.title}
                      onChange={(e) => updateSection(index, 'title', e.target.value)}
                      placeholder="Название раздела"
                      style={{ marginBottom: 8 }}
                    />
                  </Col>
                  <Col span={24}>
                    <TextArea
                      value={section.description}
                      onChange={(e) => updateSection(index, 'description', e.target.value)}
                      placeholder="Описание раздела"
                      rows={2}
                      style={{ marginBottom: 8 }}
                    />
                  </Col>
                  <Col span={12}>
                    <InputNumber
                      value={section.duration}
                      onChange={(value) => updateSection(index, 'duration', value || 0)}
                      placeholder="Часы"
                      min={0}
                      style={{ width: '100%' }}
                    />
                  </Col>
                </Row>
              </Card>
            ))}
          </div>
        );

      case 4:
        return (
          <div>
            <Title level={4}>Проверьте данные программы:</Title>
            <Card>
              <p><strong>Название:</strong> {formData.title}</p>
              <p><strong>Категория:</strong> {formData.category}</p>
              <p><strong>Длительность:</strong> {formData.duration} часов</p>
              <p><strong>Разделов:</strong> {formData.sections?.length || 0}</p>
              <p><strong>Результатов обучения:</strong> {formData.learningOutcomes?.length || 0}</p>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Конструктор программ ДПП ПК</Title>
      
      <Steps current={currentStep} items={steps} style={{ marginBottom: 32 }} />
      
      <Form
        form={form}
        layout="vertical"
        initialValues={formData}
      >
        {renderStepContent()}
      </Form>

      <div style={{ marginTop: 24 }}>
        <Space>
          {currentStep > 0 && (
            <Button onClick={handlePrev}>
              Назад
            </Button>
          )}
          
          {currentStep < steps.length - 1 && (
            <Button type="primary" onClick={handleNext}>
              Далее
            </Button>
          )}
          
          {currentStep === steps.length - 1 && (
            <Button 
              type="primary" 
              icon={<SaveOutlined />}
              onClick={handleSubmit}
              loading={createProgram.isPending}
            >
              Создать программу
            </Button>
          )}
        </Space>
      </div>
    </div>
  );
};
