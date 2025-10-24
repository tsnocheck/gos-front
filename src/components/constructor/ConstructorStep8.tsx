import React from 'react';
import { Input, Typography, Card } from 'antd';
import { type Attestation, type ExtendedProgram, ProgramSection, programSection } from '@/types';
import WYSIWYGEditor from '../shared/WYSIWYGEditor';
import RecommendationSuggestionInput from '../shared/RecommendationSuggestionInput';
import { RecommendationField } from '@/types/recommendation';

const { Title } = Typography;

interface Props {
  value: ExtendedProgram;
  onChange: (data: ExtendedProgram) => void;
}

const getModuleShortName = (moduleCode: string) => {
  const [module, code] = moduleCode.split(' ');
  return programSection.short[module as ProgramSection] + ' ' + code;
};

const ConstructorStep8: React.FC<Props> = ({ value, onChange }) => {
  const attestations = value.attestations ?? [];

  const updateAttestation = (index: number, patch: Partial<Attestation>) => {
    const next = (attestations ?? []).map((a, i) => (i === index ? { ...a, ...patch } : a));
    onChange({ attestations: next });
  };

  return (
    <div>
      <Title level={4}>Формы аттестации и оценочные материалы</Title>
      {attestations.length === 0 && (
        <Typography.Paragraph>
          Сначала добавьте аттестации на шаге «Учебный план».
        </Typography.Paragraph>
      )}

      <div style={{ display: 'grid', gap: 16 }}>
        {attestations.map((a, i) => (
          <Card
            key={i}
            title={
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span>
                  <span style={{ fontWeight: 'bold' }}>{a.name || 'Аттестация'}</span>{' '}
                  {a.moduleCode && !['open', 'close'].includes(a.moduleCode) && (
                    <span>(раздел программы {getModuleShortName(a.moduleCode)})</span>
                  )}
                </span>
                <span style={{ color: '#888', fontSize: 12 }}>{a.form}</span>
              </div>
            }
          >
            <div style={{ display: 'grid', gap: 12 }}>
              <div>
                <RecommendationSuggestionInput
                  label="Описание требований к выполнению"
                  value={a.requirements}
                  onChange={(val) => updateAttestation(i, { requirements: val })}
                  placeholder="Введите описание требований"
                  type={RecommendationField.ATTESTATION_REQUIREMENTS}
                  rows={3}
                />
              </div>

              <div>
                <WYSIWYGEditor
                  name={`attestation-criteria-${i}`}
                  label="Критерии оценивания"
                  value={a.criteria}
                  onChange={(v) => updateAttestation(i, { criteria: v })}
                />
              </div>

              <div>
                <WYSIWYGEditor
                  name={`attestation-examples-${i}`}
                  label="Примеры заданий (2–3 примера)"
                  value={a.examples}
                  onChange={(v) => updateAttestation(i, { examples: v })}
                  placeholder="Опишите примеры заданий"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 4 }}>Количество попыток</label>
                <Input
                  type="number"
                  min={1}
                  value={a.attempts}
                  onChange={(e) => updateAttestation(i, { attempts: Number(e.target.value) })}
                  style={{ width: 160 }}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ConstructorStep8;
