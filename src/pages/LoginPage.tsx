import React, { useCallback, useMemo } from 'react';
import { Form, Input, Button, Typography, Card, message, Row, Col } from 'antd';
import { UserOutlined, LockOutlined, FileTextOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLogin } from '../queries/auth';
import type { LoginCredentials } from '@/types';

const { Title, Text } = Typography;

// Константы
const DEFAULT_ROUTE = '/dashboard';
const DEFAULT_CREDENTIALS = {
  email: 'admin@gos.ru',
  password: 'admin123456',
} as const;

// Стили
const CONTAINER_STYLES = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 24,
} as const;

const CARD_STYLES = {
  borderRadius: 12,
  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
} as const;

const HEADER_STYLES = {
  textAlign: 'center' as const,
  marginBottom: 32,
};

const ICON_STYLES = {
  fontSize: 48,
  color: '#1890ff',
  marginBottom: 16,
};

const TITLE_STYLES = {
  margin: 0,
  color: '#1890ff',
};

// Типы
interface LocationState {
  from?: {
    pathname: string;
  };
}

// Правила валидации
const EMAIL_RULES = [
  { required: true, message: 'Введите email!' },
  { type: 'email' as const, message: 'Введите корректный email!' },
];

const PASSWORD_RULES = [{ required: true, message: 'Введите пароль!' }];

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const loginMutation = useLogin();

  // Мемоизация redirect пути
  const redirectPath = useMemo(() => {
    const state = location.state as LocationState;
    return state?.from?.pathname || DEFAULT_ROUTE;
  }, [location.state]);

  // Мемоизированный обработчик отправки формы
  const handleSubmit = useCallback(
    async (values: LoginCredentials) => {
      try {
        await loginMutation.mutateAsync(values);
        message.success('Вход выполнен успешно!');
        navigate(redirectPath, { replace: true });
      } catch (error) {
        const errorMessage =
          error instanceof Error && 'response' in error
            ? (error as any).response?.data?.message || 'Ошибка входа в систему'
            : 'Ошибка входа в систему';
        message.error(errorMessage);
      }
    },
    [loginMutation, navigate, redirectPath],
  );

  // Мемоизация стилей строки
  const rowStyle = useMemo(
    () => ({
      width: '100%',
      maxWidth: 400,
    }),
    [],
  );

  // Мемоизация стилей кнопки
  const buttonStyle = useMemo(
    () => ({
      marginBottom: 16,
    }),
    [],
  );

  // Мемоизация стилей для ссылки "Забыли пароль"
  const forgotPasswordStyle = useMemo(
    () => ({
      textAlign: 'center' as const,
      marginTop: 8,
    }),
    [],
  );

  return (
    <div style={CONTAINER_STYLES}>
      <Row justify="center" style={rowStyle}>
        <Col span={24}>
          <Card style={CARD_STYLES}>
            <div style={HEADER_STYLES}>
              <FileTextOutlined style={ICON_STYLES} />
              <Title level={2} style={TITLE_STYLES}>
                ПОРТАЛ
              </Title>
              <Text type="secondary">Система создания ДПП ПК</Text>
            </div>

            <Form
              name="login"
              onFinish={handleSubmit}
              autoComplete="off"
              size="large"
              initialValues={DEFAULT_CREDENTIALS}
            >
              <Form.Item name="email" rules={EMAIL_RULES}>
                <Input prefix={<UserOutlined />} placeholder="Email" />
              </Form.Item>

              <Form.Item name="password" rules={PASSWORD_RULES}>
                <Input.Password prefix={<LockOutlined />} placeholder="Пароль" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loginMutation.isPending}
                  block
                  style={buttonStyle}
                >
                  Войти
                </Button>

                <div style={{ ...HEADER_STYLES, marginBottom: 8 }}>
                  <Text type="secondary">
                    Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
                  </Text>
                </div>

                <div style={forgotPasswordStyle}>
                  <Link to="/auth/forgot-password">
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
