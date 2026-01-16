'use client'
import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, Pencil, Trash2, User, Phone, 
  FileText, MessageSquare, Paperclip, History,
  MessageCircle, CheckCircle
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
import { StatusBadge } from '../components/StatusBadge';
import { BudgetBreakdown } from '../components/BudgetBreakdown';
import { AuditTimeline } from '../components/AuditTimeline';
import { AttachmentList } from '../components/AttachmentList';
import { WhatsAppModal } from '../components/WhatsAppModal';
import { TIPOS_ESCRITURA, ESTATUS_CONFIG } from '@/features/shared/data/mock-data';
import { Escritura, EstatusEscritura } from '@/features/shared/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';
import { useRouter } from 'next/router';

type EscrituraDetailProps = {
  escritura: Escritura;
};

export default function EscrituraDetail(
  { escritura }: EscrituraDetailProps
) {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);


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

  const tipoConfig = TIPOS_ESCRITURA.find(t => t.value === escritura.tipo);
  
  // Check if receipt needs to be sent (not sent or has been edited since last send)
  // const hasBeenEdited = escritura.bitacora.some(
  //   b => b.action === 'Edición de escritura' && 
  //   (!escritura.fechaUltimoEnvio || new Date(b.at) > new Date(escritura.fechaUltimoEnvio))
  // );
  const showResendButton = !escritura.reciboEnviado;

  const handleStatusChange = (newStatus: EstatusEscritura) => {
    // const statusLabel = ESTATUS_CONFIG.find(s => s.value === newStatus)?.label;
    // updateEscritura(escritura.id, { estatus: newStatus });
    // addBitacoraEntry(
    //   escritura.id,
    //   'Cambio de estatus',
    //   `Estatus actualizado a: ${statusLabel}`
    // );
    toast.success(`Estatus actualizado a: Pagado`);
  };

  const handleDelete = () => {
    // deleteEscritura(escritura.id);
    toast.success('Escritura eliminada correctamente');
    router.push('/escrituras');
  };

  const handleSendWhatsApp = () => {
    // updateEscritura(escritura.id, { 
    //   reciboEnviado: true, 
    //   fechaUltimoEnvio: new Date() 
    // });
    // addBitacoraEntry(
    //   escritura.id,
    //   'Recibo enviado por WhatsApp',
    //   `Recibo enviado a ${escritura.personaA.nombre} (${escritura.personaA.telefono})`
    // );
    toast.success('Recibo enviado por WhatsApp');
    setShowWhatsAppModal(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in px-4 sm:px-6 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <Button variant="ghost" size="icon" asChild className="shrink-0">
            <Link href="/escrituras">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight truncate">
                {escritura.folioInterno}
              </h1>
              <StatusBadge status={escritura.estatus} />
              {escritura.reciboEnviado && !escritura.reciboEnviado && (
                <span className="inline-flex items-center gap-1 text-xs text-success bg-success/10 px-2 py-1 rounded-full border border-success/20">
                  <CheckCircle className="h-3 w-3" />
                  Recibo enviado
                </span>
              )}
            </div>
            <p className="text-sm sm:text-base text-muted-foreground mt-1 truncate">
              Escritura #{escritura.numeroEscritura} • {tipoConfig?.label}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Select value={escritura.estatus} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full sm:w-45">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ESTATUS_CONFIG.map(status => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex-1 min-w-0" />

          {showResendButton && (
            <Button
              variant="outline"
              className="text-success border-success hover:bg-success/10 hover:text-success w-full sm:w-auto"
              onClick={() => setShowWhatsAppModal(true)}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{escritura.reciboEnviado ? 'Reenviar recibo' : 'Enviar recibo'}</span>
              <span className="sm:hidden">Recibo</span>
            </Button>
          )}

          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href={`/escrituras/${escritura.id}/editar`}>
              <Pencil className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Editar</span>
              <span className="sm:hidden">Editar</span>
            </Link>
          </Button>
          <Button
            variant="outline"
            className="text-destructive hover:text-destructive hover:bg-destructive/10 w-full sm:w-auto"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Eliminar</span>
            <span className="sm:hidden">Eliminar</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Main Content */}
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
                <p className="text-sm text-muted-foreground">Folio Interno</p>
                <p className="font-medium">{escritura.folioInterno}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Número de Escritura</p>
                <p className="font-medium">{escritura.numeroEscritura}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tipo</p>
                <p className="font-medium">{tipoConfig?.label}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fecha de Creación</p>
                <p className="font-medium">
                  {format(escritura.fechaCreacion, "dd 'de' MMMM 'de' yyyy", { locale: es })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fecha de Firma</p>
                <p className="font-medium">
                  {escritura.fechaFirma
                    ? format(escritura.fechaFirma, "dd 'de' MMMM 'de' yyyy", { locale: es })
                    : 'Pendiente'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Personas Involucradas */}
          <Card className="shadow-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif">
                <User className="h-5 w-5 text-primary" />
                Personas Involucradas
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border p-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  {escritura.personaA.rolLabel}
                </p>
                <p className="font-semibold">{escritura.personaA.nombre}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                  <Phone className="h-3 w-3" />
                  {escritura.personaA.telefono}
                </p>
              </div>
              
              {escritura.personaB && (
                <div className="rounded-lg border p-4">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    {escritura.personaB.rolLabel}
                  </p>
                  <p className="font-semibold">{escritura.personaB.nombre}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                    <Phone className="h-3 w-3" />
                    {escritura.personaB.telefono}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notas */}
          {escritura.notas && (
            <Card className="shadow-premium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Notas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{escritura.notas}</p>
              </CardContent>
            </Card>
          )}

          {/* Adjuntos */}
          <Card className="shadow-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif">
                <Paperclip className="h-5 w-5 text-primary" />
                Adjuntos
                {escritura.adjuntos.length > 0 && (
                  <span className="text-sm font-normal text-muted-foreground">
                    ({escritura.adjuntos.length})
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AttachmentList attachments={escritura.adjuntos} />
            </CardContent>
          </Card>

          {/* Bitácora */}
          <Card className="shadow-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif">
                <History className="h-5 w-5 text-primary" />
                Bitácora de Actividad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AuditTimeline entries={escritura.bitacora} />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Budget */}
        <div className="space-y-6">
          <Card className="shadow-premium sticky top-20">
            <CardHeader>
              <CardTitle className="font-serif">Presupuesto</CardTitle>
            </CardHeader>
            <CardContent>
              <BudgetBreakdown
                presupuesto={escritura.presupuesto}
                tipo={escritura.tipo}
                showIsr={escritura.tipo === 'compraventa'}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar esta escritura?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La escritura <strong>{escritura.folioInterno}</strong> será eliminada permanentemente del sistema.
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

      {/* WhatsApp Modal */}
      <WhatsAppModal
        open={showWhatsAppModal}
        onOpenChange={setShowWhatsAppModal}
        escritura={escritura}
        onSend={handleSendWhatsApp}
        onSkip={() => setShowWhatsAppModal(false)}
        isResend={escritura.reciboEnviado}
      />
    </div>
  );
}
