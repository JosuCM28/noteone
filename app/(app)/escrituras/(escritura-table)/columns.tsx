"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Trash2, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Usa tu badge real si ya lo tienes:
import { StatusBadge } from "@/features/escrituras/components/StatusBadge";
import type { DeedTable } from "@/features/shared/types";

export const columnsList: ColumnDef<DeedTable>[] = [
    {
        accessorKey: "folio",
        header: () => <span>Folio / Número</span>,
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
            )
        },
        cell: ({ row }) => (
            <div className="text-sm text-foreground">{row.getValue("typeLabel") as string}</div>
        ),
    },

    {
        accessorKey: "participants",
        header: () => <span>Persona(s)</span>,
        meta: { thClassName: "hidden md:table-cell", tdClassName: "hidden md:table-cell" },
        cell: ({ row }) => {
            const participants = (row.getValue("participants") ?? []) as {
                name: string;
                phone?: string | null;
                side?: "A" | "B";
            }[];

            const a = participants.find((p) => p.side === "A") ?? participants[0];
            const b = participants.find((p) => p.side === "B");

            return (
                <div className="leading-tight">
                    <div className="text-sm font-medium text-foreground">{a?.name ?? "—"}</div>
                    {b?.name ? <div className="text-xs text-muted-foreground">{b.name}</div> : null}
                </div>
            );
        },
    },

    {
        id: "phones",
        header: () => <span>Teléfono</span>,
        meta: { thClassName: "hidden lg:table-cell", tdClassName: "hidden lg:table-cell" },
        cell: ({ row }) => {
            const participants = (row.getValue("participants") ?? []) as {
                phone?: string | null;
                side?: "A" | "B";
            }[];

            const a = participants.find((p) => p.side === "A") ?? participants[0];
            const b = participants.find((p) => p.side === "B");

            return (
                <div className="leading-tight text-muted-foreground">
                    <div className="text-sm">{a?.phone ?? "—"}</div>
                    {b?.phone ? <div className="text-sm">{b.phone}</div> : null}
                </div>
            );
        },
    },

    {
        accessorKey: "baseValue",
         header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Valor Base
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        meta: { thClassName: "text-right", tdClassName: "text-right" },
        cell: ({ row }) => {
            const raw = row.getValue("baseValue");
            const value = Number(raw ?? 0);

            const formatted = new Intl.NumberFormat("es-MX", {
                style: "currency",
                currency: "MXN",
            }).format(Number.isFinite(value) ? value : 0);

            return <div className="font-semibold text-foreground">{formatted}</div>;
        },
    },

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
            )
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
                className="flex items-center gap-1 hover:text-foreground transition-colors"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Fecha firma <ArrowUpDown className="h-3 w-3" />
            </button>
        ),
        meta: { thClassName: "hidden sm:table-cell", tdClassName: "hidden sm:table-cell" },
        cell: ({ row }) => {
            const raw = row.getValue("createdAt");
            const date = raw instanceof Date ? raw : typeof raw === "string" ? new Date(raw) : null;

            if (!date || isNaN(date.getTime())) {
                return <span className="text-muted-foreground italic">Pendiente</span>;
            }

            const formatted = new Intl.DateTimeFormat("es-MX", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }).format(date);

            return <span className="text-sm">{formatted}</span>;
        },
    },

    {

        id: "actions",
        header: () => <span className="sr-only">Acciones</span>,
        meta: { thClassName: "text-right", tdClassName: "text-right" },
        cell: ({ row }) => {
            const id = row.original.id;

            return (
                <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/escrituras/${id}`}>
                            <Eye className="h-4 w-4" />
                        </Link>
                    </Button>

                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/escrituras/${id}/editar`}>
                            <Pencil className="h-4 w-4" />
                        </Link>
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                            // aquí abres tu AlertDialog con setDeleteId(id)
                            console.log("delete", id);
                        }}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            );
        },
    },

];