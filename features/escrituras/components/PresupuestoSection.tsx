import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator } from "lucide-react";
import { TipoEscritura, Presupuesto } from "@/features/shared/types";
import { Money } from "@/components/shared/Money";

/** ✅ Config local (puedes ajustar valores por defecto) */
export type TaxConfig = {
  trasladoPorcentaje: number;
  derechoRegistro: number;
  certificadoCatastral: number;
  constanciasAdeudo: number;
};

export const DEFAULT_TAX_CONFIG: TaxConfig = {
  trasladoPorcentaje: 0,
  derechoRegistro: 0,
  certificadoCatastral: 0,
  constanciasAdeudo: 0,
};

interface PresupuestoSectionProps {
  tipo: TipoEscritura;
  valorBase: number;
  honorarios: number;
  isr: number;
  onValorBaseChange: (value: number) => void;
  onHonorariosChange: (value: number) => void;
  onIsrChange: (value: number) => void;

  /** ✅ ya no se usa useTaxConfig: ahora lo recibes aquí */
  taxConfig?: TaxConfig;
}

export function PresupuestoSection({
  tipo,
  valorBase,
  honorarios,
  isr,
  onValorBaseChange,
  onHonorariosChange,
  onIsrChange,
  taxConfig = DEFAULT_TAX_CONFIG,
}: PresupuestoSectionProps) {
  const traslado = valorBase * (taxConfig.trasladoPorcentaje / 100);
  const subtotal =
    valorBase +
    traslado +
    taxConfig.derechoRegistro +
    taxConfig.certificadoCatastral +
    taxConfig.constanciasAdeudo;

  const showIsr = tipo === "compraventa";
  const totalFinal = subtotal + honorarios + (showIsr ? isr : 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="h-5 w-5" />
          Presupuesto
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label>Valor Base (MXN)</Label>
            <Input
              type="number"
              value={valorBase || ""}
              onChange={(e) => onValorBaseChange(Number(e.target.value))}
              placeholder="0"
            />
          </div>

          <div>
            <Label>Honorarios (MXN)</Label>
            <Input
              type="number"
              value={honorarios || ""}
              onChange={(e) => onHonorariosChange(Number(e.target.value))}
              placeholder="0"
            />
          </div>

          {showIsr && (
            <div>
              <Label>ISR (MXN)</Label>
              <Input
                type="number"
                value={isr || ""}
                onChange={(e) => onIsrChange(Number(e.target.value))}
                placeholder="0"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Solo aplica al vendedor
              </p>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="space-y-2 rounded-lg bg-muted/30 p-4 text-sm">
          <div className="flex justify-between">
            <span>Valor Base</span>
            <Money amount={valorBase} />
          </div>

          <div className="flex justify-between">
            <span>Traslado ({taxConfig.trasladoPorcentaje}%)</span>
            <Money amount={traslado} />
          </div>

          <div className="flex justify-between text-muted-foreground">
            <span>Derecho de Registro</span>
            <Money amount={taxConfig.derechoRegistro} />
          </div>

          <div className="flex justify-between text-muted-foreground">
            <span>Certificado Catastral</span>
            <Money amount={taxConfig.certificadoCatastral} />
          </div>

          <div className="flex justify-between text-muted-foreground">
            <span>Constancias de Adeudo</span>
            <Money amount={taxConfig.constanciasAdeudo} />
          </div>

          <div className="flex justify-between border-t pt-2">
            <span>Subtotal</span>
            <Money amount={subtotal} />
          </div>

          <div className="flex justify-between">
            <span>Honorarios</span>
            <Money amount={honorarios} />
          </div>

          {showIsr && (
            <div className="flex justify-between">
              <span>ISR</span>
              <Money amount={isr} />
            </div>
          )}

          <div className="flex justify-between border-t pt-2 text-base font-bold">
            <span>Total Final</span>
            <Money amount={totalFinal} className="text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function calcularPresupuesto(
  tipo: TipoEscritura,
  valorBase: number,
  honorarios: number,
  isr: number,
  taxConfig: TaxConfig
): Presupuesto {
  const traslado = valorBase * (taxConfig.trasladoPorcentaje / 100);
  const subtotal =
    valorBase +
    traslado +
    taxConfig.derechoRegistro +
    taxConfig.certificadoCatastral +
    taxConfig.constanciasAdeudo;

  const isrFinal = tipo === "compraventa" ? isr : 0;
  const totalFinal = subtotal + honorarios + isrFinal;

  return {
    valorBase,
    traslado,
    derechoRegistro: taxConfig.derechoRegistro,
    certificadoCatastral: taxConfig.certificadoCatastral,
    constanciasAdeudo: taxConfig.constanciasAdeudo,
    subtotalPresupuesto: subtotal,
    honorarios,
    isr: isrFinal,
    totalFinal,
  };
}
