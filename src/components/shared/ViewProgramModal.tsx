import React from 'react';
import { Modal } from 'antd';
import { ProgramPDFViewer } from '@/components/pdf/program/ProgramPDFViewer';
import { useProgram } from '@/queries/programs.ts';
import type { ExtendedProgram } from '@/types';

interface ViewProgramModalProps {
  open: boolean;
  programId?: string | null;
  program?: ExtendedProgram;
  onClose: () => void;
  width?: number | string;
}

export const ViewProgramModal: React.FC<ViewProgramModalProps> = ({
  open,
  programId,
  program: programProp,
  onClose,
  width = '90vw',
}) => {
  // Загружаем программу только если передан programId и нет programProp
  const shouldFetchProgram = !!programId && !programProp;
  const { data: fetchedProgram } = useProgram(shouldFetchProgram ? programId : '');

  const program = programProp || fetchedProgram;

  return (
    <Modal
      open={open && !!program}
      onCancel={onClose}
      title={program?.title || 'Предпросмотр программы'}
      footer={null}
      width={width}
      style={{ top: 20 }}
    >
      {program && <ProgramPDFViewer program={program} />}
    </Modal>
  );
};

export default ViewProgramModal;
