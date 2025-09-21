import React from 'react';
import { Form, Input, Button, Typography, Card, message, Row, Col } from 'antd';
import { UserOutlined, LockOutlined, FileTextOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLogin } from '../queries/auth';
import type { LoginCredentials } from '@/types';

const { Title, Text } = Typography;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const loginMutation = useLogin();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const onFinish = async (values: LoginCredentials) => {
    try {
      await loginMutation.mutateAsync(values);
      message.success('Вход выполнен успешно!');
      navigate(from, { replace: true });
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Ошибка входа в систему');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <Row justify="center" style={{ width: '100%', maxWidth: 400 }}>
        <Col span={24}>
          <Card
            style={{
              borderRadius: 12,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <FileTextOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
              <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
                ПОРТАЛ
              </Title>
              <Text type="secondary">Система создания ДПП ПК</Text>
            </div>

            <Form
              name="login"
              onFinish={onFinish}
              autoComplete="off"
              size="large"
              initialValues={{
                email: 'admin@gos.ru',
                password: 'admin123456',
              }}
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Введите email!' },
                  { type: 'email', message: 'Введите корректный email!' },
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="Email" />
              </Form.Item>

              <Form.Item name="password" rules={[{ required: true, message: 'Введите пароль!' }]}>
                <Input.Password prefix={<LockOutlined />} placeholder="Пароль" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loginMutation.isPending}
                  block
                  style={{ marginBottom: 16 }}
                >
                  Войти
                </Button>

                <div style={{ textAlign: 'center' }}>
                  <Text type="secondary">
                    Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
                  </Text>
                </div>

                <div style={{ textAlign: 'center', marginTop: 8 }}>
                  <Link to="/auth/reset-password">
                    <Text type="secondary">Забыли пароль?</Text>
                  </Link>
                </div>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
