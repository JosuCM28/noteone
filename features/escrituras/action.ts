'use server';
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { EscrituraFormSchema } from "./schema";
import { Deed, DeedStatus } from "@/generated/prisma/client";
import { PRESUPUESTO_RULES_BY_TIPO, TaxKey } from "../shared/tax-rules";
import { TAX_ITEM_LABELS, TipoEscritura } from "../shared/types";
import { get } from "http";
import { getAuthUserId } from "../auth/actions";

export async function postEscritura(values: z.infer<typeof EscrituraFormSchema>) {

  const taxesByType = PRESUPUESTO_RULES_BY_TIPO[values.type as TipoEscritura]["taxes"];
  const filterTaxes = Object.entries(values.taxes).filter(([name, value]) => taxesByType.includes(name as TaxKey));

  const userId = await getAuthUserId();

  const taxesSideB = new Set<TaxKey>([
    "pagoISR",
    "honorariosB",
  ]);

  const escritura = await prisma.deed.create({
    data: {
      type: values.type,
      typeLabel: values.typeLabel,
      folio: values.folio,
      deedNumber: values.deedNumber,
      notes: values.notes,
      participants: {
        create: values.participants.map((p) => ({
          name: p.name,
          phone: p.phone,
          role: p.role,
          side: p.side,
        })),
      },
      baseValue: values.baseValue,
      totalA: values.totalA,
      totalB: values.totalB,
      status: (values.status).toUpperCase() as DeedStatus,
      user: { connect: { id: userId } },
      deedTax: {
        create: Object.entries(filterTaxes).map(([name, value]) => {
          const key = name as TaxKey;
          const n = Number(value ?? 0);
          const amount = Number.isFinite(n) ? n.toFixed(2) : "0.00";

          return {
            key,
            name: TAX_ITEM_LABELS?.[key] ?? key,
            amount: amount,
            side: taxesSideB.has(key) ? "B" : "A",
          }
        }),

      },

    }
  });
}