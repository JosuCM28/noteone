"use client";

import { useMemo, useState } from "react";
import { Settings, Save, ChevronLeft, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Controller, useForm } from "react-hook-form";

import {
  TipoEscrituraKey,
  TaxItemConfig,
  TIPOS_ESCRITURA_LABELS,
  TAX_ITEM_LABELS,
} from "@/features/shared/types";

import { Money } from "@/components/shared/Money";

type TaxConfigMap = Record<TipoEscrituraKey, TaxItemConfig>;

export default function Impuestos() {
  const router = useRouter();

  const [selectedTipo, setSelectedTipo] = useState<TipoEscrituraKey | null>(
    null
  );

  // ✅ Inicializa taxConfig con TODOS tus tipos
  const createEmptyTaxConfig = (): TaxConfigMap => ({
    testamento: {} as TaxItemConfig,
    "cvgastos-urgentes": {} as TaxItemConfig,
    compraventa: {} as TaxItemConfig,
    donacion: {} as TaxItemConfig,
    "adjudicacion-concepto-herencia": {} as TaxItemConfig,
    "rectificacion-superficie": {} as TaxItemConfig,
    "fusion-predios": {} as TaxItemConfig,
    "cancelacion-usufructo-muerte": {} as TaxItemConfig,
    "cancelacion-usufructo-voluntaria": {} as TaxItemConfig,
    "servidumbre-paso": {} as TaxItemConfig,
    "division-copropiedad": {} as TaxItemConfig,
    "cancelacion-reserva-dominio": {} as TaxItemConfig,
    "poder-notarial": {} as TaxItemConfig,
    "constitucion-ac": {} as TaxItemConfig,
    "inft-indistinto-nombre": {} as TaxItemConfig,
    "inft-construccion-casahabitacion": {} as TaxItemConfig,
  });

  const [taxConfig, setTaxConfig] = useState<TaxConfigMap>(
    createEmptyTaxConfig()
  );

  // ✅ Tipos y keys para render
  const tipos = useMemo(
    () => Object.keys(TIPOS_ESCRITURA_LABELS) as TipoEscrituraKey[],
    []
  );
  const taxKeys = useMemo(
    () => Object.keys(TAX_ITEM_LABELS) as (keyof TaxItemConfig)[],
    []
  );

  // ✅ React Hook Form para el detalle
  const form = useForm<TaxItemConfig>({
    defaultValues: {} as TaxItemConfig,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  // ✅ Reemplazo de updateTaxConfigForType
  const updateTaxConfigForType = (tipo: TipoEscrituraKey, d: TaxItemConfig) => {
    setTaxConfig((prev) => ({
      ...prev,
      [tipo]: d,
    }));
  };

  const handleSelect = (tipo: TipoEscrituraKey) => {
    setSelectedTipo(tipo);

    // Carga valores actuales del tipo al form
    form.reset({ ...(taxConfig[tipo] ?? ({} as TaxItemConfig)) });
  };

  const handleBack = () => {
    setSelectedTipo(null);
    form.reset({} as TaxItemConfig);
  };

  const handleSave = (values: TaxItemConfig) => {
    if (!selectedTipo) return;

    updateTaxConfigForType(selectedTipo, values);

    toast.success(
      `Impuestos de "${TIPOS_ESCRITURA_LABELS[selectedTipo]}" actualizados`
    );
  };

  // Detail view
  if (selectedTipo) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button type="button" variant="ghost" size="icon" onClick={handleBack}>
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div>
            <h1 className="text-2xl font-serif font-semibold text-foreground">
              {TIPOS_ESCRITURA_LABELS[selectedTipo]}
            </h1>
            <p className="text-muted-foreground text-sm">
              Configura los impuestos para este tipo de escritura
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-6">
            <form
              onSubmit={form.handleSubmit(handleSave)}
              className="space-y-6"
            >
              <div className="grid gap-6">
                {taxKeys.map((key) => (
                  <Controller
                    key={String(key)}
                    name={key as any}
                    control={form.control}
                    render={({ field }) => (
                      <div className="space-y-2">
                        <Label
                          htmlFor={String(key)}
                          className="text-sm font-medium text-foreground"
                        >
                          {TAX_ITEM_LABELS[key]}
                        </Label>

                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                            $
                          </span>

                          <Input
                            id={String(key)}
                            type="number"
                            min="0"
                            step="0.01"
                            value={field.value ?? 0}
                            onChange={(e) => {
                              const n = Number(e.target.value);
                              field.onChange(Number.isFinite(n) ? n : 0);
                            }}
                            onBlur={field.onBlur}
                            ref={field.ref}
                            className="pl-7 text-base"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                    )}
                  />
                ))}
              </div>

              <Separator />

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={handleBack}>
                  Cancelar
                </Button>

                <Button type="submit" className="gap-2">
                  <Save className="h-4 w-4" />
                  Guardar Cambios
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-serif font-semibold text-foreground">
            Configuración de Impuestos
          </h1>
        </div>

        <p className="text-muted-foreground">
          Administra los costos e impuestos para cada tipo de escritura. Haz clic
          en una tarjeta para editar sus valores.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tipos.map((tipo) => {
          const configuredCount = taxKeys.filter(
            (k) => (taxConfig[tipo]?.[k] ?? 0) > 0
          ).length;

          return (
            <Card
              key={tipo}
              className="group cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all duration-200"
              onClick={() => handleSelect(tipo)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">
                    {TIPOS_ESCRITURA_LABELS[tipo]}
                  </CardTitle>

                  <DollarSign className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-primary">
                    {configuredCount}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    impuestos configurados
                  </span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full group-hover:border-primary/50"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(tipo);
                  }}
                >
                  Configurar
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}