import { z } from 'zod';

export const SignInSchema = z.object({
  username: z.string().min(1, 'El usuario no puede estar vacío').max(50, 'El usuario no puede exceder los 50 caracteres'),
  password: z.string().min(1, 'La contraseña no puede estar vacía').max(50, 'La contraseña no puede exceder los 50 caracteres'),
});

export const PartisipantSchema = z.object({
  nombre: z.string().min(1, 'El nombre no puede estar vacío').max(50, 'El nombre no puede exceder los 50 caracteres'),
  telefono: z.string().min(1, 'El teléfono no puede estar vacío').max(50, 'El teléfono no puede exceder los 50 caracteres'),
  rol: z.string().min(1, 'El rol no puede estar vacío').max(50, 'El rol no puede exceder los 50 caracteres'),
});

export const escrituraSchema = z.object({
  tipo: z.string().min(1, 'El tipo no puede estar vacío').max(50, 'El tipo no puede exceder los 50 caracteres'),
  folioInterno: z.string().min(1, 'El folio interno no puede estar vacío').max(50, 'El folio interno no puede exceder los 50 caracteres'),
  numeroEscritura: z.string().min(1, 'El número de escritura no puede estar vacío').max(50, 'El número de escritura no puede exceder los 50 caracteres'),
  fechaFirma: z.string().min(1, 'La fecha de firma no puede estar vacío').max(50, 'La fecha de firma no puede exceder los 50 caracteres').optional(),
  notas: z.string().min(1, 'Las notas no pueden estar vacías').max(100, 'Las notas no pueden exceder los 100 caracteres').optional(),
  participants: z.array(PartisipantSchema).min(1, 'Debe haber al menos un participante'),
  valorBase: z.number().min(1, 'El valor base no puede ser menor a 1'),
  traslado: z.number().min(1, 'El traslado no puede ser menor a 1'),
  presupuesto: z.number().min(1, 'El presupuesto notarial no puede ser menor a 1'),
  honorarios: z.number().min(1, 'Los honorarios no pueden ser menores a 1'),
  isr: z.number().min(1, 'El ISR no puede ser menor a 1').optional(),
  estatus: z.string().min(1, 'El estatus no puede estar vacío').max(50, 'El estatus no puede exceder los 50 caracteres'),
});