// Domain Types for Notaría App

import { Decimal } from "@prisma/client/runtime/client";

export type TipoEscritura =
  | 'testamento'
  | 'cvgastos-urgentes'
  | 'compraventa'
  | 'donacion'
  | 'adjudicacion-concepto-herencia'
  | 'rectificacion-superficie'
  | 'fusion-predios'
  | 'cancelacion-usufructo-muerte'
  | 'cancelacion-usufructo-voluntaria'
  | 'servidumbre-paso'
  | 'division-copropiedad'
  | 'cancelacion-reserva-dominio'
  | 'poder-notarial'
  | 'constitucion-ac'
  | 'inft-indistinto-nombre'
  | 'inft-construccion-casahabitacion';

export type EstatusEscritura =
  | 'por-liquidar'
  | 'liquidado'
  | 'proceso-pago'
  | 'registro'
  | 'proceso-entrega'
  | 'entregado';

export type UserRole = 'admin' | 'user';

export interface Persona {
  rolLabel: string;
  nombre: string;
  telefono: string;
}

export interface Adjunto {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  status: 'pending' | 'uploaded';
}

export interface BitacoraEntry {
  id: string;
  at: Date;
  user: string;
  action: string;
  detail: string;
}

export interface Presupuesto {
  valorBase: number;
  traslado: number;
  derechoRegistro: number;
  certificadoCatastral: number;
  constanciasAdeudo: number;
  subtotalPresupuesto: number;
  honorarios: number;
  isr: number;
  totalFinal: number;
}

export interface Escritura {
  id: string;
  numeroEscritura: string;
  folioInterno: string;
  tipo: TipoEscritura;
  estatus: EstatusEscritura;
  fechaCreacion: Date;
  fechaFirma: Date | null;
  notas: string | null;
  personaA: Persona;
  personaB?: Persona;
  presupuesto: Presupuesto;
  adjuntos: Adjunto[];
  bitacora: BitacoraEntry[];
  reciboEnviado: boolean;
  fechaUltimoEnvio: Date | null;
}

export interface User {
  id: string;
  nombre: string;
  usuario: string;
  password: string;
  role: UserRole;
  activo: boolean;
  creadoEn: Date;
}

export interface TipoEscrituraConfig {
  value: TipoEscritura;
  label: string;
  description: string;
  icon: string;
  personaALabel: string;
  personaBLabel?: string;
}

export interface EstatusConfig {
  value: EstatusEscritura;
  label: string;
  color: 'default' | 'warning' | 'info' | 'success' | 'destructive' | 'secondary';
}

export interface DraftParticipant {
  id: string;
  nombre: string;
  role: string;
  telefono: string;
  side: "A" | "B"; // A = personaA (comprador/vendedor), B = personaB
}

export interface ParticipantForm {
  nombre: string;
  role: string;
  telefono: string;
}

export interface Tax {
  name: string;
  value: number;
}
export interface Participante {
  id: string;
  rol: string;
  nombre: string;
  telefono: string;
  email?: string;
}

export type TipoEscrituraKey =
  | 'testamento'
  | 'cvgastos-urgentes'
  | 'compraventa'
  | 'donacion'
  | 'adjudicacion-concepto-herencia'
  | 'rectificacion-superficie'
  | 'fusion-predios'
  | 'cancelacion-usufructo-muerte'
  | 'cancelacion-usufructo-voluntaria'
  | 'servidumbre-paso'
  | 'division-copropiedad'
  | 'cancelacion-reserva-dominio'
  | 'poder-notarial'
  | 'constitucion-ac'
  | 'inft-indistinto-nombre'
  | 'inft-construccion-casahabitacion';

  export interface TaxItemConfig {
  traslado: number;
  certificadoValorCatastral: number;
  constanciaNoAdeudo: number;
  derechoRegistro: number;
  aviso: number;
  registroEscritura: number;
  gastosNotariales: number;
  pagoISR: number;
  dobleHonorarios: number;
}

export const TIPOS_ESCRITURA_LABELS: Record<TipoEscrituraKey, string> = {
  'testamento': 'Testamento',
  'cvgastos-urgentes': 'CV Gastos Urgentes',
  'compraventa': 'Compraventa',
  'donacion': 'Donación',
  'adjudicacion-concepto-herencia': 'Adjudicación Concepto Herencia',
  'rectificacion-superficie': 'Rectificación de Superficie',
  'fusion-predios': 'Fusión de Predios',
  'cancelacion-usufructo-muerte': 'Cancelación Usufructo por Muerte',
  'cancelacion-usufructo-voluntaria': 'Cancelación Usufructo Voluntaria',
  'servidumbre-paso': 'Servidumbre de Paso',
  'division-copropiedad': 'División de Copropiedad',
  'cancelacion-reserva-dominio': 'Cancelación Reserva de Dominio',
  'poder-notarial': 'Poder Notarial',
  'constitucion-ac': 'Constitución A.C.',
  'inft-indistinto-nombre': 'INFT Indistinto Nombre',
  'inft-construccion-casahabitacion': 'INFT Construcción Casa Habitación',
};

export const TAX_ITEM_LABELS: Record<keyof TaxItemConfig, string> = {
  traslado: 'Traslado',
  certificadoValorCatastral: 'Certificado de Valor Catastral',
  constanciaNoAdeudo: 'Constancia de No Adeudo',
  derechoRegistro: 'Derecho de Registro',
  aviso: 'Aviso',
  registroEscritura: 'Registro de Escritura',
  gastosNotariales: 'Gastos Notariales',
  pagoISR: 'Pago de ISR',
  dobleHonorarios: 'Doble Honorarios',
};

