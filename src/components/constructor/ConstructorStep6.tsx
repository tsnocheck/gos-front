import React, { useCallback } from "react";
import { Table, Button, Input, Typography, Select, message } from "antd";
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

const emptyModule: Module = {
  section: ProgramSection.NPR,
  code: "",
  name: "",
  lecture: 0,
  practice: 0,
  distant: 0,
  kad: 0,
};

const emptyAttestation: Attestation = {
  moduleCode: "none",
  name: "",
  lecture: 0,
  practice: 0,
  distant: 0,
  form: "",
};

const fieldsTranslate: Record<string, string> = {
  lecture: 'Лекц. ',
  practice: "Практ. ",
  distant: 'Дист. '
}

const ConstructorStep6: React.FC<Props> = ({ value, onChange }) => {
  const handleAdd = useCallback(<T,>(field: keyof CreateProgramForm, item: T) => {
    onChange({
      [field]: [...(value[field] as T[] || []), item],
    });
  }, [onChange, value]);

  const handleRemove = useCallback(<T,>(field: keyof CreateProgramForm, idx: number) => {
    onChange({
      [field]: (value[field] as T[] || []).filter((_, i) => i !== idx),
    });
  }, [onChange, value]);

  const handleUpdate = useCallback(<T,>(
    field: keyof CreateProgramForm,
    idx: number,
    key: keyof T,
    val: any
  ) => {
    if (field === "modules") {
      const current = value.modules?.[idx];
      const updatedModule = { ...current, [key]: val } as Module;
      const duplicate = value.modules?.some((m, i) =>
        i !== idx && m.section === updatedModule.section && m.code === updatedModule.code
      );
      if (duplicate) {
        message.warning("Модуль с таким разделом и кодом уже существует");
        return;
      }
    }

    onChange({
      [field]: (value[field] as T[] || []).map((item, i) =>
        i === idx ? { ...item, [key]: val } : item
      ),
    });
  }, [onChange, value]);

  const moduleColumns = [
    {
      title: "Раздел",
      dataIndex: "section",
      render: (v: string, _: Module, i: number) => (
        <Select
          value={v}
          onChange={(val) => handleUpdate<Module>("modules", i, "section", val)}
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
      render: (v: string, _: Module, i: number) => (
        <Input style={{ width: 40 }} value={v} onChange={(e) => handleUpdate<Module>("modules", i, "code", e.target.value)} />
      ),
    },
    {
      title: "Название модуля",
      dataIndex: "name",
      render: (v: string, _: Module, i: number) => (
        <Input value={v} style={{ minWidth: 400 }} onChange={(e) => handleUpdate<Module>("modules", i, "name", e.target.value)} />
      ),
    },
    ...["lecture", "practice", "distant", "kad"].map((field) => ({
      title: field === "kad" ? "Кол-во ауд. дней" : `${fieldsTranslate[field]}ч.`,
      dataIndex: field,
      render: (v: number, _: Module, i: number) => (
        <Input
          type="number"
          value={v}
          onChange={(e) => handleUpdate<Module>("modules", i, field as keyof Module, Number(e.target.value))}
        />
      ),
    })),
    {
      title: "",
      render: (_: any, __: Module, i: number) => (
        <Button danger size="small" onClick={() => handleRemove<Module>("modules", i)}>
          Удалить
        </Button>
      ),
    },
  ];

  const attestationColumns = [
    {
      title: "Модуль",
      dataIndex: "moduleCode",
      render: (v: string, _: Attestation, i: number) => (
        <Select
          value={v}
          onChange={(val) => handleUpdate<Attestation>("attestations", i, "moduleCode", val)}
          style={{ width: 120 }}
        >
          <Option value="none">Без модуля</Option>
          {value.modules?.map(({ section, code }) => (
            <Option key={`${section} ${code}`} value={`${section} ${code}`}>
              {`${programSection.short[section]} ${code}`}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Название аттестации",
      dataIndex: "name",
      render: (v: string, _: Attestation, i: number) => (
        <Input value={v} style={{ width: 400 }} onChange={(e) => handleUpdate<Attestation>("attestations", i, "name", e.target.value)} />
      ),
    },
    ...["lecture", "practice", "distant"].map((field) => ({
      title: `${fieldsTranslate[field]}ч.`,
      dataIndex: field,
      render: (v: number, _: Attestation, i: number) => (
        <Input
          type="number"
          value={v}
          onChange={(e) => handleUpdate<Attestation>("attestations", i, field as keyof Attestation, Number(e.target.value))}
        />
      ),
    })),
    {
      title: "Форма",
      dataIndex: "form",
      render: (v: string, _: Attestation, i: number) => (
        <Select
          value={v}
          onChange={(val) => handleUpdate<Attestation>("attestations", i, "form", val)}
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
      render: (_: any, __: Attestation, i: number) => (
        <Button danger size="small" onClick={() => handleRemove<Attestation>("attestations", i)}>
          Удалить
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Title level={4}>Учебный план</Title>
      <Button onClick={() => handleAdd<Module>("modules", emptyModule)} style={{ marginBottom: 12 }}>
        Добавить модуль
      </Button>
      <Table
        dataSource={value.modules}
        rowKey={(_, i) => i!}
        pagination={false}
        columns={moduleColumns}
        style={{ marginBottom: 32 }}
      />

      <Title level={5}>Аттестации</Title>
      <Button onClick={() => handleAdd<Attestation>("attestations", emptyAttestation)} style={{ marginBottom: 12 }}>
        Добавить аттестацию
      </Button>
      <Table
        dataSource={value.attestations}
        rowKey={(_, i) => i!}
        pagination={false}
        columns={attestationColumns}
      />
    </div>
  );
};

export default ConstructorStep6;
