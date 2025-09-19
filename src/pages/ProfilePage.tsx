import React from 'react';
import { Button, Card, Col, Form, Input, message, Row, Tag, Typography } from 'antd';
import { EditOutlined, SaveOutlined, UserOutlined } from '@ant-design/icons';
import { UserRole } from '@/types';
import { useAuth } from '../hooks/useAuth';

const { Title } = Typography;

export const ProfilePage: React.FC = () => {
  const { user, checkPermission, getToken } = useAuth();
  const [form] = Form.useForm();

  const handleSave = async () => {
    try {
      message.success('Профиль обновлен');
    } catch {
      message.error('Ошибка обновления профиля');
    }
  };

  const getRoleLabels = () => {
    if (!user?.roles) return [];

    const roleLabels = {
      [UserRole.ADMIN]: { color: 'red', text: 'Администратор' },
      [UserRole.EXPERT]: { color: 'blue', text: 'Эксперт' },
      [UserRole.AUTHOR]: { color: 'green', text: 'Автор' },
    };

    return user.roles.map((role) => (
      <Tag key={role} color={roleLabels[role].color}>
        {roleLabels[role].text}
      </Tag>
    ));
  };

  return (
    <div>
      <Title level={2}>
        <UserOutlined /> Профиль пользователя
      </Title>

      <Row gutter={24}>
        <Col span={16}>
          <Card title="Основная информация">
            <Form form={form} layout="vertical" onFinish={handleSave} initialValues={{ ...user }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="phone" label="Телефон">
                    <Input disabled={!checkPermission([UserRole.ADMIN])} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="lastName" label="Фамилия">
                    <Input disabled={!checkPermission([UserRole.ADMIN])} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="firstName" label="Имя">
                    <Input disabled={!checkPermission([UserRole.ADMIN])} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="middleName" label="Отчество">
                    <Input disabled={!checkPermission([UserRole.ADMIN])} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="position" label="Должность">
                    <Input disabled={!checkPermission([UserRole.ADMIN])} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="workplace" label="Место работы">
                    <Input disabled={!checkPermission([UserRole.ADMIN])} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="department" label="Подразделение">
                <Input disabled={!checkPermission([UserRole.ADMIN])} />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                  Сохранить изменения
                </Button>
                <Button
                  type="text"
                  htmlType="button"
                  href={`/auth/reset-password?token=${getToken()}`}
                  icon={<EditOutlined />}
                >
                  Изменить пароль
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Статус аккаунта">
            <div style={{ marginBottom: 16 }}>
              <strong>Роли:</strong>
              <div style={{ marginTop: 8 }}>{getRoleLabels()}</div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <strong>Статус:</strong>
              <div style={{ marginTop: 8 }}>
                <Tag color={user?.status === 'active' ? 'green' : 'red'}>
                  {user?.status === 'active' ? 'Активен' : 'Неактивен'}
                </Tag>
              </div>
            </div>

            <div>
              <strong>Дата регистрации:</strong>
              <div style={{ marginTop: 8 }}>
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString('ru-RU')
                  : 'Не указана'}
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
