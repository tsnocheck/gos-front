import React from 'react';
import { Modal, Descriptions, Button, Tag } from 'antd';
import { EditOutlined, DownloadOutlined } from '@ant-design/icons';
import { useProgram } from '@/queries/programs';
import { useUsers } from '@/queries/admin';
import { getStatusColor, getStatusText } from '@/queries/programs';
import type { ExpertPosition } from '@/types';
import { useNavigate } from 'react-router-dom';
import { ProgramPDFDownloadButton } from '@/components/pdf/program/ProgramPDFViewer';
import { ExpertisePDFDownloadButton } from '@/components/pdf/expertise';

interface ProgramDetailsModalProps {
  open: boolean;
  programId: string | null;
  onClose: () => void;
}

export const ProgramDetailsModal: React.FC<ProgramDetailsModalProps> = ({
  open,
  programId,
  onClose,
}) => {
  const navigate = useNavigate();
  const { data: program } = useProgram(programId ?? '');
  const { data: users = [] } = useUsers();

  const getUserById = (id: string) => users.find((user) => user.id === id);

  const getExpertiseByPosition = (position: ExpertPosition) => {
    return program?.expertises?.find((exp) => exp.position === position);
  };

  const handleEditProgram = () => {
    if (programId) {
      navigate(`/programs/constructor/${programId}`);
      onClose();
    }
  };

  const handleDownloadExpertise = (expertiseId: string) => {
    // TODO: Implement expertise PDF download
    console.log('Download expertise PDF:', expertiseId);
  };

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('ru-RU');
  };

  const getExpertiseConclusionText = (expertise: any) => {
    if (!expertise) return '-';
    if (expertise.isRecommendedForApproval) return 'Положительное';
    return 'Отрицательное';
  };

  const getExpertiseConclusionColor = (expertise: any) => {
    if (!expertise) return 'default';
    if (expertise.isRecommendedForApproval) return 'success';
    return 'error';
  };

  if (!program) return null;

  const coAuthors = (program.coAuthorIds || [])
    .map((id) => getUserById(id))
    .filter(Boolean)
    .map((author) => `${author?.lastName} ${author?.firstName}`)
    .join(', ');

  const expert1 = getExpertiseByPosition('first' as ExpertPosition);
  const expert2 = getExpertiseByPosition('second' as ExpertPosition);
  const expert3 = getExpertiseByPosition('third' as ExpertPosition);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={`Детали программы: ${program.title}`}
      width="80vw"
      footer={[
        <Button key="edit" type="primary" icon={<EditOutlined />} onClick={handleEditProgram}>
          Редактировать программу
        </Button>,
        <Button key="close" onClick={onClose}>
          Закрыть
        </Button>,
      ]}
    >
      <Descriptions bordered column={1} size="small">
        <Descriptions.Item label="Название программы">{program.title}</Descriptions.Item>

        <Descriptions.Item label="Версия программы">{program.version}</Descriptions.Item>

        <Descriptions.Item label="Главный автор программы">
          {program.author ? `${program.author.lastName} ${program.author.firstName}` : '-'}
        </Descriptions.Item>

        <Descriptions.Item label="Соавторы программы">{coAuthors || '-'}</Descriptions.Item>

        <Descriptions.Item label="Ссылка на PDF файл версии программы">
          <ProgramPDFDownloadButton program={program} />
        </Descriptions.Item>

        <Descriptions.Item label="Дата отправки на экспертизу программы">
          {formatDate(program.submittedAt)}
        </Descriptions.Item>

        <Descriptions.Item label="Статус программы">
          <Tag color={getStatusColor(program.status!)}>{getStatusText(program.status!)}</Tag>
        </Descriptions.Item>

        {/* Эксперт 1 */}
        <Descriptions.Item label="ФИО эксперт 1">
          {expert1?.expert ? `${expert1.expert.lastName} ${expert1.expert.firstName}` : '-'}
        </Descriptions.Item>

        <Descriptions.Item label="Заключение эксперта 1">
          {expert1 ? (
            <Tag color={getExpertiseConclusionColor(expert1)}>
              {getExpertiseConclusionText(expert1)}
            </Tag>
          ) : (
            '-'
          )}
        </Descriptions.Item>

        <Descriptions.Item label="Дата заключения эксперта 1">
          {formatDate(expert1?.reviewedAt)}
        </Descriptions.Item>

        <Descriptions.Item label="Ссылка на PDF экспертизу эксперта 1">
          {'-'}
        </Descriptions.Item>

        {/* Эксперт 2 */}
        <Descriptions.Item label="ФИО эксперт 2">
          {expert2?.expert ? `${expert2.expert.lastName} ${expert2.expert.firstName}` : '-'}
        </Descriptions.Item>

        <Descriptions.Item label="Заключение эксперта 2">
          {expert2 ? (
            <Tag color={getExpertiseConclusionColor(expert2)}>
              {getExpertiseConclusionText(expert2)}
            </Tag>
          ) : (
            '-'
          )}
        </Descriptions.Item>

        <Descriptions.Item label="Дата заключения эксперта 2">
          {formatDate(expert2?.reviewedAt)}
        </Descriptions.Item>

        <Descriptions.Item label="Ссылка на PDF экспертизу эксперта 2">
          {expert2 ? (
            <Button
              type="link"
              icon={<DownloadOutlined />}
              onClick={() => handleDownloadExpertise(expert2.id)}
            >
              Скачать PDF экспертизы
            </Button>
          ) : (
            '-'
          )}
        </Descriptions.Item>

        {/* Эксперт 3 */}
        <Descriptions.Item label="ФИО эксперт 3">
          {expert3?.expert ? `${expert3.expert.lastName} ${expert3.expert.firstName}` : '-'}
        </Descriptions.Item>

        <Descriptions.Item label="Заключение эксперта 3">
          {expert3 ? (
            <Tag color={getExpertiseConclusionColor(expert3)}>
              {getExpertiseConclusionText(expert3)}
            </Tag>
          ) : (
            '-'
          )}
        </Descriptions.Item>

        <Descriptions.Item label="Дата заключения эксперта 3">
          {formatDate(expert3?.reviewedAt)}
        </Descriptions.Item>

        <Descriptions.Item label="Ссылка на PDF экспертизу эксперта 3">
          {expert3 ? (
            <Button
              type="link"
              icon={<DownloadOutlined />}
              onClick={() => handleDownloadExpertise(expert3.id)}
            >
              Скачать PDF экспертизы
            </Button>
          ) : (
            '-'
          )}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default ProgramDetailsModal;
