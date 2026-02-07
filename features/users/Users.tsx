'use client';
import { useEffect, useState } from 'react';
import { Plus, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { CreateUserInput, CreateUserSchema, UserRoleSchema } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import z, { set } from 'zod';
import { Field, FieldLabel } from '@/components/ui/field';
import { toast } from 'sonner';
import { SignUpForm } from '../auth/types';

export default function Usuarios() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    // const [form, setForm] = useState({ nombre: '', usuario: '', password: '', rol: 'OPERATOR' as UserRole });

    // const openNew = () => { setEditId(null); setForm({ nombre: '', usuario: '', password: '', rol: 'OPERATOR' }); setDialogOpen(true); };

    const form = useForm<z.infer<typeof CreateUserSchema>>({
        resolver: zodResolver(CreateUserSchema),
        defaultValues: {
            fullName: '',
            username: '',
            email: '',
            password: '',
            role: 'user',
        },
        mode: 'onSubmit',
        reValidateMode: 'onChange',
    });

    const openNew = () => {
        setEditId(null);
        form.reset();
        setDialogOpen(true);
    };

    const values = useWatch({
        control: form.control,
    });
    useEffect(() => {
        console.log(values);
    }, [values]);

    async function createUser(values: CreateUserInput) {
  try {
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const msg =
        data?.message ||
        data?.error ||
        "No se pudo crear el usuario";
      throw new Error(msg); 
    }

    return data;
  } catch (e: any) {
    const msg = e?.message ?? "Error inesperado";
    toast.error(msg);

    throw new Error(msg);
  }
}
const onSubmit = async (values: CreateUserInput) => {
  try {
    await createUser(values);
    toast.success("Usuario creado");
    setDialogOpen(false);
    form.reset();
  } catch {
    // ya se mostró el toast en createUser
    // NO hagas throw aquí
  }
};



    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-serif text-2xl lg:text-3xl font-bold">Usuarios</h1>
                    <p className="text-muted-foreground">Administrar usuarios del sistema</p>
                </div>
                <Button onClick={openNew} className="btn-accent  cursor-pointer"><Plus className="h-4 w-4 mr-2" />Nuevo usuario</Button>
            </div>

            <Card className="shadow-premium">
                <CardContent className="p-0">
                    <table className="table-premium">
                        <thead><tr><th>Nombre</th><th>Usuario</th><th>Rol</th><th>Estado</th><th className="hidden sm:table-cell">Creado</th><th>Acciones</th></tr></thead>

                    </table>
                </CardContent>
            </Card>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        <DialogHeader><DialogTitle>{editId ? 'Editar Usuario' : 'Nuevo Usuario'}</DialogTitle></DialogHeader>
                        <div className="space-y-4">
                            <Controller
                                name="fullName"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="fullName">Nombre completo</FieldLabel>
                                        <Input
                                            {...field}
                                            id="fullName"
                                            type="text"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Ingrese su nombre completo"
                                            className="input-focus"
                                            disabled={form.formState.isSubmitting}
                                        />
                                        {fieldState.error?.message && (
                                            <p className="text-sm text-destructive">
                                                {fieldState.error.message}
                                            </p>
                                        )}
                                    </Field>

                                )}
                            />
                            <Controller
                                name="username"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="username">Usuario</FieldLabel>
                                        <Input
                                            {...field}
                                            id="username"
                                            type="text"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Ingrese su usuario"
                                            className="input-focus"
                                            disabled={form.formState.isSubmitting}
                                        />

                                        {fieldState.error?.message && (
                                            <p className="text-sm text-destructive">
                                                {fieldState.error.message}
                                            </p>
                                        )}
                                    </Field>
                                )}

                            />

                            <Controller
                                name='email'
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="email">Email</FieldLabel>
                                        <Input
                                            {...field}
                                            id="email"
                                            type="text"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Ingrese su email"
                                            className="input-focus"
                                            disabled={form.formState.isSubmitting}
                                        />

                                        {fieldState.error?.message && (
                                            <p className="text-sm text-destructive">
                                                {fieldState.error.message}
                                            </p>
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name='password'
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                                        <Input
                                            {...field}
                                            id="password"
                                            type="password"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Ingrese su contraseña"
                                            className="input-focus"
                                            disabled={form.formState.isSubmitting}
                                        />
                                        {fieldState.error?.message && (
                                            <p className="text-sm text-destructive">
                                                {fieldState.error.message}
                                            </p>
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name='role'
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <Label>Rol</Label>
                                        <SelectTrigger id="rol">
                                            <SelectValue placeholder="Seleccione un rol" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">Administrador</SelectItem>
                                            <SelectItem value="user">Operador</SelectItem>
                                        </SelectContent>
                                        {fieldState.error?.message && (
                                            <p className="text-sm text-destructive">
                                                {fieldState.error.message}
                                            </p>
                                        )}
                                    </Select>


                                )}
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" className='cursor-pointer' onClick={() => setDialogOpen(false)} type='button'>Cancelar</Button>
                            <Button className="btn-accent cursor-pointer" type='submit'>Crear</Button></DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

        </div>
    );
}
