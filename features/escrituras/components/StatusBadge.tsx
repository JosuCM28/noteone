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
    default: 'bg-muted text-muted-foreground',
    warning: 'badge-warning',
    info: 'badge-info',
    success: 'badge-success',
    destructive: 'badge-destructive',
    secondary: 'badge-secondary',
  };

  return (
    <span className={cn('badge-status', colorClasses[config.color], className)}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
}
