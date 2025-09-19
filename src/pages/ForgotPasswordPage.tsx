import React from 'react';
import { Form, Input, Button, Typography, Card, Row, Col } from 'antd';
import { FileTextOutlined, SendOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const ForgotPasswordPage: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = async (values: { email: string }) => {
    console.log(values);
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
              <FileTextOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
              <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
                Забыли пароль?
              </Title>
              <Text type="secondary">Введите почту для восстановления аккаунта</Text>
            </div>

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
                >
                  Отправить
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
