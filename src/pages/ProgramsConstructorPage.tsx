import React, { useState } from "react";
import { Button, Steps, Typography, message } from "antd";
import ConstructorStep2 from "../components/constructor/ConstructorStep2";
import ConstructorStep3 from "../components/constructor/ConstructorStep3.tsx";
import ConstructorStep4 from "../components/constructor/ConstructorStep4.tsx";
import ConstructorStep5 from "../components/constructor/ConstructorStep5.tsx";
import ConstructorStep6 from "../components/constructor/ConstructorStep6.tsx";
import ConstructorStep7 from "../components/constructor/ConstructorStep7.tsx";
import ConstructorStep8 from "../components/constructor/ConstructorStep8.tsx";
import ConstructorStep9 from "../components/constructor/ConstructorStep9.tsx";
import type { CreateProgramForm } from "../types/program";

const steps = [
  { title: "Титульный лист", component: ConstructorStep2 },
  { title: "Лист согласования", component: ConstructorStep3 },
  { title: "Список сокращений", component: ConstructorStep4 },
  { title: "Пояснительная записка", component: ConstructorStep5 },
  { title: "Учебный план", component: ConstructorStep6 },
  { title: "Учебно-тематический план", component: ConstructorStep7 },
  { title: "Формы аттестации", component: ConstructorStep8 },
  { title: "Орг.-пед. условия", component: ConstructorStep9 },
];

export interface ConstructorFormData {
  [key: string]: unknown;
}

const { Title } = Typography;

const ProgramsConstructorPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<CreateProgramForm>({ title: "" });

  const StepComponent = steps[currentStep].component;

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };
  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };
  const handleChange = (data: Partial<CreateProgramForm>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };
  const handleFinish = () => {
    // Выводим все данные в консоль
    // Приводим к типу CreateProgramForm для наглядности
    // eslint-disable-next-line no-console
    console.log("Черновик программы:", formData);
    message.success("Черновик программы сохранён локально (отправка на сервер не реализована)");
  };

  return (
    <div style={{ padding: 24 }}>
      <Title style={{ marginBottom: 32 }} level={2}>Конструктор программы</Title>
      
      <Steps
        current={currentStep}
        items={steps}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr)",
          gap: "1rem",
          marginBottom: 24,
        }}
      />
      <div style={{ minHeight: 400, marginBottom: 32 }}>
        <StepComponent
          value={formData}
          onChange={handleChange}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button onClick={handlePrev} disabled={currentStep === 0}>
          Назад
        </Button>
        {currentStep < steps.length - 1 ? (
          <Button type="primary" onClick={handleNext}>
            Далее
          </Button>
        ) : (
          <Button type="primary" onClick={handleFinish}>
            Сохранить черновик
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProgramsConstructorPage; 