import React, { useCallback } from 'react';
import { Form, Typography } from 'antd';
import type { ExtendedProgram } from '@/types';
import WYSIWYGEditor from '../shared/WYSIWYGEditor';

const { Title } = Typography;

interface Props {
  value: ExtendedProgram;
  onChange: (data: ExtendedProgram) => void;
}

const ConstructorStep9: React.FC<Props> = ({ value, onChange }) => {
  const update = useCallback(
    (
      field: keyof Required<ExtendedProgram>['orgPedConditions'],
      newValue: Required<ExtendedProgram>['orgPedConditions'][typeof field],
    ) => {
      onChange({
        ...value,
        orgPedConditions: {
          ...value.orgPedConditions,
          [field]: newValue,
        },
      });
    },
    [value, onChange],
  );

  return (
    <Form layout="vertical">
      <Title level={4}>Организационно-педагогические условия</Title>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          marginBottom: 20,
        }}
      >
        <WYSIWYGEditor
          name="normativeDocuments"
          label="Нормативные документы"
          placeholder="Введите нормативные документы..."
          rows={3}
          value={value.orgPedConditions?.normativeDocuments}
          onChange={(val) => update('normativeDocuments', val)}
        />

        <WYSIWYGEditor
          name="mainLiterature"
          label="Список основной литературы"
          placeholder="Введите список основной литературы..."
          rows={3}
          value={value.orgPedConditions?.mainLiterature}
          onChange={(val) => update('mainLiterature', val)}
        />

        <WYSIWYGEditor
          name="additionalLiterature"
          label="Список дополнительной литературы"
          placeholder="Введите список дополнительной литературы..."
          rows={3}
          value={value.orgPedConditions?.additionalLiterature}
          onChange={(val) => update('additionalLiterature', val)}
        />

        <WYSIWYGEditor
          name="electronicMaterials"
          label="Электронные учебные материалы"
          placeholder="Введите список электронных учебных материалов..."
          rows={3}
          value={value.orgPedConditions?.electronicMaterials}
          onChange={(val) => update('electronicMaterials', val)}
        />

        <WYSIWYGEditor
          name="internetResources"
          label="Интернет-ресурсы"
          placeholder="Введите список интернет-ресурсов..."
          rows={3}
          value={value.orgPedConditions?.internetResources}
          onChange={(val) => update('internetResources', val)}
        />

        <WYSIWYGEditor
          name="equipment"
          label="Технические средства обучения"
          placeholder="Введите технические средства обучения..."
          rows={3}
          value={value.orgPedConditions?.equipment}
          onChange={(val) => update('equipment', val)}
        />

        <WYSIWYGEditor
          name="personnelProvision"
          label="Кадровое обеспечение"
          placeholder="Введите список кадрового обеспечения"
          rows={3}
          value={value.orgPedConditions?.personnelProvision}
          onChange={(val) => update('personnelProvision', val)}
        />
      </div>
    </Form>
  );
};

export default ConstructorStep9;
