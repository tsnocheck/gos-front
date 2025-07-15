import React from 'react';
import { Typography, Card } from 'antd';

const { Title } = Typography;

export const ExpertisePage: React.FC = () => {
  return (
    <div>
      <Title level={2}>Экспертиза</Title>
      <Card>
        <p>Раздел экспертизы программ</p>
        <p>Здесь эксперты могут проводить экспертизу образовательных программ.</p>
      </Card>
    </div>
  );
};
