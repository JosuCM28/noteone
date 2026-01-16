import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DraftParticipant } from "@/features/shared/types";



type ParticipantsTableProps = {
  title: string;
  items: DraftParticipant[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  maxVisible?: number; // default 3
};

export function ParticipantsTable({
  title,
  items,
  onEdit,
  onDelete,
  maxVisible = 3,
}: ParticipantsTableProps) {
  if (items.length === 0) return null;

  const enableScroll = items.length > maxVisible;

  return (
    <div className="mt-3 rounded-lg border border-border/60 overflow-hidden">
      <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-muted/40">
        {title}
      </div>

      <div
        className={cn(
          "divide-y divide-border/50",
          enableScroll && "max-h-[168px] overflow-y-auto"
          // si ya tienes .no-scrollbar en globals.css:
          // enableScroll && "max-h-[168px] overflow-y-auto no-scrollbar"
        )}
      >
        {items.map((p) => (
          <div key={p.id} className="flex items-center gap-3 px-3 py-2">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{p.nombre}</p>
              <p className="text-xs text-muted-foreground">
                {p.rol} · {p.telefono}
              </p>
            </div>

            <div className="flex gap-1">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => onEdit(p.id)}
              >
                <Pencil className="h-4 w-4" />
              </Button>

              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => onDelete(p.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
