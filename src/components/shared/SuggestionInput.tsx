import React, { useState } from 'react';
import { Input, Button, Space, Typography, Divider } from 'antd';
import { BulbOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface SuggestionInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  suggestions?: string[];
  label?: string;
  rows?: number;
}

const SuggestionInput: React.FC<SuggestionInputProps> = ({
  value,
  onChange,
  placeholder,
  suggestions = [],
  label,
  rows,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSuggestionClick = (suggestion: string) => {
    onChange?.(suggestion);
    setShowSuggestions(false);
  };

  const InputComponent = rows ? Input.TextArea : Input;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        {label && <Text strong>{label}</Text>}
        {suggestions.length > 0 && (
          <Button
            type="link"
            size="small"
            icon={<BulbOutlined />}
            onClick={() => setShowSuggestions(!showSuggestions)}
          >
            {showSuggestions ? 'Скрыть подсказки' : 'Показать подсказки'}
          </Button>
        )}
      </div>

      <InputComponent
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        rows={rows}
      />

      {showSuggestions && suggestions.length > 0 && (
        <div style={{ marginTop: 8, padding: 12, background: '#f5f5f5', borderRadius: 6 }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Нажмите на подсказку, чтобы использовать её:
          </Text>
          <Divider style={{ margin: '8px 0' }} />
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                type="text"
                size="small"
                onClick={() => handleSuggestionClick(suggestion)}
                style={{
                  textAlign: 'left',
                  height: 'auto',
                  padding: '4px 8px',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                }}
              >
                {suggestion}
              </Button>
            ))}
          </Space>
        </div>
      )}
    </div>
  );
};

export default SuggestionInput;

export const SomeComponent = () => {
  return <div></div>;
};
