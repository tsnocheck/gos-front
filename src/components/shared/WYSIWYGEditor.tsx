import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

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
  const handleChange = (content: string) => {
    if (content !== value) {
      onChange(content);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["link"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "indent",
    "align",
    "link",
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <label style={{ fontSize: 16 }}>{label}</label>
      <ReactQuill
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
