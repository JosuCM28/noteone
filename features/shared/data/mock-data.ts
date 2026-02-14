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
  { value: 'por-liquidar', label: 'Pendiente de Pago', color: 'warning' },
  { value: 'liquidado', label: 'Liquidado', color: 'info' },
  { value: 'proceso-pago', label: 'Proceso de Pago', color: 'secondary' },
  { value: 'registro', label: 'en Inscripción Registral', color: 'info' },
  { value: 'proceso-entrega', label: 'Proceso de Entrega', color: 'secondary' },
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

export const MOCK_ESCRITURAS: Escritura[] = [
 {
  id: uuid(),
  numeroEscritura: '1242',
  folioInterno: 'FI-2024-009',
  tipo: 'inft-indistinto-nombre',
  estatus: 'liquidado',
  fechaCreacion: new Date('2024-07-15'),
  fechaFirma: new Date('2024-07-26'),
  notas: 'Uso indistinto de nombre acreditado mediante testimonios',
  personaA: {
    rolLabel: 'Solicitante',
    nombre: 'Miguel Ángel Hernández López',
    telefono: '55 2345 9988',
  },
  presupuesto: {
    valorBase: 0,
    traslado: 0,
    derechoRegistro: 2850,
    certificadoCatastral: 0,
    constanciasAdeudo: 0,
    subtotalPresupuesto: 2850,
    honorarios: 12000,
    isr: 0,
    totalFinal: 14850,
  },
  adjuntos: [
    {
      id: uuid(),
      name: 'Declaraciones_testigos.pdf',
      size: 640000,
      type: 'application/pdf',
      uploadedAt: new Date(),
      status: 'uploaded',
    },
  ],
  bitacora: createBitacora('operador'),
  ...withReceipt(true),
},
{
  id: uuid(),
  numeroEscritura: '1243',
  folioInterno: 'FI-2024-010',
  tipo: 'inft-construccion-casahabitacion',
  estatus: 'registro',
  fechaCreacion: new Date('2024-07-18'),
  fechaFirma: new Date('2024-07-30'),
  notas: 'Acreditación de construcción de casa habitación mediante información testimonial',
  personaA: {
    rolLabel: 'Propietario',
    nombre: 'Laura Beatriz Moreno Castillo',
    telefono: '55 8765 4433',
  },
  presupuesto: {
    valorBase: 0,
    traslado: 0,
    derechoRegistro: 2850,
    certificadoCatastral: 1250,
    constanciasAdeudo: 0,
    subtotalPresupuesto: 4100,
    honorarios: 18000,
    isr: 0,
    totalFinal: 22100,
  },
  adjuntos: [
    {
      id: uuid(),
      name: 'Croquis_construccion.pdf',
      size: 520000,
      type: 'application/pdf',
      uploadedAt: new Date(),
      status: 'uploaded',
    },
    {
      id: uuid(),
      name: 'Fotografias_inmueble.zip',
      size: 2400000,
      type: 'application/zip',
      uploadedAt: new Date(),
      status: 'uploaded',
    },
  ],
  bitacora: createBitacora('admin'),
  ...withReceipt(true),
},

];
