import React, { useEffect, useState } from "react";
import { Form, Input, Typography, Checkbox } from "antd";
import { DistanceEquipment, Equipment } from "../../types";

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
  { value: DistanceEquipment.PC_INTERNET, label: "Персональный компьютер с интернетом" },
  { value: DistanceEquipment.AUDIO_DEVICES, label: "Колонки/наушники или встроенный динамик" },
  { value: DistanceEquipment.SOFTWARE, label: "Стандартное ПО (браузер, редактор, PDF)" },
  { value: DistanceEquipment.OTHER_DISTANCE, label: "Иное" },
];

interface Props {
  value: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

const ConstructorStep9: React.FC<Props> = ({ value, onChange }) => {
  const [form] = Form.useForm();
  const [otherEquipment, setOtherEquipment] = useState(value.otherEquipment as string || "");
  const [otherDistance, setOtherDistance] = useState(value.otherDistance as string || "");

  useEffect(() => {
    onChange({ ...form.getFieldsValue(), otherEquipment, otherDistance });
    // eslint-disable-next-line
  }, [form, otherEquipment, otherDistance]);

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={value}
      onValuesChange={() => onChange({ ...form.getFieldsValue(), otherEquipment, otherDistance })}
    >
      <Title level={4}>Организационно-педагогические условия</Title>
      <Form.Item name="normativeDocuments" label="Нормативные документы">
        <Input.TextArea rows={2} />
      </Form.Item>
      <Form.Item name="mainLiterature" label="Основная литература">
        <Input.TextArea rows={2} />
      </Form.Item>
      <Form.Item name="additionalLiterature" label="Дополнительная литература">
        <Input.TextArea rows={2} />
      </Form.Item>
      <Form.Item name="electronicMaterials" label="Электронные учебные материалы">
        <Input.TextArea rows={2} />
      </Form.Item>
      <Form.Item name="internetResources" label="Интернет-ресурсы">
        <Input.TextArea rows={2} />
      </Form.Item>
      <Form.Item name="equipment" label="Оборудование для аудиторных занятий">
        <Checkbox.Group options={equipmentList} />
        {form.getFieldValue("equipment")?.includes("other") && (
          <Input
            style={{ marginTop: 8 }}
            placeholder="Укажите оборудование..."
            value={otherEquipment}
            onChange={e => setOtherEquipment(e.target.value)}
          />
        )}
      </Form.Item>
      <Form.Item name="distanceEquipment" label="Оборудование для дистанционного обучения">
        <Checkbox.Group options={distanceEquipmentList} />
        {form.getFieldValue("distanceEquipment")?.includes("other-distance") && (
          <Input
            style={{ marginTop: 8 }}
            placeholder="Укажите дополнительное оборудование..."
            value={otherDistance}
            onChange={e => setOtherDistance(e.target.value)}
          />
        )}
      </Form.Item>
      <Form.Item name="personnelProvision" label="Кадровое обеспечение">
        <Input.TextArea rows={2} />
      </Form.Item>
    </Form>
  );
};

export default ConstructorStep9; 