import React from "react";
import { Input, Select, Form, Typography } from "antd";
import type { ExtendedProgram } from "../../types/program";
import { useProgramDictionaries } from "@/hooks/useProgramDictionaries";

const { Option } = Select;
const { Title } = Typography;

interface Props {
  value: ExtendedProgram;
  onChange: (data: ExtendedProgram) => void;
}

const ConstructorStep2: React.FC<Props> = ({ value, onChange }) => {
  const { institutions: institutionList } = useProgramDictionaries()

  return (
    <Form layout="vertical">
      <Title level={4}>Титульный лист программы</Title>
      <Form.Item label="Учреждение">
        <Select
          value={value.institution}
          onChange={(v) => {onChange({ institution: v, customInstitution: '' });}}
          placeholder="Выберите учреждение"
        >
          {institutionList?.map((inst) => (
            <Option key={inst.value} value={inst.value}>
              {inst.value}
            </Option>
          ))}
          <Option value="other">Иное</Option>
        </Select>
      </Form.Item>
      {value.institution === "other" && (
        <Form.Item label="Ваше учреждение">
          <Input
            value={value.customInstitution}
            onChange={(e) => onChange({ customInstitution: e.target.value })}
            placeholder="Введите наименование учреждения"
          />
        </Form.Item>
      )}
      <Form.Item label="Название программы">
        <Input
          value={value.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Введите название программы"
        />
      </Form.Item>
    </Form>
  );
};

export default ConstructorStep2; 