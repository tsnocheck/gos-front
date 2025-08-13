import React from "react";
import { Table, Button, Input, Typography, Checkbox } from "antd";
import type { CreateProgramForm, NetworkOrg, Topic } from "@/types";

const { Title } = Typography;

interface Props {
  value: Partial<CreateProgramForm>;
  onChange: (data: Partial<CreateProgramForm>) => void;
}

const ConstructorStep7: React.FC<Props> = ({ value, onChange }) => {
  const addTopic = () =>
    onChange({
      topics: [
        ...(value.topics ?? []),
        {
          name: "",
          lecture: 0,
          practice: 0,
          distant: 0,
          content: [],
          forms: [],
          hours: 0,
        },
      ],
    });

  const updateTopic = (
    idx: number,
    field: keyof Topic,
    v: Topic[typeof field]
  ) => {
    onChange({
      topics:
        value.topics?.map((row, i) =>
          i === idx ? { ...row, [field]: v } : row
        ) ?? [],
    });
  };

  const removeTopic = (idx: number) =>
    onChange({ topics: (value.topics ?? []).filter((_, i) => i !== idx) });

  const addNetwork = () =>
    onChange({
      network: [
        ...(value.network ?? []),
        {
          org: "",
          participation: "",
          form: "",
        },
      ],
    });

  const updateNetwork = (
    idx: number,
    field: keyof NetworkOrg,
    v: NetworkOrg[typeof field]
  ) =>
    onChange({
      network: (value.network ?? []).map((row, i) =>
        i === idx ? { ...row, [field]: v } : row
      ),
    });

  const removeNetwork = (idx: number) =>
    onChange({ network: (value.network ?? []).filter((_, i) => i !== idx) });

  return (
    <div>
      <Title level={4}>Учебно-тематический план</Title>
      <Button onClick={addTopic} style={{ marginBottom: 12 }}>
        Добавить тему
      </Button>
      <Table
        dataSource={value.topics}
        rowKey={(_, i) => i!}
        pagination={false}
        columns={[
          {
            title: "Тема",
            dataIndex: "name",
            render: (v, r, i) => (
              <Input
                value={v}
                onChange={(e) => updateTopic(i, "name", e.target.value)}
                style={{ minWidth: 400 }}
              />
            ),
          },
          {
            title: "Часы лекции",
            dataIndex: "lecture",
            render: (v, r, i) => (
              <Input
                type="number"
                value={v}
                onChange={(e) =>
                  updateTopic(i, "lecture", Number(e.target.value))
                }
              />
            ),
          },
          {
            title: "Часы практики",
            dataIndex: "practice",
            render: (v, r, i) => (
              <Input
                type="number"
                value={v}
                onChange={(e) =>
                  updateTopic(i, "practice", Number(e.target.value))
                }
              />
            ),
          },
          {
            title: "Дистанционное обучение",
            dataIndex: "distant",
            render: (v, r, i) => (
              <Input
                type="number"
                value={v}
                onChange={(e) =>
                  updateTopic(i, "distant", Number(e.target.value))
                }
              />
            ),
          },
          {
            title: "",
            render: (_, __, i) => (
              <Button danger size="small" onClick={() => removeTopic(i)}>
                Удалить
              </Button>
            ),
          },
        ]}
        style={{ marginBottom: 32 }}
      />
      <Checkbox
        checked={value.networkEnabled}
        onChange={(e) => onChange({ networkEnabled: e.target.checked })}
      >
        Сетевая форма реализации программы
      </Checkbox>
      {value.networkEnabled && (
        <>
          <Button onClick={addNetwork} style={{ margin: "12px 0" }}>
            Добавить организацию
          </Button>
          <Table
            dataSource={value.network}
            rowKey={(_, i) => i!}
            pagination={false}
            columns={[
              {
                title: "Наименование организации",
                dataIndex: "org",
                render: (v, r, i) => (
                  <Input
                    value={v}
                    onChange={(e) => updateNetwork(i, "org", e.target.value)}
                  />
                ),
              },
              {
                title: "Участие в реализации",
                dataIndex: "participation",
                render: (v, r, i) => (
                  <Input
                    value={v}
                    onChange={(e) =>
                      updateNetwork(i, "participation", e.target.value)
                    }
                  />
                ),
              },
              {
                title: "Форма участия",
                dataIndex: "form",
                render: (v, r, i) => (
                  <Input
                    value={v}
                    onChange={(e) => updateNetwork(i, "form", e.target.value)}
                  />
                ),
              },
              {
                title: "",
                render: (_, __, i) => (
                  <Button danger size="small" onClick={() => removeNetwork(i)}>
                    Удалить
                  </Button>
                ),
              },
            ]}
          />
        </>
      )}
    </div>
  );
};

export default ConstructorStep7;
