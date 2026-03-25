'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  User,
  Phone,
  FileText,
  MessageSquare,
  MessageCircle,
  CheckCircle,
  LucideHistory,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { toast } from 'sonner';

import { StatusBadge } from '../components/StatusBadge';
import { BudgetBreakdown } from '../components/BudgetBreakdown';
import { WhatsAppModal } from '../components/WhatsAppModal';
import { PDFActionsPanel } from '../components/PDFActionsPanel';

import { ESTATUS_CONFIG, TIPOS_ESCRITURA } from '@/features/shared/data/mock-data';
import type { EstatusEscritura } from '@/features/shared/types';
import { getEscrituraForView, updateEscrituraStatus, deleteEscritura } from '../action';
import { getStatusLabel } from '@/lib/utils';

type Escritura = Awaited<ReturnType<typeof getEscrituraForView>>;

type EscrituraDetailProps = {
  escritura: Escritura | null;
};

export default function EscrituraDetail({ escritura }: EscrituraDetailProps) {
  const _params = useParams<{ id: string }>();
  const router = useRouter();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  // ✅ Dialog controlado solo para abrir/cerrar
  const [showAuditDialog, setShowAuditDialog] = useState(false);

  // ------- Normalización de datos -------
  const participants = useMemo(() => (escritura?.participants ?? []), [escritura]);
  const a = useMemo(() => participants.filter((p) => p.side === 'A') ?? [], [participants]);
  const b = useMemo(() => participants.filter((p) => p.side === 'B') ?? [], [participants]);

  const reciboEnviado = false;

  // ✅ NO regreses {} en un componente de React
  if (!escritura) return null;

  const tipoConfig = useMemo(
    () => TIPOS_ESCRITURA.find((t) => t.value === (escritura.type || null)),
    [escritura.type]
  );

  const rolesDisponibles = useMemo(() => {
    if (!tipoConfig) return ['Participante'];
    return [
      tipoConfig.personaALabel,
      ...(tipoConfig.personaBLabel ? [tipoConfig.personaBLabel] : []),
    ];
  }, [tipoConfig]);

  // Si no existe, pantalla 404 friendly
  if (!escritura) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Escritura no encontrada</h2>
        <p className="text-muted-foreground mb-4">
          La escritura que busca no existe o ha sido eliminada.
        </p>
        <Button asChild>
          <Link href="/escrituras">Volver a escrituras</Link>
        </Button>
      </div>
    );
  }

  const showSendButton = !reciboEnviado;

  const handleStatusChange = async (newStatus: EstatusEscritura) => {
    await updateEscrituraStatus(escritura.id, newStatus);
    router.refresh();
    toast.success(`Estatus actualizado a: ${getStatusLabel(newStatus)}`);
  };

  const handleDelete = async () => {
    try {
      await deleteEscritura(escritura.id);
      toast.success('Escritura eliminada correctamente');
      router.push('/escrituras');
    } catch {
      toast.error('No se pudo eliminar la escritura. Inténtelo de nuevo.');
    }
  };

  const handleSendWhatsApp = async () => {
    toast.success('Recibo enviado por WhatsApp');
    setShowWhatsAppModal(false);
    router.refresh();
  };

  // ✅ Datos para la tabla: vienen DIRECTO de tu nueva action getEscrituraForView
  const auditRows = (escritura as any).auditLogs ?? [];

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in px-4 sm:px-6 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <Button variant="ghost" size="icon" asChild className="shrink-0 cursor-pointer">
            <Link href="/escrituras">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight truncate">
                {escritura.folio}
              </h1>

              <StatusBadge status={escritura.status} />

              {reciboEnviado ? (
                <span className="inline-flex items-center gap-1 text-xs text-success bg-success/10 px-2 py-1 rounded-full border border-success/20">
                  <CheckCircle className="h-3 w-3" />
                  Recibo enviado
                </span>
              ) : null}
            </div>

            <p className="text-sm sm:text-base text-muted-foreground mt-1 truncate">
              Escritura #{escritura.deedNumber ?? 'en proceso'} • {escritura.typeLabel}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Select value={escritura.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full sm:w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ESTATUS_CONFIG.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex-1 min-w-0" />

          {showSendButton ? (
            <Button
              variant="outline"
              className="cursor-pointer text-success border-success hover:bg-success/10 hover:text-success w-full sm:w-auto"
              onClick={() => setShowWhatsAppModal(true)}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">
                {reciboEnviado ? 'Reenviar recibo' : 'Enviar recibo'}
              </span>
              <span className="sm:hidden">Recibo</span>
            </Button>
          ) : null}

          {/* ✅ Dialog Bitácora (usa escritura.auditLogs) */}
          <Dialog open={showAuditDialog} onOpenChange={setShowAuditDialog}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full sm:w-auto hover:bg-primary/10 cursor-pointer hover:text-black"
              >
                <LucideHistory className="h-4 w-4 mr-2" />
                Bitácora
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 font-serif">
                  <LucideHistory className="h-5 w-5 text-primary" />
                  Bitácora de Actividad
                </DialogTitle>
              </DialogHeader>

              <div className="rounded-md border max-h-[60vh] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Detalle</TableHead>
                      <TableHead className="whitespace-nowrap">Fecha</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {auditRows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center text-muted-foreground">
                          No hay registros
                        </TableCell>
                      </TableRow>
                    ) : (
                      auditRows.map((r: any, i: number) => (
                        <TableRow key={`${String(r.createdAt)}-${i}`}>
                          <TableCell className="whitespace-pre-wrap">{r.details ?? '—'}</TableCell>
                          <TableCell className="whitespace-nowrap">
                            {new Date(r.createdAt).toLocaleString('es-MX')}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" asChild className="w-full sm:w-auto cursor-pointer">
            <Link href={`/escrituras/${escritura.id}/edit`}>
              <Pencil className="h-4 w-4 mr-2" />
              Editar
            </Link>
          </Button>

          <Button
            variant="outline"
            className="text-destructive hover:text-destructive hover:bg-destructive/10 w-full sm:w-auto cursor-pointer"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          {/* Datos Generales */}
          <Card className="shadow-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif">
                <FileText className="h-5 w-5 text-primary" />
                Datos Generales
              </CardTitle>
            </CardHeader>

            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Folio</p>
                <p className="font-medium">{escritura.folio}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Número de Escritura</p>
                <p className="font-medium">{escritura.deedNumber}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Tipo</p>
                <p className="font-medium">{escritura.typeLabel}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Estatus</p>
                <p className="font-medium">{getStatusLabel(escritura.status)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Personas */}
          <Card className="shadow-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif">
                <User className="h-5 w-5 text-primary" />
                Personas Involucradas
              </CardTitle>
            </CardHeader>

            <CardContent className="grid gap-4 sm:grid-cols-4">
              {Math.max(a.length, b.length) === 0 ? (
                <p className="sm:col-span-4 text-sm text-muted-foreground text-center">
                  No se encontraron participantes
                </p>
              ) : (
                Array.from({ length: Math.max(a.length, b.length) }).map((_, i) => {
                  const pa = a[i];
                  const pb = b[i];

                  return (
                    <div key={i} className="contents">
                      {/* A */}
                      <div className="rounded-lg border p-4 sm:col-span-2 sm:col-start-1 flex flex-col">
                        {pa ? (
                          <>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                              {pa.role ?? 'Parte A'}
                            </p>
                            <p className="font-semibold">{pa.name ?? '—'}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                              <Phone className="h-3 w-3" />
                              {pa.phone ?? '—'}
                            </p>
                          </>
                        ) : (
                          <p className="text-sm text-muted-foreground text-center">— (sin Parte A)</p>
                        )}
                      </div>

                      {/* B */}
                      <div className="rounded-lg border p-4 sm:col-span-2 sm:col-start-3 flex flex-col">
                        {pb ? (
                          <>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                              {pb.role ?? 'Parte B'}
                            </p>
                            <p className="font-semibold">{pb.name ?? '—'}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                              <Phone className="h-3 w-3" />
                              {pb.phone ?? '—'}
                            </p>
                          </>
                        ) : (
                          <p className="text-sm text-muted-foreground text-center">— (sin Parte B)</p>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Notas */}
          {escritura.notes ? (
            <Card className="shadow-premium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Notas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{escritura.notes}</p>
              </CardContent>
            </Card>
          ) : null}
        </div>

        {/* Sidebar */}
        <div>
          <div className="space-y-6 sticky top-20">
            <Card className="shadow-premium">
              <CardHeader>
                <CardTitle className="font-serif">Presupuesto</CardTitle>
              </CardHeader>
              <CardContent>
                <BudgetBreakdown
                  presupuesto={{
                    baseValue: escritura.baseValue,
                    totalA: escritura.totalA,
                    totalB: escritura.totalB,
                    taxes: escritura.deedTax,
                    rolesDisponibles: rolesDisponibles,
                  }}
                />
              </CardContent>
            </Card>

            <PDFActionsPanel
              deedId={escritura.id}
              folio={escritura.folio}
              hasParticipantesB={b.length > 0}
            />
          </div>
        </div>
      </div>

      {/* Delete dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar esta escritura?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La escritura <strong>{escritura.folio}</strong>{' '}
              será eliminada permanentemente del sistema.
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

      {/* WhatsApp modal */}
      <WhatsAppModal
        open={showWhatsAppModal}
        onOpenChange={setShowWhatsAppModal}
        deedId={escritura.id}
        folio={escritura.folio}
        participants={escritura.participants}
        onSend={handleSendWhatsApp}
        onSkip={() => setShowWhatsAppModal(false)}
        isResend={reciboEnviado}
      />
    </div>
  );
}