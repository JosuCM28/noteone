"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, type SubmitHandler } from "react-hook-form";
import { Form } from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { TipoSelector } from "../components/TipoSelector";
import { DatosGeneralesSection } from "../components/DatosGeneralesSection";
import { ParticipantesManager } from "../components/ParticipantesManager";
import { PresupuestoSection } from "../components/PresupuestoSection";
import { WhatsAppModal } from "../components/WhatsAppModal";

import { TIPOS_ESCRITURA } from "@/features/shared/data/mock-data";
import type { TipoEscritura, Escritura, EstatusEscritura } from "@/features/shared/types";
import { DEFAULT_TAX_CONFIG, type TaxConfig } from "@/features/shared/tax-rules";
import { calcularPresupuesto } from "@/features/shared/calcular-presupuesto";

import { EscrituraFormSchema } from "../schema";
import { effect } from "better-auth/react";
import { se } from "date-fns/locale";
import { getTaxes } from "@/features/settings/action";
import { get } from "http";
import { getRandomFolio } from "@/lib/utils";
import { postEscritura } from "../action";

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

type EscrituraNuevaProps = {
  taxes: Awaited<ReturnType<typeof getTaxes>>;
}

export default function EscrituraNueva({ taxes }: EscrituraNuevaProps) {
  const router = useRouter();

  type FormInput = z.input<typeof EscrituraFormSchema>;
  type FormOutput = z.output<typeof EscrituraFormSchema>;

  const form = useForm<FormInput>({
    resolver: zodResolver(EscrituraFormSchema),
    mode: "onChange",
    defaultValues: {
      type: "",
      typeLabel: "",
      folio: getRandomFolio(),
      deedNumber: null,
      notes: null,

      baseValue: null,
      totalA: null,
      totalB: null,

      status: "por-liquidar" as EstatusEscritura,

      participants: [],

      taxes: DEFAULT_TAX_CONFIG,
    },
  });




  const { fields, append, update, remove } = useFieldArray({
    control: form.control,
    name: "participants",
  });

  const tipo = form.watch("type") as TipoEscritura | "";
  const tipoConfig = useMemo(
    () => TIPOS_ESCRITURA.find((t) => t.value === (tipo || null)),
    [tipo]
  );
  useEffect(() => {

    form.setValue("taxes", {
      ...DEFAULT_TAX_CONFIG,
      ...(taxes?.[tipo] ?? {}),
    });
  }, [tipo]);

  const rolesDisponibles = useMemo(() => {
    if (!tipoConfig) return ["Participante"];
    return [
      tipoConfig.personaALabel,
      ...(tipoConfig.personaBLabel ? [tipoConfig.personaBLabel] : []),
    ];
  }, [tipoConfig]);

  // Modal state
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [savedEscritura, setSavedEscritura] = useState<Escritura | null>(null);

  // Confirm change tipo
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingTipo, setPendingTipo] = useState<TipoEscritura | null>(null);

  // ✅ draft: solo isDirty
  const hasUnsavedDraft = form.formState.isDirty;

  const resetDraftKeepingTipo = (keepTipo: string) => {
    form.reset({
      type: keepTipo,
      typeLabel: (() => {
        const cfg = TIPOS_ESCRITURA.find((x) => x.value === (keepTipo as any));
        return cfg?.label ?? keepTipo;
      })(),
      folio: getRandomFolio(),
      deedNumber: null,
      notes: null,
      baseValue: null,
      totalA: null,
      totalB: null,
      status: "por-liquidar" as EstatusEscritura,
      participants: [],
      taxes: DEFAULT_TAX_CONFIG,
    });

    setSavedEscritura(null);
    setShowWhatsAppModal(false);
  };

  const handleTipoChange = (next: TipoEscritura | null) => {
    if (!next || next === tipo) {
      form.setValue("type", (next ?? "") as any, { shouldDirty: true });
      return;
    }

    if (!hasUnsavedDraft) {
      form.setValue("type", next as any, { shouldDirty: true });
      const cfg = TIPOS_ESCRITURA.find((x) => x.value === next);
      form.setValue("typeLabel", cfg?.label ?? next, { shouldDirty: true });
      return;
    }

    setPendingTipo(next);
    setConfirmOpen(true);
  };

  const confirmChangeTipo = () => {
    if (!pendingTipo) return setConfirmOpen(false);

    resetDraftKeepingTipo(pendingTipo);

    setPendingTipo(null);
    setConfirmOpen(false);
    toast.message("Se reinició el borrador al cambiar el tipo de escritura");
  };

  const cancelChangeTipo = () => {
    setPendingTipo(null);
    setConfirmOpen(false);
  };

  const canSubmit = form.formState.isValid && !form.formState.isSubmitting;

  // ✅ Correcto para RHF: SubmitHandler<FormInput>
  const onSubmit: SubmitHandler<FormInput> = async (values) => {
    // ✅ aplica defaults de zod (status, side, etc.)
    const data: FormOutput = EscrituraFormSchema.parse(values);

    const tipoOk = data.type as TipoEscritura;

    const presupuesto = calcularPresupuesto(
      tipoOk,
      Number(data.baseValue ?? 0),
      data.taxes as TaxConfig
    );

    const escritura: Escritura = {
      id: createId(),
      numeroEscritura: data.deedNumber ?? "",
      folioInterno: data.folio,
      tipo: tipoOk,
      estatus: "por-liquidar" as EstatusEscritura,
      fechaFirma: null,
      notas: data.notes ?? null,

      participantes: data.participants.map((p) => ({
        id: createId(),
        rol: p.role,
        nombre: p.name,
        telefono: p.phone ?? "",
        side: p.side,
      })) as any,

      personaA: { rolLabel: "", nombre: "", telefono: "" } as any,
      personaB: undefined,
      presupuesto,
      reciboEnviado: false,
      fechaUltimoEnvio: null,
    } as any;
    
    await postEscritura(data);



    toast.success("Escritura creada correctamente");
    setSavedEscritura(escritura);
    setShowWhatsAppModal(true);


  };

  useEffect(() => {
    const subscription = form.watch((value) => {
      console.log("RHF LIVE:", value);
    });

    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => router.push("/escrituras")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="font-serif text-2xl font-bold">Nueva Escritura</h1>
            </div>

            <Button type="submit" disabled={!canSubmit} className="btn-accent">
              <Save className="h-4 w-4 mr-2" />
              Guardar Escritura
            </Button>
          </div>

          <div className="space-y-6">
            <TipoSelector
              selectedTipo={tipo ? (tipo as TipoEscritura) : null}
              onSelect={handleTipoChange}
            />

            <DatosGeneralesSection />

            <ParticipantesManager
              // ✅ mapea fields -> lo que tu manager espera (inglés)
              participantes={fields.map((f) => ({
                id: f.id,
                name: (f as any).name ?? "",
                phone: (f as any).phone ?? null,
                role: (f as any).role ?? "",
                side: (f as any).side ?? "A",
                email: (f as any).email ?? null,
              })) as any}
              rolesDisponibles={rolesDisponibles}

              // ✅ ahora sí recibes lo que el usuario capturó en el manager
              onAdd={(p: any) => {
                append({
                  name: p.name,
                  phone: p.phone ?? null,
                  role: p.role,
                  side: p.side ?? "A",
                  email: p.email ?? null,
                } as any);
              }}

              // ✅ update directo (patch viene en inglés)
              onUpdate={(id: string, patch: any) => {
                const index = fields.findIndex((f) => f.id === id);
                if (index === -1) return;
                update(index, { ...(fields[index] as any), ...patch } as any);
              }}

              onRemove={(id: string) => {
                const index = fields.findIndex((f) => f.id === id);
                if (index === -1) return;
                remove(index);
              }}

              minParticipantes={1}
            />

            {!!tipo && (
              <PresupuestoSection
                tipo={tipo as TipoEscritura}
                personaALabel={tipoConfig?.personaALabel}
                personaBLabel={tipoConfig?.personaBLabel}
              />
            )}
          </div>

          <div className="flex justify-between pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => router.push("/escrituras")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancelar
            </Button>

            <Button type="submit" disabled={!canSubmit} className="btn-accent">
              <Save className="h-4 w-4 mr-2" />
              Guardar Escritura
            </Button>
          </div>

          <WhatsAppModal
            open={showWhatsAppModal}
            onOpenChange={setShowWhatsAppModal}
            escritura={savedEscritura}
            onSend={() => {
              toast.success("Recibo enviado por WhatsApp");
              setShowWhatsAppModal(false);
            }}
            onSkip={() => setShowWhatsAppModal(false)}
          />

          <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>¿Cambiar tipo de escritura?</DialogTitle>
                <DialogDescription>
                  Tienes datos capturados. Si cambias el tipo, se borrarán los datos ingresados.
                </DialogDescription>
              </DialogHeader>

              <DialogFooter className="gap-2">
                <Button className="cursor-pointer" type="button" variant="outline" onClick={cancelChangeTipo}>
                  Cancelar
                </Button>
                <Button type="button" className="btn-accent cursor-pointer" onClick={confirmChangeTipo}>
                  Sí, cambiar y borrar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </form>
    </Form>
  );
}