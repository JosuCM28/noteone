import type { TaxItemConfig, TipoEscritura } from "@/features/shared/types";

export type TaxKey = keyof TaxItemConfig;

export type TaxConfig = Record<TaxKey, number>;

export const DEFAULT_TAX_CONFIG: TaxConfig = {
  traslado: 5,
  certificadoValorCatastral: 0,
  constanciaNoAdeudo: 0,
  derechoRegistro: 100,
  aviso: 112,
  registroEscritura: 10,
  gastosNotariales: 200,
  pagoISR: 1000,
  honorarios: 0,
  honorariosB: 0,
};

export type PresupuestoRules = {
  taxes: TaxKey[]; // orden exacto en que se mostrarán
};

export const PRESUPUESTO_RULES_BY_TIPO: Record<TipoEscritura, PresupuestoRules> =
{
  testamento: {
    taxes: ["derechoRegistro", "honorarios"],
  },

  "cvgastos-urgentes": {
    taxes: ["traslado", "certificadoValorCatastral", "constanciaNoAdeudo", "derechoRegistro", "aviso", "registroEscritura", "gastosNotariales", "honorarios","pagoISR",  "honorariosB"],
  },

  compraventa: {
    taxes: ["traslado", "certificadoValorCatastral", "constanciaNoAdeudo", "derechoRegistro", "aviso", "registroEscritura", "gastosNotariales","honorarios", "pagoISR", ],
  },

  donacion: {
    taxes: ["traslado", "certificadoValorCatastral", "constanciaNoAdeudo", "derechoRegistro", "aviso", "registroEscritura", "gastosNotariales", "honorarios", "pagoISR"],
  },

  "adjudicacion-concepto-herencia": {
    taxes: ["traslado", "certificadoValorCatastral", "constanciaNoAdeudo", "derechoRegistro","aviso","registroEscritura","gastosNotariales","honorarios" ],
  },

  "rectificacion-superficie": {
    taxes: ["derechoRegistro", "aviso","registroEscritura","honorarios"],
  },

  "fusion-predios": {
    taxes: ["derechoRegistro", "aviso","registroEscritura","honorarios"],
  },

  "cancelacion-usufructo-muerte": {
    taxes: ["derechoRegistro", "aviso","registroEscritura","honorarios"],
  },

  "cancelacion-usufructo-voluntaria": {
    taxes: ["derechoRegistro", "aviso","registroEscritura","honorarios"],
  },

  "servidumbre-paso": {
    taxes: ["derechoRegistro", "aviso","registroEscritura","honorarios"],
  },

  "division-copropiedad": {
    taxes: ["derechoRegistro", "aviso","registroEscritura","honorarios"],
  },

  "cancelacion-reserva-dominio": {
    taxes: ["derechoRegistro", "aviso","registroEscritura","honorarios", "pagoISR"],
  },

  "poder-notarial": {
    taxes: ["derechoRegistro", "honorarios"],
  },

  "constitucion-ac": {
    taxes: ["derechoRegistro", "registroEscritura","honorarios"],
  },

  "inft-indistinto-nombre": {
    taxes: ["registroEscritura","honorarios"],
  },

  "inft-construccion-casahabitacion": {
    taxes: ["derechoRegistro", "aviso","registroEscritura","honorarios"],
  },
} as const;