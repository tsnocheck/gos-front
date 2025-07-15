import React from 'react';
import { Form, Input, Button, Typography, Card, message, Row, Col, Select } from 'antd';
import { 
  LockOutlined, 
  MailOutlined, 
  PhoneOutlined,
  FileTextOutlined 
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useRegister } from '../hooks/useAuth';
import type { RegisterData } from '../types';

const { Title, Text } = Typography;
const { Option } = Select;

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const onFinish = async (values: RegisterData) => {
    try {
      await registerMutation.mutateAsync(values);
      message.success('Регистрация прошла успешно! Ожидайте одобрения администратора.');
      navigate('/login');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Ошибка регистрации');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24
    }}>
      <Row justify="center" style={{ width: '100%', maxWidth: 600 }}>
        <Col span={24}>
          <Card style={{
            borderRadius: 12,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <FileTextOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
              <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
                Регистрация
              </Title>
              <Text type="secondary">
                Создание аккаунта в системе ГОСЗАЛУПА
              </Text>
            </div>

            <Form
              name="register"
              onFinish={onFinish}
              autoComplete="off"
              layout="vertical"
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Фамилия"
                    name="lastName"
                    rules={[{ required: true, message: 'Введите фамилию!' }]}
                  >
                    <Input placeholder="Фамилия" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Имя"
                    name="firstName"
                    rules={[{ required: true, message: 'Введите имя!' }]}
                  >
                    <Input placeholder="Имя" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Отчество"
                name="middleName"
                rules={[{ required: true, message: 'Введите отчество!' }]}
              >
                <Input placeholder="Отчество" />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: 'Введите email!' },
                      { type: 'email', message: 'Введите корректный email!' }
                    ]}
                  >
                    <Input 
                      prefix={<MailOutlined />}
                      placeholder="email@example.com" 
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Телефон"
                    name="phone"
                    rules={[{ required: true, message: 'Введите телефон!' }]}
                  >
                    <Input 
                      prefix={<PhoneOutlined />}
                      placeholder="+7 (999) 999-99-99" 
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Должность"
                    name="position"
                    rules={[{ required: true, message: 'Введите должность!' }]}
                  >
                    <Input placeholder="Профессор, доцент..." />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Ученая степень"
                    name="academicDegree"
                  >
                    <Select placeholder="Выберите ученую степень">
                      <Option value="none">Без степени</Option>
                      <Option value="candidate">Кандидат наук</Option>
                      <Option value="doctor">Доктор наук</Option>
                      <Option value="phd">PhD</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Место работы"
                    name="workplace"
                    rules={[{ required: true, message: 'Введите место работы!' }]}
                  >
                    <Input placeholder="Название организации" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Структурное подразделение"
                    name="department"
                  >
                    <Input placeholder="Факультет, кафедра..." />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Преподаваемые предметы"
                name="subjects"
              >
                <Select
                  mode="tags"
                  placeholder="Введите предметы"
                  style={{ width: '100%' }}
                />
              </Form.Item>

              <Form.Item
                label="Пароль"
                name="password"
                rules={[
                  { required: true, message: 'Введите пароль!' },
                  { min: 8, message: 'Пароль должен содержать минимум 8 символов!' }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Минимум 8 символов"
                />
              </Form.Item>

              <Form.Item
                label="Подтверждение пароля"
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Подтвердите пароль!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Пароли не совпадают!'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Повторите пароль"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={registerMutation.isPending}
                  block
                  size="large"
                  style={{ marginBottom: 16 }}
                >
                  Зарегистрироваться
                </Button>

                <div style={{ textAlign: 'center' }}>
                  <Text type="secondary">
                    Уже есть аккаунт?{' '}
                    <Link to="/login">
                      Войти
                    </Link>
                  </Text>
                </div>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
