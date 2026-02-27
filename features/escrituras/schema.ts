// schema.ts
import { z } from "zod";

export const DeedSideSchema = z.enum(["A", "B"]);
export const DeedStatusSchema = z.enum([
  "por_liquidar",
  "liquidado",
  "proceso_pago",
  "registro",
  "proceso_entrega",
  "entregado",
  "cancelado",
]);

const DecimalInputSchema = z.union([
  z.number(),
  z.string().trim().regex(/^\d+(\.\d{1,2})?$/, "Número inválido (máx 2 decimales)"),
]);

export const ParticipantInputSchema = z.object({
  name: z.string().trim().min(1).max(255),
  phone: z.string().trim().max(50).optional().nullable(),
  role: z.string().trim().min(1).max(255),
  side: DeedSideSchema.default("A"),
});

/** 👇 TaxConfig real (según tus keys) */
export const TaxConfigSchema = z.object({
  traslado: z.number().min(0),
  certificadoValorCatastral: z.number().min(0),
  constanciaNoAdeudo: z.number().min(0),
  derechoRegistro: z.number().min(0),
  aviso: z.number().min(0),
  registroEscritura: z.number().min(0),
  gastosNotariales: z.number().min(0),
  pagoISR: z.number().min(0),
  honorarios: z.number().min(0),
  honorariosB: z.number().min(0),
});


export const EscrituraFormSchema = z
  .object({
    type: z.string().trim().min(1),
    typeLabel: z.string().trim().min(1).max(255),
    folio: z.string().trim().min(1).max(255),

    deedNumber: z.string().trim().max(255).optional().nullable(),
    notes: z.string().trim().max(1000).optional().nullable(),

    baseValue: DecimalInputSchema.optional().nullable(),
    totalA: DecimalInputSchema.optional().nullable(),
    totalB: DecimalInputSchema.optional().nullable(),

    status: DeedStatusSchema.default("por_liquidar"),
    userId: z.string().uuid().optional(), // idealmente NO viene del form

    participants: z.array(ParticipantInputSchema).min(1, "Por favor agrega al menos un participante"),

    /** 👇 ahora es TaxConfig */
    taxes: TaxConfigSchema,
  })

  