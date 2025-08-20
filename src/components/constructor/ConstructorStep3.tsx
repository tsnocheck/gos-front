import React, { useMemo } from "react";
import { Select, Form, Typography, Button, Space } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import type { CreateProgramForm } from "../../types/program";
import { useAvailableAuthors } from "@/queries/programs";

const { Option } = Select;
const { Title } = Typography;

interface Props {
  value: Partial<CreateProgramForm>;
  onChange: (data: Partial<CreateProgramForm>) => void;
}

const ConstructorStep3: React.FC<Props> = ({ value, onChange }) => {
  const { data: authors = [], isLoading: loadingAuthors } =
    useAvailableAuthors();

  const availableAuthors = useMemo(() => {
    return authors.filter((author) => !value.coAuthorIds?.includes(author.id));
  }, [authors, value]);

  const getAuthorNameById = (id: string) => {
    const author = authors.find((author) => author.id === id);
    return `${author?.lastName ?? ""} ${author?.firstName ?? ""} ${
      author?.middleName ?? ""
    }`;
  };

  const addCoAuthor = () =>
    onChange({ coAuthorIds: [...(value.coAuthorIds ?? []), ""] });

  const removeCoAuthor = (index: number) =>
    onChange({ coAuthorIds: value.coAuthorIds?.filter((_, i) => i !== index) });

  const updateCoAuthor = (index: number, authorId: string) =>
    onChange({
      coAuthorIds: value.coAuthorIds?.map((id, i) => (i === index ? authorId : id)),
    });

  return (
    <Form layout="vertical">
      <Title level={4}>Лист согласования</Title>
      {/* Соавторы */}
      <Form.Item label="Соавторы">
        <Space direction="vertical" style={{ width: "100%" }}>
          {value.coAuthorIds?.map((authorId, index) => (
            <Space key={index} style={{ width: "100%" }}>
              <Select
                value={getAuthorNameById(authorId)}
                onChange={(v) => updateCoAuthor(index, v)}
                loading={loadingAuthors}
                placeholder={`Выберите соавтора ${index + 1}`}
                style={{ flex: 1, minWidth: 400 }}
                allowClear
              >
                {availableAuthors.map((u) => (
                  <Option key={u.id} value={u.id}>
                    {u.lastName} {u.firstName} {u.middleName}
                  </Option>
                ))}
              </Select>
              <Button
                type="text"
                danger
                icon={<MinusCircleOutlined />}
                onClick={() => removeCoAuthor(index)}
              />
            </Space>
          ))}

          <Button
            type="dashed"
            onClick={addCoAuthor}
            {...{ icon: availableAuthors.length && <PlusOutlined /> }}
            style={{ width: "100%" }}
            disabled={!availableAuthors.length}
          >
            {availableAuthors.length
              ? "Добавить соавтора"
              : "Нет доступных авторов"}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default ConstructorStep3;
