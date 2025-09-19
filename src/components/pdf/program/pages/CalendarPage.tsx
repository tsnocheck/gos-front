import { useCallback, type FC } from 'react';
import { programSection, type Attestation, type Module, type ProgramPDFProps } from '@/types';
import { PDFPage } from '../../shared/ui/PDFPage';
import { calcWidth } from '../../shared/utils';
import { PDFTable } from '../../shared';
import { Text } from '@react-pdf/renderer';

const TOTAL_COLS = 9;

export const CalendarPage: FC<ProgramPDFProps> = ({ program }) => {
  const calcTime = useCallback(
    (module: Module | Attestation) => {
      return module.lecture + module.distant + module.practice;
    },
    [program],
  );

  const attestationByModule = (moduleCode: string) =>
    program.attestations?.find((attestation) => attestation.moduleCode === moduleCode);

  const TotalRow: FC = () => {
    const attestation = attestationByModule('close');

    const initialValues = {
      lecture: attestation?.lecture ?? 0,
      practice: attestation?.practice ?? 0,
      distant: attestation?.distant ?? 0,
      kad: 0,
    };

    const initialWithTotal = {
      ...initialValues,
      total: initialValues.lecture + initialValues.practice + initialValues.distant,
    };

    const total = (program.modules ?? []).reduce((acc, { lecture, distant, practice, kad }) => {
      acc.lecture += lecture;
      acc.distant += distant;
      acc.practice += practice;
      acc.kad += kad;
      acc.total += lecture + distant + practice;

      return acc;
    }, initialWithTotal);

    return (
      <PDFTable.Tr>
        <PDFTable.Th style={{ textAlign: 'left', ...calcWidth(4 / TOTAL_COLS) }}>
          ИТОГО:
        </PDFTable.Th>
        <PDFTable.Td style={calcWidth(1 / TOTAL_COLS)}>{total.total || '-'}</PDFTable.Td>
        <PDFTable.Td style={calcWidth(1 / TOTAL_COLS)}>{total.lecture || '-'}</PDFTable.Td>
        <PDFTable.Td style={calcWidth(1 / TOTAL_COLS)}>{total.practice || '-'}</PDFTable.Td>
        <PDFTable.Td style={calcWidth(1 / TOTAL_COLS)}>{total.distant || '-'}</PDFTable.Td>
        <PDFTable.Td style={calcWidth(1 / TOTAL_COLS)}>{total.kad || '-'}</PDFTable.Td>
      </PDFTable.Tr>
    );
  };

  const ModuleRows: FC = () => {
    return (program.modules ?? [])?.map((module, idx) => (
      <>
        <PDFTable.Tr key={idx}>
          <PDFTable.Th style={calcWidth(1 / TOTAL_COLS)}>
            {programSection.short[module.section] + ' ' + module.code}
          </PDFTable.Th>
          <PDFTable.Th style={calcWidth(3 / TOTAL_COLS)}>{module.name}</PDFTable.Th>
          <PDFTable.Td style={calcWidth(1 / TOTAL_COLS)}>{calcTime(module) || '-'}</PDFTable.Td>
          <PDFTable.Td style={calcWidth(1 / TOTAL_COLS)}>{module.lecture || '-'}</PDFTable.Td>
          <PDFTable.Td style={calcWidth(1 / TOTAL_COLS)}>{module.practice || '-'}</PDFTable.Td>
          <PDFTable.Td style={calcWidth(1 / TOTAL_COLS)}>{module.distant || '-'}</PDFTable.Td>
          <PDFTable.Td style={calcWidth(1 / TOTAL_COLS)}>{module.kad || '-'}</PDFTable.Td>
        </PDFTable.Tr>
      </>
    ));
  };

  const AttestationRow: FC = () => {
    const attestation = attestationByModule('close');

    return (
      attestation && (
        <PDFTable.Tr>
          <PDFTable.Th style={{ ...calcWidth(4 / TOTAL_COLS), textAlign: 'left' }}>
            {attestation.name}
          </PDFTable.Th>
          <PDFTable.Td style={calcWidth(1 / TOTAL_COLS)}>
            {calcTime(attestation) || '-'}
          </PDFTable.Td>
          <PDFTable.Td style={calcWidth(1 / TOTAL_COLS)}>{attestation.lecture || '-'}</PDFTable.Td>
          <PDFTable.Td style={calcWidth(1 / TOTAL_COLS)}>{attestation.practice || '-'}</PDFTable.Td>
          <PDFTable.Td style={calcWidth(1 / TOTAL_COLS)}>{attestation.distant || '-'}</PDFTable.Td>
          <PDFTable.Td style={calcWidth(1 / TOTAL_COLS)}></PDFTable.Td>
        </PDFTable.Tr>
      )
    );
  };

  return (
    <PDFPage title="Календарный учебный график" ui={{ title: { marginBottom: 0 } }}>
      <Text style={{ textAlign: 'center', marginBottom: 4 }}>
        дополнительной профессиональной программы повышения квалификации {'\n'}
        <Text style={{ fontStyle: 'italic' }}>«{program.title ?? 'Название программы'}»</Text>
      </Text>

      <PDFTable.Self>
        <PDFTable.Tr>
          <PDFTable.Th style={calcWidth(1 / TOTAL_COLS)}>Шифр модуля</PDFTable.Th>
          <PDFTable.Th style={calcWidth(3 / TOTAL_COLS)}>
            Наименование структурного компонента программы
          </PDFTable.Th>
          <PDFTable.Th style={calcWidth(1 / TOTAL_COLS)}>Всего час.</PDFTable.Th>
          <PDFTable.Tr
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              ...calcWidth(3 / TOTAL_COLS),
            }}
          >
            <PDFTable.Th style={{ paddingVertical: 2 }}>Трудкоемкость, часы</PDFTable.Th>
            <PDFTable.Tr>
              <PDFTable.Td style={calcWidth(1 / 3)}>Лекц. зан.</PDFTable.Td>
              <PDFTable.Td style={calcWidth(1 / 3)}>Практ. зан.</PDFTable.Td>
              <PDFTable.Td style={calcWidth(1 / 3)}>Дист. обучение</PDFTable.Td>
            </PDFTable.Tr>
          </PDFTable.Tr>
          <PDFTable.Th style={calcWidth(1 / TOTAL_COLS)}>Кол-во ауд. дней*</PDFTable.Th>
        </PDFTable.Tr>
        <ModuleRows />
        {attestationByModule('close') && <AttestationRow />}
        <TotalRow />
      </PDFTable.Self>
    </PDFPage>
  );
};
