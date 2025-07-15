import React from 'react';
import { Typography, Card } from 'antd';

const { Title } = Typography;

export const DashboardPage: React.FC = () => {
  return (
    <div>
      <Title level={2}>Главная страница</Title>
      <Card>
        <p>Добро пожаловать в ГосЗаЛУПа!</p>
        <p>Авторизация временно отключена. Все функции доступны без входа в систему.</p>
      </Card>
    </div>
  );
};
