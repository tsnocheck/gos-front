import React from 'react';
import { Select, Form, Typography } from 'antd';
import type { ExtendedProgram } from '@/types';
import { useProgramDictionaries } from '@/hooks/useProgramDictionaries';
import RecommendationSuggestionInput from '../shared/RecommendationSuggestionInput';
import { RecommendationField } from '@/types/recommendation';

const { Option } = Select;
const { Title } = Typography;

interface Props {
  value: ExtendedProgram;
  onChange: (data: ExtendedProgram) => void;
}

const ConstructorStep2: React.FC<Props> = ({ value, onChange }) => {
  const { institutions: institutionList } = useProgramDictionaries();

  return (
    <Form layout="vertical">
      <Title level={4}>Титульный лист программы</Title>
      <Form.Item label="Учреждение">
        <Select
          value={value.institution}
          onChange={(v) => {
            onChange({ institution: v, customInstitution: '' });
          }}
          placeholder="Выберите учреждение"
        >
          {institutionList?.map((inst) => (
            <Option key={inst.id} value={inst.id}>
              {inst.value}
            </Option>
          ))}
          <Option value="other">Иное</Option>
        </Select>
      </Form.Item>
      {value.institution === 'other' && (
        <Form.Item>
          <RecommendationSuggestionInput
            label="Ваше учреждение"
            value={value.customInstitution}
            onChange={(val) => onChange({ customInstitution: val })}
            placeholder="Введите наименование учреждения"
            type={RecommendationField.CUSTOM_INSTITUTION}
          />
        </Form.Item>
      )}
      <Form.Item>
        <RecommendationSuggestionInput
          label="Название программы"
          value={value.title}
          onChange={(val) => onChange({ title: val })}
          placeholder="Введите название программы"
          type={RecommendationField.TITLE}
        />
      </Form.Item>
    </Form>
  );
};

export default ConstructorStep2;
