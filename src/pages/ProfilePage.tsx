import React from 'react';
import { Card, Form, Input, Button, Typography, Row, Col, Tag, message } from 'antd';
import { UserOutlined, SaveOutlined } from '@ant-design/icons';
import { useCurrentUser } from '../hooks/useAuth';
import { UserRole } from '../types';

const { Title } = Typography;

export const ProfilePage: React.FC = () => {
  const { data: user } = useCurrentUser();
  const [form] = Form.useForm();

  const handleSave = async (values: any) => {
    try {
      // TODO: Реализовать обновление профиля
      console.log('Saving profile:', values);
      message.success('Профиль обновлен');
    } catch (error) {
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

    return user.roles.map(role => (
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
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSave}
              initialValues={{
                email: user?.email,
                firstName: user?.firstName,
                lastName: user?.lastName,
                middleName: user?.middleName,
                phone: user?.phone,
                position: user?.position,
                workplace: user?.workplace,
                department: user?.department,
              }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ required: true, type: 'email' }]}
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="phone"
                    label="Телефон"
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="lastName"
                    label="Фамилия"
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="firstName"
                    label="Имя"
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="middleName"
                    label="Отчество"
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="position"
                    label="Должность"
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="workplace"
                    label="Место работы"
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="department"
                label="Подразделение"
              >
                <Input />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                  Сохранить изменения
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Статус аккаунта">
            <div style={{ marginBottom: 16 }}>
              <strong>Роли:</strong>
              <div style={{ marginTop: 8 }}>
                {getRoleLabels()}
              </div>
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
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU') : 'Не указана'}
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
