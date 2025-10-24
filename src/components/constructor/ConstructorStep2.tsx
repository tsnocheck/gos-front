import React, { useMemo } from 'react';
import { Select, Form, Typography } from 'antd';
import { DictionaryStatus, type ExtendedProgram } from '@/types';
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

  const filteredInstitutions = useMemo(() => {
    return institutionList?.filter((inst) => inst.status !== DictionaryStatus.INACTIVE) ?? [];
  }, [institutionList]);

  return (
    <Form layout="vertical">
      <Title level={4}>Титульный лист программы</Title>
      <Form.Item label="Организация, реализующая программу ДПО">
        <Select
          value={value.institution}
          onChange={(v) => {
            onChange({ institution: v, customInstitution: '' });
          }}
          placeholder="Выберите организацию"
          style={{ width: '100%' }}
        >
          {filteredInstitutions?.map((inst) => (
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
            label="Ваша организация"
            value={value.customInstitution}
            onChange={(val) => onChange({ customInstitution: val })}
            placeholder="Введите наименование организации"
            type={RecommendationField.CUSTOM_INSTITUTION}
          />
        </Form.Item>
      )}
      <Form.Item label="Вид дополнительной профессиональной программы">
        <Select
          value={value.type}
          onChange={(v) => onChange({ type: v })}
          placeholder="Выберите вид программы"
          style={{ width: '100%' }}
        >
          <Option value="Дополнительная профессиональная программа повышения квалификации">
            Дополнительная профессиональная программа повышения квалификации
          </Option>
          <Option value="Дополнительная профессиональная программа профессиональной переподготовки">
            Дополнительная профессиональная программа профессиональной переподготовки
          </Option>
        </Select>
      </Form.Item>
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
