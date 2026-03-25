"use client";

import { useEffect, useMemo, useState } from "react";
import { Settings, Save, ChevronLeft, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

import {
  Controller,
  useForm,
  type FieldPath,
  type FieldPathValue,
} from "react-hook-form";

import {
  TipoEscrituraKey,
  TipoEscritura, // si no existe en tu types, quítalo y deja el cast en getRuleKeys
  TaxItemConfig,
  TIPOS_ESCRITURA_LABELS,
  TAX_ITEM_LABELS,
} from "@/features/shared/types";

import {
  DEFAULT_TAX_CONFIG,
  PRESUPUESTO_RULES_BY_TIPO,
  type TaxKey,
} from "@/features/shared/tax-rules"; // ajusta ruta
import { getTaxes, updateTax } from "./action";

type TaxConfigMap = Record<TipoEscrituraKey, TaxItemConfig>;
type FormValues = TaxConfigMap;

/**
 * ✅ Path tipado para RHF:
 * "tipo.taxKey" como FieldPath<FormValues>
 */
const makeTaxPath = <T extends TipoEscrituraKey, K extends TaxKey>(
  tipo: T,
  key: K
) => `${tipo}.${key}` as FieldPath<FormValues>;

type taxSettingsConfigProps = {
  taxes: Awaited<ReturnType<typeof getTaxes>>;
}

export default function Impuestos({ taxes }: taxSettingsConfigProps) {
  const [selectedTipo, setSelectedTipo] = useState<TipoEscrituraKey | null>(
    null
  );

  const createDefaultTaxConfigMap = (): TaxConfigMap =>
  ({
    testamento: { ...DEFAULT_TAX_CONFIG, ...taxes["testamento"] },
    "cvgastos-urgentes": { ...DEFAULT_TAX_CONFIG, ...taxes["cvgastos-urgentes"] },
    compraventa: { ...DEFAULT_TAX_CONFIG  , ...taxes["compraventa"]},
    donacion: { ...DEFAULT_TAX_CONFIG  , ...taxes["donacion"]},
    "adjudicacion-concepto-herencia": { ...DEFAULT_TAX_CONFIG  , ...taxes["adjudicacion-concepto-herencia"]},
    "rectificacion-superficie": { ...DEFAULT_TAX_CONFIG  , ...taxes["rectificacion-superficie"]},
    "fusion-predios": { ...DEFAULT_TAX_CONFIG  , ...taxes["fusion-predios"]},
    "cancelacion-usufructo-muerte": { ...DEFAULT_TAX_CONFIG  , ...taxes["cancelacion-usufructo-muerte"]},
    "cancelacion-usufructo-voluntaria": { ...DEFAULT_TAX_CONFIG  , ...taxes["cancelacion-usufructo-voluntaria"]},
    "servidumbre-paso": { ...DEFAULT_TAX_CONFIG  , ...taxes["servidumbre-paso"]},
    "division-copropiedad": { ...DEFAULT_TAX_CONFIG  , ...taxes["division-copropiedad"]},
    "cancelacion-reserva-dominio": { ...DEFAULT_TAX_CONFIG  , ...taxes["cancelacion-reserva-dominio"]},
    "poder-notarial": { ...DEFAULT_TAX_CONFIG  , ...taxes["poder-notarial"]},
    "constitucion-ac": { ...DEFAULT_TAX_CONFIG  , ...taxes["constitucion-ac"]},
    "inft-indistinto-nombre": { ...DEFAULT_TAX_CONFIG  , ...taxes["inft-indistinto-nombre"]},
    "inft-construccion-casahabitacion": { ...DEFAULT_TAX_CONFIG  , ...taxes["inft-construccion-casahabitacion"]},
  } satisfies TaxConfigMap);

  const tipos = useMemo(
    () => Object.keys(TIPOS_ESCRITURA_LABELS) as TipoEscrituraKey[],
    []
  );


  const form = useForm<FormValues>({
    defaultValues: createDefaultTaxConfigMap(),
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldUnregister: false,
  });
  const allValues = form.watch();

  const getRuleKeys = (tipo: TipoEscrituraKey): TaxKey[] => {
    // Si no tienes TipoEscritura en tus types, usa esto:
    // return (PRESUPUESTO_RULES_BY_TIPO as any)[tipo].taxes as TaxKey[];

    return PRESUPUESTO_RULES_BY_TIPO[tipo as unknown as TipoEscritura].taxes;
  };

  const handleSaveTipo = async () => {
    if (!selectedTipo) return;

    const ruleKeys = getRuleKeys(selectedTipo); // de PRESUPUESTO_RULES_BY_TIPO
    const valuesForTipo = form.getValues(selectedTipo); // TaxItemConfig

    const rows = ruleKeys.map((taxKey) => ({
      key: selectedTipo,                 // tipo escritura
      name: taxKey,                      // taxKey
      value: Number(valuesForTipo?.[taxKey] ?? 0),
    }));
    try {
      await updateTax(selectedTipo, rows);
      toast.success(`Impuestos de "${TIPOS_ESCRITURA_LABELS[selectedTipo]}" guardados`);
    }
    catch (e) {
      toast.error("Error al guardar los impuestos");
    }

  };


  useEffect(() => {
    if (!selectedTipo) return;

    const subscription = form.watch((values, info) => {
      // info.name te dice exactamente qué campo cambió: "testamento.traslado"
      const changedPath = info?.name;

      if (typeof changedPath === "string" && changedPath.startsWith(`${selectedTipo}.`)) {
        console.log("✅ Changed field:", changedPath);
        console.log("📌 Current tipo values:", values[selectedTipo]);
      }
    });

    return () => subscription.unsubscribe();
  }, [form, selectedTipo]);

  // Detail view
  if (selectedTipo) {
    const ruleKeys = getRuleKeys(selectedTipo);

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="cursor-pointer"
            onClick={() => setSelectedTipo(null)}
          >
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
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveTipo();
              }}
              className="space-y-6"
            >
              <div className="grid gap-6">
                {ruleKeys.map((key) => {
                  const name = makeTaxPath(selectedTipo, key);

                  return (
                    <Controller<FormValues, typeof name>
                      key={String(key)}
                      name={name}
                      control={form.control}
                      render={({ field }) => {
                        // ✅ Garantiza que value sea number para <input/>
                        const value =
                          (field.value ??
                            0) as FieldPathValue<FormValues, typeof name>;

                        return (
                          <div className="space-y-2">
                            <Label
                              htmlFor={`${selectedTipo}.${String(key)}`}
                              className="text-sm font-medium text-foreground"
                            >
                              {TAX_ITEM_LABELS[key]}
                            </Label>

                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                                {key === "traslado" ? "%" : "$"}
                              </span>

                              <Input
                                id={`${selectedTipo}.${String(key)}`}
                                type="number"
                                min="0"
                                step="0.000001"
                                maxLength={12}
                                value={Number(value) || ""}
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
                        );
                      }}
                    />
                  );
                })}
              </div>

              <Separator />

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => setSelectedTipo(null)}
                >
                  Cancelar
                </Button>

                <Button type="submit" className="cursor-pointer gap-2">
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
          const allowed = getRuleKeys(tipo);
          const tipoValues = allValues?.[tipo] ?? ({} as TaxItemConfig);

          const configuredCount = allowed.filter(
            (k) => (tipoValues?.[k] ?? 0) > 0
          ).length;

          return (
            <Card
              key={tipo}
              className="group cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all duration-200"
              onClick={() => setSelectedTipo(tipo)}
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
                  className="w-full group-hover:border-primary/50 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTipo(tipo);
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