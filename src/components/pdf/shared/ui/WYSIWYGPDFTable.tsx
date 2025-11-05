import React, { type PropsWithChildren } from 'react';
import { View, Text } from '@react-pdf/renderer';
import { StyleSheet } from '@react-pdf/renderer';

const WYSIWYGTableStyles = StyleSheet.create({
  table: {
    marginTop: 8,
    marginBottom: 8,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    width: '100%',
    borderTopWidth: 1,
    borderColor: '#000',
  },
  cell: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 10,
    lineHeight: 1.25,
    flexShrink: 1,
    flexGrow: 1,
    flexBasis: 0,
  },
  headerCell: {
    backgroundColor: '#f5f5f5',
  },
  headerText: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 10,
  },
});

type CellProps = PropsWithChildren<{
  style?: any;
  colspan?: number;
  width?: string | number;
}>;

type RowProps = PropsWithChildren<{
  style?: any;
  isHeader?: boolean;
}>;

export const WYSIWYGPDFTable = {
  Table: (props: PropsWithChildren<{ style?: any }>) => (
    <View style={[WYSIWYGTableStyles.table, props.style || {}]} wrap={true}>
      {props.children}
    </View>
  ),

  Row: (props: RowProps) => (
    <View style={[WYSIWYGTableStyles.row, props.style || {}]} wrap={false}>
      {props.children}
    </View>
  ),

  HeaderCell: (props: CellProps) => {
    const cellStyle: any = { ...WYSIWYGTableStyles.cell, ...WYSIWYGTableStyles.headerCell };

    if (props.colspan && props.colspan > 1) {
      cellStyle.flexGrow = props.colspan;
      cellStyle.flexBasis = `${props.colspan * 100}%`;
    }

    if (props.width) {
      cellStyle.width = props.width;
      cellStyle.flexGrow = 0;
      cellStyle.flexShrink = 0;
    }

    const isReactElement = React.isValidElement(props.children);
    const isArrayOfElements =
      Array.isArray(props.children) && props.children.some((child) => React.isValidElement(child));

    return (
      <View style={[cellStyle, props.style || {}]} wrap={false}>
        {isReactElement || isArrayOfElements ? (
          props.children
        ) : (
          <Text style={WYSIWYGTableStyles.headerText}>{props.children}</Text>
        )}
      </View>
    );
  },

  Cell: (props: CellProps) => {
    const cellStyle: any = { ...WYSIWYGTableStyles.cell };

    if (props.colspan && props.colspan > 1) {
      cellStyle.flexGrow = props.colspan;
      cellStyle.flexBasis = `${props.colspan * 100}%`;
    }

    if (props.width) {
      cellStyle.width = props.width;
      cellStyle.flexGrow = 0;
      cellStyle.flexShrink = 0;
    }

    const isReactElement = React.isValidElement(props.children);
    const isArrayOfElements =
      Array.isArray(props.children) && props.children.some((child) => React.isValidElement(child));

    return (
      <View style={[cellStyle, props.style || {}]} wrap={false}>
        {isReactElement || isArrayOfElements ? (
          props.children
        ) : (
          <Text style={{ fontSize: 10, lineHeight: 1.3 }}>{props.children}</Text>
        )}
      </View>
    );
  },
};

