import React from 'react';
import { Typography, Card, List, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title } = Typography;

const mockPrograms = [
  {
    id: '1',
    name: 'Демо программа 1',
    description: 'Описание демо программы 1',
    status: 'Черновик',
  },
  {
    id: '2',
    name: 'Демо программа 2', 
    description: 'Описание демо программы 2',
    status: 'Активна',
  },
];

export const ProgramsListPage: React.FC = () => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <Title level={2}>Программы</Title>
        <Link to="/programs/constructor">
          <Button type="primary" icon={<PlusOutlined />}>
            Создать программу
          </Button>
        </Link>
      </div>

      <Card>
        <List
          dataSource={mockPrograms}
          renderItem={(program) => (
            <List.Item>
              <List.Item.Meta
                title={program.name}
                description={program.description}
              />
              <div>{program.status}</div>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};
