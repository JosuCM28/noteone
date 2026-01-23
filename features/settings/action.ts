'use server';
import { prisma } from "@/lib/prisma";
import z from "zod";
import { TaxSettingsSchema } from "../auth/schemas";
import { TaxType } from "@/generated/prisma/enums";
import { getTaxType, UI_TYPES } from "@/lib/utils";

export async function updateTax(data: z.infer<typeof TaxSettingsSchema>) {
  const ops = Object.entries(data).map(([name,value]) => {
    const enumName = getTaxType(name as UI_TYPES) as TaxType;
    return prisma.taxes.upsert({
      where: {
        name: enumName
      },
      update: {
        value
      }, 
      create:{
        name: enumName,
        value
      }

    })
  })
  await prisma.$transaction(ops)
}