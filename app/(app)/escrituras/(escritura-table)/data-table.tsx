"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import React from "react";

interface DataTableDeedProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  
}

export function DataTableDeed<TData, TValue>({ columns, data }: DataTableDeedProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className=" overflow-hidden rounded-xl border">
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
    </div>
  );
}