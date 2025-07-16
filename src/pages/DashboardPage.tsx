import React from 'react';
import { Typography, Row, Col, Card, Statistic, Button, List, Avatar, Tag } from 'antd';
import { 
  BookOutlined, 
  ExperimentOutlined, 
  TeamOutlined, 
  PlusOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useProgramStats, useMyPrograms } from '../hooks/usePrograms';
import { UserRole, ProgramStatus } from '../types';

const { Title, Text } = Typography;

export const DashboardPage: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { data: programStats } = useProgramStats();
  const { data: myPrograms } = useMyPrograms({ limit: 5 });

  // Если пользователь не загружен, используем заглушку для UI
  const displayUser = user || {
    id: '1',
    firstName: 'Пользователь',
    lastName: '',
    email: 'demo@example.com',
    roles: [UserRole.AUTHOR] as UserRole[],
  };

  // Заглушка для статистики, если данные не загружены
  const mockStats = {
    total: 12,
    byStatus: {
      [ProgramStatus.PUBLISHED]: 5,
      [ProgramStatus.ON_EXPERTISE]: 3,
      [ProgramStatus.DRAFT]: 2,
      [ProgramStatus.IN_DEVELOPMENT]: 2,
    }
  };

  // Заглушка для программ, если данные не загружены  
  const mockPrograms = myPrograms || {
    data: [],
    total: 0
  };

  const shouldShowMockData = !myPrograms && user?.roles?.includes(UserRole.AUTHOR);

  const displayStats = programStats || mockStats;
  const displayPrograms = mockPrograms;

  const getWelcomeMessage = () => {
    const name = displayUser ? `${displayUser.firstName} ${displayUser.lastName}` : 'Пользователь';
    const time = new Date().getHours();
    
    let greeting = 'Добро пожаловать';
    if (time < 12) greeting = 'Доброе утро';
    else if (time < 18) greeting = 'Добрый день';
    else greeting = 'Добрый вечер';

    return `${greeting}, ${name}!`;
  };

  const getStatusColor = (status: ProgramStatus) => {
    switch (status) {
      case ProgramStatus.DRAFT:
      case ProgramStatus.IN_DEVELOPMENT:
        return 'default';
      case ProgramStatus.ON_EXPERTISE:
        return 'processing';
      case ProgramStatus.PUBLISHED:
        return 'success';
      case ProgramStatus.REJECTED:
        return 'error';
      case ProgramStatus.ARCHIVED:
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: ProgramStatus) => {
    switch (status) {
      case ProgramStatus.DRAFT:
        return 'Черновик';
      case ProgramStatus.IN_DEVELOPMENT:
        return 'В разработке';
      case ProgramStatus.ON_EXPERTISE:
        return 'На экспертизе';
      case ProgramStatus.PUBLISHED:
        return 'Опубликована';
      case ProgramStatus.REJECTED:
        return 'Отклонена';
      case ProgramStatus.ARCHIVED:
        return 'Архивирована';
      default:
        return status;
    }
  };

  const getQuickActions = () => {
    const actions = [];

    if (displayUser?.roles?.includes(UserRole.AUTHOR)) {
      actions.push(
        <Card key="create-program">
          <Card.Meta
            avatar={<Avatar icon={<PlusOutlined />} style={{ backgroundColor: '#52c41a' }} />}
            title={<Link to="/programs/constructor">Создать программу</Link>}
            description="Создание новой ДПП ПК"
          />
        </Card>
      );
    }

    if (displayUser?.roles?.includes(UserRole.EXPERT)) {
      actions.push(
        <Card key="expertise">
          <Card.Meta
            avatar={<Avatar icon={<ExperimentOutlined />} style={{ backgroundColor: '#1890ff' }} />}
            title={<Link to="/expertise">Экспертиза</Link>}
            description="Проведение экспертизы программ"
          />
        </Card>
      );
    }

    if (displayUser?.roles?.includes(UserRole.ADMIN)) {
      actions.push(
        <Card key="admin">
          <Card.Meta
            avatar={<Avatar icon={<TeamOutlined />} style={{ backgroundColor: '#f5222d' }} />}
            title={<Link to="/admin/users">Администрирование</Link>}
            description="Управление системой"
          />
        </Card>
      );
    }

    return actions;
  };

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <Title level={2}>{getWelcomeMessage()}</Title>
        <Text type="secondary">
          Система создания дополнительных профессиональных программ повышения квалификации
        </Text>
        
        {/* Краткая инструкция для новых пользователей */}
        {displayUser && !programStats && (
          <div style={{ 
            marginTop: 16, 
            padding: 16, 
            backgroundColor: '#f6ffed', 
            border: '1px solid #b7eb8f', 
            borderRadius: 6 
          }}>
            <Text>
              <strong>Добро пожаловать в систему ГОСЗАЛУПА!</strong> 
              {displayUser.roles?.includes(UserRole.AUTHOR) && " Начните с создания вашей первой образовательной программы."}
              {displayUser.roles?.includes(UserRole.EXPERT) && " Вы можете приступить к экспертизе программ."}
              {displayUser.roles?.includes(UserRole.ADMIN) && " Управляйте пользователями и контролируйте процессы в системе."}
            </Text>
          </div>
        )}
      </div>

      {/* Статистика */}
      {displayUser?.roles?.includes(UserRole.ADMIN) && (
        <Row style={{ gap: 16, marginBottom: 32 }}>
          <Col style={{ flex: 1 }}>
            <Card>
              <Statistic
                title="Всего программ"
                value={displayStats.total}
                prefix={<BookOutlined />}
              />
            </Card>
          </Col>
          <Col style={{ flex: 1 }}>
            <Card>
              <Statistic
                title="Опубликованы"
                value={displayStats.byStatus[ProgramStatus.PUBLISHED] || 0}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col style={{ flex: 1 }}>
            <Card>
              <Statistic
                title="На экспертизе"
                value={displayStats.byStatus[ProgramStatus.ON_EXPERTISE] || 0}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col style={{ flex: 1 }}>
            <Card>
              <Statistic
                title="В разработке"
                value={
                  (displayStats.byStatus[ProgramStatus.DRAFT] || 0) +
                  (displayStats.byStatus[ProgramStatus.IN_DEVELOPMENT] || 0)
                }
                prefix={<FileTextOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
        </Row>
      )}

      <Row style={{ gap: 16 }}>
        {/* Быстрые действия */}
        <Col style={{ flex: 1 }}>
          <Card title="Быстрые действия" style={{ marginBottom: 16 }}>
            <Row gutter={[16, 16]}>
              {getQuickActions().map((action, index) => (
                <Col key={index}>
                  {action}
                </Col>
              ))}
            </Row>
          </Card>

          {/* Мои последние программы */}
          {displayUser?.roles?.includes(UserRole.AUTHOR) && (
            <Card 
              title="Мои программы" 
              extra={<Link to="/programs">Все программы</Link>}
            >
              {displayPrograms?.data && displayPrograms.data.length > 0 ? (
                <List
                  itemLayout="horizontal"
                  dataSource={displayPrograms.data}
                  renderItem={(program: any) => (
                    <List.Item
                      actions={[
                        <Link key="edit" to={`/programs/${program.id}/edit`}>
                          Редактировать
                        </Link>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<Avatar icon={<BookOutlined />} />}
                        title={
                          <div>
                            <Link to={`/programs/${program.id}`}>
                              {program.title}
                            </Link>
                            <Tag 
                              color={getStatusColor(program.status)} 
                              style={{ marginLeft: 8 }}
                            >
                              {getStatusText(program.status)}
                            </Tag>
                          </div>
                        }
                        description={program.description}
                      />
                    </List.Item>
                  )}
                />
              ) : (
                <div style={{ textAlign: 'center', padding: 40 }}>
                  <BookOutlined style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 16 }} />
                  <div>
                    <Text type="secondary">У вас пока нет программ</Text>
                  </div>
                  <Button 
                    type="primary" 
                    style={{ marginTop: 16 }}
                    onClick={() => window.location.href = '/programs/constructor'}
                  >
                    Создать первую программу
                  </Button>
                </div>
              )}
            </Card>
          )}
        </Col>

        {/* Боковая панель */}
        <Col style={{ flex: 1 }}>
          <Card title="Система ролей" style={{ marginBottom: 16 }}>
            <div>
              <Text strong>Ваши роли:</Text>
              <div style={{ marginTop: 8 }}>
                {displayUser?.roles?.map(role => {
                  const roleLabels = {
                    [UserRole.ADMIN]: 'Администратор',
                    [UserRole.EXPERT]: 'Эксперт',
                    [UserRole.AUTHOR]: 'Автор',
                  };
                  
                  const roleColors = {
                    [UserRole.ADMIN]: 'red',
                    [UserRole.EXPERT]: 'blue',
                    [UserRole.AUTHOR]: 'green',
                  };

                  return (
                    <Tag key={role} color={roleColors[role]} style={{ marginBottom: 4 }}>
                      {roleLabels[role]}
                    </Tag>
                  );
                })}
              </div>
            </div>
          </Card>

          <Card title="Справка">
            <List
              size="small"
              dataSource={[
                { title: 'Как создать программу?', link: '/help/create-program' },
                { title: 'Процесс экспертизы', link: '/help/expertise' },
                { title: 'Работа с справочниками', link: '/help/dictionaries' },
              ]}
              renderItem={(item) => (
                <List.Item>
                  <Link to={item.link}>{item.title}</Link>
                </List.Item>
              )}
            />
          </Card>

          <Card title="Последние события" style={{ marginTop: 16 }}>
            <List
              size="small"
              dataSource={[
                'Программа "Основы веб-разработки" отправлена на экспертизу',
                'Новый эксперт назначен на программу "IT-менеджмент"',
                'Обновлены справочники направлений подготовки',
                'Система обновлена до версии 2.1.0'
              ]}
              renderItem={(item) => (
                <List.Item>
                  <ClockCircleOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                  <Text style={{ flex: 1 }}>{item}</Text>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
