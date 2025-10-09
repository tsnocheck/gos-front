import { StyleSheet } from '@react-pdf/renderer';

export type StyleObject = Parameters<typeof StyleSheet.create>[0][0];

export const PDFStyles = StyleSheet.create({
  page: {
    paddingHorizontal: 30,
    paddingVertical: 60,
    fontSize: 12,
    lineHeight: 1.6,
    fontFamily: 'Times-New-Roman',
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  paragraph: {
    marginBottom: 10,
    textAlign: 'justify',
  },
  bold: { fontWeight: 'bold' },
  italic: { fontStyle: 'italic' },
  block: {
    marginBottom: 10,
    textAlign: 'justify',
  },
  row: {
    marginBottom: 5,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    right: 0,
    left: 0,
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'Times-New-Roman',
  },
});

export const PDFTableStyles = StyleSheet.create({
  self: {
    // removed outer borders so each row/cell draws its own borders — this prevents a visible gap
    // when the table is split across pages
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
    // draw a top border for every row so horizontal lines remain continuous across page breaks
    borderTopWidth: 1,
    borderColor: '#000',
  },
  col: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1, // add left border to ensure complete table borders
    borderColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 10,
    lineHeight: 1.25,
    flexShrink: 1,
  },
  headerCell: {
    backgroundColor: '#f5f5f5',
  },
  headerText: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 10,
  },
  center: {
    textAlign: 'center',
  },
  italic: {
    fontStyle: 'italic',
  },
});

export const PDFListStyles = StyleSheet.create({
  list: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 8,
    marginBottom: 8,
  },
  listItem: {
    marginBottom: 4,
  },
  bullet: {
    width: 10,
    fontSize: 12,
  },
  itemContent: {
    flex: 1,
    fontSize: 12,
  },
});

export const currentYear = new Date().getFullYear();

export const calcWidth = (partOf: number): StyleObject => ({
  width: `${partOf * 100}%`,
});
