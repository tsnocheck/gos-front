import { type FC } from 'react';
import { ProgramSection, programSection, type ProgramPDFProps } from '@/types';
import { PDFPage } from '../../shared/ui/PDFPage';
import { calcWidth, PDFStyles } from '../../shared/utils';
import { PDFTable } from '../../shared';
import React from 'react';
import { Text } from '@react-pdf/renderer';

const TOTAL_COLS = 8;

export const SyllabusPage: FC<ProgramPDFProps> = ({ program, pageNumber }) => {
  const modulesBySection = (section: ProgramSection) =>
    program.modules?.filter((module) => module.section === section);

  const attestationsByModule = (moduleCode: string) =>
    program.attestations?.filter((attestation) => attestation.moduleCode === moduleCode);

  const TotalRow: FC = () => {
    const total = [...(program.modules ?? []), ...(program.attestations ?? [])].reduce(
      (acc, { lecture, distant, practice }) => {
        acc.lecture += lecture;
        acc.distant += distant;
        acc.practice += practice;

        return acc;
      },
      {
        lecture: 0,
        practice: 0,
        distant: 0,
      },
    );

    return (
      <PDFTable.Tr>
        <PDFTable.Th style={{ textAlign: 'left', ...calcWidth(3 / TOTAL_COLS) }}>
          ИТОГО:
        </PDFTable.Th>
        <PDFTable.Td style={calcWidth(1 / TOTAL_COLS)}>{total.lecture || '-'}</PDFTable.Td>
        <PDFTable.Td style={calcWidth(1 / TOTAL_COLS)}>{total.practice || '-'}</PDFTable.Td>
        <PDFTable.Td style={calcWidth(1 / TOTAL_COLS)}>{total.distant || '-'}</PDFTable.Td>
        <PDFTable.Td style={calcWidth(2 / TOTAL_COLS)}></PDFTable.Td>
      </PDFTable.Tr>
    );
  };

  const AttestationRows: FC<{ moduleCode: string }> = ({ moduleCode }) => {
    return attestationsByModule(moduleCode)?.map((attestation, idx) => (
      <PDFTable.Tr key={idx}>
        <PDFTable.Th style={{ textAlign: 'left', ...calcWidth(3 / TOTAL_COLS) }}>
          {attestation.name}
        </PDFTable.Th>
        <PDFTable.Td style={calcWidth(1 / TOTAL_COLS)}>{attestation.lecture || '-'}</PDFTable.Td>
        <PDFTable.Td style={calcWidth(1 / TOTAL_COLS)}>{attestation.practice || '-'}</PDFTable.Td>
        <PDFTable.Td style={calcWidth(1 / TOTAL_COLS)}>{attestation.distant || '-'}</PDFTable.Td>
        <PDFTable.Td style={calcWidth(2 / TOTAL_COLS)}>{attestation.form}</PDFTable.Td>
      </PDFTable.Tr>
    ));
  };

  const ModuleRows: FC<{ section: ProgramSection }> = ({ section }) => {
    return modulesBySection(section)?.map((module, idx) => (
      <React.Fragment key={idx}>
        <PDFTable.Tr>
          <PDFTable.Th style={calcWidth(1 / TOTAL_COLS)}>
            {programSection.short[module.section] + ' ' + module.code}
          </PDFTable.Th>
          <PDFTable.Th style={calcWidth(2 / TOTAL_COLS)}>{module.name}</PDFTable.Th>
          <PDFTable.Td style={calcWidth(1 / TOTAL_COLS)}>{module.lecture || '-'}</PDFTable.Td>
          <PDFTable.Td style={calcWidth(1 / TOTAL_COLS)}>{module.practice || '-'}</PDFTable.Td>
          <PDFTable.Td style={calcWidth(1 / TOTAL_COLS)}>{module.distant || '-'}</PDFTable.Td>
          <PDFTable.Td style={calcWidth(2 / TOTAL_COLS)}></PDFTable.Td>
        </PDFTable.Tr>

        <AttestationRows moduleCode={`${section} ${module.code}`} />
      </React.Fragment>
    ));
  };

  const SectionRow: FC<{ section: ProgramSection }> = ({ section }) => {
    console.log(section);

    return (
      <React.Fragment>
        <PDFTable.Tr style={calcWidth(1)}>
          <PDFTable.Th style={calcWidth(1)}>
            {programSection.full[section].toUpperCase()}
          </PDFTable.Th>
        </PDFTable.Tr>

        <ModuleRows section={section} />
      </React.Fragment>
    );
  };

  return (
    <PDFPage
      title="Учебный план"
      ui={{ title: { marginBottom: 0 } }}
      pageNumber={pageNumber}
    >
      <Text style={{ lineHeight: 1, textAlign: 'center' }}>
        дополнительной профессиональной программы повышения квалификации {'\n'}
        <Text style={PDFStyles.italic}>«{program.title ?? 'Название программы'}»</Text>
      </Text>
      <PDFTable.Self>
        {/* Header row 1 - main headers */}
        <PDFTable.Tr isHeader>
          <PDFTable.Th style={calcWidth(1 / TOTAL_COLS)}>Шифр модуля</PDFTable.Th>
          <PDFTable.Th style={calcWidth(2 / TOTAL_COLS)}>
            Структурный компонент программы / образовательный модуль
          </PDFTable.Th>
          <PDFTable.Th style={calcWidth(3 / TOTAL_COLS)}>
            Формы организации, часы
          </PDFTable.Th>
          <PDFTable.Th style={calcWidth(2 / TOTAL_COLS)}>Формы контроля</PDFTable.Th>
        </PDFTable.Tr>

        {/* Header row 2 - subheaders for "Формы организации, часы" */}
        <PDFTable.Tr isHeader>
          <PDFTable.Th style={calcWidth(1 / TOTAL_COLS)}></PDFTable.Th>
          <PDFTable.Th style={calcWidth(2 / TOTAL_COLS)}></PDFTable.Th>
          <PDFTable.Th style={calcWidth(2 / TOTAL_COLS)}>Ауд. зан.</PDFTable.Th>
          <PDFTable.Th style={calcWidth(1 / TOTAL_COLS)}>Сам. раб.</PDFTable.Th>
          <PDFTable.Th style={calcWidth(2 / TOTAL_COLS)}></PDFTable.Th>
        </PDFTable.Tr>

        {/* Header row 3 - detailed subheaders */}
        <PDFTable.Tr isHeader>
          <PDFTable.Th style={calcWidth(1 / TOTAL_COLS)}></PDFTable.Th>
          <PDFTable.Th style={calcWidth(2 / TOTAL_COLS)}></PDFTable.Th>
          <PDFTable.Th style={calcWidth(1 / TOTAL_COLS)}>Лекц. зан.</PDFTable.Th>
          <PDFTable.Th style={calcWidth(1 / TOTAL_COLS)}>Практ. зан.</PDFTable.Th>
          <PDFTable.Th style={calcWidth(1 / TOTAL_COLS)}>Дист. обучение</PDFTable.Th>
          <PDFTable.Th style={calcWidth(2 / TOTAL_COLS)}></PDFTable.Th>
        </PDFTable.Tr>

        {attestationsByModule('open')?.length && <AttestationRows moduleCode="open" />}

        {(modulesBySection(ProgramSection.NPR) ?? []).length > 0 && (
          <SectionRow section={ProgramSection.NPR} />
        )}
        {(modulesBySection(ProgramSection.PMR) ?? []).length > 0 && (
          <SectionRow section={ProgramSection.PMR} />
        )}
        {(modulesBySection(ProgramSection.VR) ?? []).length > 0 && (
          <SectionRow section={ProgramSection.VR} />
        )}

        {attestationsByModule('close')?.length && <AttestationRows moduleCode="close" />}

        <TotalRow />
      </PDFTable.Self>
    </PDFPage>
  );
};
