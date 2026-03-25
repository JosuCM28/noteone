"use server";

import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { ReciboA } from "./templates/ReciboA";
import { ReciboB } from "./templates/ReciboB";
import { ReporteAdmin } from "./templates/ReporteAdmin";
import { getEscrituraForView } from "../action";
import type { EscrituraParaPDF } from "./types";

export type TipoPDF = "A" | "B" | "admin";

function mapEscritura(
  raw: Awaited<ReturnType<typeof getEscrituraForView>>
): EscrituraParaPDF {
  return {
    id: raw.id,
    folio: raw.folio,
    deedNumber: raw.deedNumber,
    typeLabel: raw.typeLabel,
    type: raw.type,
    status: raw.status,
    notes: raw.notes,
    baseValue: raw.baseValue,
    totalA: raw.totalA,
    totalB: raw.totalB,
    participants: raw.participants.map((p) => ({
      name: p.name,
      phone: p.phone,
      role: p.role,
      side: p.side,
    })),
    deedTax: raw.deedTax.map((t) => ({
      key: t.key,
      name: t.name,
      amount: t.amount,
      side: t.side,
    })),
  };
}

export async function generatePDFBase64(
  deedId: string,
  tipo: TipoPDF
): Promise<string> {
  const raw = await getEscrituraForView(deedId);
  const escritura = mapEscritura(raw);

  let element: React.ReactElement;

  switch (tipo) {
    case "A":
      element = React.createElement(ReciboA, { escritura });
      break;
    case "B":
      element = React.createElement(ReciboB, { escritura });
      break;
    case "admin":
      element = React.createElement(ReporteAdmin, { escritura });
      break;
  }

  const buffer = await renderToBuffer(element);
  return buffer.toString("base64");
}
