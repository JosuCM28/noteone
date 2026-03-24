import { Escritura, User, TipoEscrituraConfig, EstatusConfig } from '@/features/shared/types';

export const TIPOS_ESCRITURA: TipoEscrituraConfig[] = [
  {
    value: 'testamento',
    label: 'Testamento',
    description: 'Disposición de bienes para después del fallecimiento',
    icon: 'scroll',
    personaALabel: 'Testador',
  },
  {
    value: 'cvgastos-urgentes',
    label: 'Compraventa por Gastos Urgentes',
    description: 'Enajenación para cubrir gastos urgentes',
    icon: 'alert-circle',
    personaALabel: 'Comprador',
    personaBLabel: 'Vendedor',
  },
  {
    value: 'compraventa',
    label: 'Escritura de Compraventa',
    description: 'Transferencia de propiedad mediante pago',
    icon: 'home',
    personaALabel: 'Comprador',
    personaBLabel: 'Vendedor',
  },
  {
    value: 'donacion',
    label: 'Donación',
    description: 'Transferencia gratuita de bienes',
    icon: 'gift',
    personaALabel: 'Donante',
    personaBLabel: 'Donatario',
  },
  {
    value: 'adjudicacion-concepto-herencia',
    label: 'Adjudicación por Concepto de Herencia (Intestamentaria o Testamentaria)',
    description: 'Asignación de bienes heredados',
    icon: 'users',
    personaALabel: 'Heredero',
  },
  {
    value: 'rectificacion-superficie',
    label: 'Rectificación de Superficie',
    description: 'Corrección de medidas del inmueble',
    icon: 'ruler',
    personaALabel: 'Otorgante',
  },
  {
    value: 'fusion-predios',
    label: 'Fusión de Predios',
    description: 'Unificación de dos o más inmuebles',
    icon: 'layers',
    personaALabel: 'Otorgante',
  },
  {
    value: 'cancelacion-usufructo-muerte',
    label: 'Cancelación de Usufructo Vitalicio por Muerte',
    description: 'Extinción del usufructo por fallecimiento',
    icon: 'x-circle',
    personaALabel: 'Otorgante',
  },
  {
    value: 'cancelacion-usufructo-voluntaria',
    label: 'Cancelación Voluntaria de Usufructo Vitalicio',
    description: 'Renuncia expresa al derecho de usufructo',
    icon: 'x-square',
    personaALabel: 'Otorgante',

  },
  {
    value: 'servidumbre-paso',
    label: 'Servidumbre de Paso',
    description: 'Derecho de tránsito sobre predio ajeno',
    icon: 'route',
    personaALabel: 'Otorgante',
  },
  {
    value: 'division-copropiedad',
    label: 'División de Copropiedad',
    description: 'Separación de derechos entre copropietarios',
    icon: 'columns',
    personaALabel: 'Otorgante',
  },
  {
    value: 'cancelacion-reserva-dominio',
    label: 'Cancelación de Reserva de Dominio',
    description: 'Liberación de dominio pleno',
    icon: 'unlock',
    personaALabel: 'Comprador',
    personaBLabel: 'Vendedor',
  },
  {
    value: 'poder-notarial',
    label: 'Poder Notarial',
    description: 'Facultad legal para actuar en nombre de otro',
    icon: 'pen-tool',
    personaALabel: 'Poderante',

  },
  {
    value: 'constitucion-ac',
    label: 'Constitución de Asociación Civil',
    description: 'Creación de una Asociación Civil',
    icon: 'building',
    personaALabel: 'Asociado',
  },
  {
    value: 'inft-indistinto-nombre',
    label: 'Información Testimonial para Acreditar Uso Indistinto de Nombre',
    description:
      'Procedimiento mediante el cual se acredita, a través de testimonios, que una persona ha utilizado de forma indistinta dos o más nombres para identificarse en actos relacionados con un inmueble.',
    icon: 'file-text',
    personaALabel: 'Otorgante',
  },
  {
    value: 'inft-construccion-casahabitacion',
    label: 'Información Testimonial para Acreditar Construcción de Casa Habitación',
    description:
      'Procedimiento notarial mediante testimonios para acreditar la existencia, antigüedad y características de una construcción destinada a casa habitación sobre un inmueble.',
    icon: 'home',
    personaALabel: 'Otorgante',
  },

];

export const ESTATUS_CONFIG: EstatusConfig[] = [
  { value: 'por_liquidar', label: 'Pendiente de Pago', color: 'warning' },

  { value: 'liquidado', label: 'Liquidado', color: 'purple' },

  { value: 'proceso_pago', label: 'Proceso de Pago', color: 'orange' },

  { value: 'registro', label: 'Registro', color: 'info' },

  { value: 'proceso_entrega', label: 'En Entrega', color: 'secondary' },

  { value: 'entregado', label: 'Entregado', color: 'success' },
];

export const IMPUESTOS_FIJOS = {
  derechoRegistro: 10,
  certificadoCatastral: 11,
  constanciasAdeudo: 12,
};

const uuid = () => crypto.randomUUID();

export const MOCK_USERS: User[] = [
  {
    id: uuid(),
    nombre: 'Administrador Principal',
    usuario: 'admin',
    password: '123456',
    role: 'admin',
    activo: true,
    creadoEn: new Date('2024-01-15'),
  },
  {
    id: uuid(),
    nombre: 'María García López',
    usuario: 'operador',
    password: '123456',
    role: 'user',
    activo: true,
    creadoEn: new Date('2024-02-20'),
  },
];

const createBitacora = (user: string): { id: string; at: Date; user: string; action: string; detail: string }[] => [
  {
    id: uuid(),
    at: new Date(),
    user,
    action: 'Creación de escritura',
    detail: 'Se creó la escritura en el sistema',
  },
];

const withReceipt = (sent: boolean): { reciboEnviado: boolean; fechaUltimoEnvio: Date | null } => ({
  reciboEnviado: sent,
  fechaUltimoEnvio: sent ? new Date() : null,
});

