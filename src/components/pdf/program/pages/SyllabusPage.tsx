import { useCallback, type FC } from "react";
import { ProgramSection, programSection, type ProgramPDFProps } from "@/types";
import { PDFPage } from "../../shared/ui/PDFPage";
import { calcWidth } from "../../shared/utils";
import { PDFTable } from "../../shared";

export const SyllabusPage: FC<ProgramPDFProps> = ({ program }) => {
  const modulesBySection = useCallback(
    (section: ProgramSection) =>
      program.modules?.filter((module) => module.section === section),
    [program]
  );

  const attestationsByModule = useCallback(
    (moduleCode: string) =>
      program.attestations?.filter(
        (attestation) => attestation.moduleCode === moduleCode
      ),
    [program]
  );

  const TotalRow: FC = () => {
    const total = [
      ...(program.modules ?? []),
      ...(program.attestations ?? []),
    ].reduce(
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
      }
    );

    return (
      <PDFTable.Tr>
        <PDFTable.Th style={{ textAlign: "left", ...calcWidth(3 / 8) }}>
          ИТОГО:
        </PDFTable.Th>
        <PDFTable.Td style={calcWidth(1 / 8)}>
          {total.lecture || "-"}
        </PDFTable.Td>
        <PDFTable.Td style={calcWidth(1 / 8)}>
          {total.practice || "-"}
        </PDFTable.Td>
        <PDFTable.Td style={calcWidth(1 / 8)}>
          {total.distant || "-"}
        </PDFTable.Td>
        <PDFTable.Td style={calcWidth(2 / 8)}></PDFTable.Td>
      </PDFTable.Tr>
    );
  };

  const AttestationRows: FC<{ moduleCode: string }> = ({ moduleCode }) => {
    return attestationsByModule(moduleCode)?.map((attestation, idx) => (
      <PDFTable.Tr key={idx}>
        <PDFTable.Td style={calcWidth(3 / 8)}>{attestation.name}</PDFTable.Td>
        <PDFTable.Td style={calcWidth(1 / 8)}>
          {attestation.lecture || "-"}
        </PDFTable.Td>
        <PDFTable.Td style={calcWidth(1 / 8)}>
          {attestation.practice || "-"}
        </PDFTable.Td>
        <PDFTable.Td style={calcWidth(1 / 8)}>
          {attestation.distant || "-"}
        </PDFTable.Td>
        <PDFTable.Td style={calcWidth(2 / 8)}>{attestation.form}</PDFTable.Td>
      </PDFTable.Tr>
    ));
  };

  const ModuleRows: FC<{ section: ProgramSection }> = ({ section }) => {
    return modulesBySection(section)?.map((module, idx) => (
      <>
        <PDFTable.Tr key={idx}>
          <PDFTable.Th style={calcWidth(1 / 8)}>
            {programSection.short[module.section] + " " + module.code}
          </PDFTable.Th>
          <PDFTable.Th style={calcWidth(2 / 8)}>{module.name}</PDFTable.Th>
          <PDFTable.Td style={calcWidth(1 / 8)}>
            {module.lecture || "-"}
          </PDFTable.Td>
          <PDFTable.Td style={calcWidth(1 / 8)}>
            {module.practice || "-"}
          </PDFTable.Td>
          <PDFTable.Td style={calcWidth(1 / 8)}>
            {module.distant || "-"}
          </PDFTable.Td>
          <PDFTable.Td style={calcWidth(2 / 8)}></PDFTable.Td>
        </PDFTable.Tr>

        <AttestationRows moduleCode={`${section} ${module.code}`} />
      </>
    ));
  };

  const SectionRow: FC<{ section: ProgramSection }> = ({ section }) => {
    return (
      <>
        <PDFTable.Tr style={calcWidth(1)}>
          <PDFTable.Th style={calcWidth(1)}>
            {programSection.full[section].toUpperCase()}
          </PDFTable.Th>
        </PDFTable.Tr>

        <ModuleRows section={section} />
      </>
    );
  };

  return (
    <PDFPage title="Учебный план">
      <PDFTable.Self>
        <PDFTable.Tr>
          <PDFTable.Th style={calcWidth(1 / 8)}>Шифр модуля</PDFTable.Th>
          <PDFTable.Th style={calcWidth(2 / 8)}>
            Структурный компонент программы / образовательный модуль
          </PDFTable.Th>
          <PDFTable.Tr
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              ...calcWidth(3 / 8),
            }}
          >
            <PDFTable.Th>Формы организации, часы</PDFTable.Th>
            <PDFTable.Tr>
              <PDFTable.Th style={calcWidth(2 / 3)}>Ауд. зан.</PDFTable.Th>
              <PDFTable.Th style={calcWidth(1 / 3)}>Сам. раб.</PDFTable.Th>
            </PDFTable.Tr>
            <PDFTable.Tr>
              <PDFTable.Td style={calcWidth(1 / 3)}>Лекц. зан.</PDFTable.Td>
              <PDFTable.Td style={calcWidth(1 / 3)}>Практ. зан.</PDFTable.Td>
              <PDFTable.Td style={calcWidth(1 / 3)}>Дист. обучение</PDFTable.Td>
            </PDFTable.Tr>
          </PDFTable.Tr>
          <PDFTable.Th style={calcWidth(2 / 8)}>Формы контроля</PDFTable.Th>
        </PDFTable.Tr>

        {attestationsByModule('none')?.length && <AttestationRows moduleCode="none" />}

        {modulesBySection(ProgramSection.NPR)?.length && (
          <SectionRow section={ProgramSection.NPR} />
        )}
        {modulesBySection(ProgramSection.PMR)?.length && (
          <SectionRow section={ProgramSection.PMR} />
        )}
        {modulesBySection(ProgramSection.VR)?.length && (
          <SectionRow section={ProgramSection.VR} />
        )}

        <TotalRow />
      </PDFTable.Self>
    </PDFPage>
  );
};
