"use client";

import { useState, useEffect } from "react";
import {
  MessageCircle,
  Send,
  ArrowRight,
  CheckCircle,
  XCircle,
  Loader2,
  Phone,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { sendReciboWhatsApp } from "../pdf/send-whatsapp";

interface Participant {
  name: string;
  phone?: string | null | undefined ;
  role: string;
  side?: string | undefined;
}

interface WhatsAppModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSend: () => void;
  onSkip: () => void;
  deedId: string ;
  folio: string;
  participants: Participant[];
  isResend?: boolean;
}

type SendStatus = "idle" | "sending" | "success" | "error";

interface SideState {
  phone: string;
  status: SendStatus;
  error: string | null;
}

export function WhatsAppModal({
  open,
  onOpenChange,
  onSend,
  onSkip,
  deedId,
  folio,
  participants,
  isResend = false,
}: WhatsAppModalProps) {
  const participantsA = participants.filter((p) => p.side === "A");
  const participantsB = participants.filter((p) => p.side === "B");

  const firstA = participantsA[0];
  const firstB = participantsB[0];

  const [stateA, setStateA] = useState<SideState>({
    phone: firstA?.phone ?? "",
    status: "idle",
    error: null,
  });
  const [stateB, setStateB] = useState<SideState>({
    phone: firstB?.phone ?? "",
    status: "idle",
    error: null,
  });

  // Sincronizar teléfonos cada vez que el modal abre (o cambian los participantes)
  useEffect(() => {
    if (open) {
      setStateA({ phone: firstA?.phone ?? "", status: "idle", error: null });
      setStateB({ phone: firstB?.phone ?? "", status: "idle", error: null });
    }
  }, [open, firstA?.phone, firstB?.phone]);

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      onSkip();
      return;
    }
    onOpenChange(next);
  };

  const handleSkip = () => {
    onSkip();
    onOpenChange(false);
  };

  const handleSend = async (side: "A" | "B") => {
    const setState = side === "A" ? setStateA : setStateB;
    const state = side === "A" ? stateA : stateB;
    const participant = side === "A" ? firstA : firstB;

    if (!state.phone.trim()) {
      toast.error("Ingrese un número de teléfono válido");
      return;
    }

    setState((s) => ({ ...s, status: "sending", error: null }));

    const result = await sendReciboWhatsApp(
      deedId,
      side,
      state.phone.trim(),
      participant?.name ?? "Cliente",
      folio,
      participant?.role ?? `Parte ${side}`
    );

    if (result.success) {
      setState((s) => ({ ...s, status: "success", error: null }));
      toast.success(
        `Recibo de ${participant?.role ?? "cliente"} enviado a ${participant?.name ?? "cliente"}`
      );
      onSend();
    } else {
      setState((s) => ({ ...s, status: "error", error: result.error }));
      toast.error(`Error al enviar recibo de ${participant?.role ?? side}: ${result.error}`);
    }
  };

  const allSent =
    stateA.status === "success" &&
    (participantsB.length === 0 || stateB.status === "success");

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-lg"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="h-11 w-11 rounded-full bg-success/10 flex items-center justify-center border border-success/20 shrink-0">
              <MessageCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <DialogTitle className="font-serif">
                {isResend ? "Reenviar recibos por WhatsApp" : "Enviar recibos por WhatsApp"}
              </DialogTitle>
              <DialogDescription className="text-xs mt-0.5">
                Escritura {folio} — Se enviará el PDF correspondiente a cada parte.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3 mt-2">
          {/* Parte A */}
          {firstA ? (
            <SideCard
              side="A"
              participant={firstA}
              state={stateA}
              onPhoneChange={(v) =>
                setStateA((s) => ({ ...s, phone: v, status: "idle", error: null }))
              }
              onSend={() => handleSend("A")}
            />
          ) : null}

          {/* Parte B */}
          {firstB ? (
            <SideCard
              side="B"
              participant={firstB}
              state={stateB}
              onPhoneChange={(v) =>
                setStateB((s) => ({ ...s, phone: v, status: "idle", error: null }))
              }
              onSend={() => handleSend("B")}
            />
          ) : null}

          {/* No hay participantes */}
          {!firstA && !firstB && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No hay participantes registrados en esta escritura.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-3 border-t mt-2">
          {allSent ? (
            <span className="text-xs text-success flex items-center gap-1">
              <CheckCircle className="h-3.5 w-3.5" />
              Todos los recibos enviados
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">
              Los PDFs se generan en el servidor antes del envío.
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={handleSkip}
          >
            <ArrowRight className="h-4 w-4 mr-1" />
            {allSent ? "Cerrar" : "Omitir"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ──────────────────────────────────────────
   Sub-componente: tarjeta por cada parte
─────────────────────────────────────────── */
function SideCard({
  side,
  participant,
  state,
  onPhoneChange,
  onSend,
}: {
  side: "A" | "B";
  participant: Participant;
  state: SideState;
  onPhoneChange: (v: string) => void;
  onSend: () => void;
}) {
  const colorA = "bg-blue-50 border-blue-200";
  const colorB = "bg-emerald-50 border-emerald-200";
  const badgeColorA = "bg-blue-100 text-blue-700";
  const badgeColorB = "bg-emerald-100 text-emerald-700";

  const isSending = state.status === "sending";
  const isSuccess = state.status === "success";
  const isError = state.status === "error";

  return (
    <div
      className={`rounded-lg border p-4 space-y-3 ${side === "A" ? colorA : colorB}`}
    >
      {/* Nombre + rol */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">{participant.name}</p>
          <p className="text-xs text-muted-foreground">{participant.role}</p>
        </div>
        <Badge
          variant="secondary"
          className={`text-xs ${side === "A" ? badgeColorA : badgeColorB}`}
        >
          {participant.role}
        </Badge>
      </div>

      {/* Teléfono editable */}
      <div className="flex items-center gap-2">
        <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <Input
          value={state.phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          placeholder="Ej: 5512345678"
          className="h-8 text-sm bg-white"
          disabled={isSending || isSuccess}
        />
      </div>

      {/* Estado del envío */}
      {isError && state.error ? (
        <p className="text-xs text-destructive flex items-start gap-1">
          <XCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          {state.error}
        </p>
      ) : null}

      {/* Botón enviar */}
      <Button
        size="sm"
        className={`w-full cursor-pointer ${
          isSuccess
            ? "bg-success hover:bg-success/90 text-success-foreground"
            : ""
        }`}
        onClick={onSend}
        disabled={isSending || isSuccess}
      >
        {isSending ? (
          <>
            <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
            Enviando…
          </>
        ) : isSuccess ? (
          <>
            <CheckCircle className="h-3.5 w-3.5 mr-2" />
            Enviado
          </>
        ) : (
          <>
            <Send className="h-3.5 w-3.5 mr-2" />
            Enviar recibo
          </>
        )}
      </Button>
    </div>
  );
}
