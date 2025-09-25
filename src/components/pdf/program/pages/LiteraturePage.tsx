import type { FC } from 'react';
import type { ProgramPDFProps } from '@/types';
import { Equipment, DistanceEquipment } from '@/types';
import { View, Text } from '@react-pdf/renderer';
import { PDFPage } from '../../shared/ui/PDFPage';
import HTMLContent from '../../shared/ui/HTMLContent';

const equipmentLabels: Record<Equipment, string> = {
  [Equipment.COMPUTER]: 'Компьютер',
  [Equipment.PROJECTOR]: 'Проектор',
  [Equipment.INTERACTIVE_BOARD]: 'Интерактивная доска',
  [Equipment.SPEAKERS]: 'Колонки',
  [Equipment.MARKER_BOARDS]: 'Маркерные доски или флипчарты',
  [Equipment.OTHER]: 'Иное',
};

const distanceEquipmentLabels: Record<DistanceEquipment, string> = {
  [DistanceEquipment.PC_INTERNET]: 'Персональный компьютер с интернетом',
  [DistanceEquipment.AUDIO_DEVICES]: 'Колонки/наушники или встроенный динамик',
  [DistanceEquipment.SOFTWARE]: 'Стандартное ПО (браузер, редактор, PDF)',
  [DistanceEquipment.OTHER_DISTANCE]: 'Иное',
};

export const LiteraturePage: FC<ProgramPDFProps> = ({ program, pageNumber }) => {
  const { orgPedConditions } = program;

  const formatEquipmentList = (equipment: Equipment[], otherEquipment?: string) => {
    const items = equipment.map(eq => equipmentLabels[eq]).filter(Boolean);
    if (equipment.includes(Equipment.OTHER) && otherEquipment) {
      items[items.indexOf(equipmentLabels[Equipment.OTHER])] = otherEquipment;
    }
    return items.join(', ');
  };

  const formatDistanceEquipmentList = (equipment: DistanceEquipment[], otherDistance?: string) => {
    const items = equipment.map(eq => distanceEquipmentLabels[eq]).filter(Boolean);
    if (equipment.includes(DistanceEquipment.OTHER_DISTANCE) && otherDistance) {
      items[items.indexOf(distanceEquipmentLabels[DistanceEquipment.OTHER_DISTANCE])] = otherDistance;
    }
    return items.join(', ');
  };

  return (
    <PDFPage title="Список литературы" pageNumber={pageNumber}>
      {orgPedConditions?.mainLiterature && (
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>
            Список основной литературы
          </Text>
          <HTMLContent html={orgPedConditions.mainLiterature} />
        </View>
      )}

      {orgPedConditions?.additionalLiterature && (
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>
            Список дополнительной литературы
          </Text>
          <HTMLContent html={orgPedConditions.additionalLiterature} />
        </View>
      )}

      {orgPedConditions?.electronicMaterials && (
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>
            Электронные учебные материалы
          </Text>
          <HTMLContent html={orgPedConditions.electronicMaterials} />
        </View>
      )}

      {orgPedConditions?.internetResources && (
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>
            Интернет-ресурсы
          </Text>
          <HTMLContent html={orgPedConditions.internetResources} />
        </View>
      )}

      {orgPedConditions?.equipment && orgPedConditions.equipment.length > 0 && (
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>
            Оборудование для аудиторных занятий
          </Text>
          <Text style={{ fontSize: 12, lineHeight: 1.4 }}>
            {formatEquipmentList(orgPedConditions.equipment, orgPedConditions.otherEquipment)}
          </Text>
        </View>
      )}

      {orgPedConditions?.distanceEquipment && orgPedConditions.distanceEquipment.length > 0 && (
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>
            Оборудование для дистанционного обучения
          </Text>
          <Text style={{ fontSize: 12, lineHeight: 1.4 }}>
            {formatDistanceEquipmentList(orgPedConditions.distanceEquipment, orgPedConditions.otherDistance)}
          </Text>
        </View>
      )}

      {orgPedConditions?.personnelProvision && (
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>
            Кадровое обеспечение
          </Text>
          <HTMLContent html={orgPedConditions.personnelProvision} />
        </View>
      )}
    </PDFPage>
  );
};
