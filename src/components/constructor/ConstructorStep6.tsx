import React, { useState, useEffect } from "react";
import { Table, Button, Input, Typography, Select } from "antd";
import {
  attestationForms,
  programSection,
  ProgramSection,
  type Attestation,
  type CreateProgramForm,
  type Module,
} from "@/types";

const { Title } = Typography;
const { Option } = Select;

interface Props {
  value: Partial<CreateProgramForm>;
  onChange: (data: Partial<CreateProgramForm>) => void;
}

const ConstructorStep6: React.FC<Props> = ({ value, onChange }) => {
  const [modules, setModules] = useState<Module[]>(value.modules || []);
  const [attestations, setAttestations] = useState<Attestation[]>(
    value.attestations || []
  );

  useEffect(() => {
    onChange({ modules, attestations });
  }, [modules, attestations]);

  const addModule = () =>
    setModules((prev) => [
      ...prev,
      {
        section: ProgramSection.NPR,
        code: "",
        name: "",
        lecture: 0,
        practice: 0,
        distant: 0,
        kad: 0,
      },
    ]);
  const addAttestation = () =>
    setAttestations((prev) => [
      ...prev,
      { name: "", lecture: 0, practice: 0, distant: 0, form: "" },
    ]);

  const updateModule = (idx: number, field: keyof Module, value: any) => {
    setModules((prev) =>
      prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row))
    );
  };
  const updateAttestation = (
    idx: number,
    field: keyof Attestation,
    value: any
  ) => {
    setAttestations((prev) =>
      prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row))
    );
  };
  const removeModule = (idx: number) =>
    setModules((prev) => prev.filter((_, i) => i !== idx));
  const removeAttestation = (idx: number) =>
    setAttestations((prev) => prev.filter((_, i) => i !== idx));

  return (
    <div>
      <Title level={4}>Учебный план</Title>
      <Button onClick={addModule} style={{ marginBottom: 12 }}>
        Добавить модуль
      </Button>
      <Table
        dataSource={modules}
        rowKey={(_, i) => i!}
        pagination={false}
        columns={[
          {
            title: "Раздел",
            dataIndex: "section",
            render: (v, r, i) => (
              <Select
                value={v}
                onChange={(val) => updateModule(i, "section", val)}
                style={{ width: 200 }}
              >
                {Object.entries(programSection.full).map(([key, label]) => (
                  <Option key={key} value={key}>
                    {label}
                  </Option>
                ))}
              </Select>
            ),
          },
          {
            title: "Код",
            dataIndex: "code",
            render: (v, r, i) => (
              <Input
                value={v}
                onChange={(e) => updateModule(i, "code", e.target.value)}
              />
            ),
          },
          {
            title: "Название модуля",
            dataIndex: "name",
            render: (v, r, i) => (
              <Input
                value={v}
                onChange={(e) => updateModule(i, "name", e.target.value)}
              />
            ),
          },
          {
            title: "Лекц. ч.",
            dataIndex: "lecture",
            render: (v, r, i) => (
              <Input
                type="number"
                value={v}
                onChange={(e) =>
                  updateModule(i, "lecture", Number(e.target.value))
                }
              />
            ),
          },
          {
            title: "Практ. ч.",
            dataIndex: "practice",
            render: (v, r, i) => (
              <Input
                type="number"
                value={v}
                onChange={(e) =>
                  updateModule(i, "practice", Number(e.target.value))
                }
              />
            ),
          },
          {
            title: "Дист. ч.",
            dataIndex: "distant",
            render: (v, r, i) => (
              <Input
                type="number"
                value={v}
                onChange={(e) =>
                  updateModule(i, "distant", Number(e.target.value))
                }
              />
            ),
          },
          {
            title: "Кол-во ауд. дней",
            dataIndex: "kad",
            render: (v, r, i) => (
              <Input
                type="number"
                value={v}
                onChange={(e) => updateModule(i, "kad", Number(e.target.value))}
              />
            ),
          },
          {
            title: "",
            render: (_, __, i) => (
              <Button danger size="small" onClick={() => removeModule(i)}>
                Удалить
              </Button>
            ),
          },
        ]}
        style={{ marginBottom: 32 }}
      />
      <Title level={5}>Аттестации</Title>
      <Button onClick={addAttestation} style={{ marginBottom: 12 }}>
        Добавить аттестацию
      </Button>
      <Table
        dataSource={attestations}
        rowKey={(_, i) => i!}
        pagination={false}
        columns={[
          {
            title: "Модуль",
            dataIndex: "moduleCode",
            render: (v, r, i) => (
              <Select
                value={v}
                defaultValue={"none"}
                onChange={(val) => updateAttestation(i, "moduleCode", val)}
                style={{ width: 200 }}
              >
                <Option key={'none'} value={"none"}>Без модуля</Option>
                {modules.map(({ section, code }) => (
                  <Option
                    key={`${section} ${code}`}
                    value={`${section} ${code}`}
                  >
                    {`${programSection.short[section]} ${code}`}
                  </Option>
                ))}
              </Select>
            ),
          },
          {
            title: "Название аттестации",
            dataIndex: "name",
            render: (v, r, i) => (
              <Input
                value={v}
                onChange={(e) => updateAttestation(i, "name", e.target.value)}
              />
            ),
          },
          {
            title: "Лекц. ч",
            dataIndex: "lecture",
            render: (v, r, i) => (
              <Input
                type="number"
                value={v}
                onChange={(e) =>
                  updateAttestation(i, "lecture", Number(e.target.value))
                }
              />
            ),
          },
          {
            title: "Практ. ч",
            dataIndex: "practice",
            render: (v, r, i) => (
              <Input
                type="number"
                value={v}
                onChange={(e) =>
                  updateAttestation(i, "practice", Number(e.target.value))
                }
              />
            ),
          },
          {
            title: "Дист. ч",
            dataIndex: "distant",
            render: (v, r, i) => (
              <Input
                type="number"
                value={v}
                onChange={(e) =>
                  updateAttestation(i, "distant", Number(e.target.value))
                }
              />
            ),
          },
          {
            title: "Форма",
            dataIndex: "form",
            render: (v, r, i) => (
              <Select
                value={v}
                onChange={(val) => updateAttestation(i, "form", val)}
                style={{ width: 120 }}
              >
                {attestationForms.map((f) => (
                  <Option key={f} value={f}>
                    {f}
                  </Option>
                ))}
              </Select>
            ),
          },
          {
            title: "",
            render: (_, __, i) => (
              <Button danger size="small" onClick={() => removeAttestation(i)}>
                Удалить
              </Button>
            ),
          },
        ]}
      />
    </div>
  );
};

export default ConstructorStep6;
