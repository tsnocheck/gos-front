import React, { useMemo } from "react";
import { Select, Form, Typography } from "antd";
import type { CreateProgramForm } from "../../types/program";
import { useAvailableAuthors } from "@/queries/programs";

const { Option } = Select;
const { Title } = Typography;

interface Props {
  value: Partial<CreateProgramForm>;
  onChange: (data: Partial<CreateProgramForm>) => void;
}

const ConstructorStep3: React.FC<Props> = ({ value, onChange }) => {
  const { data: authors = [], isLoading: loadingAuthors } = useAvailableAuthors();

  const omittedAuthors = useMemo(() => authors.filter(({id}) => value.author1Id !== id), [value.author1Id])

  return (
    <Form layout="vertical">
      <Title level={4}>Лист согласования</Title>
      <Form.Item label="Соавтор 1">
        <Select
          value={value.author1Id}
          onChange={(v) => onChange({ author1Id: v })}
          loading={loadingAuthors}
          placeholder="Выберите автора"
          allowClear
        >
          {authors?.map((u) => (
            <Option key={u.id} value={u.id}>
              {u.lastName} {u.firstName} {u.middleName}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Соавтор 2">
        <Select
          value={value.author2Id}
          onChange={(v) => onChange({ author2Id: v })}
          loading={loadingAuthors}
          disabled={!value.author1Id}
          placeholder="Выберите второго автора"
          allowClear
        >
          {omittedAuthors.map((u) => (
            <Option key={u.id} value={u.id}>
              {u.lastName} {u.firstName} {u.middleName}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
};

export default ConstructorStep3; 