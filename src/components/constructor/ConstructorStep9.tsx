import React, { useCallback } from "react";
import { Form, Input, Typography, Checkbox, Tabs } from "antd";
import {
  DistanceEquipment,
  Equipment,
  type CreateProgramForm,
} from "../../types";
import WYSIWYGEditor from "../shared/WYSIWYGEditor";

const { Title } = Typography;

const equipmentList: { value: Equipment; label: string }[] = [
  { value: Equipment.COMPUTER, label: "Компьютер" },
  { value: Equipment.PROJECTOR, label: "Проектор" },
  { value: Equipment.INTERACTIVE_BOARD, label: "Интерактивная доска" },
  { value: Equipment.SPEAKERS, label: "Колонки" },
  { value: Equipment.MARKER_BOARDS, label: "Маркерные доски или флипчарты" },
  { value: Equipment.OTHER, label: "Иное" },
];

const distanceEquipmentList: { value: DistanceEquipment; label: string }[] = [
  {
    value: DistanceEquipment.PC_INTERNET,
    label: "Персональный компьютер с интернетом",
  },
  {
    value: DistanceEquipment.AUDIO_DEVICES,
    label: "Колонки/наушники или встроенный динамик",
  },
  {
    value: DistanceEquipment.SOFTWARE,
    label: "Стандартное ПО (браузер, редактор, PDF)",
  },
  { value: DistanceEquipment.OTHER_DISTANCE, label: "Иное" },
];

interface Props {
  value: Partial<CreateProgramForm>;
  onChange: (data: Partial<CreateProgramForm>) => void;
}

const ConstructorStep9: React.FC<Props> = ({ value, onChange }) => {
  const update = useCallback((
    field: keyof CreateProgramForm["orgPedConditions"],
    newValue: CreateProgramForm["orgPedConditions"][typeof field]
  ) => {
    onChange({
      ...value,
      orgPedConditions: {
        ...value.orgPedConditions,
        [field]: newValue,
      },
    });
  }, [value, onChange]);

  return (
    <Form layout="vertical">
      <Title level={4}>Организационно-педагогические условия</Title>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
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
          onChange={(val) => update("normativeDocuments", val)}
        />

        <WYSIWYGEditor
          name="mainLiterature"
          label="Список основной литературы"
          placeholder="Введите список основной литературы..."
          rows={3}
          value={value.orgPedConditions?.mainLiterature}
          onChange={(val) => update("mainLiterature", val)}
        />

        <WYSIWYGEditor
          name="additionalLiterature"
          label="Список дополнительной литературы"
          placeholder="Введите список дополнительной литературы..."
          rows={3}
          value={value.orgPedConditions?.additionalLiterature}
          onChange={(val) => update("additionalLiterature", val)}
        />

        <WYSIWYGEditor
          name="electronicMaterials"
          label="Электронные учебные материалы"
          placeholder="Введите список электронных учебных материалов..."
          rows={3}
          value={value.orgPedConditions?.electronicMaterials}
          onChange={(val) => update("electronicMaterials", val)}
        />

        <WYSIWYGEditor
          name="internetResources"
          label="Интернет-ресурсы"
          placeholder="Введите список интернет-ресурсов..."
          rows={3}
          value={value.orgPedConditions?.internetResources}
          onChange={(val) => update("internetResources", val)}
        />
      </div>

      <Form.Item label="Оборудование для аудиторных занятий">
        <Checkbox.Group
          options={equipmentList}
          value={value.orgPedConditions?.equipment}
          onChange={(val) => update("equipment", val as Equipment[])}
        />
        {value.orgPedConditions?.equipment?.includes(Equipment.OTHER) && (
          <Input
            style={{ marginTop: 8 }}
            placeholder="Укажите оборудование..."
            value={value.orgPedConditions?.otherEquipment}
            onChange={(e) => update("otherEquipment", e.target.value)}
          />
        )}
      </Form.Item>

      <Form.Item label="Оборудование для дистанционного обучения">
        <Checkbox.Group
          options={distanceEquipmentList}
          value={value.orgPedConditions?.distanceEquipment}
          onChange={(val) =>
            update("distanceEquipment", val as DistanceEquipment[])
          }
        />
        {value.orgPedConditions?.distanceEquipment?.includes(
          DistanceEquipment.OTHER_DISTANCE
        ) && (
          <Input
            style={{ marginTop: 8 }}
            placeholder="Укажите дополнительное оборудование..."
            value={value.orgPedConditions?.otherDistance}
            onChange={(e) => update("otherDistance", e.target.value)}
          />
        )}
      </Form.Item>

      <WYSIWYGEditor
        name="personnelProvision"
        label="Кадровое обеспечение"
        placeholder="Введите список кадрового обеспечения"
        rows={3}
        value={value.orgPedConditions?.personnelProvision}
        onChange={(val) => update("personnelProvision", val)}
      />
    </Form>
  );
};

export default ConstructorStep9;
