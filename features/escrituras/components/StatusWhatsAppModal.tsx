"use client";

import { useState, useEffect } from "react";
import {
  MessageCircle,
  Send,
  CheckCircle,
  XCircle,
  Loader2,
  Phone,
  ArrowRight,
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
import { sendStatusWhatsApp } from "../pdf/send-whatsapp";
import { getStatusLabel } from "@/lib/utils";

interface Participant {
  name: string;
  phone?: string | null;
  role: string;
  side?: string;
}

interface StatusWhatsAppModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  participants: Participant[];
  folio: string;
  deedNumber: string | null;
  typeLabel: string;
  status: string;
}

type SendStatus = "idle" | "sending" | "success" | "error";

interface ParticipantState {
  phone: string;
  status: SendStatus;
  error: string | null;
}

export function StatusWhatsAppModal({
  open,
  onOpenChange,
  participants,
  folio,
  deedNumber,
  typeLabel,
  status,
}: StatusWhatsAppModalProps) {
  const firstA = participants.find((p) => p.side === "A");
  const firstB = participants.find((p) => p.side === "B");
  const statusLabel = getStatusLabel(status as import("@/features/shared/types").EstatusEscritura);

  const [stateA, setStateA] = useState<ParticipantState>({
    phone: firstA?.phone ?? "",
    status: "idle",
    error: null,
  });
  const [stateB, setStateB] = useState<ParticipantState>({
    phone: firstB?.phone ?? "",
    status: "idle",
    error: null,
  });

  useEffect(() => {
    if (open) {
      setStateA({ phone: firstA?.phone ?? "", status: "idle", error: null });
      setStateB({ phone: firstB?.phone ?? "", status: "idle", error: null });
    }
  }, [open, firstA?.phone, firstB?.phone]);

  const handleSend = async (side: "A" | "B") => {
    const participant = side === "A" ? firstA : firstB;
    const state = side === "A" ? stateA : stateB;
    const setState = side === "A" ? setStateA : setStateB;

    if (!state.phone.trim()) {
      toast.error("Ingrese un número de teléfono válido");
      return;
    }

    setState((s) => ({ ...s, status: "sending", error: null }));

    const result = await sendStatusWhatsApp({
      phone: state.phone.trim(),
      recipientName: participant?.name ?? "Cliente",
      role: participant?.role ?? `Parte ${side}`,
      folio,
      deedNumber,
      typeLabel,
      statusLabel,
    });

    if (result.success) {
      setState((s) => ({ ...s, status: "success", error: null }));
      toast.success(`Status enviado a ${participant?.name ?? "cliente"}`);
    } else {
      setState((s) => ({ ...s, status: "error", error: result.error }));
      toast.error(`Error al enviar: ${result.error}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-lg"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
              <MessageCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="font-serif">Enviar Status por WhatsApp</DialogTitle>
              <DialogDescription className="text-xs mt-0.5">
                Escritura {folio} — Se enviará el estatus actual a cada parte.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Status preview */}
        <div className="rounded-lg border bg-muted/40 px-4 py-3 text-xs space-y-1 text-muted-foreground">
          <p><span className="font-medium text-foreground">Folio:</span> {folio}</p>
          <p><span className="font-medium text-foreground">No. Escritura:</span> {deedNumber ?? "En proceso"}</p>
          <p><span className="font-medium text-foreground">Tipo:</span> {typeLabel}</p>
          <p><span className="font-medium text-foreground">Estatus:</span> <span className="text-primary font-semibold">{statusLabel}</span></p>
        </div>

        <div className="space-y-3 mt-1">
          {firstA && (
            <ParticipantCard
              side="A"
              participant={firstA}
              state={stateA}
              onPhoneChange={(v) => setStateA((s) => ({ ...s, phone: v, status: "idle", error: null }))}
              onSend={() => handleSend("A")}
            />
          )}
          {firstB && (
            <ParticipantCard
              side="B"
              participant={firstB}
              state={stateB}
              onPhoneChange={(v) => setStateB((s) => ({ ...s, phone: v, status: "idle", error: null }))}
              onSend={() => handleSend("B")}
            />
          )}
          {!firstA && !firstB && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No hay participantes registrados en esta escritura.
            </p>
          )}
        </div>

        <div className="flex justify-end pt-3 border-t mt-2">
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={() => onOpenChange(false)}
          >
            <ArrowRight className="h-4 w-4 mr-1" />
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ParticipantCard({
  side,
  participant,
  state,
  onPhoneChange,
  onSend,
}: {
  side: "A" | "B";
  participant: Participant;
  state: ParticipantState;
  onPhoneChange: (v: string) => void;
  onSend: () => void;
}) {
  const colorA = "bg-blue-50 border-blue-200";
  const colorB = "bg-emerald-50 border-emerald-200";
  const badgeA = "bg-blue-100 text-blue-700";
  const badgeB = "bg-emerald-100 text-emerald-700";

  const isSending = state.status === "sending";
  const isSuccess = state.status === "success";
  const isError   = state.status === "error";

  return (
    <div className={`rounded-lg border p-4 space-y-3 ${side === "A" ? colorA : colorB}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">{participant.name}</p>
          <p className="text-xs text-muted-foreground">{participant.role}</p>
        </div>
        <Badge variant="secondary" className={`text-xs ${side === "A" ? badgeA : badgeB}`}>
          {participant.role}
        </Badge>
      </div>

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

      {isError && state.error && (
        <p className="text-xs text-destructive flex items-start gap-1">
          <XCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          {state.error}
        </p>
      )}

      <Button
        size="sm"
        className={`w-full cursor-pointer ${isSuccess ? "bg-success hover:bg-success/90 text-success-foreground" : ""}`}
        onClick={onSend}
        disabled={isSending || isSuccess}
      >
        {isSending ? (
          <><Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />Enviando…</>
        ) : isSuccess ? (
          <><CheckCircle className="h-3.5 w-3.5 mr-2" />Enviado</>
        ) : (
          <><Send className="h-3.5 w-3.5 mr-2" />Enviar status</>
        )}
      </Button>
    </div>
  );
}
