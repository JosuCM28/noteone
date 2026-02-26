'use server';
import { prisma } from "@/lib/prisma";
import z from "zod";
import { TaxSettingsSchema } from "../auth/schemas";
import { TaxType } from "@/generated/prisma/enums";
import { getTaxType, UI_TYPES } from "@/lib/utils";

export async function updateTax(tipo: string, rows: Array<{ key: string; name: string; value: number }>) {

  const safeRows = rows
    .filter((r) => r && r.key === tipo && typeof r.name === "string")
    .map((r) => ({
      key: tipo,
      name: r.name,
      value: String(Number(r.value ?? 0)), // Decimal safe
    }));

  const ops = safeRows.map((r) => {

    return prisma.taxes.upsert({
      where: {
        key_name: { key: tipo, name: r.name }
      },
      update: {
        value: r.value
      },
      create: {
        key: tipo,
        name: r.name,
        value: r.value
      }

    })
  })
  await prisma.$transaction(ops)
}

export async function getTaxes() {
  const taxes = await prisma.taxes.findMany({
    select: {
      key: true,
      name: true,
      value: true,
    }
  });

  return taxes.reduce((acc, t) => {
    if (!acc[t.key]) acc[t.key] = {};
    acc[t.key][t.name] = Number(t.value);
    return acc;
  }, {} as Record<string, Record<string, number>>);
}