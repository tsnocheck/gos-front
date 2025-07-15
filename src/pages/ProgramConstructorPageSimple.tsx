import React from 'react';
import { Typography, Card, Form, Input, Button, Select, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { TextArea } = Input;

export const ProgramConstructorPage: React.FC = () => {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    console.log('Program data:', values);
    message.success('Программа создана успешно!');
  };

  return (
    <div>
      <Title level={2}>Конструктор программ</Title>
      
      <Card>
        <Form 
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Название программы"
            rules={[{ required: true, message: 'Введите название программы' }]}
          >
            <Input placeholder="Название программы" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Описание"
            rules={[{ required: true, message: 'Введите описание программы' }]}
          >
            <TextArea 
              rows={4} 
              placeholder="Описание программы"
            />
          </Form.Item>

          <Form.Item
            name="category"
            label="Категория"
          >
            <Select placeholder="Выберите категорию">
              <Select.Option value="educational">Образовательная</Select.Option>
              <Select.Option value="professional">Профессиональная</Select.Option>
              <Select.Option value="training">Тренинговая</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit"
              icon={<SaveOutlined />}
              size="large"
            >
              Сохранить программу
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
