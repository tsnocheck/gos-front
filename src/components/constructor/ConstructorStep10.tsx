import React from "react";
import type { ExtendedProgram } from "../../types";
import ProgramPDFViewer from "../pdf/program/ProgramPDFViewer";

interface Props {
  value: ExtendedProgram;
}

const ConstructorStep10: React.FC<Props> = ({ value }) => {
  return (
    <div>
      <ProgramPDFViewer program={value} />
    </div>
  );
};

export default ConstructorStep10;
