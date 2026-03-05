'use server';
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { EscrituraFormSchema } from "./schema";
import { Deed, DeedStatus, DeedTax } from "@/generated/prisma/client";
import { PRESUPUESTO_RULES_BY_TIPO, TaxKey } from "../shared/tax-rules";
import { EstatusEscritura, TAX_ITEM_LABELS, TipoEscritura } from "../shared/types";
import { get } from "http";
import { getAuthUserId } from "../auth/actions";
import { isPrismaUniqueError } from "@/lib/prisma-errors";
import { es } from "date-fns/locale";

type Grouped = Record<string, number>;

export async function postEscritura(values: z.infer<typeof EscrituraFormSchema>) {

  const taxesByType = PRESUPUESTO_RULES_BY_TIPO[values.type as TipoEscritura]["taxes"];

  const taxesByTypeSet = new Set<TaxKey>(taxesByType);

  const filterTaxes = Object.entries(values.taxes).filter(([name]) => taxesByTypeSet.has(name as TaxKey));



  const userId = await getAuthUserId();

  const taxesSideB = new Set<TaxKey>([
    "pagoISR",
    "honorariosB",
  ]);


  try {

    await prisma.$transaction(async (tx) => {
      const escritura = await tx.deed.create({
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
            create: filterTaxes.map(([name, value]) => {
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

      const user = await tx.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          name: true,
        }
      });

      await tx.auditLog.create({
        data: {
          userId,
          deedId: escritura.id,
          action: "CREATE",
          details: `El usuario ${user?.name ?? "desconocido"} creó la escritura.`,
          deedFolio: escritura.folio,
          deedNumber: escritura.deedNumber,
        },
      });
    });

  }
  catch (error) {
    if (isPrismaUniqueError(error)) {
      throw new Error("ESCRITURANUMBER_TAKEN");
    }
    throw error;
  }




}

export async function updateEscritura(
  deedId: string,
  values: z.infer<typeof EscrituraFormSchema>
) {
  const taxesByType = PRESUPUESTO_RULES_BY_TIPO[values.type as TipoEscritura]["taxes"];
  const taxesByTypeSet = new Set<TaxKey>(taxesByType);
  const filterTaxes = Object.entries(values.taxes).filter(([name]) =>
    taxesByTypeSet.has(name as TaxKey)
  );

  const userId = await getAuthUserId();
  const taxesSideB = new Set<TaxKey>(["pagoISR", "honorariosB"]);

  try {
    await prisma.$transaction(async (tx) => {
      const existing = await tx.deed.findFirst({
        where: {
          id: deedId,
          userId,
        },
        select: {
          id: true,
          folio: true,
          deedNumber: true,
          status: true,
          notes: true,
        },
      });

      if (!existing) {
        throw new Error("ESCRITURA_NOT_FOUND");
      }


      const escritura = await tx.deed.update({
        where: {
          id: existing.id,
        },
        data: {
          type: values.type,
          typeLabel: values.typeLabel,
          folio: values.folio,
          deedNumber: values.deedNumber,
          notes: values.notes,
          baseValue: values.baseValue,
          totalA: values.totalA,
          totalB: values.totalB,
          status: values.status.toUpperCase() as DeedStatus,
          participants: {
            deleteMany: {},
            create: values.participants.map((p) => ({
              name: p.name,
              phone: p.phone,
              role: p.role,
              side: p.side,
            })),
          },
          deedTax: {
            deleteMany: {},
            create: filterTaxes.map(([name, value]) => {
              const key = name as TaxKey;
              const n = Number(value ?? 0);
              const amount = Number.isFinite(n) ? n.toFixed(2) : "0.00";

              return {
                key,
                name: TAX_ITEM_LABELS?.[key] ?? key,
                amount,
                side: taxesSideB.has(key) ? "B" : "A",
              };
            }),
          },
        },
      });

      const user = await tx.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          name: true,
        },
      });

      await tx.auditLog.create({
        data: {
          userId,
          deedId: escritura.id,
          action: "UPDATE",
          details: `El usuario ${user?.name ?? "desconocido"} actualizó la escritura.`,
          deedFolio: escritura.folio,
          deedNumber: escritura.deedNumber,
        },
      });

      if (existing?.status !== escritura?.status) {
        await tx.auditLog.create({
          data: {
            userId,
            deedId: escritura.id,
            action: "STATUS_CHANGE",
            details: `El usuario ${user?.name ?? "desconocido"} cambió el estatus de la escritura.`,
            deedFolio: escritura.folio,
            deedNumber: escritura.deedNumber,
          },
        });
      }

      if (existing?.notes !== escritura?.notes) {
        await tx.auditLog.create({
          data: {
            userId,
            deedId: escritura.id,
            action: "NOTE_CHANGE",
            details: `El usuario ${user?.name ?? "desconocido"} cambió las notas de la escritura.`,
            deedFolio: escritura.folio,
            deedNumber: escritura.deedNumber,
          },
        });
      }



    });
  } catch (error) {
    if (isPrismaUniqueError(error)) {
      throw new Error("ESCRITURANUMBER_TAKEN");
    }
    throw error;
  }
}

export async function getEscritura(id: string) {
  const escritura = await prisma.deed.findUnique({
    where: {
      id,
    },
    include: {
      participants: true,
      deedTax: true,
    },
  });

  if (!escritura) {
    throw new Error("ESCRITURA_NOT_FOUND");
  }
  const taxes = escritura.deedTax.reduce<Grouped>((acc, tax) => {
    if (!acc[tax.key]) acc[tax.key] = tax.amount.toNumber() ?? 0;
    return acc;
  }, {});

  return {
    id: escritura.id,
    type: escritura.type,
    typeLabel: escritura.typeLabel,
    folio: escritura.folio,
    deedNumber: escritura.deedNumber,
    notes: escritura.notes,
    baseValue: escritura.baseValue?.toNumber() ?? 0,
    totalA: escritura.totalA?.toNumber() ?? 0,
    totalB: escritura.totalB?.toNumber() ?? 0,
    status: escritura.status.toLocaleLowerCase() as EstatusEscritura,
    participants: escritura.participants.map((p) => ({
      name: p.name,
      phone: p.phone,
      role: p.role,
      side: p.side,
    })),
    DeedTax: taxes,
  };
}

export async function getEscriturasForTable() {
  const escrituras = await prisma.deed.findMany({
    select: {
      id: true,
      typeLabel: true,
      folio: true,
      deedNumber: true,
      participants: {
        select: {
          name: true,
          phone: true,
          side: true,
        },
      },
      baseValue: true,
      status: true,
      createdAt: true,
    },
  });

  return escrituras;
}

export async function deleteEscritura(id: string) {
  const escritura = await prisma.deed.findUnique({
    where: {
      id,
    },
  });

  if (!escritura) {
    throw new Error("ESCRITURA_NO_ENCONTRADA");
  }

  await prisma.deed.delete({
    where: {
      id: escritura.id,
    },
  });
}


export async function updateEscrituraStatus(id: string, status: EstatusEscritura) {
  const userId = await getAuthUserId();
  await prisma.$transaction(async (tx) => {
    const escritura = await tx.deed.findUnique({
      where: {
        id,
      },
    });

    if (!escritura) {
      throw new Error("ESCRITURA NO ENCONTRADA");
    }

    await tx.deed.update({
      where: {
        id: escritura.id,
      },
      data: {
        status: status.toUpperCase() as DeedStatus,
      },
    });
    const user = await tx.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        name: true,
      },
    })

    await tx.auditLog.create({
      data: {
        userId,
        deedId: escritura.id,
        action: "STATUS_CHANGE",
        details: `El usuario ${user?.name ?? "desconocido"} cambió el estatus de la escritura.`,
        deedFolio: escritura.folio,
        deedNumber: escritura.deedNumber,
      },
    });
  });

}

export async function getEscrituraForView(id: string) {

  const escritura = await prisma.deed.findUnique({
    where: {
      id,
    },
    include: {
      participants: {
        select: {
          name: true,
          phone: true,
          role: true,
          side: true,
        },
      },
      deedTax: {
        select: {
          key: true,
          name: true,
          amount: true,
          side: true,
        },
      },
      auditLogs: {
        select: {
          details: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }
    },
  });

  if (!escritura) {
    throw new Error("ESCRITURA_NOT_FOUND");
  }

  const safeTaxes = escritura.deedTax.map((tax) => ({
    ...tax,
    amount: tax.amount.toNumber() ?? 0,
  }));

  return {
    id: escritura.id,
    type: escritura.type,
    typeLabel: escritura.typeLabel,
    folio: escritura.folio,
    deedNumber: escritura.deedNumber,
    notes: escritura.notes,
    baseValue: escritura.baseValue?.toNumber() ?? 0,
    totalA: escritura.totalA?.toNumber() ?? 0,
    totalB: escritura.totalB?.toNumber() ?? 0,
    status: escritura.status.toLocaleLowerCase() as EstatusEscritura,
    participants: escritura.participants.map((p) => ({
      name: p.name,
      phone: p.phone,
      role: p.role,
      side: p.side,
    })),
    deedTax: safeTaxes,
    auditLogs: escritura.auditLogs.map((l) => ({
      details: l.details,
      createdAt: l.createdAt,
    })),
  };
}