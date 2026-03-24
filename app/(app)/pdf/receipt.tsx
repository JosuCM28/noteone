import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

export type ReceiptItem = { name: string; qty: number; price: number };

export type ReceiptPdfProps = {
  folio: string;
  customerName: string;
  total: number;
  items: ReceiptItem[];
};

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 11 },
  title: { fontSize: 16, marginBottom: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  table: { marginTop: 12, borderWidth: 1, borderColor: "#ddd" },
  thRow: { flexDirection: "row", backgroundColor: "#f5f5f5" },
  tdRow: { flexDirection: "row", borderTopWidth: 1, borderTopColor: "#eee" },
  th: { padding: 8, fontSize: 10, fontWeight: 700 },
  td: { padding: 8 },
  colQty: { width: "15%" },
  colName: { width: "55%" },
  colAmt: { width: "30%", textAlign: "right" },
  totalRow: { marginTop: 12, flexDirection: "row", justifyContent: "flex-end" },
  totalLabel: { fontSize: 12, fontWeight: 700, marginRight: 10 },
  totalValue: { fontSize: 12, fontWeight: 700 },
});

export function ReceiptPdf({ folio, customerName, total, items }: ReceiptPdfProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>RECIBO</Text>

        <View style={styles.row}>
          <Text>Folio: {folio}</Text>
          <Text>Cliente: {customerName}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.thRow}>
            <Text style={[styles.th, styles.colQty]}>Cant</Text>
            <Text style={[styles.th, styles.colName]}>Concepto</Text>
            <Text style={[styles.th, styles.colAmt]}>Importe</Text>
          </View>

          {items.map((it, idx) => (
            <View key={idx} style={styles.tdRow}>
              <Text style={[styles.td, styles.colQty]}>{it.qty}</Text>
              <Text style={[styles.td, styles.colName]}>{it.name}</Text>
              <Text style={[styles.td, styles.colAmt]}>
                ${(it.qty * it.price).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
        </View>
      </Page>
    </Document>
  );
}