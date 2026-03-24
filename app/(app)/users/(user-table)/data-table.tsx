"use client";

import React, { useState } from "react";
import z from "zod";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowLeft, ArrowRight, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

import { CreateUserSchema } from "@/features/users/schema";
import { UserRole } from "@/features/shared/types";
import { postUser } from "@/features/users/action";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  currentUserId: string;
}

type ConfirmOptions = {
  title: string;
  description: string;
  onConfirm: () => void | Promise<void>;
};

export function DataTableUser<TData, TValue>({
  columns,
  data,
  currentUserId,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();

  const [dialogOpen, setDialogOpen] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("¿Estás seguro?");
  const [confirmDescription, setConfirmDescription] = useState(
    "Esta acción no se puede deshacer."
  );
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const confirmRef = useState<{ current: null | (() => void | Promise<void>) }>(
    { current: null }
  )[0];
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const form = useForm<z.infer<typeof CreateUserSchema>>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      password: "",
      role: "user" as UserRole,
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const openNew = () => {
    form.reset();
    setDialogOpen(true);
  };

  const confirm = ({ title, description, onConfirm }: ConfirmOptions) => {
    setConfirmTitle(title);
    setConfirmDescription(description);
    confirmRef.current = onConfirm;
    setConfirmOpen(true);
  };

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
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error al confirmar la acción");
    } finally {
      setConfirmLoading(false);
      confirmRef.current = null;
    }
  };

  const handleSubmit = async (values: z.infer<typeof CreateUserSchema>) => {
    try {
      await postUser(values);
      toast.success("Usuario creado");
      setDialogOpen(false);
      form.reset();
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Error al crear el usuario");
    }
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
      columnFilters,
    },
    meta: {
      currentUserId,
      confirm,
      refreshTable: () => router.refresh(),
    },
  });
  const hasFilters =
    table.getState().columnFilters.length > 0 ||
    !!table.getState().globalFilter;

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h1 className="font-serif text-2xl font-bold lg:text-3xl">
              Usuarios
            </h1>
            <p className="text-muted-foreground">
              Administrar usuarios del sistema
            </p>
          </div>

          <Button onClick={openNew} className="btn-accent cursor-pointer">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo usuario
          </Button>
        </div>
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
                        (table.getColumn("role")?.getFilterValue() as string) ?? ""
                      }
                      onValueChange={(value) =>
                        table.getColumn("role")?.setFilterValue(value as string)
                      }
                    >
                      <SelectTrigger className="w-full max-w-48">
                        <SelectValue placeholder="Roles" />
                      </SelectTrigger>
        
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Roles</SelectLabel>
        
                          
                            <div>
                              {}
                              <SelectItem value='admin'>
                                Administrador
                              </SelectItem>
                              <SelectItem value='user'>
                                Operador
                              </SelectItem>
                            </div>
                         
        
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


        <div>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-b border-slate-200 hover:bg-transparent"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="h-14 px-6 text-left align-middle"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="border-b border-slate-200 hover:bg-slate-50/50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="px-6 py-5 align-middle"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-slate-500"
                  >
                    No hay resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Nuevo Usuario</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Controller
                name="fullName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="fullName">Nombre completo</FieldLabel>
                    <Input
                      {...field}
                      id="fullName"
                      type="text"
                      placeholder="Ingrese su nombre completo"
                      disabled={form.formState.isSubmitting}
                    />
                    {fieldState.error?.message && (
                      <p className="text-sm text-destructive">
                        {fieldState.error.message}
                      </p>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="username"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="username">Usuario</FieldLabel>
                    <Input
                      {...field}
                      id="username"
                      type="text"
                      placeholder="Ingrese su usuario"
                      disabled={form.formState.isSubmitting}
                    />
                    {fieldState.error?.message && (
                      <p className="text-sm text-destructive">
                        {fieldState.error.message}
                      </p>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="Ingrese su email"
                      disabled={form.formState.isSubmitting}
                    />
                    {fieldState.error?.message && (
                      <p className="text-sm text-destructive">
                        {fieldState.error.message}
                      </p>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                    <Input
                      {...field}
                      id="password"
                      type="password"
                      placeholder="Ingrese su contraseña"
                      disabled={form.formState.isSubmitting}
                    />
                    {fieldState.error?.message && (
                      <p className="text-sm text-destructive">
                        {fieldState.error.message}
                      </p>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="role"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="role">Rol</FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={form.formState.isSubmitting}
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
                      <p className="text-sm text-destructive">
                        {fieldState.error.message}
                      </p>
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
                onClick={() => setDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                className="btn-accent cursor-pointer"
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Creando..." : "Crear"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={confirmLoading}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={confirmLoading}
            >
              {confirmLoading ? "Confirmando..." : "Confirmar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}