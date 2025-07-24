import React, { useEffect, useState } from "react";
import { Input, Select, Form, Typography } from "antd";
import type { CreateProgramForm } from "../../types/program";

const { Option } = Select;
const { Title } = Typography;

interface Props {
  value: CreateProgramForm;
  onChange: (data: Partial<CreateProgramForm>) => void;
}

const institutionsMock = [
  { short_name: "КОИРО", full_name: "Калининградский областной институт развития образования" },
  { short_name: "ДПО", full_name: "Другое учреждение дополнительного образования" },
];

const ConstructorStep2: React.FC<Props> = ({ value, onChange }) => {
  const [customInstitution, setCustomInstitution] = useState(value.customInstitution || "");
  const [institution, setInstitution] = useState(value.institution || "");
  const [title, setTitle] = useState(value.title || "");

  useEffect(() => {
    onChange({ institution, customInstitution, title });
    // eslint-disable-next-line
  }, [institution, customInstitution, title]);

  return (
    <Form layout="vertical">
      <Title level={4}>Титульный лист программы</Title>
      <Form.Item label="Учреждение">
        <Select
          value={institution}
          onChange={setInstitution}
          placeholder="Выберите учреждение"
        >
          {institutionsMock.map((inst) => (
            <Option key={inst.short_name} value={inst.short_name}>
              {inst.short_name}
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