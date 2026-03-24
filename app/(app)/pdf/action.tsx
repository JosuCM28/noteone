"use server";

import React from "react";
import { pdf } from "@react-pdf/renderer";
import { ReceiptPdf, type ReceiptItem } from "./receipt";
// import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type GeneratePdfResult = {
  filename: string;
  mime: "application/pdf";
  base64: string;
};

export async function generateReceiptPdfBase64(receiptId: string): Promise<GeneratePdfResult> {
  // 1) Trae datos desde DB (ejemplo mock)
  // const receipt = await prisma.receipt.findUnique({ where: { id: receiptId }, include: { items: true } });
  const customerName = "Juan Pérez";
  const items: ReceiptItem[] = [
    { name: "Servicio contable", qty: 1, price: 500 },
    { name: "Gestión", qty: 1, price: 200 },
  ];

  // 2) Total (sí, reduce suma el total del array)
  const total = items.reduce((acc, it) => acc + it.qty * it.price, 0);

  // 3) PDF → Buffer (en memoria)
  const instance = pdf(
    <ReceiptPdf
      folio={receiptId}
      customerName={customerName}
      total={total}
      items={items}
    />
  );

  const buffer = await instance.toBuffer();

  return {
    filename: recibo-${"Hola"}.pdf,
    mime: "application/pdf",
    base64: buffer.toString("base64"),
  };
}