import React from 'react';
import { Modal } from 'antd';
import { ProgramPDFViewer } from '@/components/pdf/program/ProgramPDFViewer';
import type { Program } from '@/types/program';

interface ViewProgramModalProps {
  open: boolean;
  program: Program | null;
  onClose: () => void;
  width?: number | string;
}

export const ViewProgramModal: React.FC<ViewProgramModalProps> = ({
  open,
  program,
  onClose,
  width = '90vw',
}) => {
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
