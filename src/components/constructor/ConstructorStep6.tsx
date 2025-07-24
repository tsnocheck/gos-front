import React, { useState, useEffect } from "react";
import { Table, Button, Input, Form, Typography, Select, Space } from "antd";

const { Title } = Typography;
const { Option } = Select;

interface ModuleRow {
  code: string;
  name: string;
  lecture: number;
  practice: number;
  distant: number;
  total: number;
  kad: number;
}
interface AttestationRow {
  name: string;
  lecture: number;
  practice: number;
  distant: number;
  form: string;
  total: number;
}

interface Props {
  value: { modules?: ModuleRow[]; attestations?: AttestationRow[] };
  onChange: (data: { modules: ModuleRow[]; attestations: AttestationRow[] }) => void;
}

const attestationForms = ["Экзамен", "Зачёт"];

const ConstructorStep6: React.FC<Props> = ({ value, onChange }) => {
  const [modules, setModules] = useState<ModuleRow[]>(value.modules || []);
  const [attestations, setAttestations] = useState<AttestationRow[]>(value.attestations || []);

  useEffect(() => {
    onChange({ modules, attestations });
    // eslint-disable-next-line
  }, [modules, attestations]);

  const addModule = () => setModules((prev) => [...prev, { code: "", name: "", lecture: 0, practice: 0, distant: 0, total: 0, kad: 0 }]);
  const addAttestation = () => setAttestations((prev) => [...prev, { name: "", lecture: 0, practice: 0, distant: 0, form: "", total: 0 }]);

  const updateModule = (idx: number, field: keyof ModuleRow, value: any) => {
    setModules((prev) => prev.map((row, i) => i === idx ? { ...row, [field]: value } : row));
  };
  const updateAttestation = (idx: number, field: keyof AttestationRow, value: any) => {
    setAttestations((prev) => prev.map((row, i) => i === idx ? { ...row, [field]: value } : row));
  };
  const removeModule = (idx: number) => setModules((prev) => prev.filter((_, i) => i !== idx));
  const removeAttestation = (idx: number) => setAttestations((prev) => prev.filter((_, i) => i !== idx));

  return (
    <div>
      <Title level={4}>Учебный план</Title>
      <Button onClick={addModule} style={{ marginBottom: 12 }}>Добавить модуль</Button>
      <Table
        dataSource={modules}
        rowKey={(_, i) => i?.toString()}
        pagination={false}
        columns={[
          { title: "Код", dataIndex: "code", render: (v, r, i) => <Input value={v} onChange={e => updateModule(i, "code", e.target.value)} /> },
          { title: "Название модуля", dataIndex: "name", render: (v, r, i) => <Input value={v} onChange={e => updateModule(i, "name", e.target.value)} /> },
          { title: "Лект.", dataIndex: "lecture", render: (v, r, i) => <Input type="number" value={v} onChange={e => updateModule(i, "lecture", Number(e.target.value))} /> },
          { title: "Прак.", dataIndex: "practice", render: (v, r, i) => <Input type="number" value={v} onChange={e => updateModule(i, "practice", Number(e.target.value))} /> },
          { title: "Дист.", dataIndex: "distant", render: (v, r, i) => <Input type="number" value={v} onChange={e => updateModule(i, "distant", Number(e.target.value))} /> },
          { title: "Итого", dataIndex: "total", render: (v, r, i) => <Input type="number" value={v} onChange={e => updateModule(i, "total", Number(e.target.value))} /> },
          { title: "КАД", dataIndex: "kad", render: (v, r, i) => <Input type="number" value={v} onChange={e => updateModule(i, "kad", Number(e.target.value))} /> },
          { title: "", render: (_, __, i) => <Button danger size="small" onClick={() => removeModule(i)}>Удалить</Button> },
        ]}
        style={{ marginBottom: 32 }}
      />
      <Title level={5}>Аттестации</Title>
      <Button onClick={addAttestation} style={{ marginBottom: 12 }}>Добавить аттестацию</Button>
      <Table
        dataSource={attestations}
        rowKey={(_, i) => i?.toString()}
        pagination={false}
        columns={[
          { title: "Название аттестации", dataIndex: "name", render: (v, r, i) => <Input value={v} onChange={e => updateAttestation(i, "name", e.target.value)} /> },
          { title: "Лект.", dataIndex: "lecture", render: (v, r, i) => <Input type="number" value={v} onChange={e => updateAttestation(i, "lecture", Number(e.target.value))} /> },
          { title: "Прак.", dataIndex: "practice", render: (v, r, i) => <Input type="number" value={v} onChange={e => updateAttestation(i, "practice", Number(e.target.value))} /> },
          { title: "Дист.", dataIndex: "distant", render: (v, r, i) => <Input type="number" value={v} onChange={e => updateAttestation(i, "distant", Number(e.target.value))} /> },
          { title: "Форма", dataIndex: "form", render: (v, r, i) => <Select value={v} onChange={val => updateAttestation(i, "form", val)} style={{ width: 120 }}>{attestationForms.map(f => <Option key={f} value={f}>{f}</Option>)}</Select> },
          { title: "Итого", dataIndex: "total", render: (v, r, i) => <Input type="number" value={v} onChange={e => updateAttestation(i, "total", Number(e.target.value))} /> },
          { title: "", render: (_, __, i) => <Button danger size="small" onClick={() => removeAttestation(i)}>Удалить</Button> },
        ]}
      />
    </div>
  );
};

export default ConstructorStep6; 