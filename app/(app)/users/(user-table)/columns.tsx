"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserRawTable } from "@/features/shared/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { deleteUser, updateUser, resetUserPassword } from "@/features/users/action";
import { toast } from "sonner";
import { UserStatusSwitch } from "@/features/users/components/user-status-swtich";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UpdateUserSchema,
  UpdateUserInput,
  ResetPasswordSchema,
  ResetPasswordInput,
} from "@/features/users/schema";

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
      className="h-auto p-0 cursor-pointer text-[13px] font-semibold uppercase tracking-wide text-slate-500 hover:bg-transparent hover:text-slate-700"
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

function ActionsCell({
  user,
  meta,
}: {
  user: UserRawTable;
  meta: TableMetaUsers | undefined;
}) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

  const editForm = useForm<UpdateUserInput>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      fullName: user.name ?? "",
      username: user.username ?? "",
      email: user.email ?? "",
      role: user.role as "admin" | "user",
    },
  });

  const resetForm = useForm<ResetPasswordInput>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleEdit = async (values: UpdateUserInput) => {
    try {
      await updateUser(user.id, values);
      toast.success("Usuario actualizado");
      setEditOpen(false);
      router.refresh();
    } catch {
      toast.error("Error al actualizar el usuario");
    }
  };

  const handleResetPassword = async (values: ResetPasswordInput) => {
    try {
      await resetUserPassword(user.id, values);
      toast.success("Contraseña restablecida correctamente");
      setResetOpen(false);
      resetForm.reset();
    } catch {
      toast.error("Error al restablecer la contraseña");
    }
  };

  return (
    <>
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 cursor-pointer data-[state=open]:bg-muted"
            >
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                editForm.reset({
                  fullName: user.name ?? "",
                  username: user.username ?? "",
                  email: user.email ?? "",
                  role: user.role as "admin" | "user",
                });
                setEditOpen(true);
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                resetForm.reset();
                setResetOpen(true);
              }}
            >
              Restablecer contraseña
            </DropdownMenuItem>
            <DropdownMenuSeparator />
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

      {/* Diálogo de edición */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <form onSubmit={editForm.handleSubmit(handleEdit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Editar Usuario</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Controller
                name="fullName"
                control={editForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="fullName">Nombre completo</FieldLabel>
                    <Input
                      {...field}
                      id="fullName"
                      type="text"
                      placeholder="Ingrese su nombre completo"
                      disabled={editForm.formState.isSubmitting}
                    />
                    {fieldState.error?.message && (
                      <p className="text-sm text-destructive">{fieldState.error.message}</p>
                    )}
                  </Field>
                )}
              />
              <Controller
                name="username"
                control={editForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="username">Usuario</FieldLabel>
                    <Input
                      {...field}
                      id="username"
                      type="text"
                      placeholder="Ingrese su usuario"
                      disabled={editForm.formState.isSubmitting}
                    />
                    {fieldState.error?.message && (
                      <p className="text-sm text-destructive">{fieldState.error.message}</p>
                    )}
                  </Field>
                )}
              />
              <Controller
                name="email"
                control={editForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="Ingrese su email"
                      disabled={editForm.formState.isSubmitting}
                    />
                    {fieldState.error?.message && (
                      <p className="text-sm text-destructive">{fieldState.error.message}</p>
                    )}
                  </Field>
                )}
              />
              <Controller
                name="role"
                control={editForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="role">Rol</FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={editForm.formState.isSubmitting}
                    >
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Seleccione un rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="user">Operador</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.error?.message && (
                      <p className="text-sm text-destructive">{fieldState.error.message}</p>
                    )}
                  </Field>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                className="cursor-pointer"
                onClick={() => setEditOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                className="btn-accent cursor-pointer"
                type="submit"
                disabled={editForm.formState.isSubmitting}
              >
                {editForm.formState.isSubmitting ? "Guardando..." : "Guardar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo de restablecer contraseña */}
      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent>
          <form onSubmit={resetForm.handleSubmit(handleResetPassword)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Restablecer Contraseña</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Controller
                name="password"
                control={resetForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="new-password">Nueva contraseña</FieldLabel>
                    <Input
                      {...field}
                      id="new-password"
                      type="password"
                      placeholder="Ingrese la nueva contraseña"
                      disabled={resetForm.formState.isSubmitting}
                    />
                    {fieldState.error?.message && (
                      <p className="text-sm text-destructive">{fieldState.error.message}</p>
                    )}
                  </Field>
                )}
              />
              <Controller
                name="confirmPassword"
                control={resetForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="confirm-password">Confirmar contraseña</FieldLabel>
                    <Input
                      {...field}
                      id="confirm-password"
                      type="password"
                      placeholder="Confirme la nueva contraseña"
                      disabled={resetForm.formState.isSubmitting}
                    />
                    {fieldState.error?.message && (
                      <p className="text-sm text-destructive">{fieldState.error.message}</p>
                    )}
                  </Field>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                className="cursor-pointer"
                onClick={() => setResetOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                className="btn-accent cursor-pointer"
                type="submit"
                disabled={resetForm.formState.isSubmitting}
              >
                {resetForm.formState.isSubmitting ? "Restableciendo..." : "Restablecer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

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

      return <ActionsCell user={user} meta={meta} />;
    },
  },
];
