// Domain Types for Notaría App

export type TipoEscritura =
  | 'testamento'
  | 'compraventa'
  | 'donacion'
  | 'cancelacion-hipoteca'
  | 'cancelacion-usufructo'
  | 'sucesion-testamentaria'
  | 'poder-notarial'
  | 'constitucion-sociedad'
  | 'rectificacion';

export type EstatusEscritura =
  | 'por-liquidar'
  | 'liquidado'
  | 'proceso-pago'
  | 'registro'
  | 'proceso-entrega'
  | 'entregado';

export type UserRole = 'admin' | 'operador';

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
  rol: UserRole;
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
  rol: string;
  telefono: string;
  side: "A" | "B"; // A = personaA (comprador/vendedor), B = personaB
}

export interface ParticipantForm {
  nombre: string;
  rol: string;
  telefono: string;
}

