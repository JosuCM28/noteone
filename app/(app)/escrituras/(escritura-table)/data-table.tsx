"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,

} from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ESTATUS_CONFIG, TIPOS_ESCRITURA } from "@/features/shared/data/mock-data";
import Link from "next/link";

interface DataTableDeedProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];

}

export function DataTableDeed<TData, TValue>({ columns, data }: DataTableDeedProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const confirmRef = React.useRef<null | (() => void | Promise<void>)>(null);
  const [confirmTitle, setConfirmTitle] = React.useState<string>("¿Estás seguro?");
  const [confirmDescription, setConfirmDescription] = React.useState<string>("Esta acción no se puede deshacer.");
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [globalFilter, setGlobalFilter] = React.useState("");


  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      globalFilter,
      columnFilters,
    },
    meta: {
      confirm: ({
        title,
        description,
        onConfirm,
      }: {
        title?: string;
        description?: string;
        onConfirm: () => void | Promise<void>;
      }) => {
        confirmRef.current = onConfirm;
        setConfirmTitle(title ?? "¿Estás seguro?");
        setConfirmDescription(description ?? "Esta acción no se puede deshacer.");
        setConfirmOpen(true);
      },
      toast,
    } as any,
  });
  const hasFilters =
    table.getState().columnFilters.length > 0 ||
    !!table.getState().globalFilter;

  const handleConfirm = async () => {
    const fn = confirmRef.current;
    if (!fn) {
      setConfirmOpen(false);
      return;
    }

    try {
      setConfirmLoading(true);
      await fn();
      setConfirmOpen(false);
    } catch (e) {
      // La acción ya debería manejar su propio toast/error si quieres.
    } finally {
      setConfirmLoading(false);
      confirmRef.current = null;
    }
  };

  return (

    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 ">
        <div className="flex-1 min-w-0">
          <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
            Escrituras
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Consulta todas las escrituras
          </p>
        </div>
        <Button asChild className="btn-accent w-full sm:w-fit">
          <Link href="/escrituras/new">
            <Plus className="mr-2 h-4 w-4" />
            Nueva escritura
          </Link>
        </Button>
      </div>
      <div className=" overflow-hidden rounded-xl border">
        <div className="flex items-center p-4 justify-between">
          <div className="flex gap-4">
            <Input
              placeholder="Buscar..."
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="max-w-lg w-100  "
            />
            <Select
              value={
                (table.getColumn("typeLabel")?.getFilterValue() as string) ?? ""
              }
              onValueChange={(value) =>
                table.getColumn("typeLabel")?.setFilterValue(value as string)
              }
            >
              <SelectTrigger className="w-full max-w-48">
                <SelectValue placeholder="Tipo de escritura" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Tipos</SelectLabel>

                  {TIPOS_ESCRITURA.map((t) => (
                    <div key={t.value}>
                      <SelectItem value={t.label}>
                        {t.label}
                      </SelectItem>
                    </div>
                  ))}

                </SelectGroup>
              </SelectContent>
            </Select>

            <Select
              value={
                (table.getColumn("status")?.getFilterValue() as string) ?? ""
              }
              onValueChange={(value) =>
                table.getColumn("status")?.setFilterValue(value as string)
              }
            >
              <SelectTrigger className="w-full max-w-48">
                <SelectValue placeholder="Tipo de escritura" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Estatus</SelectLabel>

                  {ESTATUS_CONFIG.map((t) => (
                    <div key={t.value}>
                      <SelectItem value={t.label}>
                        {t.label}
                      </SelectItem>
                    </div>
                  ))}

                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {hasFilters && (
            <Button
              variant="destructive"
              className="cursor-pointer"
              onClick={() => {
                table.resetColumnFilters();
                table.resetGlobalFilter();
              }}
            >
              <Trash2 className="h-4 w-4" />
              Limpiar filtros
            </Button>
          )}
        </div>
        <div className="overflow-x-auto">

          {/* IMPORTANTE: usamos table-premium como en tu tabla original */}
          <table className="table-premium w-full">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((header) => (
                    <th
                      key={header.id}
                      className={cn(
                        "uppercase tracking-wide text-xs text-muted-foreground font-semibold",
                        (header.column.columnDef as any).meta?.thClassName
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-muted/40 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={cn(
                          "py-5 align-middle",
                          (cell.column.columnDef as any).meta?.tdClassName
                        )}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                    No se encontraron resultados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex items-center justify-end space-x-2 py-4 gap-2 pr-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4 cursor-pointer" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="cursor-pointer"
            >
              <ArrowRight className="h-4 w-4 cursor-pointer" />
            </Button>
          </div>
        </div>

        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{confirmTitle}</AlertDialogTitle>
              <AlertDialogDescription>{confirmDescription}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={confirmLoading}>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirm} disabled={confirmLoading}>
                {confirmLoading ? "Confirmando..." : "Confirmar"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}