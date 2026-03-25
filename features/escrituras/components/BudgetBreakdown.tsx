import { PresupuestoView } from "@/features/shared/types";
import { Money } from "@/components/shared/Money";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface BudgetBreakdownProps {
  presupuesto: PresupuestoView;
  className?: string;
}

export function BudgetBreakdown({ presupuesto, className }: BudgetBreakdownProps) {
  const taxes = presupuesto.taxes ?? [];

  const taxesA = taxes.filter((t) => t.side === "A");
  const taxesB = taxes.filter((t) => t.side === "B");

  const hasA = taxesA.length > 0 || (presupuesto.totalA ?? 0) > 0;
  const hasB = taxesB.length > 0 || (presupuesto.totalB ?? 0) > 0;

  const totalFinal = (presupuesto.totalA ?? 0) + (presupuesto.totalB ?? 0);

  const Section = ({
    title,
    items,
    total,
  }: {
    title: string;
    items: PresupuestoView["taxes"];
    total: number;
  }) => {
    const hasItems = items.length > 0;

    return (
      <div className="space-y-2 rounded-lg border bg-muted/10 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </p>

        {hasItems ? (
          <div className="space-y-2">
            {items.map((t) => (
              <div
                key={`${t.key}-${t.side}`}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-muted-foreground">{t.name}</span>
                {t.key === "traslado" ? (
                  <span className="font-medium tabular-nums">{t.amount}%</span>
                ) : (
                  <Money amount={t.amount} />
                )}
              </div>
            ))}

            <Separator className="my-1" />

            {/* Total por sección */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-sm font-semibold">
                Total {title}
              </span>
              <Money amount={total} className="font-semibold text-primary" />
            </div>
          </div>
        ) : (
          <div className="rounded-md border bg-background p-3 text-xs text-muted-foreground text-center">
            Sin conceptos.
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Valor base */}
      {presupuesto.baseValue > 0 ? (
        <div className="flex items-center justify-between rounded-lg border bg-background p-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Valor base
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Base para cálculo (si aplica)
            </p>
          </div>
          <Money amount={presupuesto.baseValue} className="text-base font-semibold" />
        </div>
      ) : null}

      {/* Comprador */}
      {hasA ? (
        <Section
          title={presupuesto.rolesDisponibles?.[0] ?? "Comprador"}
          items={taxesA}
          total={presupuesto.totalA ?? 0}
        />
      ) : null}

      {/* Vendedor */}
      {hasB ? (
        <Section
          title={presupuesto.rolesDisponibles?.[1] ?? "Vendedor"}
          items={taxesB}
          total={presupuesto.totalB ?? 0}
        />
      ) : null}

      <Separator className="my-1" />

      {/* Total final */}
      <div className="flex items-center justify-between rounded-lg border bg-primary/5 p-3">
        <span className="text-base font-semibold">Total final</span>
        <Money amount={totalFinal} className="text-base text-primary font-semibold" />
      </div>
    </div>
  );
}