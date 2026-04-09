import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import fs from "fs";
import path from "path";
import type { EscrituraParaPDF } from "../types";
import { STATUS_LABELS, formatMXN, formatDateES } from "../types";

const _logoPath = path.join(process.cwd(), "public", "notariaLogo.png");
const LOGO_SRC = `data:image/png;base64,${fs.readFileSync(_logoPath).toString("base64")}`;
const NOTARIA = "Notaría Pública Número Uno\nAltotonga, Ver.";
const NOTARIA_FOOTER = "Notaría Pública Número Uno Altotonga, Ver.";

const C = {
  navy: "#1B3A6B",
  navyLight: "#2A5298",
  navyDark: "#122848",
  gold: "#C9A84C",
  goldLight: "#E8C96A",
  white: "#FFFFFF",
  offWhite: "#F7F9FC",
  grayBg: "#F4F7FA",
  grayBorder: "#D1DCE8",
  grayText: "#6B7E95",
  darkText: "#1A2535",
  success: "#1A6B3A",
  successBg: "#EBF7F0",
  successBorder: "#A3D4B8",
};

const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    backgroundColor: C.white,
    paddingHorizontal: 40,
    paddingVertical: 36,
    fontSize: 9,
    color: C.darkText,
  },

  /* ── Header ── */
  header: {
    backgroundColor: C.navy,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 22,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logo: {
    width: 130,
    height: 130,
    objectFit: "contain",
    marginVertical: -20,
  },
  headerCenter: {
    flex: 1,
    gap: 3,
  },
  headerTitle: {
    color: C.white,
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.5,
  },
  headerNotaria: {
    color: C.goldLight,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },
  headerRole: {
    color: "#A8C4E0",
    fontSize: 7.5,
    marginTop: 1,
  },
  headerRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  headerDate: {
    color: "#A8C4E0",
    fontSize: 7.5,
  },
  headerFolio: {
    backgroundColor: C.gold,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  headerFolioText: {
    color: C.navyDark,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
  },

  /* ── Gold divider ── */
  divider: {
    height: 2,
    backgroundColor: C.gold,
    borderRadius: 1,
    marginBottom: 14,
    opacity: 0.35,
  },

  /* ── ID box ── */
  idBox: {
    backgroundColor: "#EFF4FF",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#BFCFE8",
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  idLabel: { fontSize: 7.5, color: C.grayText },
  idValue: { flex: 1, fontSize: 7, fontFamily: "Helvetica-Bold", color: C.navy },

  /* ── Sections ── */
  sectionsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  section: {
    flex: 1,
    backgroundColor: C.grayBg,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: C.grayBorder,
    padding: 12,
  },
  sectionTitle: {
    fontSize: 6.5,
    fontFamily: "Helvetica-Bold",
    color: C.navyLight,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: C.grayBorder,
  },
  row: { flexDirection: "row", marginBottom: 5 },
  rowLabel: { width: "45%", color: C.grayText, fontSize: 7.5 },
  rowValue: { flex: 1, fontFamily: "Helvetica-Bold", fontSize: 7.5 },

  badge: {
    backgroundColor: C.navyLight,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: "flex-start",
  },
  badgeText: { color: C.white, fontSize: 6.5, fontFamily: "Helvetica-Bold" },

  /* ── Total ── */
  totalBox: {
    backgroundColor: C.successBg,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: C.successBorder,
    paddingHorizontal: 24,
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  totalLeft: { gap: 3 },
  totalLabel: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: C.success,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  totalNote: {
    fontSize: 7,
    color: C.grayText,
  },
  totalAmount: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: C.success,
  },

  /* ── Footer ── */
  footer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: C.grayBorder,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  footerText: { fontSize: 6.5, color: C.grayText, maxWidth: "65%", lineHeight: 1.5 },
  footerRight: { alignItems: "flex-end", gap: 3 },
  footerBrand: { fontSize: 7.5, fontFamily: "Helvetica-Bold", color: C.navy },
  footerDate: { fontSize: 6.5, color: C.grayText },
  footerLeft: {
    flexDirection: "column",
    flexGrow: 1,
    flexShrink: 1,
  },
});

interface Props { escritura: EscrituraParaPDF }

export function ReciboA({ escritura }: Props) {
  const participantesA = escritura.participants.filter((p) => p.side === "A");
  const today = formatDateES(new Date());
  const statusLabel = STATUS_LABELS[escritura.status] ?? escritura.status;
  const rolesA = [...new Set(participantesA.map((p) => p.role))].join(" / ") || "Parte A";

  return (
    <Document title={`Recibo ${rolesA} – ${escritura.folio}`} author={NOTARIA_FOOTER}>
      <Page size="A4" style={s.page}>

        {/* ── Header ── */}
        <View style={s.header}>
          <Image src={LOGO_SRC} style={s.logo} />
          <View style={s.headerCenter}>
            <Text style={s.headerTitle}>COMPROBANTE DE PAGO</Text>
            <Text style={s.headerNotaria}>{NOTARIA}</Text>
            <Text style={s.headerRole}>{rolesA}</Text>
          </View>
          <View style={s.headerRight}>
            <Text style={s.headerDate}>{today}</Text>
            <View style={s.headerFolio}>
              <Text style={s.headerFolioText}>Folio: {escritura.folio}</Text>
            </View>
          </View>
        </View>

        <View style={s.divider} />

        {/* ── ID de escritura ── */}
        <View style={s.idBox}>
          <Text style={s.idLabel}>ID de escritura:</Text>
          <Text style={s.idValue}>{escritura.id}</Text>
        </View>

        {/* ── Datos del cliente + Datos de escritura (lado a lado) ── */}
        <View style={s.sectionsRow}>

          {/* Parte A */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>Datos del Cliente</Text>
            {participantesA.length > 0 ? (
              participantesA.map((p, i) => (
                <View key={i}>
                  <View style={s.row}>
                    <Text style={s.rowLabel}>Nombre:</Text>
                    <Text style={s.rowValue}>{p.name}</Text>
                  </View>
                  <View style={s.row}>
                    <Text style={s.rowLabel}>Rol:</Text>
                    <View style={s.badge}>
                      <Text style={s.badgeText}>{p.role}</Text>
                    </View>
                  </View>
                  <View style={s.row}>
                    <Text style={s.rowLabel}>Teléfono:</Text>
                    <Text style={s.rowValue}>{p.phone ?? "—"}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={{ color: C.grayText, fontSize: 7.5 }}>Sin participantes.</Text>
            )}
          </View>

          {/* Escritura */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>Datos de la Escritura</Text>
            <View style={s.row}>
              <Text style={s.rowLabel}>Tipo:</Text>
              <Text style={s.rowValue}>{escritura.typeLabel}</Text>
            </View>
            <View style={s.row}>
              <Text style={s.rowLabel}>No. Escritura:</Text>
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
        </View>

        {/* ── Total a pagar ── */}
        <View style={s.totalBox}>
          <View style={s.totalLeft}>
            <Text style={s.totalLabel}>Total a Pagar</Text>
            <Text style={s.totalNote}>{rolesA} · {escritura.typeLabel}</Text>
          </View>
          <Text style={s.totalAmount}>{formatMXN(escritura.totalA)}</Text>
        </View>

        {/* ── Footer ── */}
        <View style={s.footer}>
          <View style={s.footerLeft}>
            <Text style={s.footerText}>Calle Allende No. 17, Col. Centro</Text>
            <Text style={s.footerText}>C.P. 93700, Altotonga, Veracruz</Text>
            <Text style={s.footerText}>Tel. (226) 316 00 82</Text>
            <Text style={s.footerText}>Email: notaria1altotonga@outlook.com</Text>
          </View>
          <View style={s.footerRight}>
            <Text style={s.footerBrand}>{NOTARIA_FOOTER}</Text>
            <Text style={s.footerDate}>Generado: {today}</Text>
          </View>
        </View>

      </Page>
    </Document>
  );
}
