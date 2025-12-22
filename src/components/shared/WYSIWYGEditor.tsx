import React, { useMemo, useRef, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import QuillResizeImage from 'quill-resize-image';
import { Typography, Card, Button, Modal, InputNumber, Space } from 'antd';
import { TableOutlined } from '@ant-design/icons';
import { registerTableBlots } from './tableBlot';

// Регистрируем модуль resize для изображений
Quill.register('modules/resize', QuillResizeImage);

const { Text } = Typography;

// Регистрируем поддержку таблиц один раз
let tableRegistered = false;
if (!tableRegistered) {
  registerTableBlots();
  tableRegistered = true;
}

interface WYSIWYGEditorProps {
  name: string;
  label: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}

const WYSIWYGEditor: React.FC<WYSIWYGEditorProps> = ({
  name,
  label,
  value,
  onChange,
  placeholder,
}) => {
  const quillRef = useRef<ReactQuill>(null);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);

  const handleChange = (content: string) => {
    if (content !== value) {
      onChange(content);
    }
  };

  // Функция для вставки таблицы
  const insertTable = () => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const range = quill.getSelection(true);

      // Генерируем HTML для таблицы без inline стилей (будут применяться через CSS)
      let tableHTML = '<table>';

      // Добавляем заголовок
      tableHTML += '<thead><tr>';
      for (let col = 0; col < tableCols; col++) {
        tableHTML += `<th>Заголовок ${col + 1}</th>`;
      }
      tableHTML += '</tr></thead>';

      // Добавляем строки
      tableHTML += '<tbody>';
      for (let row = 0; row < tableRows; row++) {
        tableHTML += '<tr>';
        for (let col = 0; col < tableCols; col++) {
          tableHTML += '<td><br></td>';
        }
        tableHTML += '</tr>';
      }
      tableHTML += '</tbody></table><p><br></p>';

      // Вставляем таблицу как HTML
      quill.clipboard.dangerouslyPasteHTML(range.index, tableHTML);
      quill.setSelection(range.index + 1, 0);

      setIsTableModalOpen(false);
    }
  };

  const showTableModal = () => {
    setIsTableModalOpen(true);
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ size: ['small', false, 'large', 'huge'] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
          [{ indent: '-1' }, { indent: '+1' }],
          [{ align: [] }],
          ['blockquote'],
          ['link', 'image'],
          ['clean'],
        ],
      },
      // Модуль для изменения размера изображений
      resize: {
        locale: {},
      },
    }),
    [],
  );

  const formats = [
    'header',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'check',
    'indent',
    'align',
    'blockquote',
    'link',
    'image',
    'table',
    'table-row',
    'table-cell',
    'table-header',
    'table-body',
    'table-head',
  ];

  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
        }}
      >
        <Text strong style={{ fontSize: 14, color: '#262626' }}>
          {label}
        </Text>
        <Button type="default" size="small" icon={<TableOutlined />} onClick={showTableModal}>
          Вставить таблицу
        </Button>
      </div>

      <Modal
        title="Создать таблицу"
        open={isTableModalOpen}
        onOk={insertTable}
        onCancel={() => setIsTableModalOpen(false)}
        okText="Вставить"
        cancelText="Отмена"
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Text>Количество строк:</Text>
            <InputNumber
              min={1}
              max={20}
              value={tableRows}
              onChange={(val) => setTableRows(val ?? 3)}
              style={{ width: '100%', marginTop: 8 }}
            />
          </div>
          <div>
            <Text>Количество столбцов:</Text>
            <InputNumber
              min={1}
              max={10}
              value={tableCols}
              onChange={(val) => setTableCols(val ?? 3)}
              style={{ width: '100%', marginTop: 8 }}
            />
          </div>
        </Space>
      </Modal>

      <Card
        size="small"
        style={{
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
          border: '1px solid #f0f0f0',
        }}
        styles={{ body: { padding: 0 } }}
      >
        <div
          style={
            {
              '--ql-color-primary': '#1890ff',
              '--ql-toolbar-bg': '#fafafa',
            } as React.CSSProperties
          }
          className="wysiwyg-editor-wrapper"
        >
          <ReactQuill
            ref={quillRef}
            id={name}
            theme="snow"
            value={value}
            onChange={handleChange}
            modules={modules}
            formats={formats}
            placeholder={placeholder || 'Введите текст...'}
            style={
              {
                minHeight: '200px',
                '--ql-editor-min-height': '150px',
              } as React.CSSProperties
            }
          />
        </div>
      </Card>
      <style>{`
        .wysiwyg-editor-wrapper .ql-toolbar.ql-snow {
          background: #fafafa;
          border: none;
          border-bottom: 1px solid #f0f0f0;
          border-radius: 8px 8px 0 0;
          padding: 12px;
        }

        .wysiwyg-editor-wrapper .ql-container.ql-snow {
          border: none;
          border-radius: 0 0 8px 8px;
        }

        .wysiwyg-editor-wrapper .ql-editor {
          min-height: 150px;
          padding: 16px;
          font-size: 14px;
          line-height: 1.6;
        }

        .wysiwyg-editor-wrapper .ql-editor.ql-blank::before {
          color: #bfbfbf;
          font-style: italic;
        }

        .wysiwyg-editor-wrapper .ql-toolbar .ql-formats {
          margin-right: 12px;
        }

        .wysiwyg-editor-wrapper .ql-toolbar button {
          border-radius: 4px;
          padding: 6px;
          margin: 0 1px;
          transition: all 0.2s ease;
        }

        .wysiwyg-editor-wrapper .ql-toolbar button:hover {
          background: #e6f7ff;
          color: #1890ff;
        }

        .wysiwyg-editor-wrapper .ql-toolbar button.ql-active {
          background: #1890ff;
          color: white;
        }

        .wysiwyg-editor-wrapper .ql-picker {
          color: #595959;
        }

        .wysiwyg-editor-wrapper .ql-picker-options {
          border-radius: 6px;
          border: 1px solid #d9d9d9;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        /* Стили для таблиц - ключевая часть! */
        .wysiwyg-editor-wrapper .ql-editor table {
          border-collapse: collapse;
          width: 100%;
          margin: 12px 0;
          display: table !important;
        }

        .wysiwyg-editor-wrapper .ql-editor table thead {
          display: table-header-group !important;
        }

        .wysiwyg-editor-wrapper .ql-editor table tbody {
          display: table-row-group !important;
        }

        .wysiwyg-editor-wrapper .ql-editor table tr {
          display: table-row !important;
        }

        .wysiwyg-editor-wrapper .ql-editor table td,
        .wysiwyg-editor-wrapper .ql-editor table th {
          display: table-cell !important;
          border: 1px solid #d9d9d9;
          padding: 8px;
          min-width: 50px;
          vertical-align: top;
        }

        .wysiwyg-editor-wrapper .ql-editor table th {
          background-color: #fafafa;
          font-weight: bold;
          text-align: center;
        }

        .wysiwyg-editor-wrapper .ql-editor table tr:hover {
          background-color: #f5f5f5;
        }

        .wysiwyg-editor-wrapper .ql-editor table tbody tr:nth-child(even) {
          background-color: #fafafa;
        }

        /* Стили для resize изображений */
        .wysiwyg-editor-wrapper .ql-editor img {
          cursor: pointer;
          max-width: 100%;
        }

        .wysiwyg-editor-wrapper .ql-editor img.active {
          outline: 2px solid #1890ff;
        }
      `}</style>
    </div>
  );
};

export default WYSIWYGEditor;
