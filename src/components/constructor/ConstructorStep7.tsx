import React, { useState, useEffect } from "react";
import { Table, Button, Input, Form, Typography, Checkbox } from "antd";

const { Title } = Typography;

interface TopicRow {
  name: string;
  lecture: number;
  practice: number;
  distant: number;
}
interface NetworkRow {
  org: string;
  participation: string;
  form: string;
}

interface Props {
  value: { topics?: TopicRow[]; network?: NetworkRow[]; networkEnabled?: boolean };
  onChange: (data: { topics: TopicRow[]; network: NetworkRow[]; networkEnabled: boolean }) => void;
}

const ConstructorStep7: React.FC<Props> = ({ value, onChange }) => {
  const [topics, setTopics] = useState<TopicRow[]>(value.topics || []);
  const [network, setNetwork] = useState<NetworkRow[]>(value.network || []);
  const [networkEnabled, setNetworkEnabled] = useState(!!value.networkEnabled);

  useEffect(() => {
    onChange({ topics, network, networkEnabled });
    // eslint-disable-next-line
  }, [topics, network, networkEnabled]);

  const addTopic = () => setTopics((prev) => [...prev, { name: "", lecture: 0, practice: 0, distant: 0 }]);
  const updateTopic = (idx: number, field: keyof TopicRow, value: any) => {
    setTopics((prev) => prev.map((row, i) => i === idx ? { ...row, [field]: value } : row));
  };
  const removeTopic = (idx: number) => setTopics((prev) => prev.filter((_, i) => i !== idx));

  const addNetwork = () => setNetwork((prev) => [...prev, { org: "", participation: "", form: "" }]);
  const updateNetwork = (idx: number, field: keyof NetworkRow, value: any) => {
    setNetwork((prev) => prev.map((row, i) => i === idx ? { ...row, [field]: value } : row));
  };
  const removeNetwork = (idx: number) => setNetwork((prev) => prev.filter((_, i) => i !== idx));

  return (
    <div>
      <Title level={4}>Учебно-тематический план</Title>
      <Button onClick={addTopic} style={{ marginBottom: 12 }}>Добавить тему</Button>
      <Table
        dataSource={topics}
        rowKey={(_, i) => i?.toString()}
        pagination={false}
        columns={[
          { title: "Тема", dataIndex: "name", render: (v, r, i) => <Input value={v} onChange={e => updateTopic(i, "name", e.target.value)} /> },
          { title: "Часы лекции", dataIndex: "lecture", render: (v, r, i) => <Input type="number" value={v} onChange={e => updateTopic(i, "lecture", Number(e.target.value))} /> },
          { title: "Часы практики", dataIndex: "practice", render: (v, r, i) => <Input type="number" value={v} onChange={e => updateTopic(i, "practice", Number(e.target.value))} /> },
          { title: "Дистанционное обучение", dataIndex: "distant", render: (v, r, i) => <Input type="number" value={v} onChange={e => updateTopic(i, "distant", Number(e.target.value))} /> },
          { title: "", render: (_, __, i) => <Button danger size="small" onClick={() => removeTopic(i)}>Удалить</Button> },
        ]}
        style={{ marginBottom: 32 }}
      />
      <Checkbox checked={networkEnabled} onChange={e => setNetworkEnabled(e.target.checked)}>
        Сетевая форма реализации программы
      </Checkbox>
      {networkEnabled && (
        <>
          <Button onClick={addNetwork} style={{ margin: "12px 0" }}>Добавить организацию</Button>
          <Table
            dataSource={network}
            rowKey={(_, i) => i?.toString()}
            pagination={false}
            columns={[
              { title: "Наименование организации", dataIndex: "org", render: (v, r, i) => <Input value={v} onChange={e => updateNetwork(i, "org", e.target.value)} /> },
              { title: "Участие в реализации", dataIndex: "participation", render: (v, r, i) => <Input value={v} onChange={e => updateNetwork(i, "participation", e.target.value)} /> },
              { title: "Форма участия", dataIndex: "form", render: (v, r, i) => <Input value={v} onChange={e => updateNetwork(i, "form", e.target.value)} /> },
              { title: "", render: (_, __, i) => <Button danger size="small" onClick={() => removeNetwork(i)}>Удалить</Button> },
            ]}
          />
        </>
      )}
    </div>
  );
};

export default ConstructorStep7; 