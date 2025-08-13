import { StyleSheet } from "@react-pdf/renderer";

export type StyleObject = Parameters<typeof StyleSheet.create>[0][0];

export const PDFStyles = StyleSheet.create({
  page: {
    paddingHorizontal: 30,
    paddingVertical: 60,
    fontSize: 12,
    lineHeight: 1.6,
    fontFamily: "Times-New-Roman",
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 30,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "uppercase",
  },
  paragraph: { marginBottom: 10 },
  bold: { fontWeight: "bold" },
  italic: { fontStyle: "italic" },
  block: {
    marginBottom: 10,
  },
  row: {
    marginBottom: 5,
  },
});

export const PDFTableStyles = StyleSheet.create({
  self: {
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderColor: "#000",
    marginTop: 4,
    display: 'flex',
    flexDirection: 'column'
  },
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch",
  },
  col: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000",
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontSize: 11,
    lineHeight: 1.25,
  },
  header: {
    fontWeight: "bold",
    textAlign: "center",
  },
  center: {
    textAlign: "center",
  },
  italic: {
    fontStyle: "italic",
  },
});

export const PDFListStyles = StyleSheet.create({
  list: {
    display: "flex",
    flexDirection: "column",
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
