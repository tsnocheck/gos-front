import React, { useCallback, useMemo } from 'react';
import { Form, Input, Select, Table, Typography } from 'antd';
import { standards, type ExtendedProgram } from '@/types';
import { useProgramDictionaries } from '@/hooks/useProgramDictionaries';
import RecommendationSuggestionInput from '../shared/RecommendationSuggestionInput';
import EditableTagsSelect from '../shared/EditableTagsSelect';
import { RecommendationField } from '@/types/recommendation';

const { Title } = Typography;

interface Props {
  value: ExtendedProgram;
  onChange: (data: ExtendedProgram) => void;
}

const ConstructorStep5: React.FC<Props> = ({ value, onChange }) => {
  const [form] = Form.useForm<ExtendedProgram>();

  const selectedFunctions = Form.useWatch<string[] | undefined>('functions', form);

  const { functions, getActions, categories, educationForms, duties, getDictionaryById } =
    useProgramDictionaries();

  const actions = useMemo(() => getActions(selectedFunctions ?? []), [selectedFunctions]);

  const handleValuesChange = useCallback(
    (changedValues: ExtendedProgram) => {
      if (changedValues.functions) form.setFieldValue('actions', []);

      onChange(form.getFieldsValue());
    },
    [form, onChange],
  );

  return (
    <Form form={form} layout="vertical" initialValues={value} onValuesChange={handleValuesChange}>
      <Title level={4}>Характеристика программы</Title>

      <Form.Item name="relevance">
        <RecommendationSuggestionInput
          label="Актуальность разработки программы"
          value={value.relevance}
          onChange={(val) => onChange({ relevance: val })}
          placeholder="Введите актуальность программы"
          type={RecommendationField.RELEVANCE}
          rows={2}
        />
      </Form.Item>

      <Form.Item name="goal">
        <RecommendationSuggestionInput
          label="Цель реализации программы"
          value={value.goal}
          onChange={(val) => onChange({ goal: val })}
          placeholder="Введите цель программы"
          type={RecommendationField.GOAL}
          rows={2}
        />
      </Form.Item>

      <Form.Item name="standard" label="Проф. стандарт/ЕКС">
        <Select
          placeholder="Выберите стандарт"
          options={Object.entries(standards).map(([value, label]) => ({
            value,
            label,
          }))}
        />
      </Form.Item>

      {(value.standard === 'professional-standard' || value.standard === 'both') && (
        <div style={{ display: 'flex', width: '100%', gap: 20 }}>
          <Form.Item name="functions" label="Трудовые функции" style={{ flex: 1, minWidth: 0 }}>
            <EditableTagsSelect
              value={value.functions || []}
              onChange={(val) => {
                onChange({ functions: val });
                if (val.length === 0) onChange({ actions: [] });
              }}
              options={functions?.map((f) => ({
                value: f.id,
                label: f.value,
              }))}
              placeholder="Выберите трудовые функции"
              style={{ width: '100%', maxWidth: '100%' }}
              maxTagTextLength={30}
            />
          </Form.Item>
          <Form.Item name="actions" label="Трудовые действия" style={{ flex: 1, minWidth: 0 }}>
            <EditableTagsSelect
              value={value.actions || []}
              onChange={(val) => onChange({ actions: val })}
              options={actions?.map((a) => ({
                value: a.id,
                label: a.value,
              }))}
              disabled={!selectedFunctions?.length}
              placeholder="Выберите трудовые действия"
              style={{ width: '100%', maxWidth: '100%' }}
              maxTagTextLength={30}
            />
          </Form.Item>
        </div>
      )}

      {(value.standard === 'eks' || value.standard === 'both') && (
        <Form.Item name="duties" label="Должностные обязанности">
          <EditableTagsSelect
            value={value.duties || []}
            onChange={(val) => onChange({ duties: val })}
            options={duties?.map((d) => ({ value: d.id, label: d.value }))}
            placeholder="Выберите должностные обязанности"
            style={{ width: '100%', maxWidth: '100%' }}
            maxTagTextLength={30}
          />
        </Form.Item>
      )}

      <Form.Item name="know" label="Знать">
        <EditableTagsSelect
          value={value.know || []}
          onChange={(val) => onChange({ know: val })}
          placeholder="Введите знания"
          style={{ width: '100%', maxWidth: '100%' }}
          maxTagTextLength={30}
        />
      </Form.Item>

      <Form.Item name="can" label="Уметь">
        <EditableTagsSelect
          value={value.can || []}
          onChange={(val) => onChange({ can: val })}
          placeholder="Введите умения"
          style={{ width: '100%', maxWidth: '100%' }}
          maxTagTextLength={30}
        />
      </Form.Item>

      <Form.Item name="category" label="Категория слушателей">
        <Select
          showSearch
          mode="tags"
          maxCount={1}
          placeholder="Выберите или введите категорию слушателей"
          options={categories?.map((c) => ({ value: c.id, label: c.value }))}
          filterOption={(input, option) =>
            (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
          }
          value={value.category ? [value.category] : []}
          onChange={(val) => onChange({ category: val[0] })}
        />
      </Form.Item>

      {value.category && (
        <div style={{ textAlign: 'center', marginBottom: 10, fontWeight: 'bold' }}>
          {getDictionaryById(value.category)?.value ?? value.category}
        </div>
      )}

      <Table
        bordered
        pagination={false}
        style={{ marginBottom: 10 }}
        columns={[
          ...(value.standard === 'professional-standard' || value.standard === 'both'
            ? [
                { title: 'Трудовые функции', dataIndex: 'functions' },
                { title: 'Трудовые действия', dataIndex: 'actions' },
              ]
            : []),

          ...(value.standard === 'eks' || value.standard === 'both'
            ? [{ title: 'Должностные обязанности', dataIndex: 'duties' }]
            : []),

          { title: 'Знать', dataIndex: 'know' },
          { title: 'Уметь', dataIndex: 'can' },
        ]}
        dataSource={[
          {
            key: 1,
            functions: value.functions?.map((id) => (
              <p style={{ marginBottom: 1 }}>&bull; {getDictionaryById(id)?.value ?? id}</p>
            )),
            actions: value.actions?.map((id) => (
              <p style={{ marginBottom: 1 }}>&bull; {getDictionaryById(id)?.value ?? id}</p>
            )),
            duties: value.duties?.map((id) => (
              <p style={{ marginBottom: 1 }}>&bull; {getDictionaryById(id)?.value ?? id}</p>
            )),
            know: value.know?.map((value) => <p style={{ marginBottom: 1 }}>&bull; {value}</p>),
            can: value.can?.map((value) => <p style={{ marginBottom: 1 }}>&bull; {value}</p>),
          },
        ]}
      />

      <Form.Item name="educationForm" label="Форма обучения">
        <Select
          options={educationForms?.map((f) => ({
            value: f.id,
            label: f.value,
          }))}
        />
      </Form.Item>

      <Form.Item name="term" label="Срок освоения программы (часы)">
        <Input type="number" min={1} style={{ width: 120 }} />
      </Form.Item>
    </Form>
  );
};

export default ConstructorStep5;
