import { View, Text } from '@react-pdf/renderer';
import { PDFListStyles } from '../utils';

export const PDFList: React.FC<{ items: string[] }> = ({ items }) => (
  <View style={PDFListStyles.list}>
    {items.map((item, index) => (
      <View style={PDFListStyles.listItem} key={index}>
        <Text style={PDFListStyles.bullet}>• </Text>
        <Text style={PDFListStyles.itemContent}>{item}</Text>
        <Text>{'\n'}</Text>
      </View>
    ))}
  </View>
);
