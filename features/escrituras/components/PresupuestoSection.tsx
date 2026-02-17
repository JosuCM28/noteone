"use client";

import { useMemo } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator } from "lucide-react";
import { Money } from "@/components/shared/Money";

import {
  DEFAULT_TAX_CONFIG,
  PRESUPUESTO_RULES_BY_TIPO,
  type TaxConfig,
  type TaxKey,
} from "@/features/shared/tax-rules";

import { z } from "zod";
import { EscrituraFormSchema } from "../schema"; // ✅ ajusta path si hace falta
import type { TipoEscritura } from "@/features/shared/types";

function toNumber(v: unknown) {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}

const PERSONA_B_KEYS: TaxKey[] = ["pagoISR", "honorariosB"];

// ✅ Labels seguros para tus TaxKey (usa esto o reemplaza por tu TAX_ITEM_LABELS)
const TAX_LABELS: Record<TaxKey, string> = {
  traslado: "Traslado",
  certificadoValorCatastral: "Certificado Valor Catastral",
  constanciaNoAdeudo: "Constancia No Adeudo",
  derechoRegistro: "Derecho de Registro",
  aviso: "Aviso",
  registroEscritura: "Registro de Escritura",
  gastosNotariales: "Gastos Notariales",
  pagoISR: "Pago ISR",
  honorarios: "Honorarios",
  honorariosB: "Honorarios B",
};

type FormInput = z.input<typeof EscrituraFormSchema>;

type Props = {
  tipo: TipoEscritura;
  personaALabel?: string;
  personaBLabel?: string;
};

export function PresupuestoSection({ tipo, personaALabel, personaBLabel }: Props) {
  const { control, setValue } = useFormContext<FormInput>();

  const rules = PRESUPUESTO_RULES_BY_TIPO[tipo];
  const ruleKeys = rules?.taxes ?? [];

  // ✅ RHF values
  const baseValueRaw = useWatch({ control, name: "baseValue" });
  const baseValue = toNumber(baseValueRaw ?? 0);

  const taxesWatch = useWatch({ control, name: "taxes" }) as Partial<TaxConfig> | undefined;

  // ✅ fallback (por si taxes aún no está)
  const taxes = useMemo<TaxConfig>(() => {
    return { ...DEFAULT_TAX_CONFIG, ...(taxesWatch ?? {}) };
  }, [taxesWatch]);

  const { taxesAKeys, taxesBKeys } = useMemo(() => {
    const a: TaxKey[] = [];
    const b: TaxKey[] = [];

    for (const key of ruleKeys) {
      if (PERSONA_B_KEYS.includes(key)) b.push(key);
      else a.push(key);
    }

    return { taxesAKeys: a, taxesBKeys: b };
  }, [ruleKeys]);

  const totalA = useMemo(() => {
    let s = baseValue;
    for (const key of taxesAKeys) s += toNumber(taxes[key]);
    return s;
  }, [baseValue, taxesAKeys, taxes]);

  const totalB = useMemo(() => {
    let s = 0;
    for (const key of taxesBKeys) s += toNumber(taxes[key]);
    return s;
  }, [taxesBKeys, taxes]);

  // ✅ si quieres, puedes “guardar” los totales en el form para enviar a backend
  // (solo si tu schema permite totalA/totalB)
  // useEffect(() => {
  //   setValue("totalA", totalA);
  //   setValue("totalB", totalB);
  // }, [totalA, totalB, setValue]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="h-5 w-5" />
          Presupuesto
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* BaseValue */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label>Valor Base (MXN)</Label>
            <Controller
              control={control}
              name="baseValue"
              render={({ field }) => (
                <Input
                  type="number"
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(toNumber(e.target.value))}
                  placeholder="0"
                />
              )}
            />
          </div>
        </div>

        {/* Persona A / General */}
        <div className="space-y-3 rounded-lg bg-muted/30 p-4 text-sm">
          <p className="text-sm font-semibold">
            Pagos generales / {personaALabel ?? "Persona A"}
          </p>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Valor Base</span>
            <Money amount={baseValue} />
          </div>

          {taxesAKeys.map((key) => (
            <div key={key} className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:items-center">
              <span className="text-muted-foreground">{TAX_LABELS[key]}</span>

              <Controller
                control={control}
                name={`taxes.${key}` as const}
                render={({ field }) => (
                  <Input
                    type="number"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(toNumber(e.target.value))}
                    placeholder="0"
                  />
                )}
              />
            </div>
          ))}

          <div className="flex justify-between border-t pt-2 text-base font-bold">
            <span>Total ({personaALabel ?? "Persona A"})</span>
            <Money amount={totalA} className="text-primary" />
          </div>
        </div>

        {/* Persona B */}
        {taxesBKeys.length > 0 && (
          <div className="space-y-3 rounded-lg bg-muted/30 p-4 text-sm mt-10">
            <p className="text-sm font-semibold">Pagos de {personaBLabel ?? "Persona B"}</p>

            {taxesBKeys.map((key) => (
              <div key={key} className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:items-center">
                <span className="text-muted-foreground">{TAX_LABELS[key]}</span>

                <Controller
                  control={control}
                  name={`taxes.${key}` as const}
                  render={({ field }) => (
                    <Input
                      type="number"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(toNumber(e.target.value))}
                      placeholder="0"
                    />
                  )}
                />
              </div>
            ))}

            <div className="flex justify-between border-t pt-2 text-base font-bold">
              <span>Total ({personaBLabel ?? "Persona B"})</span>
              <Money amount={totalB} className="text-primary" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}