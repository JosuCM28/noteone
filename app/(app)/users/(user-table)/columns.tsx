"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserRawTable } from "@/features/shared/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { deleteUser } from "@/features/users/action";
import { toast } from "sonner";
import { UserStatusSwitch } from "@/features/users/components/user-status-swtich";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function SortHeader({
  title,
  column,
}: {
  title: string;
  column: any;
}) {
  return (
    <Button
      variant="ghost"
      className="h-auto p-0 text-[13px] font-semibold uppercase tracking-wide text-slate-500 hover:bg-transparent hover:text-slate-700"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {title}
      <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
    </Button>
  );
}

type ConfirmOptions = {
  title: string;
  description: string;
  onConfirm: () => void | Promise<void>;
};

type TableMetaUsers = {
  currentUserId?: string;
  confirm?: (options: ConfirmOptions) => void;
  refreshTable?: () => void;
};

export const columnsUser: ColumnDef<UserRawTable>[] = [
  {
    accessorKey: "name",
    header: () => (
      <span className="text-[13px] font-semibold uppercase tracking-wide text-slate-500">
        nombre
      </span>
    ),
    cell: ({ row }) => (
      <div className="text-[15px] font-semibold text-slate-900">
        {row.getValue("name") as string}
      </div>
    ),
  },
  {
    accessorKey: "username",
    header: () => (
      <span className="text-[13px] font-semibold uppercase tracking-wide text-slate-500">
        Usuario
      </span>
    ),
    cell: ({ row }) => (
      <div className="text-[15px] text-slate-500">
        {((row.getValue("username") as string | null) ?? "-")}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: () => (
      <span className="text-[13px] font-semibold uppercase tracking-wide text-slate-500">
        Email
      </span>
    ),
    cell: ({ row }) => (
      <div className="text-[15px] text-slate-500">
        {row.getValue("email") as string}
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => <SortHeader title="Rol" column={column} />,
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      const isAdmin = role === "admin";

      return (
        <Badge
          variant="secondary"
          className={
            isAdmin
              ? "rounded-full bg-sky-100 px-3 py-1 text-[13px] font-medium text-sky-700 hover:bg-sky-100"
              : "rounded-full bg-stone-100 px-3 py-1 text-[13px] font-medium text-stone-700 hover:bg-stone-100"
          }
        >
          {isAdmin ? "Administrador" : "Operador"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: () => (
      <span className="text-[13px] font-semibold uppercase tracking-wide text-slate-500">
        Estado
      </span>
    ),
    cell: ({ row, table }) => {
      const user = row.original;
      const meta = table.options.meta as TableMetaUsers | undefined;
      const currentUserId = meta?.currentUserId;
      const isCurrentUser = user.id === currentUserId;

      return (
        <div className="flex items-center">
          <UserStatusSwitch
            userId={user.id}
            initialChecked={user.isActive}
            disabled={isCurrentUser}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <SortHeader title="Creado" column={column} />,
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as Date | string;

      return (
        <div className="text-[15px] text-slate-500">
          {format(new Date(createdAt), "dd MMM yyyy", { locale: es })}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Acciones</span>,
    cell: ({ row, table }) => {
      const user = row.original;
      const meta = table.options.meta as TableMetaUsers | undefined;

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

              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive"
                onClick={() => {
                  meta?.confirm?.({
                    title: "¿Eliminar usuario?",
                    description: `El usuario ${user.name ?? "sin nombre"} se eliminará permanentemente.`,
                    onConfirm: async () => {
                      await deleteUser(user.id);
                      toast.success("Usuario eliminado correctamente");
                      meta?.refreshTable?.();
                    },
                  });
                }}
              >
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];