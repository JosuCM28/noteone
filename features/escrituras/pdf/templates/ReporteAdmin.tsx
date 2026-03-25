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
  slate: "#1E293B",
  slateLight: "#334155",
  slateMid: "#475569",
  blue: "#1D4ED8",
  blueLight: "#3B82F6",
  white: "#FFFFFF",
  grayBg: "#F8FAFC",
  grayBorder: "#CBD5E1",
  grayText: "#64748B",
  darkText: "#0F172A",
  sideA: "#1B3A6B",
  sideABg: "#EFF4FF",
  sideABorder: "#BFCFE8",
  sideB: "#1A5C3A",
  sideBBg: "#F0FAF4",
  sideBBorder: "#B8D9C4",
  gold: "#B45309",
  goldBg: "#FFFBEB",
  goldBorder: "#FCD34D",
};

const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    backgroundColor: C.white,
    paddingHorizontal: 36,
    paddingVertical: 28,
    fontSize: 9,
    color: C.darkText,
  },
  /* ---------- Top stripe ---------- */
  topStripe: {
    backgroundColor: C.slate,
    height: 5,
    borderRadius: 3,
    marginBottom: 14,
  },
  /* ---------- Header ---------- */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: C.slate,
  },
  headerLeft: { gap: 3 },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: C.slate,
  },
  headerSub: { fontSize: 9, color: C.slateMid },
  headerRight: { alignItems: "flex-end", gap: 4 },
  headerTag: {
    backgroundColor: C.slate,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  headerTagText: {
    color: C.white,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },
  headerDate: { fontSize: 8, color: C.grayText },
  /* ---------- Info grid (datos generales) ---------- */
  infoGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  infoCard: {
    flex: 1,
    backgroundColor: C.grayBg,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: C.grayBorder,
    padding: 10,
    gap: 5,
  },
  infoCardTitle: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: C.blue,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: C.grayBorder,
  },
  infoRow: { flexDirection: "row", gap: 4 },
  infoLabel: { width: "45%", fontSize: 8, color: C.grayText },
  infoValue: { flex: 1, fontSize: 8, fontFamily: "Helvetica-Bold" },
  /* ---------- Section (personas / impuestos) ---------- */
  section: {
    marginBottom: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: C.grayBorder,
    overflow: "hidden",
  },
  sectionHeader: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionHeaderA: { backgroundColor: C.sideA },
  sectionHeaderB: { backgroundColor: C.sideB },
  sectionHeaderNeutral: { backgroundColor: C.slateLight },
  sectionHeaderText: {
    color: C.white,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionHeaderBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  sectionHeaderBadgeText: { color: C.white, fontSize: 7 },
  sectionBody: { padding: 10, gap: 6 },
  participantCard: {
    flexDirection: "row",
    backgroundColor: C.white,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: C.grayBorder,
    padding: 8,
    gap: 10,
    alignItems: "flex-start",
  },
  participantDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 2,
  },
  participantDotA: { backgroundColor: C.sideA },
  participantDotB: { backgroundColor: C.sideB },
  participantInfo: { flex: 1, gap: 2 },
  participantName: { fontSize: 9, fontFamily: "Helvetica-Bold" },
  participantRole: { fontSize: 7, color: C.grayText },
  participantPhone: { fontSize: 8, color: C.slateMid },
  /* ---------- Tax table ---------- */
  taxTable: { marginTop: 2 },
  taxTableHeader: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: C.grayBg,
    borderBottomWidth: 1,
    borderBottomColor: C.grayBorder,
  },
  taxTableHeaderText: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: C.grayText,
    textTransform: "uppercase",
  },
  taxRow: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: C.grayBorder,
  },
  taxRowAlt: { backgroundColor: C.grayBg },
  colName: { flex: 1 },
  colSide: { width: 50 },
  colAmount: { width: 80, textAlign: "right" },
  /* ---------- Totals ---------- */
  totalsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  totalCard: {
    flex: 1,
    borderRadius: 5,
    borderWidth: 1.5,
    padding: 12,
    gap: 4,
  },
  totalCardA: {
    borderColor: C.sideA,
    backgroundColor: C.sideABg,
  },
  totalCardB: {
    borderColor: C.sideB,
    backgroundColor: C.sideBBg,
  },
  totalCardFinal: {
    borderColor: C.gold,
    backgroundColor: C.goldBg,
  },
  totalCardLabel: { fontSize: 8, color: C.grayText },
  totalCardAmount: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
  },
  totalCardAmountA: { color: C.sideA },
  totalCardAmountB: { color: C.sideB },
  totalCardAmountFinal: { color: C.gold },
  /* ---------- Notes ---------- */
  notesBox: {
    backgroundColor: C.goldBg,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: C.goldBorder,
    padding: 10,
    marginBottom: 12,
    gap: 4,
  },
  notesTitle: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: C.gold,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  notesText: { fontSize: 8, color: C.slateMid },
  /* ---------- Footer ---------- */
  footer: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: C.grayBorder,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  footerLeft: { gap: 2 },
  footerText: { fontSize: 7, color: C.grayText },
  footerConfidential: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: C.slateMid,
  },
  footerRight: { alignItems: "flex-end", gap: 2 },
  footerBrand: { fontSize: 9, fontFamily: "Helvetica-Bold", color: C.slate },
  footerDate: { fontSize: 7, color: C.grayText },
});

interface Props {
  escritura: EscrituraParaPDF;
}

export function ReporteAdmin({ escritura }: Props) {
  const participantesA = escritura.participants.filter((p) => p.side === "A");
  const participantesB = escritura.participants.filter((p) => p.side === "B");
  const taxesA = escritura.deedTax.filter((t) => t.side === "A");
  const taxesB = escritura.deedTax.filter((t) => t.side === "B");
  const totalFinal = escritura.totalA + escritura.totalB;
  const today = formatDateES(new Date());
  const statusLabel = STATUS_LABELS[escritura.status] ?? escritura.status;
  const hasB = participantesB.length > 0 || taxesB.length > 0;

  const rolesA = [...new Set(participantesA.map((p) => p.role))].join(" / ") || "Parte A";
  const rolesB = [...new Set(participantesB.map((p) => p.role))].join(" / ") || "Parte B";

  return (
    <Document
      title={`Reporte Completo – ${escritura.folio}`}
      author="Sistema Notarial"
    >
      <Page size="A4" style={s.page}>
        {/* Top stripe */}
        <View style={s.topStripe} />

        {/* Header */}
        <View style={s.header}>
          <View style={s.headerLeft}>
            <Text style={s.headerTitle}>REPORTE DE ESCRITURA</Text>
            <Text style={s.headerSub}>Documento Completo · Uso Interno</Text>
          </View>
          <View style={s.headerRight}>
            <View style={s.headerTag}>
              <Text style={s.headerTagText}>USO ADMINISTRATIVO</Text>
            </View>
            <Text style={s.headerDate}>{today}</Text>
          </View>
        </View>

        {/* Datos generales grid */}
        <View style={s.infoGrid}>
          <View style={s.infoCard}>
            <Text style={s.infoCardTitle}>Identificación</Text>
            <View style={s.infoRow}>
              <Text style={s.infoLabel}>Folio:</Text>
              <Text style={s.infoValue}>{escritura.folio}</Text>
            </View>
            <View style={s.infoRow}>
              <Text style={s.infoLabel}>No. Escritura:</Text>
              <Text style={s.infoValue}>{escritura.deedNumber ?? "En proceso"}</Text>
            </View>
          </View>

          <View style={s.infoCard}>
            <Text style={s.infoCardTitle}>Tipo y Estatus</Text>
            <View style={s.infoRow}>
              <Text style={s.infoLabel}>Tipo:</Text>
              <Text style={s.infoValue}>{escritura.typeLabel}</Text>
            </View>
            <View style={s.infoRow}>
              <Text style={s.infoLabel}>Estatus:</Text>
              <Text style={s.infoValue}>{statusLabel}</Text>
            </View>
          </View>

          {escritura.baseValue > 0 ? (
            <View style={s.infoCard}>
              <Text style={s.infoCardTitle}>Valor Base</Text>
              <View style={s.infoRow}>
                <Text style={s.infoLabel}>Monto:</Text>
                <Text style={s.infoValue}>{formatMXN(escritura.baseValue)}</Text>
              </View>
            </View>
          ) : null}
        </View>

        {/* Persona A */}
        <View style={s.section}>
          <View style={[s.sectionHeader, s.sectionHeaderA]}>
            <Text style={s.sectionHeaderText}>{rolesA} — Participantes</Text>
            <View style={s.sectionHeaderBadge}>
              <Text style={s.sectionHeaderBadgeText}>
                {participantesA.length} persona(s)
              </Text>
            </View>
          </View>
          <View style={s.sectionBody}>
            {participantesA.length > 0 ? (
              participantesA.map((p, i) => (
                <View key={i} style={s.participantCard}>
                  <View style={[s.participantDot, s.participantDotA]} />
                  <View style={s.participantInfo}>
                    <Text style={s.participantName}>{p.name}</Text>
                    <Text style={s.participantRole}>{p.role}</Text>
                    <Text style={s.participantPhone}>
                      Tel: {p.phone ?? "—"}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={{ fontSize: 8, color: C.grayText }}>
                Sin participantes registrados.
              </Text>
            )}
          </View>
        </View>

        {/* Conceptos Parte A */}
        <View style={s.section}>
          <View style={[s.sectionHeader, s.sectionHeaderA]}>
            <Text style={s.sectionHeaderText}>Conceptos {rolesA}</Text>
            <View style={s.sectionHeaderBadge}>
              <Text style={s.sectionHeaderBadgeText}>
                Total: {formatMXN(escritura.totalA)}
              </Text>
            </View>
          </View>
          <View style={s.taxTable}>
            <View style={s.taxTableHeader}>
              <Text style={[s.taxTableHeaderText, s.colName]}>Concepto</Text>
              <Text style={[s.taxTableHeaderText, s.colAmount]}>Monto</Text>
            </View>
            {taxesA.length > 0 ? (
              taxesA.map((t, i) => (
                <View key={t.key} style={[s.taxRow, i % 2 !== 0 ? s.taxRowAlt : {}]}>
                  <Text style={[{ fontSize: 8 }, s.colName]}>{t.name}</Text>
                  <Text style={[{ fontSize: 8, fontFamily: "Helvetica-Bold" }, s.colAmount]}>
                    {t.key === "traslado" ? `${t.amount}%` : formatMXN(t.amount)}
                  </Text>
                </View>
              ))
            ) : (
              <View style={s.taxRow}>
                <Text style={{ fontSize: 8, color: C.grayText }}>
                  Sin conceptos registrados.
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Persona B y conceptos B — solo si existe */}
        {hasB ? (
          <>
            <View style={s.section}>
              <View style={[s.sectionHeader, s.sectionHeaderB]}>
                <Text style={s.sectionHeaderText}>{rolesB} — Participantes</Text>
                <View style={s.sectionHeaderBadge}>
                  <Text style={s.sectionHeaderBadgeText}>
                    {participantesB.length} persona(s)
                  </Text>
                </View>
              </View>
              <View style={s.sectionBody}>
                {participantesB.length > 0 ? (
                  participantesB.map((p, i) => (
                    <View key={i} style={s.participantCard}>
                      <View style={[s.participantDot, s.participantDotB]} />
                      <View style={s.participantInfo}>
                        <Text style={s.participantName}>{p.name}</Text>
                        <Text style={s.participantRole}>{p.role}</Text>
                        <Text style={s.participantPhone}>
                          Tel: {p.phone ?? "—"}
                        </Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <Text style={{ fontSize: 8, color: C.grayText }}>
                    Sin participantes registrados.
                  </Text>
                )}
              </View>
            </View>

            <View style={s.section}>
              <View style={[s.sectionHeader, s.sectionHeaderB]}>
                <Text style={s.sectionHeaderText}>Conceptos {rolesB}</Text>
                <View style={s.sectionHeaderBadge}>
                  <Text style={s.sectionHeaderBadgeText}>
                    Total: {formatMXN(escritura.totalB)}
                  </Text>
                </View>
              </View>
              <View style={s.taxTable}>
                <View style={s.taxTableHeader}>
                  <Text style={[s.taxTableHeaderText, s.colName]}>Concepto</Text>
                  <Text style={[s.taxTableHeaderText, s.colAmount]}>Monto</Text>
                </View>
                {taxesB.length > 0 ? (
                  taxesB.map((t, i) => (
                    <View key={t.key} style={[s.taxRow, i % 2 !== 0 ? s.taxRowAlt : {}]}>
                      <Text style={[{ fontSize: 8 }, s.colName]}>{t.name}</Text>
                      <Text style={[{ fontSize: 8, fontFamily: "Helvetica-Bold" }, s.colAmount]}>
                        {t.key === "traslado" ? `${t.amount}%` : formatMXN(t.amount)}
                      </Text>
                    </View>
                  ))
                ) : (
                  <View style={s.taxRow}>
                    <Text style={{ fontSize: 8, color: C.grayText }}>
                      Sin conceptos registrados.
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </>
        ) : null}

        {/* Totales */}
        <View style={s.totalsRow}>
          <View style={[s.totalCard, s.totalCardA]}>
            <Text style={s.totalCardLabel}>Total {rolesA}</Text>
            <Text style={[s.totalCardAmount, s.totalCardAmountA]}>
              {formatMXN(escritura.totalA)}
            </Text>
          </View>
          {hasB ? (
            <View style={[s.totalCard, s.totalCardB]}>
              <Text style={s.totalCardLabel}>Total {rolesB}</Text>
              <Text style={[s.totalCardAmount, s.totalCardAmountB]}>
                {formatMXN(escritura.totalB)}
              </Text>
            </View>
          ) : null}
          <View style={[s.totalCard, s.totalCardFinal]}>
            <Text style={s.totalCardLabel}>Total Final</Text>
            <Text style={[s.totalCardAmount, s.totalCardAmountFinal]}>
              {formatMXN(totalFinal)}
            </Text>
          </View>
        </View>

        {/* Notas */}
        {escritura.notes ? (
          <View style={s.notesBox}>
            <Text style={s.notesTitle}>Notas de la escritura</Text>
            <Text style={s.notesText}>{escritura.notes}</Text>
          </View>
        ) : null}

        {/* Footer */}
        <View style={s.footer}>
          <View style={s.footerLeft}>
            <Text style={s.footerConfidential}>DOCUMENTO CONFIDENCIAL</Text>
            <Text style={s.footerText}>
              Uso exclusivo del personal autorizado del sistema notarial.
            </Text>
          </View>
          <View style={s.footerRight}>
            <Text style={s.footerBrand}>Sistema Notarial</Text>
            <Text style={s.footerDate}>Generado: {today}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
