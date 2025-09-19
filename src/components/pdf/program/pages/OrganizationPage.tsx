import { Text } from '@react-pdf/renderer';
import type { FC } from 'react';
import type { ProgramPDFProps } from '@/types';
import { PDFPage } from '../../shared/ui/PDFPage';

export const OrganizationPage: FC<ProgramPDFProps> = ({ program }) => {
  return (
    <PDFPage title="Орг.-пед. условия">
      <Text>Кадровое обеспечение: {program.orgPedConditions?.personnelProvision}</Text>
      <Text>Оборудование: {(program.orgPedConditions?.equipment || []).join(', ')}</Text>
      <Text>Дистанционное: {(program.orgPedConditions?.distanceEquipment || []).join(', ')}</Text>
    </PDFPage>
  );
};
