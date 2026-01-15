import { z } from 'zod';

export const SignInSchema = z.object({
  username: z.string().min(1, 'El usuario no puede estar vacío').max(50, 'El usuario no puede exceder los 50 caracteres'),
  password: z.string().min(1, 'La contraseña no puede estar vacía').max(50, 'La contraseña no puede exceder los 50 caracteres'),
});