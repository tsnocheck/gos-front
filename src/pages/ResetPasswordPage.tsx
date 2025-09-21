import React, { useState } from 'react';
import { Form, Input, Button, Typography, Card, message, Row, Col } from 'antd';
import { LockOutlined, FileTextOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useResetPassword } from '../queries/auth';

const { Title, Text } = Typography;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export const ResetPasswordPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const query = useQuery();
  const resetPasswordMutation = useResetPassword();
  const [submitting, setSubmitting] = useState(false);
  const token = query.get('token');

  const onFinish = async (values: { password: string; confirm: string }) => {
    if (!token) {
      message.error('Некорректная ссылка для сброса пароля.');
      return;
    }
    if (values.password !== values.confirm) {
      message.error('Пароли не совпадают!');
      return;
    }
    setSubmitting(true);
    try {
      await resetPasswordMutation.mutateAsync({ token, newPassword: values.password });
      message.success('Пароль успешно изменён!');
      navigate('/login');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Ошибка смены пароля');
    } finally {
      setSubmitting(false);
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
                Сброс пароля
              </Title>
              <Text type="secondary">Введите новый пароль для входа</Text>
            </div>

            <Form
              form={form}
              name="reset-password"
              onFinish={onFinish}
              autoComplete="off"
              size="large"
            >
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: 'Введите новый пароль!' },
                  {
                    pattern:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[{\]};:'",<.>/?\\|`~]).{8,}$/,
                    message:
                      'Пароль должен содержать минимум 8 символов, включать заглавные и строчные буквы, цифру и спецсимвол',
                  },
                ]}
                hasFeedback
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Новый пароль" />
              </Form.Item>

              <Form.Item
                name="confirm"
                dependencies={['password']}
                hasFeedback
                rules={[
                  { required: true, message: 'Подтвердите новый пароль!' },
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
                <Input.Password prefix={<LockOutlined />} placeholder="Подтвердите пароль" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitting}
                  block
                  style={{ marginBottom: 16 }}
                >
                  Сменить пароль
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
