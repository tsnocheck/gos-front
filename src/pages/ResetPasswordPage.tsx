import React, { useState } from 'react';
import { Form, Input, Button, Typography, Card, message, Row, Col } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useChangePassword } from '../queries/auth';

const { Title, Text } = Typography;

export const ResetPasswordPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const changePasswordMutation = useChangePassword();
  const [submitting, setSubmitting] = useState(false);

  const onFinish = async (values: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('Пароли не совпадают!');
      return;
    }
    setSubmitting(true);
    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      message.success('Пароль успешно изменён!');
      navigate('/dashboard');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Введён неверный пароль');
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
              <UserOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
              <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
                Смена пароля
              </Title>
              <Text type="secondary">Введите текущий пароль и новый пароль</Text>
            </div>

            <Form
              form={form}
              name="change-password"
              onFinish={onFinish}
              autoComplete="off"
              size="large"
            >
              <Form.Item
                name="currentPassword"
                rules={[
                  { required: true, message: 'Введите текущий пароль!' },
                  { min: 6, message: 'Пароль должен содержать минимум 6 символов' },
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Текущий пароль" />
              </Form.Item>

              <Form.Item
                name="newPassword"
                rules={[
                  { required: true, message: 'Введите новый пароль!' },
                  { min: 6, message: 'Пароль должен содержать минимум 6 символов' },
                  {
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                    message:
                      'Пароль должен содержать минимум одну строчную букву, одну заглавную букву и одну цифру',
                  },
                ]}
                hasFeedback
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Новый пароль" />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                dependencies={['newPassword']}
                hasFeedback
                rules={[
                  { required: true, message: 'Подтвердите новый пароль!' },
                  { min: 6, message: 'Пароль должен содержать минимум 6 символов' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Пароли не совпадают!'));
                    },
                  }),
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Подтвердите новый пароль" />
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
