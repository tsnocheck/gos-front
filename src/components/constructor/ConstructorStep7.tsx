import React from 'react';
import { Table, Button, Input, Typography, Checkbox, Select, Tabs } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { ExtendedProgram, NetworkOrg, Topic, Module, TopicContent } from '@/types';
import { programSection } from '@/types';

const { Title } = Typography;

interface Props {
  value: ExtendedProgram;
  onChange: (data: ExtendedProgram) => void;
}

const ConstructorStep7: React.FC<Props> = ({ value, onChange }) => {
  const modules: Module[] = value.modules ?? [];

  const updateModule = (moduleIndex: number, updated: Partial<Module>) => {
    onChange({
      modules: modules.map((m, i) => (i === moduleIndex ? { ...m, ...updated } : m)),
    });
  };

  // Thematic plan (topics) per module
  const addTopic = (moduleIndex: number) => {
    const current = modules[moduleIndex]?.topics ?? [];
    updateModule(moduleIndex, {
      topics: [...current, { name: '' }],
    });
  };

  const updateTopic = (
    moduleIndex: number,
    idx: number,
    field: keyof Topic,
    v: Topic[typeof field],
  ) => {
    const current = modules[moduleIndex]?.topics ?? [];
    updateModule(moduleIndex, {
      topics: current.map((row, i) => (i === idx ? { ...row, [field]: v } : row)),
    });
  };

  const removeTopic = (moduleIndex: number, idx: number) => {
    const current = modules[moduleIndex]?.topics ?? [];
    updateModule(moduleIndex, {
      topics: current.filter((_, i) => i !== idx),
    });
  };

  // Network per module
  const addNetwork = (moduleIndex: number) => {
    const current = modules[moduleIndex]?.network ?? [];
    updateModule(moduleIndex, {
      network: [...current, { org: '', participation: '', form: '' }],
    });
  };

  const updateNetwork = (
    moduleIndex: number,
    idx: number,
    field: keyof NetworkOrg,
    v: NetworkOrg[typeof field],
  ) => {
    const current = modules[moduleIndex]?.network ?? [];
    updateModule(moduleIndex, {
      network: current.map((row, i) => (i === idx ? { ...row, [field]: v } : row)),
    });
  };

  const removeNetwork = (moduleIndex: number, idx: number) => {
    const current = modules[moduleIndex]?.network ?? [];
    updateModule(moduleIndex, {
      network: current.filter((_, i) => i !== idx),
    });
  };

  // Topic content editors inside a topic
  const ensureTopicContent = (
    moduleIndex: number,
    topicIndex: number,
    key: keyof Pick<Topic, 'lecture' | 'practice' | 'distant'>,
  ): TopicContent => {
    const topic = modules[moduleIndex]?.topics?.[topicIndex];
    const current = (topic?.[key] as TopicContent) ?? { content: [], forms: [], hours: 0 };
    if (!topic?.[key]) {
      updateTopic(moduleIndex, topicIndex, key, current as Topic[typeof key]);
    }
    return current;
  };

  const updateTopicContent = (
    moduleIndex: number,
    topicIndex: number,
    key: keyof Pick<Topic, 'lecture' | 'practice' | 'distant'>,
    field: keyof TopicContent,
    value: TopicContent[typeof field],
  ) => {
    const base = ensureTopicContent(moduleIndex, topicIndex, key);
    const next = { ...base, [field]: value } as TopicContent;
    updateTopic(moduleIndex, topicIndex, key, next as Topic[typeof key]);
  };

  const TopicContentEditor: React.FC<{
    moduleIndex: number;
    topicIndex: number;
    kind: 'lecture' | 'practice' | 'distant';
    title: string;
    hideForms?: boolean;
  }> = ({ moduleIndex, topicIndex, kind, title, hideForms }) => {
    const tc = ensureTopicContent(moduleIndex, topicIndex, kind);
    return (
      <div style={{ marginBottom: 12 }}>
        <Typography.Text strong>{title}</Typography.Text>
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: 8, marginTop: 8 }}
        >
          <Select
            mode="tags"
            value={tc.content}
            onChange={(val) => updateTopicContent(moduleIndex, topicIndex, kind, 'content', val)}
            placeholder="Содержание"
            style={{ width: '100%', maxWidth: '100%' }}
            maxTagTextLength={25}
          />
          {!hideForms ? (
            <Select
              mode="tags"
              value={tc.forms}
              onChange={(val) => updateTopicContent(moduleIndex, topicIndex, kind, 'forms', val)}
              placeholder="Формы организации"
              style={{ width: '100%', maxWidth: '100%' }}
              maxTagTextLength={25}
            />
          ) : (
            <div />
          )}
          <Input
            type="number"
            value={tc.hours}
            onChange={(e) =>
              updateTopicContent(moduleIndex, topicIndex, kind, 'hours', Number(e.target.value))
            }
            placeholder="Часы"
          />
        </div>
      </div>
    );
  };

  const tabItems = modules.map((module, moduleIndex) => ({
    key: String(moduleIndex),
    label: `${programSection.short[module.section]} ${module.code}`,
    children: (
      <div style={{ marginBottom: 32 }}>
        <Title level={5}>{module.name}</Title>

        <Button onClick={() => addTopic(moduleIndex)} style={{ marginBottom: 12 }}>
          Добавить тему
        </Button>
        <Table<Topic>
          dataSource={module.topics}
          rowKey={(_, i) => i!}
          pagination={false}
          columns={
            [
              {
                title: 'Тема',
                dataIndex: 'name',
                render: (v: string, _row: Topic, i: number) => (
                  <Input
                    value={v}
                    onChange={(e) => updateTopic(moduleIndex, i, 'name', e.target.value)}
                    style={{ minWidth: 400 }}
                  />
                ),
              },
              {
                title: '',
                render: (_: unknown, __: Topic, i: number) => (
                  <Button danger size="small" onClick={() => removeTopic(moduleIndex, i)}>
                    Удалить
                  </Button>
                ),
              },
            ] as ColumnsType<Topic>
          }
          expandable={{
            expandedRowRender: (_record: Topic, i: number) => (
              <div style={{ background: '#fafafa', padding: 12 }}>
                <TopicContentEditor
                  moduleIndex={moduleIndex}
                  topicIndex={i}
                  kind="lecture"
                  title="Содержание лекционных занятий"
                  hideForms
                />
                <TopicContentEditor
                  moduleIndex={moduleIndex}
                  topicIndex={i}
                  kind="practice"
                  title="Содержание практических занятий"
                />
                <TopicContentEditor
                  moduleIndex={moduleIndex}
                  topicIndex={i}
                  kind="distant"
                  title="Содержание самостоятельной работы в режиме дистанционного обучения"
                />
              </div>
            ),
          }}
          style={{ marginBottom: 16 }}
        />

        <Checkbox
          checked={!!module.networkEnabled}
          onChange={(e) => updateModule(moduleIndex, { networkEnabled: e.target.checked })}
        >
          Сетевая форма реализации программы
        </Checkbox>
        {module.networkEnabled && (
          <>
            <Button onClick={() => addNetwork(moduleIndex)} style={{ margin: '12px 0' }}>
              Добавить организацию
            </Button>
            <Table<NetworkOrg>
              dataSource={module.network}
              rowKey={(_, i) => i!}
              pagination={false}
              columns={
                [
                  {
                    title: 'Наименование организации',
                    dataIndex: 'org',
                    render: (v: string, _r: NetworkOrg, i: number) => (
                      <Input
                        value={v}
                        onChange={(e) => updateNetwork(moduleIndex, i, 'org', e.target.value)}
                      />
                    ),
                  },
                  {
                    title: 'Участие в реализации',
                    dataIndex: 'participation',
                    render: (v: string, _r: NetworkOrg, i: number) => (
                      <Input
                        value={v}
                        onChange={(e) =>
                          updateNetwork(moduleIndex, i, 'participation', e.target.value)
                        }
                      />
                    ),
                  },
                  {
                    title: 'Форма участия',
                    dataIndex: 'form',
                    render: (v: string, _r: NetworkOrg, i: number) => (
                      <Input
                        value={v}
                        onChange={(e) => updateNetwork(moduleIndex, i, 'form', e.target.value)}
                      />
                    ),
                  },
                  {
                    title: '',
                    render: (_: unknown, __: NetworkOrg, i: number) => (
                      <Button danger size="small" onClick={() => removeNetwork(moduleIndex, i)}>
                        Удалить
                      </Button>
                    ),
                  },
                ] as ColumnsType<NetworkOrg>
              }
            />
          </>
        )}
      </div>
    ),
  }));

  return (
    <div>
      <Title level={4}>Учебно-тематический план</Title>
      {modules.length === 0 ? (
        <Typography.Paragraph>Сначала добавьте модули на шаге «Учебный план».</Typography.Paragraph>
      ) : (
        <Tabs items={tabItems} />
      )}
    </div>
  );
};

export default ConstructorStep7;
