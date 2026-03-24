import { EstatusEscritura } from '@/features/shared/types';
import { ESTATUS_CONFIG } from '@/features/shared/data/mock-data';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: EstatusEscritura;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = ESTATUS_CONFIG.find(e => e.value === status);

  if (!config) return null;

  const colorClasses = {
    default: "bg-muted text-muted-foreground",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",   // pendiente
    info: "bg-blue-100 text-blue-800 border-blue-200",            // registro
    success: "bg-green-100 text-green-800 border-green-200",      // entregado
    secondary: "bg-gray-100 text-gray-800 border-gray-200",       // proceso
    destructive: "bg-red-100 text-red-800 border-red-200",        // error / cancelado
    purple: "bg-purple-100 text-purple-800 border-purple-200",    // liquidado
    orange: "bg-orange-100 text-orange-800 border-orange-200",    // proceso pago
  };

  return (
    <span className={cn('badge-status', colorClasses[config.color], className)}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
}
