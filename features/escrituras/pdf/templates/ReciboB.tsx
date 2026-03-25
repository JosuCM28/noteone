import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { EscrituraParaPDF } from "../types";
import { STATUS_LABELS, formatMXN, formatDateES } from "../types";

const C = {
  emerald: "#1A5C3A",
  emeraldLight: "#2D7A50",
  gold: "#C9A84C",
  white: "#FFFFFF",
  grayBg: "#F4F8F5",
  grayBorder: "#C8DDD0",
  grayText: "#5E7368",
  darkText: "#1A2821",
  accent: "#0D4E2F",
  accentBg: "#E8F4EE",
};

const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    backgroundColor: C.white,
    paddingHorizontal: 36,
    paddingVertical: 32,
    fontSize: 9,
    color: C.darkText,
  },
  /* ---------- Header ---------- */
  header: {
    backgroundColor: C.emerald,
    borderRadius: 6,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: { gap: 2 },
  headerTitle: { color: C.white, fontSize: 15, fontFamily: "Helvetica-Bold" },
  headerSub: { color: "#9DCBB0", fontSize: 8 },
  headerRight: { alignItems: "flex-end", gap: 3 },
  headerDate: { color: "#9DCBB0", fontSize: 8 },
  headerRef: { color: C.gold, fontSize: 9, fontFamily: "Helvetica-Bold" },
  /* ---------- Notice band ---------- */
  noticeBand: {
    backgroundColor: C.accentBg,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: C.grayBorder,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  noticeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.emeraldLight,
  },
  noticeText: { fontSize: 8, color: C.accent, fontFamily: "Helvetica-Bold" },
  /* ---------- ID box ---------- */
  idBox: {
    backgroundColor: "#EEF6F1",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: C.grayBorder,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  idLabel: { fontSize: 8, color: C.grayText },
  idValue: { flex: 1, fontSize: 7, fontFamily: "Helvetica-Bold", color: C.emerald },
  /* ---------- Table row highlight ---------- */
  tableRowHighlight: { backgroundColor: "#D9EEE1" },
  /* ---------- Section ---------- */
  section: {
    backgroundColor: C.grayBg,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: C.grayBorder,
    padding: 12,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: C.emeraldLight,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: C.grayBorder,
  },
  row: { flexDirection: "row", marginBottom: 4 },
  rowLabel: { width: "40%", color: C.grayText, fontSize: 8 },
  rowValue: { flex: 1, fontFamily: "Helvetica-Bold", fontSize: 8 },
  /* ---------- Table ---------- */
  table: { marginTop: 4 },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: C.emerald,
    borderRadius: 3,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 2,
  },
  tableHeaderText: {
    color: C.white,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },
  tableRow: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: C.grayBorder,
  },
  tableRowAlt: { backgroundColor: "#E0EDE5" },
  colConcepto: { flex: 1 },
  colMonto: { width: 80, textAlign: "right" },
  /* ---------- Total box ---------- */
  totalBox: {
    backgroundColor: C.accentBg,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: C.emerald,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: C.emerald,
  },
  totalAmount: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: C.emerald,
  },
  /* ---------- Badge ---------- */
  badge: {
    backgroundColor: C.emeraldLight,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: "flex-start",
  },
  badgeText: { color: C.white, fontSize: 7, fontFamily: "Helvetica-Bold" },
  /* ---------- Footer ---------- */
  footer: {
    marginTop: 14,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: C.grayBorder,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  footerText: { fontSize: 7, color: C.grayText, maxWidth: "70%" },
  footerRight: { alignItems: "flex-end", gap: 2 },
  footerBrand: { fontSize: 8, fontFamily: "Helvetica-Bold", color: C.emerald },
  footerDate: { fontSize: 7, color: C.grayText },
});

interface Props {
  escritura: EscrituraParaPDF;
}

export function ReciboB({ escritura }: Props) {
  const participantesB = escritura.participants.filter((p) => p.side === "B");
  const taxesB = escritura.deedTax.filter((t) => t.side === "B");
  const today = formatDateES(new Date());
  const statusLabel = STATUS_LABELS[escritura.status] ?? escritura.status;

  // Roles únicos de los participantes B
  const rolesB = [...new Set(participantesB.map((p) => p.role))].join(" / ") || "Parte B";

  // Separar traslado del resto de impuestos
  const trasladoTax = taxesB.find((t) => t.key === "traslado");
  const otrosTaxesB = taxesB.filter((t) => t.key !== "traslado");

  return (
    <Document
      title={`Recibo ${rolesB} – ${escritura.folio}`}
      author="Sistema Notarial"
    >
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <View style={s.headerLeft}>
            <Text style={s.headerTitle}>COMPROBANTE DE PAGO</Text>
            <Text style={s.headerSub}>{rolesB} · Sistema Notarial</Text>
          </View>
          <View style={s.headerRight}>
            <Text style={s.headerDate}>{today}</Text>
            <Text style={s.headerRef}>Folio: {escritura.folio}</Text>
          </View>
        </View>

        {/* Notice */}
        <View style={s.noticeBand}>
          <View style={s.noticeDot} />
          <Text style={s.noticeText}>
            Este comprobante corresponde exclusivamente a los conceptos de {rolesB} de la escritura.
          </Text>
        </View>

        {/* ID de escritura (verificación de autenticidad) */}
        <View style={s.idBox}>
          <Text style={s.idLabel}>ID de escritura:</Text>
          <Text style={s.idValue}>{escritura.id}</Text>
        </View>

        {/* Datos del cliente (Persona B) */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Datos del Cliente</Text>
          {participantesB.length > 0 ? (
            participantesB.map((p, i) => (
              <View key={i}>
                <View style={s.row}>
                  <Text style={s.rowLabel}>Nombre:</Text>
                  <Text style={s.rowValue}>{p.name}</Text>
                </View>
                <View style={s.row}>
                  <Text style={s.rowLabel}>Rol:</Text>
                  <View>
                    <View style={s.badge}>
                      <Text style={s.badgeText}>{p.role}</Text>
                    </View>
                  </View>
                </View>
                <View style={s.row}>
                  <Text style={s.rowLabel}>Teléfono:</Text>
                  <Text style={s.rowValue}>{p.phone ?? "—"}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={{ color: C.grayText, fontSize: 8 }}>
              Sin participantes registrados.
            </Text>
          )}
        </View>

        {/* Datos de la escritura */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Datos de la Escritura</Text>
          <View style={s.row}>
            <Text style={s.rowLabel}>Tipo:</Text>
            <Text style={s.rowValue}>{escritura.typeLabel}</Text>
          </View>
          <View style={s.row}>
            <Text style={s.rowLabel}>No. de Escritura:</Text>
            <Text style={s.rowValue}>{escritura.deedNumber ?? "En proceso"}</Text>
          </View>
          <View style={s.row}>
            <Text style={s.rowLabel}>Folio Interno:</Text>
            <Text style={s.rowValue}>{escritura.folio}</Text>
          </View>
          <View style={s.row}>
            <Text style={s.rowLabel}>Estatus:</Text>
            <Text style={s.rowValue}>{statusLabel}</Text>
          </View>
        </View>

        {/* Desglose de conceptos Parte B */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Desglose de Conceptos – {rolesB}</Text>
          {taxesB.length > 0 ? (
            <View style={s.table}>
              <View style={s.tableHeader}>
                <Text style={[s.tableHeaderText, s.colConcepto]}>Concepto</Text>
                <Text style={[s.tableHeaderText, s.colMonto]}>Monto</Text>
              </View>

              {/* Traslado como porcentaje */}
              {trasladoTax ? (
                <View style={[s.tableRow, s.tableRowHighlight]}>
                  <Text style={[{ fontSize: 8 }, s.colConcepto]}>
                    {trasladoTax.name}
                  </Text>
                  <Text style={[{ fontSize: 8, fontFamily: "Helvetica-Bold" }, s.colMonto]}>
                    {trasladoTax.amount}%
                  </Text>
                </View>
              ) : null}

              {/* Resto de impuestos */}
              {otrosTaxesB.map((t, i) => (
                <View
                  key={t.key}
                  style={[s.tableRow, i % 2 !== 0 ? s.tableRowAlt : {}]}
                >
                  <Text style={[{ fontSize: 8 }, s.colConcepto]}>{t.name}</Text>
                  <Text
                    style={[
                      { fontSize: 8, fontFamily: "Helvetica-Bold" },
                      s.colMonto,
                    ]}
                  >
                    {formatMXN(t.amount)}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={{ color: C.grayText, fontSize: 8, marginTop: 4 }}>
              Sin conceptos registrados.
            </Text>
          )}
        </View>

        {/* Total */}
        <View style={s.totalBox}>
          <Text style={s.totalLabel}>TOTAL A PAGAR</Text>
          <Text style={s.totalAmount}>{formatMXN(escritura.totalB)}</Text>
        </View>

        {/* Footer */}
        <View style={s.footer}>
          <Text style={s.footerText}>
            Documento generado por el sistema notarial. Para verificar la autenticidad
            de este comprobante, ingrese el ID de escritura en la sección de verificación
            del sistema.
          </Text>
          <View style={s.footerRight}>
            <Text style={s.footerBrand}>Sistema Notarial</Text>
            <Text style={s.footerDate}>Generado: {today}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
