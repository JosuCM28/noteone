export type EscrituraParticipantePDF = {
  name: string;
  phone: string | null;
  role: string;
  side: string;
};

export type EscrituraTaxPDF = {
  key: string;
  name: string;
  amount: number;
  side: string | null;
};

export type EscrituraParaPDF = {
  id: string;
  folio: string;
  deedNumber: string | null;
  typeLabel: string;
  type: string;
  status: string;
  notes: string | null;
  baseValue: number;
  totalA: number;
  totalB: number;
  participants: EscrituraParticipantePDF[];
  deedTax: EscrituraTaxPDF[];
};

export const STATUS_LABELS: Record<string, string> = {
  por_liquidar: "Por Liquidar",
  liquidado: "Liquidado",
  proceso_pago: "En Proceso de Pago",
  registro: "En Registro",
  proceso_entrega: "En Proceso de Entrega",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

export function formatMXN(amount: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDateES(date: Date): string {
  return date.toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
