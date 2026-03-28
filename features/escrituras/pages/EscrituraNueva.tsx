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

import { EscrituraFormSchema } from "../schema";
import { getTaxes } from "@/features/settings/action";
import { getRandomFolio } from "@/lib/utils";
import { postEscritura } from "../action";

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

      status: "por_liquidar" as EstatusEscritura,

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

  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingTipo, setPendingTipo] = useState<TipoEscritura | null>(null);
  const [escrituraId, setEscrituraId] = useState<string | null>(null);


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
      status: "por_liquidar" as EstatusEscritura,
      participants: [],
      taxes: DEFAULT_TAX_CONFIG,
    });

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

  const onSubmit: SubmitHandler<FormInput> = async (values) => {
    const data: FormOutput = EscrituraFormSchema.parse(values);
    try {
      const escrituraReturnId = await postEscritura(data);
      setEscrituraId(escrituraReturnId);
      toast.success("Escritura creada correctamente");
      setShowWhatsAppModal(true);

    }
    catch (error) {
      if (error instanceof Error) {
        if (error.message === "ESCRITURANUMBER_TAKEN") {
          toast.error("El número de escritura ya está en uso");
          return;
        }
      }
      toast.error("Error al crear la escritura");

    }

  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="cursor-pointer"
                onClick={() => router.push("/escrituras")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="font-serif text-xl sm:text-2xl font-bold">Nueva Escritura</h1>
            </div>

            <Button type="submit" disabled={!canSubmit} className="btn-accent cursor-pointer">
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

            <Button type="submit" disabled={!canSubmit} className="btn-accent cursor-pointer">
              <Save className="h-4 w-4 mr-2" />
              Guardar Escritura
            </Button>
          </div>

          <WhatsAppModal
            open={showWhatsAppModal}
            onOpenChange={setShowWhatsAppModal}
            deedId={escrituraId!}
            folio={form.getValues("folio")}
            participants={form.getValues("participants")}
            onSend={() => {
              toast.success("Recibo enviado por WhatsApp");
              router.push("/escrituras");
              setShowWhatsAppModal(false);
            }}
            onSkip={() => {
              setShowWhatsAppModal(false);
              router.push("/escrituras");
            }

            }
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