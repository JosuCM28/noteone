"use client";

import { useTransition, useMemo } from "react";
import { Settings, Save, RotateCcw, Percent, DollarSign } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Tax } from "../shared/types";
import { TaxSettingsSchema } from "../auth/schemas";
import z from "zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { updateTax } from "./action";
import { start } from "repl";
import { Spinner } from "@/components/ui/spinner";

// 🔧 Ajusta estos imports/vars a tu app real
// import { useTaxConfig } from "@/features/taxes/useTaxConfig";
// import { Navigate } from "react-router-dom";
const isAdmin = true as boolean;

interface TaxSettingsProps {
  taxes: Tax[];
}

export default function Impuestos({ taxes }: TaxSettingsProps) {

  const [isPending, startTrasition] = useTransition();
  const router = useRouter();


  const form = useForm<z.infer<typeof TaxSettingsSchema>>({
    defaultValues: {
      porcentaje: taxes.find((t) => t.name === "TRASLADO")?.value ?? 0,
      derechoRegistro: taxes.find((t) => t.name === "DERECHO_REGISTRO")?.value ?? 0,
      certificadoCatastral: taxes.find((t) => t.name === "CERTIFICADO_CATASTRAL")?.value ?? 0,
      constanciaAdeudo: taxes.find((t) => t.name === "CONSTANCIAS_ADEUDOS")?.value ?? 0,
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const submitCount = form.formState.submitCount;

  const { control, watch } = form;

  function shouldShowError(fieldState: any, submitCount: number) {
    return (fieldState.isTouched || submitCount > 0) && !!fieldState.error;
  }

  // Cuando llegue config desde backend/store, hidrata RHF

  const values = watch();

  const totalImpuestosFijos = useMemo(() => {
    return (
      (values.derechoRegistro || 0) +
      (values.certificadoCatastral || 0) +
      (values.constanciaAdeudo || 0)
    );
  }, [values.derechoRegistro, values.certificadoCatastral, values.constanciaAdeudo]);

  const ejemploTraslado = useMemo(() => {
    const pct = values.porcentaje || 0;
    return (100000 * pct) / 100;
  }, [values.porcentaje]);

  const previewSubtotal = useMemo(() => {
    const pct = values.porcentaje || 0;
    const traslado = (1000000 * pct) / 100;
    return 1000000 + traslado + totalImpuestosFijos;
  }, [values.porcentaje, totalImpuestosFijos]);

  const handleSubmit = async (data: z.infer<typeof TaxSettingsSchema>) => {
    try {
      await updateTax(data);
      form.reset(data);
      toast.success('Cambios guardados correctamente');
      startTrasition(() => router.refresh());
    } catch (error) {
      console.log(error);
      toast.error('Error al guardar cambios');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-serif font-semibold text-foreground flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" />
          Configuración de Impuestos
        </h1>
        <p className="text-muted-foreground mt-1">
          Administra los porcentajes y montos fijos utilizados en el cálculo del presupuesto de escrituras.
        </p>
      </div>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid gap-6 lg:grid-cols-2">

          {/* Traslado */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Percent className="h-5 w-5 text-primary" />
                Porcentaje de Traslado
              </CardTitle>
              <CardDescription>
                Porcentaje aplicado sobre el valor base de la escritura para calcular el traslado de dominio.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-2">
                <div className="relative">
                  <Controller
                    name="porcentaje"
                    control={form.control}
                    render={({ field, fieldState }) => {
                      const showError = shouldShowError(fieldState, submitCount);
                      return (
                        <Field data-invalid={showError}>
                          <FieldLabel htmlFor="porcentaje">
                            Porcentaje (%) <span className="text-red-500">*</span>
                          </FieldLabel>
                          <Input
                            id="porcentaje"
                            type="number"
                            min={0}
            
                            step={0.1}
                            value={field.value === 0 ? '' : String(field.value)}
                            onChange={(e) => field.onChange(Number(e.target.value || 0))}
                            onBlur={field.onBlur}
                            ref={field.ref}
                            placeholder="0"
                            className="pr-8"
                            disabled={form.formState.isSubmitting || isPending}
                          />
                          <h1></h1>
                          {showError && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      );
                    }}
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  Ejemplo: Si el valor base es $100,000 y el traslado es {values.porcentaje || 0}%,
                  el monto sería ${ejemploTraslado.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Impuestos Fijos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="h-5 w-5 text-primary" />
                Impuestos Fijos
              </CardTitle>
              <CardDescription>Montos fijos que se suman al presupuesto de cada escritura.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="derechoRegistro">Derecho de Registro</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Controller
                    control={control}
                    name="derechoRegistro"
                    render={({ field }) => (
                      <Input
                        id="derechoRegistro"
                        type="number"
                        min={0}
                        step={0.01}
                        value={field.value === 0 ? '' : String(field.value)}
                        onChange={(e) => field.onChange(Number(e.target.value || 0))}
                        onBlur={field.onBlur}
                        ref={field.ref}
                        className="pl-7"
                        placeholder="0"
                        disabled={form.formState.isSubmitting || isPending}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="certificadoCatastral">Certificado Catastral</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Controller
                    control={control}
                    name="certificadoCatastral"
                    render={({ field }) => (
                      <Input
                        id="certificadoCatastral"
                        type="number"
                        min={0}
                        step={0.01}
                        value={field.value === 0 ? '' : String(field.value)}
                        onChange={(e) => field.onChange(Number(e.target.value || 0))}
                        onBlur={field.onBlur}
                        ref={field.ref}
                        className="pl-7"
                        disabled={form.formState.isSubmitting || isPending}
                        placeholder="0"
                      />
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="constanciasAdeudo">Constancias de No Adeudo</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Controller
                    control={control}
                    name="constanciaAdeudo"
                    render={({ field }) => (
                      <Input
                        id="constanciasAdeudo"
                        type="number"
                        min={0}
                        step={0.01}
                        value={field.value === 0 ? '' : String(field.value)}
                        onChange={(e) => field.onChange(Number(e.target.value || 0))}
                        onBlur={field.onBlur}
                        ref={field.ref}
                        className="pl-7"
                        placeholder="0"
                        disabled={form.formState.isSubmitting || isPending}
                      />
                    )}
                  />
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-lg">
                <span className="font-medium">Total Impuestos Fijos</span>
                <span className="font-semibold text-primary">
                  ${totalImpuestosFijos.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                </span>
              </div>


            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-6">
          <Button type="submit" className="gap-2 cursor-pointer" disabled={form.formState.isSubmitting || isPending || !form.formState.isDirty} >
            {
              isPending || form.formState.isSubmitting ? (
                <Spinner className="size-4 " />


              ) : (
                <div className="flex gap-2 items-center">
                  <Save className="size-4" />
                  <span>Guardar Cambios</span>
                </div>

              )
            }
          </Button>

        </div>
      </form>



      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base">Vista Previa del Cálculo</CardTitle>
          <CardDescription>
            Ejemplo de cómo se aplicarían estos valores en una escritura con valor base de $1,000,000
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Valor Base</span>
              <span>$1,000,000.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Traslado ({values.porcentaje || 0}%)</span>
              <span>${(1000000 * values.porcentaje / 100).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Derecho de Registro</span>
              <span>${values.derechoRegistro.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Certificado Catastral</span>
              <span>${values.certificadoCatastral.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Constancias de No Adeudo</span>
              <span>${values.constanciaAdeudo.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-semibold">
              <span>Subtotal (sin honorarios)</span>
              <span className="text-primary">
                ${(1000000 + (1000000 * values.porcentaje / 100) + totalImpuestosFijos).toLocaleString('es-MX', { minimumFractionDigits: 4 })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div >


  );
}
