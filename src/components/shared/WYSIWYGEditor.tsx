import React, { useMemo, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Typography, Card } from 'antd';

const { Text } = Typography;

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
          ['clean'],
        ],
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
        bodyStyle={{ padding: 0 }}
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
      `}</style>
    </div>
  );
};

export default WYSIWYGEditor;
