import { User } from 'lucide-react';
import { z } from 'zod';

export const UserRoleSchema = z.enum(['admin', 'user']);

export const CreateUserSchema = z.object({
    fullName: z.string().min(8, 'El nombre debe tener al menos 8 caracteres').max(50, 'El nombre no puede exceder los 50 caracteres'),
    username: z.string().min(1, 'El usuario no puede estar vacío').max(50, 'El usuario no puede exceder los 50 caracteres'),
    email: z.email().min(1, 'El correo no puede estar vacío').max(50, 'El correo no puede exceder los 50 caracteres'),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres').max(50, 'La contraseña no puede exceder los 50 caracteres'),
    role: UserRoleSchema,
});
export type CreateUserInput = z.infer<typeof CreateUserSchema>;


