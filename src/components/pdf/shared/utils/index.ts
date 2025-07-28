import { StyleSheet } from "@react-pdf/renderer";

export type StyleObject = Parameters<typeof StyleSheet.create>[0][0]

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
    fontWeight: 900,
    textAlign: "center",
    textTransform: "uppercase",
  },
  block: {
    marginBottom: 10,
  },
  row: {
    marginBottom: 5,
  },
});

export const currentYear = new Date().getFullYear();