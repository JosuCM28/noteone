'use client';
import { useState } from 'react';
import Image from 'next/image';
import { redirect, useRouter } from 'next/navigation';
import { Scale, Eye, EyeOff, Loader2, ClipboardCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { useAuth } from '@/features/auth';
import { toast } from 'sonner';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignInSchema } from '@/features/auth/schemas';
import z from 'zod';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import { signIn, signUp } from '../actions';

export default function Login() {
    const form = useForm<z.infer<typeof SignInSchema>>({
        resolver: zodResolver(SignInSchema),
        defaultValues: {
            username: '',
            password: '',
        },
        mode: 'onChange',
    });

    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);

    const handleRegister =  async () => {
        try{
            const res = await signUp({
                username: 'daniel',
                password: '123456789',
                name: 'Daniel',
                email: 'daniel@example.com',
            });
            console.log(res);
            toast.success('Registro exitoso');
        }
        catch (error) {
            console.log(error);
            toast.error('Error al registrar usuario');
        }
    }

    const handleSubmit = async (values: z.infer<typeof SignInSchema>) => {

        try {
            const res = await signIn(values);
            if (!res?.user) {
                toast.error('Credenciales incorrectas');
                return;
            }
            toast.success('Bienvenido al sistema');
            router.push('/dashboard');

        }
        catch (error) {
            toast.error('Error al iniciar sesión');
            console.log(error);
        };
    }

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Decorative */}
            <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
                <Image
                    src="/loginbg.jpg" // Pon tu imagen en la carpeta /public
                    alt="Fondo Sistema Notarial"
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/70 via-primary/60 to-primary/30" />
                <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <rect width="100" height="100" fill="url(#grid)" />
                    </svg>
                </div>

                <div className="relative z-10 flex flex-col justify-center px-12 lg:px-16">
                    <div className="mb-8">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-amber-600 shadow-xl">
                            <Scale className="h-8 w-8 text-primary" />
                        </div>
                    </div>

                    <h1 className="font-serif text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
                        Sistema de Gestión Notarial
                    </h1>
                    <p className="text-lg text-primary-foreground/80 max-w-md">
                        Administre sus escrituras, presupuestos y trámites notariales de manera eficiente y segura.
                    </p>

                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-8">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-amber-600">
                            <Scale className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="font-serif text-xl font-semibold">Notaría Uno</h1>
                            <p className="text-xs text-muted-foreground">Sistema de Gestión</p>
                        </div>
                    </div>

                    <Card className="border-0 shadow-premium-lg">
                        <CardHeader className="space-y-1 pb-4">
                            <CardTitle className="font-serif text-2xl">Iniciar sesión</CardTitle>
                            <CardDescription>
                                Ingrese sus credenciales para acceder al sistema
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">

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
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />

                                <div className="space-y-2">
                                    <Controller
                                        name="password"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                                                <div className="relative">
                                                    <Input
                                                        {...field}
                                                        id="password"
                                                        type={showPassword ? 'text' : 'password'}
                                                        aria-invalid={fieldState.invalid}
                                                        placeholder="Ingrese su contraseña"
                                                        className="input-focus"
                                                        disabled={form.formState.isSubmitting}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                                        onClick={() => setShowPassword(prev => !prev)}
                                                        disabled={form.formState.isSubmitting}
                                                    >
                                                        {showPassword ? (
                                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                                        ) : (
                                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                        )}
                                                    </Button>

                                                </div>
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full btn-accent h-11"
                                    disabled={form.formState.isSubmitting || !form.formState.isDirty || !form.formState.isValid}
                                >
                                    {form.formState.isSubmitting ? (
                                        <>
                                            <Spinner className="size-4" />
                                            Ingresando...
                                        </>
                                    ) : (
                                        'Ingresar'
                                    )}
                                </Button>
                            </form>

                        </CardContent>
                    </Card>

                    <p className="text-center text-xs text-muted-foreground mt-6">
                        © 2026 Sistema Notarial. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </div>
    );
}
