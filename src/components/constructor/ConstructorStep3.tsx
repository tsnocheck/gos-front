import React, { useMemo } from 'react';
import { Select, Form, Typography, Button, Space } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import type { ExtendedProgram } from '../../types/program';
import { useAvailableAuthors } from '@/queries/programs';

const { Option } = Select;
const { Title } = Typography;

interface Props {
  value: ExtendedProgram;
  onChange: (data: ExtendedProgram) => void;
}

const ConstructorStep3: React.FC<Props> = ({ value, onChange }) => {
  const { data: authors = [], isLoading: loadingAuthors } = useAvailableAuthors();

  const availableAuthors = useMemo(() => {
    return authors.filter((author) => !value.coAuthorIds?.includes(author.id));
  }, [authors, value]);

  const getAuthorNameById = (id: string) => {
    const author = authors.find((author) => author.id === id);
    if (author) {
      return `${author?.lastName ?? ''} ${author?.firstName ?? ''} ${author?.middleName ?? ''}`;
    }
    // Если автор не найден, возвращаем сам id (это может быть вручную введенное имя)
    return id;
  };

  const addCoAuthor = () => onChange({ coAuthorIds: [...(value.coAuthorIds ?? []), ''] });

  const removeCoAuthor = (index: number) =>
    onChange({ coAuthorIds: value.coAuthorIds?.filter((_, i) => i !== index) });

  const updateCoAuthor = (index: number, authorId: string) =>
    onChange({
      coAuthorIds: value.coAuthorIds?.map((id, i) => (i === index ? authorId : id)),
    });

  return (
    <Form layout="vertical">
      <Title level={4}>Выбор соавторов</Title>
      {/* Соавторы */}
      <Form.Item label="Соавторы">
        <Space direction="vertical" style={{ width: '100%' }}>
          {value.coAuthorIds?.map((authorId, index) => (
            <Space key={index} style={{ width: '100%' }}>
              <Select
                mode="tags"
                maxCount={1}
                value={authorId ? [getAuthorNameById(authorId)] : []}
                onChange={(values) => updateCoAuthor(index, values[0] || '')}
                loading={loadingAuthors}
                placeholder="Выберите из списка или введите вручную (ФИО)"
                style={{ flex: 1, minWidth: 400 }}
                allowClear
                showSearch
                optionFilterProp="children"
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
            icon={<PlusOutlined />}
            style={{ width: '100%' }}
          >
            Добавить соавтора
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default ConstructorStep3;
