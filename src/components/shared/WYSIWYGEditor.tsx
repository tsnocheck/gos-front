import React, { useMemo, useRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Quill } from 'react-quill-new';
import QuillResizeImage from 'quill-resize-image';
import QuillTableBetter from 'quill-table-better';
import 'quill-table-better/dist/quill-table-better.css';
import { Typography, Card } from 'antd';

const { Text } = Typography;

// Регистрируем модуль resize для изображений
Quill.register('modules/resize', QuillResizeImage);

// Регистрируем модуль таблиц
Quill.register(
  {
    'modules/table-better': QuillTableBetter,
  },
  true,
);

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

  const handleChange = (content: string) => {
    if (content !== value) {
      onChange(content);
    }
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
          ['table-better'],
          ['clean'],
        ],
      },
      // Отключаем встроенный модуль таблиц Quill
      table: false,
      // Модуль для изменения размера изображений (без тулбара)
      resize: {
        locale: {},
        // Используем только модули Resize и DisplaySize, без Toolbar
        modules: ['Resize', 'DisplaySize'],
      },
      // Модуль улучшенных таблиц
      'table-better': {
        language: 'ru_RU',
        menus: ['column', 'row', 'merge', 'table', 'cell', 'wrap', 'delete'],
        toolbarTable: true,
      },
      // Привязки клавиш для таблиц
      keyboard: {
        bindings: QuillTableBetter.keyboardBindings,
      },
    }),
    [],
  );

  // Include table-related formats from quill-table-better
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
    // Table formats from quill-table-better
    'table-cell-line',
    'table-cell-block',
    'table-cell',
    'table-th-block',
    'table-th',
    'table-row',
    'table-th-row',
    'table-body',
    'table-thead',
    'table-col',
    'table-colgroup',
    'table-container',
    'table-temporary',
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
      </div>

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

        /* Стили для таблиц quill-table-better */
        .wysiwyg-editor-wrapper .ql-editor table {
          border-collapse: collapse;
          width: 100%;
          margin: 12px 0;
        }

        .wysiwyg-editor-wrapper .ql-editor table td,
        .wysiwyg-editor-wrapper .ql-editor table th {
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

        /* Стили для выделенных ячеек */
        .wysiwyg-editor-wrapper .ql-editor td.ql-cell-selected,
        .wysiwyg-editor-wrapper .ql-editor th.ql-cell-selected {
          background-color: #e6f7ff !important;
        }

        /* Стили для resize изображений */
        .wysiwyg-editor-wrapper .ql-editor img {
          cursor: pointer;
          max-width: 707px; /* Ограничение по ширине PDF (530pt ≈ 707px) */
        }

        .wysiwyg-editor-wrapper .ql-editor img.active {
          outline: 2px solid #1890ff;
        }

        /* Скрываем тулбар resize-image (100%, 50%, left, center, right) */
        #editor-resizer .toolbar {
          display: none !important;
        }

        /* Стили для кнопки таблицы в тулбаре */
        .wysiwyg-editor-wrapper .ql-toolbar .ql-table-better {
          width: auto !important;
        }

        .wysiwyg-editor-wrapper .ql-toolbar .ql-table-better svg {
          width: 18px;
          height: 18px;
        }

        /* Стили для контекстного меню таблицы */
        .ql-table-better-menu {
          border-radius: 6px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .ql-table-better-menu .ql-table-better-menu-item {
          padding: 8px 16px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .ql-table-better-menu .ql-table-better-menu-item:hover {
          background-color: #e6f7ff;
        }
      `}</style>
    </div>
  );
};

export default WYSIWYGEditor;
