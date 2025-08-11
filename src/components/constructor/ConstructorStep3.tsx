import React, { useEffect, useState } from "react";
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

  const [author1, setAuthor1] = useState(value.author1 || "");
  const [author2, setAuthor2] = useState(value.author2 || "");

  useEffect(() => {
    onChange({ author1, author2 });
  }, [author1, author2, onChange]);

  return (
    <Form layout="vertical">
      <Title level={4}>Лист согласования</Title>
      <Form.Item label="Соавтор 1">
        <Select
          value={author1}
          onChange={setAuthor1}
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
          value={author2}
          onChange={setAuthor2}
          loading={loadingAuthors}
          disabled={!author1}
          placeholder="Выберите второго автора"
          allowClear
        >
          {authors.map((u) => (
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