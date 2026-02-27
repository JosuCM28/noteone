"use client";

import { MessageCircle, Send, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface WhatsAppModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSend: () => void;
  onSkip: () => void;
}

export function WhatsAppModal({
  open,
  onOpenChange,
  onSend,
  onSkip,
}: WhatsAppModalProps) {

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      // 👉 Si intenta cerrarse (X), ejecutar skip
      onSkip();
      return;
    }
    onOpenChange(nextOpen);
  };

  const handleSkip = () => {
    onSkip();
    onOpenChange(false);
  };

  const handleSend = () => {
    onSend();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center border border-success/20">
              <MessageCircle className="h-6 w-6 text-success" />
            </div>
            <div>
              <DialogTitle className="font-serif">
                Enviar por WhatsApp
              </DialogTitle>
              <DialogDescription>
                ¿Deseas enviar la escritura por WhatsApp o continuar sin enviarla?
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <Button variant="outline" className="flex-1" onClick={handleSkip}>
            <ArrowRight className="h-4 w-4 mr-2" />
            Continuar sin enviar
          </Button>

          <Button
            className="flex-1 bg-success hover:bg-success/90 text-success-foreground"
            onClick={handleSend}
          >
            <Send className="h-4 w-4 mr-2" />
            Enviar por WhatsApp
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}