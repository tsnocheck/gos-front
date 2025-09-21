import React from 'react';
import { Modal } from 'antd';
import { ProgramPDFViewer } from '@/components/pdf/program/ProgramPDFViewer';
import { useProgram } from '@/queries/programs.ts';

interface ViewProgramModalProps {
  open: boolean;
  programId: string | null;
  onClose: () => void;
  width?: number | string;
}

export const ViewProgramModal: React.FC<ViewProgramModalProps> = ({
  open,
  programId,
  onClose,
  width = '90vw',
}) => {
  const { data: program } = useProgram(programId ?? '');

  return (
    <Modal
      open={open && !!program}
      onCancel={onClose}
      title={program?.title}
      footer={null}
      width={width}
    >
      {program && <ProgramPDFViewer program={program} />}
    </Modal>
  );
};

export default ViewProgramModal;
