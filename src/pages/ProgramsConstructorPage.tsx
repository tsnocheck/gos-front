import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Steps, Typography, message } from 'antd';
import ConstructorStep2 from '../components/constructor/ConstructorStep2';
import ConstructorStep3 from '../components/constructor/ConstructorStep3';
import ConstructorStep4 from '../components/constructor/ConstructorStep4';
import ConstructorStep5 from '../components/constructor/ConstructorStep5';
import ConstructorStep6 from '../components/constructor/ConstructorStep6';
import ConstructorStep7 from '../components/constructor/ConstructorStep7';
import ConstructorStep8 from '../components/constructor/ConstructorStep8';
import ConstructorStep9 from '../components/constructor/ConstructorStep9';
import ViewProgramModal from '../components/shared/ViewProgramModal';
import type { ExtendedProgram } from '@/types';
import { useCreateProgram, useProgram, useUpdateProgram } from '@/queries/programs';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { EyeOutlined } from '@ant-design/icons';

const steps = [
  { title: 'Титульный лист', component: ConstructorStep2 },
  { title: 'Соавторы', component: ConstructorStep3 },
  { title: 'Список сокращений и условных обозначений', component: ConstructorStep4 },
  { title: 'Характеристика программы', component: ConstructorStep5 },
  { title: 'Учебный план', component: ConstructorStep6 },
  { title: 'Учебно-тематический план', component: ConstructorStep7 },
  { title: 'Формы аттестации', component: ConstructorStep8 },
  { title: 'Орг.-пед. условия', component: ConstructorStep9 },
];

const { Title } = Typography;

const ProgramsConstructorPage: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Получаем текущий шаг из URL или устанавливаем 0 по умолчанию
  const initialStep = useMemo(() => {
    const stepParam = searchParams.get('step');
    const stepNumber = stepParam ? parseInt(stepParam, 10) : 0;
    return stepNumber >= 0 && stepNumber < steps.length ? stepNumber : 0;
  }, []);

  const [currentStep, setCurrentStep] = useState(initialStep);
  const [formData, setFormData] = useState<ExtendedProgram>({ title: '' });
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const createProgram = useCreateProgram();
  const updateProgram = useUpdateProgram();
  const { data: programData, isSuccess } = useProgram(params.id ?? '');

  const isPending = useMemo(
    () => createProgram.isPending || updateProgram.isPending,
    [createProgram, updateProgram],
  );

  const updateStepInUrl = useCallback(
    (step: number) => {
      setSearchParams({ step: step.toString() });
    },
    [setSearchParams],
  );

  const handleNext = () => {
    const nextStep = Math.min(currentStep + 1, steps.length - 1);
    setCurrentStep(nextStep);
    updateStepInUrl(nextStep);
  };

  const handlePrev = () => {
    const prevStep = Math.max(currentStep - 1, 0);
    setCurrentStep(prevStep);
    updateStepInUrl(prevStep);
  };

  const handleChange = useCallback((data: ExtendedProgram) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  const handleFinish = async (leaveAfterSave: boolean) => {
    try {
      if (!params.id) {
        await createProgram.mutateAsync(formData, {
          onSuccess() {
            if (leaveAfterSave) navigate('/programs');
          },
        });
      } else {
        await updateProgram.mutateAsync(
          { id: params.id, data: formData },
          {
            onSuccess() {
              if (leaveAfterSave) navigate('/programs');
            },
          },
        );
      }
      message.success('Программа успешно сохранена');
    } catch {
      message.error('Ошибка при отправке формы');
    }
  };

  useEffect(() => {
    if (isSuccess && programData) {
      setFormData(programData);
    }
  }, [isSuccess, programData]);

  const StepComponent = steps[currentStep].component;

  return (
    <div style={{ padding: 24 }}>
      <Title style={{ marginBottom: 32 }} level={2}>
        Конструктор программы
      </Title>

      <Steps
        current={currentStep}
        items={steps.map((item) => ({ title: item.title }))}
        onChange={(stepIndex) => {
          setCurrentStep(stepIndex);
          updateStepInUrl(stepIndex);
        }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr)',
          gap: '1rem',
          marginBottom: 24,
        }}
      />
      <div style={{ minHeight: 400, marginBottom: 32 }}>
        <StepComponent value={formData} onChange={handleChange} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={handlePrev} disabled={currentStep === 0}>
          Назад
        </Button>
        <div style={{ display: 'flex', gap: 10 }}>
          {currentStep < steps.length - 1 && (
            <Button type="primary" onClick={handleNext}>
              Далее
            </Button>
          )}
          <Button type="default" icon={<EyeOutlined />} onClick={() => setPreviewModalOpen(true)}>
            Предпросмотр программы
          </Button>
          <Button
            type="primary"
            variant="solid"
            color="green"
            disabled={isPending}
            onClick={() => handleFinish(false)}
          >
            Сохранить
          </Button>
          {params.id && (
            <Button
              type="primary"
              variant="solid"
              color="orange"
              disabled={isPending}
              onClick={() => handleFinish(true)}
            >
              Сохранить и выйти
            </Button>
          )}
        </div>
      </div>

      <ViewProgramModal
        open={previewModalOpen}
        program={formData}
        onClose={() => setPreviewModalOpen(false)}
      />
    </div>
  );
};

export default ProgramsConstructorPage;
