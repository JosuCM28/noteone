'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Scale, Eye, EyeOff, LogOut } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    try {
      const res = await signUp({
        username: 'josue',
        password: 'Piripitiflautica',
        name: 'josue',
        email: 'josue@example.com',
        
      });
      toast.success('Registro exitoso');
    } catch (error) {
      console.log(error);
      toast.error('Error al registrar usuario');
    }
  };

  const handleSubmit = async (values: z.infer<typeof SignInSchema>) => {
    try {
      const res = await signIn(values);

      if (!res?.user) {
        toast.error('Credenciales incorrectas');
        return;
      }

      toast.success('Bienvenido al sistema');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Error al iniciar sesión');
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-sidebar-background">
        {/* Background image */}
        <Image
          src="/loginbg.jpg"
          alt="Fondo Sistema Notarial"
          fill
          priority
          className="object-cover"
        />

        {/* ✅ Premium overlay: gradient + blur suave */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/35 to-black/10 backdrop-blur-[2px]" />

        {/* ✅ Optional: premium grain/noise overlay (sin cuadrícula) */}
        <div
          className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E\")",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 lg:px-16">
          <div className="mb-8">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl shadow-xl"
              style={{ background: 'var(--gradient-accent)' }}
            >
              <Scale className="h-8 w-8" style={{ color: 'var(--accent-foreground)' }} />
            </div>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Sistema de Gestión Notarial
          </h1>

          <p className="text-base sm:text-lg text-white/80 max-w-md">
            Administre sus escrituras, presupuestos y trámites notariales de manera eficiente y segura.
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-6 sm:mb-8">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl"
              style={{ background: 'var(--gradient-accent)' }}
            >
              <Scale className="h-6 w-6" style={{ color: 'var(--accent-foreground)' }} />
            </div>

            <div>
              <h1 className="font-serif text-xl font-semibold">Notaría Uno</h1>
              <p className="text-xs text-muted-foreground">Sistema de Gestión</p>
            </div>
          </div>

          <Card className="border-0 shadow-premium-lg">
            <CardHeader className="space-y-1 pb-4 px-4 sm:px-6 pt-6">
              <CardTitle className="font-serif text-xl sm:text-2xl">Iniciar sesión</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Ingrese sus credenciales para acceder al sistema
              </CardDescription>
            </CardHeader>

            <CardContent className="px-4 sm:px-6 pb-6">
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
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

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
                          className="input-focus pr-10"
                          disabled={form.formState.isSubmitting}
                        />

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                          onClick={() => setShowPassword((prev) => !prev)}
                          disabled={form.formState.isSubmitting}
                        >
                          {showPassword ? (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>

                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full btn-accent h-11"
                  disabled={
                    form.formState.isSubmitting ||
                    !form.formState.isDirty ||
                    !form.formState.isValid
                  }
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

                {/* Debug / Register Button (Opcional) */}
                <Button type="button" variant="outline" onClick={handleRegister} className="w-full">
                  Registrar rápido (dev)
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground mt-6 px-4">
            © 2026 Sistema Notarial. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
