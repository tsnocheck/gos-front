import React from 'react';
import { Typography, Card } from 'antd';

const { Title } = Typography;

export const RegisterPage: React.FC = () => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: '#f0f0f0'
    }}>
      <Card style={{ width: 400 }}>
        <Title level={3} style={{ textAlign: 'center' }}>Регистрация</Title>
        <p style={{ textAlign: 'center', color: '#666' }}>
          Регистрация временно отключена
        </p>
      </Card>
    </div>
  );
};
