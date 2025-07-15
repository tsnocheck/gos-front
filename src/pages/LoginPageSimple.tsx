import React from 'react';
import { Typography, Card, Form, Input, Button } from 'antd';

const { Title } = Typography;

export const LoginPage: React.FC = () => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: '#f0f0f0'
    }}>
      <Card style={{ width: 400 }}>
        <Title level={3} style={{ textAlign: 'center' }}>Вход в систему</Title>
        <p style={{ textAlign: 'center', color: '#666' }}>
          Авторизация временно отключена
        </p>
        <Form layout="vertical">
          <Form.Item label="Email">
            <Input disabled placeholder="demo@goszalupa.ru" />
          </Form.Item>
          <Form.Item label="Пароль">
            <Input.Password disabled placeholder="••••••••" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" block disabled>
              Войти (отключено)
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
