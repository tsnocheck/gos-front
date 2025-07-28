import React, { useEffect } from "react";
import type { CreateProgramForm } from "../../types";
import ProgramPDFViewer from "../pdf/program/ProgramPDFViewer";

interface Props {
  value: CreateProgramForm;
}

const ConstructorStep10: React.FC<Props> = ({ value }) => {
  useEffect(() => {
    console.log(value);
  }, [value]);

  return (
    <div>
      <ProgramPDFViewer program={value} />
    </div>
  );
};

export default ConstructorStep10;
