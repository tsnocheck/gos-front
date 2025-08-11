import React, { useEffect, useState } from "react";
import { Input, Select, Form, Typography } from "antd";
import type { CreateProgramForm } from "../../types/program";
import { useProgramDictionaries } from "@/hooks/useProgramDictionaries";

const { Option } = Select;
const { Title } = Typography;

interface Props {
  value: Partial<CreateProgramForm>;
  onChange: (data: Partial<CreateProgramForm>) => void;
}

const ConstructorStep2: React.FC<Props> = ({ value, onChange }) => {
  const [customInstitution, setCustomInstitution] = useState(value.customInstitution || "");
  const [institution, setInstitution] = useState(value.institution || "");
  const [title, setTitle] = useState(value.title || "");

  const { institutions: institutionList } = useProgramDictionaries()


  useEffect(() => {
    onChange({ institution, customInstitution, title });
  }, [institution, customInstitution, title, onChange]);

  return (
    <Form layout="vertical">
      <Title level={4}>Титульный лист программы</Title>
      <Form.Item label="Учреждение">
        <Select
          value={institution}
          onChange={setInstitution}
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
      {institution === "other" && (
        <Form.Item label="Ваше учреждение">
          <Input
            value={customInstitution}
            onChange={(e) => setCustomInstitution(e.target.value)}
            placeholder="Введите наименование учреждения"
          />
        </Form.Item>
      )}
      <Form.Item label="Название программы">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Введите название программы"
        />
      </Form.Item>
    </Form>
  );
};

export default ConstructorStep2; 