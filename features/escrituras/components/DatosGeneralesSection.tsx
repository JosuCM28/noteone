import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

import { ESTATUS_CONFIG } from "@/features/shared/data/mock-data";

// ✅ Ajusta el type si quieres, pero con RHF basta `any` aquí si no estás exportando el tipo del form.
export function DatosGeneralesSection() {
  const { control, getValues } = useFormContext<any>();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="h-5 w-5" />
          Datos Generales
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex justify-between items-center gap-2">
          {/* folioInterno -> folio */}
          <FormField

            control={control}
            name="folio"

            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Folio Interno *</FormLabel>
                <FormControl>
                  <Input {...field}
                    readOnly
                    placeholder="FI-2024-XXX" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* numeroEscritura -> deedNumber */}
          <FormField
            control={control}
            name="deedNumber"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Número de Escritura *</FormLabel>
                <FormControl>
                  <Input
                    value={field.value ?? ""}   // 👈 porque deedNumber es nullable
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    placeholder="1234"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ⚠️ fechaFirma NO está en tu schema actual
              Si la quieres, agrégala a Zod + defaultValues y descomenta esto.
          */}
          {/*
          <FormField
            control={control}
            name="signedAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de Firma</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          */}

          {/* estatus -> status */}
          <FormField
            control={control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Estatus Inicial</FormLabel>
                <Select value={field.value} onValueChange={field.onChange} defaultValue={getValues("status")}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ESTATUS_CONFIG.map((s) => (
                      <SelectItem key={s.value} value={s.value} >
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* notas -> notes */}
        <FormField
          control={control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas</FormLabel>
              <FormControl>
                <Textarea
                  value={field.value ?? ""}  // 👈 notes es nullable
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                  placeholder="Notas adicionales sobre la escritura..."
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}