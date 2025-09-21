import React, { useMemo, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from 'antd';
import { TableOutlined } from '@ant-design/icons';

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

  const insertTable = () => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const tableHTML = `
        <table style="border-collapse: collapse; width: 100%; margin: 10px 0; border: 2px solid #000;">
          <tr>
            <td style="border: 1px solid #000; padding: 8px;">Ячейка 1</td>
            <td style="border: 1px solid #000; padding: 8px;">Ячейка 2</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 8px;">Ячейка 3</td>
            <td style="border: 1px solid #000; padding: 8px;">Ячейка 4</td>
          </tr>
        </table>
      `;

      const range = quill.getSelection();
      if (range) {
        // Вставляем в позицию курсора
        quill.clipboard.dangerouslyPasteHTML(range.index, tableHTML);
      } else {
        // Если нет выделения, вставляем в конец
        const length = quill.getLength();
        quill.clipboard.dangerouslyPasteHTML(length - 1, tableHTML);
      }

      // Фокусируемся на редакторе после вставки
      quill.focus();
    }
  };

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ align: [] }],
        ['link', 'image'],
        ['clean'],
      ],
    }),
    [],
  );

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'indent',
    'align',
    'link',
    'image',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ fontSize: 16 }}>{label}</label>
      </div>
      <ReactQuill
        ref={quillRef}
        id={name}
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );
};

export default WYSIWYGEditor;
