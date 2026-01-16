'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Plus, Search, Filter, X, Eye, Pencil, Trash2,
  ChevronLeft, ChevronRight, ArrowUpDown, FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent } from '@/components/ui/card';
// import { useEscrituras } from '@/features/escrituras';
import { StatusBadge } from '../components/StatusBadge';
import { Money } from '@/components/shared/Money';
import { TIPOS_ESCRITURA, ESTATUS_CONFIG } from '@/features/shared/data/mock-data';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Escritura } from '@/features/shared/types';

const ITEMS_PER_PAGE = 10;

type EscriturasListaProps = {
  escrituras: Escritura[];
};


export default function EscriturasLista({ escrituras }: EscriturasListaProps) {

  const [localSearch, setLocalSearch] = useState('');
  const [tipoFilter, setTipoFilter] = useState<string>('all');
  const [estatusFilter, setEstatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'fecha' | 'total'>('fecha');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [deleteId, setDeleteId] = useState<string | null>(null);



  const clearFilters = () => {
    setLocalSearch('');
    setTipoFilter('all');
    setEstatusFilter('all');
    setCurrentPage(1);
  };

  const hasFilters = localSearch || tipoFilter !== 'all' || estatusFilter !== 'all';

  const handleDelete = () => {
    if (deleteId) {
      // deleteEscritura(deleteId);
      toast.success('Escritura eliminada correctamente');
      setDeleteId(null);
    }
  };

  const toggleSort = (field: 'fecha' | 'total') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getTipoLabel = (tipo: string) => {
    return TIPOS_ESCRITURA.find(t => t.value === tipo)?.label || tipo;
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in px-4 sm:px-6 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
            Escrituras
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            {escrituras.length} escritura{escrituras.length !== 1 ? 's' : ''} encontrada{escrituras.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button asChild className="btn-accent w-full sm:w-fit">
          <Link href="/escrituras/new">
            <Plus className="mr-2 h-4 w-4" />
            Nueva escritura
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card className="shadow-premium">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="relative flex-1 min-w-45 sm:min-w-50">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Buscar por folio, número o nombre..."
                value={localSearch}
                onChange={(e) => {
                  setLocalSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 input-focus text-sm"
              />
            </div>

            <Select value={tipoFilter} onValueChange={(v) => { setTipoFilter(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-full sm:w-45 text-sm">
                <Filter className="h-4 w-4 mr-2 shrink-0" />
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                {TIPOS_ESCRITURA.map(tipo => (
                  <SelectItem key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={estatusFilter} onValueChange={(v) => { setEstatusFilter(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-full sm:w-45 text-sm">
                <SelectValue placeholder="Estatus" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estatus</SelectItem>
                {ESTATUS_CONFIG.map(status => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-sm">
                <X className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Limpiar</span>
                <span className="sm:hidden">Limpiar</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="shadow-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-premium">
            <thead>
              <tr>
                <th>Folio / Número</th>
                <th>Tipo</th>
                <th className="hidden md:table-cell">Persona(s)</th>
                <th className="hidden lg:table-cell">Teléfono</th>
                <th>
                  <button
                    onClick={() => toggleSort('total')}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    Total
                    <ArrowUpDown className={cn(
                      "h-3 w-3",
                      sortBy === 'total' && "text-primary"
                    )} />
                  </button>
                </th>
                <th>Estatus</th>
                <th className="hidden sm:table-cell">
                  <button
                    onClick={() => toggleSort('fecha')}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    Fecha firma
                    <ArrowUpDown className={cn(
                      "h-3 w-3",
                      sortBy === 'fecha' && "text-primary"
                    )} />
                  </button>
                </th>
                <th className="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {/* {paginatedEscrituras.map((escritura) => (
                <tr key={escritura.id}>
                  <td>
                    <div>
                      <Link 
                        to={`/escrituras/${escritura.id}`}
                        className="font-medium hover:text-primary transition-colors"
                      >
                        {escritura.folioInterno}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        Esc. #{escritura.numeroEscritura}
                      </p>
                    </div>
                  </td>
                  <td className="text-sm">
                    {getTipoLabel(escritura.tipo)}
                  </td>
                  <td className="hidden md:table-cell">
                    <p className="text-sm">{escritura.personaA.nombre}</p>
                    {escritura.personaB && (
                      <p className="text-xs text-muted-foreground">
                        {escritura.personaB.nombre}
                      </p>
                    )}
                  </td>
                  <td className="hidden lg:table-cell text-sm text-muted-foreground">
                    <p>{escritura.personaA.telefono}</p>
                    {escritura.personaB && (
                      <p>{escritura.personaB.telefono}</p>
                    )}
                  </td>
                  <td>
                    <Money amount={escritura.presupuesto.totalFinal} className="text-sm" />
                  </td>
                  <td>
                    <StatusBadge status={escritura.estatus} />
                  </td>
                  <td className="hidden sm:table-cell text-sm">
                    {escritura.fechaFirma ? (
                      format(escritura.fechaFirma, "dd MMM yyyy", { locale: es })
                    ) : (
                      <span className="text-muted-foreground italic">Pendiente</span>
                    )}
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/escrituras/${escritura.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/escrituras/${escritura.id}/editar`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(escritura.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))} */}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {escrituras.length === 0 && (
          <div className="text-center py-16">
            <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="font-medium mb-1">
              {hasFilters ? 'No se encontraron resultados' : 'No hay escrituras'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {hasFilters
                ? 'Intente con otros filtros de búsqueda'
                : 'Comience creando su primera escritura'}
            </p>
            {hasFilters ? (
              <Button variant="outline" onClick={clearFilters}>
                Limpiar filtros
              </Button>
            ) : (
              <Button asChild className="btn-accent">
                <Link href="/escrituras/nueva">
                  <Plus className="mr-2 h-4 w-4" />
                  Crear primera escritura
                </Link>
              </Button>
            )}
          </div>
        )}

        {/* Pagination */}
        {/* {totalPages > 1 && (
          <div className="flex items-center justify-between border-t px-4 py-3">
            <p className="text-sm text-muted-foreground">
              Mostrando {((currentPage - 1) * ITEMS_PER_PAGE) + 1} a{' '}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredEscrituras.length)} de{' '}
              {filteredEscrituras.length}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium px-2">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )} */}
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar esta escritura?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La escritura será eliminada permanentemente del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
