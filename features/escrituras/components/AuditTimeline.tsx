import { BitacoraEntry } from '@/features/shared/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Clock } from 'lucide-react';

interface AuditTimelineProps {
  entries: BitacoraEntry[];
}

export function AuditTimeline({ entries }: AuditTimelineProps) {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        No hay actividad registrada
      </p>
    );
  }

  return (
    <div className="space-y-0">
      {entries.map((entry) => (
        <div key={entry.id} className="timeline-item">
          <div className="timeline-dot">
            <Clock className="h-3 w-3 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">{entry.action}</p>
            <p className="text-xs text-muted-foreground">{entry.detail}</p>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <span>{entry.user}</span>
              <span>•</span>
              <span>
                {format(entry.at, "dd MMM yyyy, HH:mm", { locale: es })}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
