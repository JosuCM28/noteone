import { Presupuesto, Tax, TipoEscritura } from '@/features/shared/types';
import { Money } from '@/components/shared/Money';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface BudgetBreakdownProps {
  presupuesto: Presupuesto;
  tipo: TipoEscritura;
  showIsr?: boolean;
  className?: string;
}

export function BudgetBreakdown({ presupuesto, tipo, showIsr = true, className }: BudgetBreakdownProps) {
  const isCompraventa = tipo === 'compraventa';

  return (
    <div className={cn('space-y-3', className)}>
      {presupuesto.valorBase > 0 && (
        <>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Valor base</span>
            <Money amount={presupuesto.valorBase} />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Traslado (5%)</span>
            <Money amount={presupuesto.traslado} />
          </div>
        </>
      )}

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Derecho de registro</span>
        <Money amount={presupuesto.derechoRegistro} />
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Certificado catastral</span>
        <Money amount={presupuesto.certificadoCatastral} />
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Constancias de adeudo</span>
        <Money amount={presupuesto.constanciasAdeudo} />
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <span className="font-medium">Subtotal presupuesto</span>
        <Money amount={presupuesto.subtotalPresupuesto} className="text-primary" />
      </div>

      <Separator />

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Honorarios</span>
        <Money amount={presupuesto.honorarios} />
      </div>

      {showIsr && (
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">ISR</span>
            {isCompraventa && (
              <span className="text-xs bg-muted px-1.5 py-0.5 rounded">Solo vendedor</span>
            )}
          </div>
          {isCompraventa ? (
            <Money amount={presupuesto.isr} />
          ) : (
            <span className="text-muted-foreground text-xs">No aplica</span>
          )}
        </div>
      )}

      <Separator />

      <div className="flex items-center justify-between pt-2">
        <span className="text-lg font-bold">Total Final</span>
        <Money 
          amount={presupuesto.totalFinal} 
          className="text-lg text-primary"
        />
      </div>
    </div>
  );
}
