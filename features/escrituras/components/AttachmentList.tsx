import { Adjunto } from '@/features/shared/types';
import { FileText, Image, File, Check, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AttachmentListProps {
  attachments: Adjunto[];
  onRemove?: (id: string) => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function getFileIcon(type: string) {
  if (type.startsWith('image/')) return Image;
  if (type === 'application/pdf') return FileText;
  return File;
}

export function AttachmentList({ attachments, onRemove }: AttachmentListProps) {
  if (attachments.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        No hay archivos adjuntos
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {attachments.map((attachment) => {
        const Icon = getFileIcon(attachment.type);
        
        return (
          <div
            key={attachment.id}
            className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{attachment.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(attachment.size)}
              </p>
            </div>
            <div className={cn(
              "flex items-center gap-1 text-xs px-2 py-1 rounded-full",
              attachment.status === 'uploaded' 
                ? "bg-success/10 text-success" 
                : "bg-warning/10 text-warning"
            )}>
              {attachment.status === 'uploaded' ? (
                <>
                  <Check className="h-3 w-3" />
                  Subido
                </>
              ) : (
                <>
                  <Clock className="h-3 w-3" />
                  Pendiente
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
