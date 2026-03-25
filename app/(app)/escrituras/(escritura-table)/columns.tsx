"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import {  ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Usa tu badge real si ya lo tienes:
import { StatusBadge } from "@/features/escrituras/components/StatusBadge";
import type { DeedTable } from "@/features/shared/types";
import { deleteEscritura } from "@/features/escrituras/action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export const deleteDeed = async (id: string) => {
  try {
    await deleteEscritura(id);
    toast.success("Escritura eliminada");
  } catch {
    toast.error("No se pudo eliminar la escritura. Inténtelo de nuevo.");
  }
};


export const columnsList: ColumnDef<DeedTable>[] = [
  {
    accessorKey: "folio",
    header: () => <span>Folio / Número</span>,
    enableGlobalFilter: true,
    cell: ({ row }) => {
      const folio = row.getValue("folio") as string;
      // const deedNumber = row.getValue("deedNumber") as string | null;

      return (
        <div className="leading-tight">
          <div className="font-medium text-foreground">{folio}</div>
          {/* <div className="text-xs text-muted-foreground">
                        {deedNumber ? `Esc. #${deedNumber}` : <span className="italic">Esc. pendiente</span>}
                    </div> */}
        </div>
      );
    },
  },
  {
    accessorKey: "deedNumber",
    header: () => <span>Número de escritura</span>,
    enableGlobalFilter: true,
    cell: ({ row }) => {
      const deedNumber = row.getValue("deedNumber") as string;
      // const deedNumber = row.getValue("deedNumber") as string | null;

      return (
        <div className="leading-tight">
          <div className="font-medium text-foreground">
            {deedNumber ? '#' + deedNumber : '-----'}
          </div>
          {/* <div className="text-xs text-muted-foreground">
                        {deedNumber ? `Esc. #${deedNumber}` : <span className="italic">Esc. pendiente</span>}
                    </div> */}
        </div>
      );
    },
  },

  {
    accessorKey: "typeLabel",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tipo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-sm text-foreground">
        {row.getValue("typeLabel") as string}
      </div>
    ),
  },
  {
    id: "participants",
    header: () => <span>Persona(s)</span>,
    enableGlobalFilter: true,
    accessorFn: (row) =>
      (row.participants ?? [])
        .map((p: { name: string }) => p.name)
        .join(" "),
    meta: {
      thClassName: "hidden md:table-cell",
      tdClassName: "hidden md:table-cell",
    },
    cell: ({ row }) => {
      const participants = row.original.participants ?? [];

      const a = participants.find((p) => p.side === "A") ?? participants[0];
      const b = participants.find((p) => p.side === "B");

      return (
        <div className="leading-tight">
          <div className="text-sm font-medium text-foreground">
            {a?.name ?? "—"}
          </div>
          {b?.name ? (
            <div className="text-xs text-muted-foreground">{b.name}</div>
          ) : null}
        </div>
      );
    },
  },

  // {
  //     id: "phones",
  //     header: () => <span>Teléfono</span>,
  //     meta: { thClassName: "hidden lg:table-cell", tdClassName: "hidden lg:table-cell" },
  //     cell: ({ row }) => {
  //         const participants = (row.getValue("participants") ?? []) as {
  //             phone?: string | null;
  //             side?: "A" | "B";
  //         }[];

  //         const a = participants.find((p) => p.side === "A") ?? participants[0];
  //         const b = participants.find((p) => p.side === "B");

  //         return (
  //             <div className="leading-tight text-muted-foreground">
  //                 <div className="text-sm">{a?.phone ?? "—"}</div>
  //                 {b?.phone ? <div className="text-sm">{b.phone}</div> : null}
  //             </div>
  //         );
  //     },
  // },

  // {
  //   accessorKey: "baseValue",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         Valor Base
  //         <ArrowUpDown className="ml-2 h-4 w-4" />
  //       </Button>
  //     );
  //   },
  //   meta: { thClassName: "text-right", tdClassName: "text-right" },
  //   cell: ({ row }) => {
  //     const raw = row.getValue("baseValue");
  //     const value = Number(raw ?? 0);

  //     const formatted = new Intl.NumberFormat("es-MX", {
  //       style: "currency",
  //       currency: "MXN",
  //     }).format(Number.isFinite(value) ? value : 0);

  //     return <div className="font-semibold text-foreground">{formatted}</div>;
  //   },
  // },

  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Estatus
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    filterFn: (row, columnId, filterValue: string) => {
      if (!filterValue) return true;
      const status = row.getValue(columnId) as string;
      return status.toLowerCase() === filterValue.toLowerCase();
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return <StatusBadge status={status.toLowerCase() as any} />;
    },
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Fecha firma <ArrowUpDown className="h-3 w-3" />
      </button>
    ),
    meta: {
      thClassName: "hidden sm:table-cell",
      tdClassName: "hidden sm:table-cell",
    },
    cell: ({ row }) => {
      const raw = row.getValue("createdAt");
      const date =
        raw instanceof Date
          ? raw
          : typeof raw === "string"
            ? new Date(raw)
            : null;

      if (!date || isNaN(date.getTime())) {
        return <span className="text-muted-foreground italic">Pendiente</span>;
      }

      const formatted = new Intl.DateTimeFormat("es-MX", {
        day: "2-digit",
        month: "numeric",
        year: "numeric",
      }).format(date);

      return <span className="text-sm">{formatted}</span>;
    },
  },

  // {
  //   id: "actions",
  //   header: () => <span className="sr-only">Acciones</span>,
  //   meta: { thClassName: "text-right", tdClassName: "text-right" },
  //   cell: ({ row, table }) => {
  //     const deed = row.original; // <- aquí ya tienes la fila completa
  //     const id = deed.id;

  //     return (
  //       <div className="flex items-center justify-end gap-1">
  //         <Button variant="ghost" size="icon" asChild>
  //           <Link href={`/escrituras/${id}`}>
  //             <Eye className="h-4 w-4" />
  //           </Link>
  //         </Button>

  //         <Button variant="ghost" size="icon" asChild>
  //           <Link href={`/escrituras/${id}/edit`}>
  //             <Pencil className="h-4 w-4" />
  //           </Link>
  //         </Button>
  //         <Button
  //           variant="ghost"
  //           size="icon"
  //           className="text-destructive hover:text-destructive cursor-pointer"
  //           onClick={() => {
  //             (table.options.meta as any)?.confirm?.({
  //               title: "¿Eliminar escritura?",
  //               description: `Se eliminará la escritura #${
  //                 (deed as DeedTable).folio ?? "sin número"
  //               }. Esta acción no se puede deshacer.`,
  //               onConfirm: async () => {
  //                 await deleteDeed((deed as any).id);
  //                 toast.success("Escritura eliminada");
  //               },
  //             });
  //           }}
  //         >
  //           <Trash2 className="h-4 w-4" />
  //         </Button>
  //       </div>
  //     );
  //   },
  // },
  {
    id: "actions",
    header: () => <span className="sr-only">Acciones</span>,
    meta: {
      thClassName: "text-right",
      tdClassName: "text-right",
    },
    cell: ({ row, table }) => {
      const deed = row.original as DeedTable;
      const id = deed.id;

      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 data-[state=open]:bg-muted"
              >
                <span className="sr-only">Abrir menú</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>

              <DropdownMenuItem asChild>
                <Link href={`/escrituras/${id}`} className="cursor-pointer">
                  <span>Ver</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href={`/escrituras/${id}/edit`}
                  className="cursor-pointer"
                >
                  <span>Editar</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive"
                onClick={() => {
                  (table.options.meta as any)?.confirm?.({
                    title: "¿Eliminar escritura?",
                    description: `Se eliminará la escritura #${deed.folio ?? "sin número"
                      }. Esta acción no se puede deshacer.`,
                    onConfirm: async () => {
                      await deleteDeed(id);
                    },
                  });
                }}
              >
                <span>Eliminar</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
