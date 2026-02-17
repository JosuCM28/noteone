import type { TipoEscritura } from "@/features/shared/types";
import {
    PRESUPUESTO_RULES_BY_TIPO,
    type TaxConfig,
    type TaxKey,
} from "@/features/shared/tax-rules";

export type PresupuestoResult = {
    valorBase: number;
    impuestos: Partial<Record<TaxKey, number>>;
    total: number;
};

export function calcularPresupuesto(
    tipo: TipoEscritura,
    valorBase: number,
    taxConfig: TaxConfig
): PresupuestoResult {
    const rules = PRESUPUESTO_RULES_BY_TIPO[tipo];

    const impuestos: Partial<Record<TaxKey, number>> = {};
    let total = valorBase;

    for (const key of rules.taxes) {
        // OJO: aquí asumo que "traslado" es porcentaje.
        // Si traslado YA es monto final, cambia a: const amount = taxConfig[key] ?? 0;
        const amount =
            key === "traslado"
                ? valorBase * ((taxConfig.traslado ?? 0) / 100)
                : (taxConfig[key] ?? 0);

        impuestos[key] = amount;
        total += amount;
    }

    return { valorBase, impuestos, total };
}