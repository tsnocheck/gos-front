import React from 'react';
import { Typography, Card } from 'antd';

const { Title } = Typography;

export const ProfilePage: React.FC = () => {
  return (
    <div>
      <Title level={2}>Профиль пользователя</Title>
      <Card>
        <p><strong>Имя:</strong> Демо Пользователь</p>
        <p><strong>Email:</strong> demo@goszalupa.ru</p>
        <p><strong>Роль:</strong> Кандидат</p>
        <p><strong>Статус:</strong> Активен</p>
      </Card>
    </div>
  );
};
