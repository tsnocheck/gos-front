import React from 'react';
import { Typography, Card } from 'antd';

const { Title } = Typography;

export const AdminUsersPage: React.FC = () => {
  return (
    <div>
      <Title level={2}>Администрирование пользователей</Title>
      <Card>
        <p>Управление пользователями системы</p>
        <p>Здесь администраторы могут управлять пользователями, ролями и правами доступа.</p>
      </Card>
    </div>
  );
};
