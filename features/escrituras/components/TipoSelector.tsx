import React, { useMemo, useState } from "react";
import {
  Scroll,
  Home,
  Gift,
  Ban,
  XCircle,
  Users,
  PenTool,
  Building,
  FileEdit,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TipoEscritura } from "@/features/shared/types";
import { TIPOS_ESCRITURA } from "@/features/shared/data/mock-data";
import { cn } from "@/lib/utils";

interface TipoSelectorProps {
  selectedTipo: TipoEscritura | null;
  onSelect: (tipo: TipoEscritura) => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  scroll: Scroll,
  home: Home,
  gift: Gift,
  ban: Ban,
  "x-circle": XCircle,
  users: Users,
  "pen-tool": PenTool,
  building: Building,
  "file-edit": FileEdit,
};

const PAGE_SIZE = 9;

export function TipoSelector({ selectedTipo, onSelect }: TipoSelectorProps) {
  const [page, setPage] = useState(0);

  const total = TIPOS_ESCRITURA.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const items = useMemo(() => {
    const start = page * PAGE_SIZE;
    return TIPOS_ESCRITURA.slice(start, start + PAGE_SIZE);
  }, [page]);

  const canPrev = page > 0;
  const canNext = page < pageCount - 1;

  const goPrev = () => setPage((p) => Math.max(0, p - 1));
  const goNext = () => setPage((p) => Math.min(pageCount - 1, p + 1));

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-lg">Tipo de Escritura *</CardTitle>

          {/* Controles tipo carrusel */}
          {pageCount > 1 && (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={goPrev}
                disabled={!canPrev}
                aria-label="Anterior"
                className="cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <span className="text-xs text-muted-foreground tabular-nums">
                {page + 1}/{pageCount}
              </span>

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={goNext}
                disabled={!canNext}
                aria-label="Siguiente"
                className="cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => {
            const Icon = iconMap[t.icon] || Scroll;

            return (
              <button
                key={t.value}
                type="button"
                onClick={() => onSelect(t.value)}
                className={cn(
                  "p-4 rounded-xl border-2 text-left transition-all hover:border-primary/50 cursor-pointer",
                  selectedTipo === t.value
                    ? "border-primary bg-primary/5"
                    : "border-border"
                )}
              >
                <Icon className="h-5 w-5 mb-2 text-primary" />
                <p className="font-medium text-sm">{t.label}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {t.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Footer opcional (indicador + hint) */}
        {pageCount > 1 && (
          <div className="mt-4 flex items-center justify-end text-xs text-muted-foreground">
            <span>Usa las flechas para ver más tipos</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
