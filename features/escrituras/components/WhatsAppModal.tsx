import { MessageCircle, X, Send, Phone } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Escritura } from '@/features/shared/types';
import { Money } from '@/components/shared/Money';

interface WhatsAppModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  escritura: Escritura | null;
  onSend: () => void;
  onSkip: () => void;
  isResend?: boolean;
}

export function WhatsAppModal({
  open,
  onOpenChange,
  escritura,
  onSend,
  onSkip,
  isResend = false,
}: WhatsAppModalProps) {
  if (!escritura) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center border border-success/20">
              <MessageCircle className="h-6 w-6 text-success" />
            </div>
            <div>
              <DialogTitle className="font-serif">
                {isResend ? 'Reenviar recibo' : 'Enviar recibo por WhatsApp'}
              </DialogTitle>
              <DialogDescription>
                {isResend
                  ? 'Se ha detectado cambios en la escritura. ¿Desea reenviar el recibo actualizado?'
                  : '¿Desea enviar el recibo de la escritura al cliente?'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Preview Card */}
        <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Folio</span>
            <span className="font-medium">{escritura.folioInterno}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Escritura</span>
            <span className="font-medium">#{escritura.numeroEscritura}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Cliente</span>
            <span className="font-medium">{escritura.personaA.nombre}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Teléfono</span>
            <div className="flex items-center gap-2">
              <Phone className="h-3 w-3 text-muted-foreground" />
              <span className="font-medium">{escritura.personaA.telefono}</span>
            </div>
          </div>
          <div className="pt-2 border-t flex items-center justify-between">
            <span className="font-medium">Total a pagar</span>
            <Money amount={escritura.presupuesto.totalFinal} className="text-lg text-primary" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onSkip}
          >
            <X className="h-4 w-4 mr-2" />
            {isResend ? 'No reenviar' : 'Continuar sin enviar'}
          </Button>
          <Button
            className="flex-1 bg-success hover:bg-success/90 text-success-foreground"
            onClick={onSend}
          >
            <Send className="h-4 w-4 mr-2" />
            {isResend ? 'Reenviar por WhatsApp' : 'Enviar por WhatsApp'}
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-2">
          Se abrirá WhatsApp con el mensaje predefinido del recibo
        </p>
      </DialogContent>
    </Dialog>
  );
}
