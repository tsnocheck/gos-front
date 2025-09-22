import React, { useState } from 'react';
import { Form, Input, Button, Typography, Card, Row, Col, message } from 'antd';
import { FileTextOutlined, SendOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useForgotPassword } from '@/queries/auth';

const { Title, Text } = Typography;

export const ForgotPasswordPage: React.FC = () => {
  const [form] = Form.useForm();
  const [isEmailSent, setIsEmailSent] = useState(false);
  const forgotPasswordMutation = useForgotPassword();

  const onFinish = async (values: { email: string }) => {
    try {
      await forgotPasswordMutation.mutateAsync(values);
      setIsEmailSent(true);
      message.success('Инструкции по восстановлению пароля отправлены на вашу почту');
    } catch {
      message.error('Ошибка при отправке запроса. Попробуйте еще раз');
    }
  };

  const handleResend = () => {
    setIsEmailSent(false);
    form.resetFields();
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
            <div style={{ textAlign: 'center', marginBottom: 12 }}>
              {isEmailSent ? (
                <>
                  <CheckCircleOutlined
                    style={{ fontSize: 48, color: '#52c41a', marginBottom: 16 }}
                  />
                  <Title level={2} style={{ margin: 0, color: '#52c41a' }}>
                    Письмо отправлено!
                  </Title>
                  <Text type="secondary">
                    Проверьте свою почту и следуйте инструкциям для восстановления пароля
                  </Text>
                </>
              ) : (
                <>
                  <FileTextOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
                  <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
                    Забыли пароль?
                  </Title>
                  <Text type="secondary">Введите почту для восстановления аккаунта</Text>
                </>
              )}
            </div>

            {!isEmailSent ? (
              <Form
                form={form}
                name="forgot-password"
                onFinish={onFinish}
                autoComplete="off"
                size="large"
                layout={'vertical'}
                style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
              >
                <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                  <Input placeholder="Введите email" />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: '100%' }}
                    icon={<SendOutlined />}
                    iconPosition={'end'}
                    loading={forgotPasswordMutation.isPending}
                  >
                    Отправить
                  </Button>
                </Form.Item>
              </Form>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <Button
                  type="primary"
                  onClick={handleResend}
                  style={{ width: '100%' }}
                  icon={<SendOutlined />}
                  iconPosition="end"
                >
                  Отправить повторно
                </Button>
                <Button type="default" href="/login" style={{ width: '100%' }}>
                  Перейти на страницу авторизации
                </Button>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};
