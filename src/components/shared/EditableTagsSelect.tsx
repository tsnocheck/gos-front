import React, { useState, useEffect } from 'react';
import { Tag, Input, Select } from 'antd';
import { PlusOutlined, EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';

interface Option {
  value: string;
  label: string;
}

interface EditableTagsSelectProps {
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  style?: React.CSSProperties;
  maxTagTextLength?: number;
  options?: Option[];
  disabled?: boolean;
}

const EditableTagsSelect: React.FC<EditableTagsSelectProps> = ({
  value = [],
  onChange,
  placeholder = 'Добавить тег',
  style,
  maxTagTextLength = 25,
  options = [],
  disabled = false,
}) => {
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');

  // Добавляем стили для скрытия стрелочек у input type="number"
  useEffect(() => {
    if (typeof document !== 'undefined' && !document.getElementById('number-input-styles')) {
      const style = document.createElement('style');
      style.id = 'number-input-styles';
      style.textContent = `
        /* Chrome, Safari, Edge, Opera */
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        /* Firefox */
        input[type=number] {
          -moz-appearance: textfield;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const handleClose = (removedTag: string) => {
    if (!value) return;
    const newTags = value.filter((tag) => tag !== removedTag);
    onChange(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue) {
      const currentValues = value || [];
      if (!currentValues.includes(inputValue)) {
        onChange([...currentValues, inputValue]);
      }
    }
    setInputVisible(false);
    setInputValue('');
  };

  const handleSelectChange = (selectedValue: string) => {
    if (selectedValue) {
      const currentValues = value || [];
      if (!currentValues.includes(selectedValue)) {
        onChange([...currentValues, selectedValue]);
      }
    }
    setInputVisible(false);
    setInputValue('');
  };

  const handleSelectSearch = (searchValue: string) => {
    setInputValue(searchValue);
  };

  const availableOptions = options.filter((option) => !value?.includes(option.value));

  const handleSelectKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue) {
      const currentValues = value || [];
      if (!currentValues.includes(inputValue)) {
        // Если нажали Enter и есть введенный текст, который не входит в существующие теги
        const existingOption = availableOptions.find(
          (opt) =>
            opt.label.toLowerCase() === inputValue.toLowerCase() ||
            opt.value.toLowerCase() === inputValue.toLowerCase(),
        );

        if (!existingOption) {
          // Добавляем кастомный тег
          onChange([...currentValues, inputValue]);
          setInputVisible(false);
          setInputValue('');
          e.preventDefault();
        }
      }
    }
  };

  const handleEditStart = (index: number, currentValue: string) => {
    setEditingIndex(index);
    setEditingValue(currentValue);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditingValue(e.target.value);
  };

  const handleEditConfirm = () => {
    if (editingIndex !== null && editingValue) {
      const currentValues = value || [];
      if (!currentValues.includes(editingValue)) {
        const newTags = [...currentValues];
        newTags[editingIndex] = editingValue;
        onChange(newTags);
      }
    }
    setEditingIndex(null);
    setEditingValue('');
  };

  const handleEditCancel = () => {
    setEditingIndex(null);
    setEditingValue('');
  };

  const truncateText = (text: string) => {
    return text.length > maxTagTextLength ? text.slice(0, maxTagTextLength) + '...' : text;
  };

  const getDisplayText = (tagValue: string) => {
    const option = options.find((opt) => opt.value === tagValue);
    return option ? option.label : tagValue;
  };

  if (disabled) {
    return (
      <div
        style={{
          ...style,
          minHeight: 40,
          border: '1px solid #d9d9d9',
          borderRadius: 4,
          padding: 6,
          backgroundColor: '#f5f5f5',
        }}
      >
        {value.map((tag) => (
          <Tag
            key={tag}
            style={{
              marginBottom: 6,
              marginRight: 6,
              padding: '6px 12px',
              fontSize: '14px',
              lineHeight: '1.4',
            }}
          >
            {truncateText(getDisplayText(tag))}
          </Tag>
        ))}
      </div>
    );
  }

  return (
    <div
      style={{ ...style, minHeight: 32, border: '1px solid #d9d9d9', borderRadius: 4, padding: 4 }}
    >
      {value?.map((tag, index) => {
        if (editingIndex === index) {
          return options.length > 0 ? (
            <Select
              key={`edit-${index}`}
              size="small"
              style={{ width: 150, marginRight: 8, marginBottom: 4 }}
              value={editingValue}
              onChange={(val) => setEditingValue(val)}
              onBlur={handleEditConfirm}
              options={[...options, { value: editingValue, label: editingValue }]}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              autoFocus
            />
          ) : (
            <div
              key={`edit-${index}`}
              style={{
                display: 'inline-flex',
                flexDirection: 'column',
                marginRight: 8,
                marginBottom: 4,
                position: 'relative',
                fontSize: 16,
              }}
            >
              <Input.TextArea
                size="small"
                style={{ minWidth: 300, maxWidth: 600, resize: 'vertical', fontSize: 14 }}
                value={editingValue}
                onChange={handleEditChange}
                onBlur={handleEditConfirm}
                autoSize={{ minRows: 1, maxRows: 6 }}
                autoFocus
              />
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  marginTop: 4,
                  justifyContent: 'flex-end',
                }}
              >
                <CheckOutlined
                  style={{ cursor: 'pointer', color: '#52c41a', fontSize: 16 }}
                  onClick={handleEditConfirm}
                />
                <CloseOutlined
                  style={{ cursor: 'pointer', color: '#ff4d4f', fontSize: 16 }}
                  onClick={handleEditCancel}
                />
              </div>
            </div>
          );
        }

        const displayText = getDisplayText(tag);
        return (
          <Tag
            key={tag}
            closable
            onClose={() => handleClose(tag)}
            style={{
              marginBottom: 6,
              marginRight: 6,
              cursor: 'pointer',
              userSelect: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              fontSize: '14px',
              lineHeight: '1.4',
            }}
            title={displayText.length > maxTagTextLength ? displayText : undefined}
          >
            <span onClick={() => handleEditStart(index, tag)}>{truncateText(displayText)}</span>
            <EditOutlined
              style={{ fontSize: 12, opacity: 0.7 }}
              onClick={() => handleEditStart(index, tag)}
            />
          </Tag>
        );
      })}

      {inputVisible ? (
        options.length > 0 ? (
          <Select
            size="small"
            style={{ width: 150, marginRight: 8, marginBottom: 4 }}
            value={inputValue}
            onChange={handleSelectChange}
            onSearch={handleSelectSearch}
            onKeyDown={handleSelectKeyDown}
            onBlur={() => {
              setInputVisible(false);
              setInputValue('');
            }}
            options={availableOptions}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            placeholder={placeholder}
            autoFocus
            open
            notFoundContent={
              inputValue ? (
                <div
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    color: '#1890ff',
                  }}
                  onClick={() => {
                    const currentValues = value || [];
                    if (inputValue && !currentValues.includes(inputValue)) {
                      onChange([...currentValues, inputValue]);
                      setInputVisible(false);
                      setInputValue('');
                    }
                  }}
                >
                  + Добавить "{inputValue}"
                </div>
              ) : (
                'Не найдено'
              )
            }
          />
        ) : (
          <div
            style={{
              display: 'inline-flex',
              flexDirection: 'column',
              marginRight: 8,
              marginBottom: 4,
              position: 'relative',
            }}
          >
            <Input.TextArea
              size="small"
              style={{ minWidth: 300, maxWidth: 600, resize: 'vertical' }}
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputConfirm}
              autoSize={{ minRows: 2, maxRows: 6 }}
              placeholder={placeholder}
              autoFocus
            />
            <div
              style={{
                display: 'flex',
                gap: 8,
                marginTop: 4,
                justifyContent: 'flex-end',
              }}
            >
              <CheckOutlined
                style={{ cursor: 'pointer', color: '#52c41a', fontSize: 16 }}
                onClick={handleInputConfirm}
              />
              <CloseOutlined
                style={{ cursor: 'pointer', color: '#ff4d4f', fontSize: 16 }}
                onClick={() => {
                  setInputVisible(false);
                  setInputValue('');
                }}
              />
            </div>
          </div>
        )
      ) : (
        <Tag
          onClick={showInput}
          style={{
            background: '#fff',
            borderStyle: 'dashed',
            cursor: 'pointer',
            marginBottom: 6,
            marginRight: 6,
            padding: '6px 12px',
            fontSize: '14px',
            lineHeight: '1.4',
          }}
        >
          <PlusOutlined /> {placeholder}
        </Tag>
      )}
    </div>
  );
};

export default EditableTagsSelect;
