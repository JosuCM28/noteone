"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TipoSelector } from "../components/TipoSelector";
import { DatosGeneralesSection } from "../components/DatosGeneralesSection";
import { ParticipantesManager } from "../components/ParticipantesManager";
import {
  PresupuestoSection,
  calcularPresupuesto,
  DEFAULT_TAX_CONFIG,
  type TaxConfig,
} from "../components/PresupuestoSection";
import { WhatsAppModal } from "../components/WhatsAppModal";
import { TIPOS_ESCRITURA } from "@/features/shared/data/mock-data";
import {
  TipoEscritura,
  EstatusEscritura,
  Escritura,
} from "@/features/shared/types";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Side = "A" | "B";

type Participante = {
  id: string;
  rol: string;
  nombre: string;
  telefono: string;
  side?: Side;
};

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function EscrituraNueva() {
  const router = useRouter();

  const [tipo, setTipo] = useState<TipoEscritura | null>(null);
  const [folioInterno, setFolioInterno] = useState("");
  const [numeroEscritura, setNumeroEscritura] = useState("");
  const [fechaFirma, setFechaFirma] = useState("");
  const [notas, setNotas] = useState("");
  const [estatus, setEstatus] = useState<EstatusEscritura>("por-liquidar");
  const [valorBase, setValorBase] = useState(0);
  const [honorarios, setHonorarios] = useState(0);
  const [isr, setIsr] = useState(0);

  const taxConfig: TaxConfig = DEFAULT_TAX_CONFIG;

  const [participantes, setParticipantes] = useState<Participante[]>([]);

  // Modal state
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [savedEscritura, setSavedEscritura] = useState<Escritura | null>(null);

  // Confirm change tipo
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingTipo, setPendingTipo] = useState<TipoEscritura | null>(null);

  // Get tipo config
  const tipoConfig = useMemo(
    () => TIPOS_ESCRITURA.find((t) => t.value === tipo),
    [tipo]
  );

  const requiresB = !!tipoConfig?.personaBLabel;

  const rolesDisponibles = useMemo(() => {
    if (!tipoConfig) return ["Participante"];
    return [
      tipoConfig.personaALabel,
      ...(tipoConfig.personaBLabel ? [tipoConfig.personaBLabel] : []),
    ];
  }, [tipoConfig]);

  const participantesA = useMemo(() => {
    const labelA = tipoConfig?.personaALabel;
    return participantes.filter(
      (p) => p.side === "A" || (labelA && p.rol === labelA)
    );
  }, [participantes, tipoConfig]);

  const participantesB = useMemo(() => {
    const labelB = tipoConfig?.personaBLabel;
    return participantes.filter(
      (p) => p.side === "B" || (labelB && p.rol === labelB)
    );
  }, [participantes, tipoConfig]);

  /**
   * ¿Hay datos ingresados "abajo" que se perderían?
   * (ajusta esta heurística si quieres)
   */
  const hasUnsavedDraft = useMemo(() => {
    return (
      folioInterno.trim() ||
      numeroEscritura.trim() ||
      fechaFirma.trim() ||
      notas.trim() ||
      participantes.length > 0 ||
      valorBase > 0 ||
      honorarios > 0 ||
      isr > 0
    );
  }, [
    folioInterno,
    numeroEscritura,
    fechaFirma,
    notas,
    participantes.length,
    valorBase,
    honorarios,
    isr,
  ]);

  const resetDraft = () => {
    setFolioInterno("");
    setNumeroEscritura("");
    setFechaFirma("");
    setNotas("");
    setEstatus("por-liquidar");
    setValorBase(0);
    setHonorarios(0);
    setIsr(0);
    setParticipantes([]);
    setSavedEscritura(null);
    setShowWhatsAppModal(false);
  };

  /**
   * Intercepta cambio de tipo desde TipoSelector
   */
  const handleTipoChange = (next: TipoEscritura | null) => {
    // Selección inicial o mismo tipo
    if (!next || next === tipo) {
      setTipo(next);
      return;
    }

    // Si no hay datos, cambia directo
    if (!hasUnsavedDraft) {
      setTipo(next);
      return;
    }

    // Si hay datos, pide confirmación
    setPendingTipo(next);
    setConfirmOpen(true);
  };

  const confirmChangeTipo = () => {
    if (!pendingTipo) {
      setConfirmOpen(false);
      return;
    }
    resetDraft();
    setTipo(pendingTipo);
    setPendingTipo(null);
    setConfirmOpen(false);
    toast.message("Se reinició el borrador al cambiar el tipo de escritura");
  };

  const cancelChangeTipo = () => {
    setPendingTipo(null);
    setConfirmOpen(false);
  };

  /**
   * Participantes handlers (compatibles con varias firmas)
   */
  const handleAddParticipante = (...args: any[]) => {
    const maybe = args[0];

    if (maybe && typeof maybe === "object" && !Array.isArray(maybe)) {
      const p = maybe as Participante;
      setParticipantes((prev) => [...prev, { ...p, id: p.id ?? createId() }]);
      return;
    }

    const hasA = participantesA.length >= 1;
    const hasB = participantesB.length >= 1;

    const side: Side = !hasA ? "A" : requiresB && !hasB ? "B" : "A";
    const rolDefault =
      side === "A"
        ? tipoConfig?.personaALabel ?? "Participante"
        : tipoConfig?.personaBLabel ?? "Participante";

    setParticipantes((prev) => [
      ...prev,
      { id: createId(), rol: rolDefault, nombre: "", telefono: "", side },
    ]);
  };

  const handleUpdateParticipante = (...args: any[]) => {
    if (args.length === 1 && Array.isArray(args[0])) {
      setParticipantes(args[0] as Participante[]);
      return;
    }

    if (args.length === 1 && args[0] && typeof args[0] === "object") {
      const p = args[0] as Partial<Participante> & { id?: string };
      if (!p.id) return;
      setParticipantes((prev) =>
        prev.map((x) => (x.id === p.id ? { ...x, ...p } : x))
      );
      return;
    }

    if (args.length === 2 && typeof args[0] === "string" && args[1]) {
      const id = args[0] as string;
      const patch = args[1] as Partial<Participante>;
      setParticipantes((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...patch } : p))
      );
      return;
    }

    if (args.length === 2 && typeof args[0] === "number" && args[1]) {
      const index = args[0] as number;
      const patch = args[1] as Partial<Participante>;
      setParticipantes((prev) =>
        prev.map((p, i) => (i === index ? { ...p, ...patch } : p))
      );
      return;
    }
  };

  const handleRemoveParticipante = (...args: any[]) => {
    if (args.length === 1 && typeof args[0] === "string") {
      const id = args[0] as string;
      setParticipantes((prev) => prev.filter((p) => p.id !== id));
      return;
    }
    if (args.length === 1 && typeof args[0] === "number") {
      const index = args[0] as number;
      setParticipantes((prev) => prev.filter((_, i) => i !== index));
      return;
    }
  };

  // Validation: requiere A siempre, y B si el tipo lo define
  const isValid = useMemo(() => {
    const baseOk =
      !!tipo &&
      folioInterno.trim().length > 0 &&
      numeroEscritura.trim().length > 0;

    const aOk = participantesA.length >= 1;
    const bOk = !requiresB || participantesB.length >= 1;

    return baseOk && aOk && bOk;
  }, [
    tipo,
    folioInterno,
    numeroEscritura,
    participantesA.length,
    participantesB.length,
    requiresB,
  ]);

  const handleSubmit = () => {
    if (!isValid || !tipo) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    const presupuesto = calcularPresupuesto(
      tipo,
      valorBase,
      honorarios,
      isr,
      taxConfig
    );

    const pA =
      participantes.find(
        (p) => p.side === "A" || p.rol === tipoConfig?.personaALabel
      ) ?? null;

    const pB =
      participantes.find(
        (p) => p.side === "B" || p.rol === tipoConfig?.personaBLabel
      ) ?? null;

    const personaA = pA
      ? { rolLabel: pA.rol, nombre: pA.nombre, telefono: pA.telefono }
      : { rolLabel: "", nombre: "", telefono: "" };

    const personaB = pB
      ? { rolLabel: pB.rol, nombre: pB.nombre, telefono: pB.telefono }
      : undefined;

    const escritura: Escritura = {
      id: createId(),
      numeroEscritura,
      folioInterno,
      tipo,
      estatus,
      fechaFirma: fechaFirma ? new Date(fechaFirma) : null,
      notas: notas || null,
      participantes,
      personaA,
      personaB,
      presupuesto,
      adjuntos: [],
      reciboEnviado: false,
      fechaUltimoEnvio: null,
    } as unknown as Escritura;

    toast.success("Escritura creada correctamente");
    setSavedEscritura(escritura);
    setShowWhatsAppModal(true);
  };

  const goToDetalle = (id: string) => router.push(`/escrituras/${id}`);

  const handleSendWhatsApp = () => {
    toast.success("Recibo enviado por WhatsApp");
    setShowWhatsAppModal(false);
    if (savedEscritura) goToDetalle(savedEscritura.id);
  };

  const handleSkipWhatsApp = () => {
    setShowWhatsAppModal(false);
    if (savedEscritura) goToDetalle(savedEscritura.id);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/escrituras")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-serif text-2xl font-bold">Nueva Escritura</h1>
        </div>

        <Button onClick={handleSubmit} disabled={!isValid} className="btn-accent">
          <Save className="h-4 w-4 mr-2" />
          Guardar Escritura
        </Button>
      </div>

      {/* Form Sections */}
      <div className="space-y-6">
        {/* Tipo de Escritura */}
        <TipoSelector selectedTipo={tipo} onSelect={handleTipoChange} />

        {/* Datos Generales */}
        <DatosGeneralesSection
          folioInterno={folioInterno}
          numeroEscritura={numeroEscritura}
          fechaFirma={fechaFirma}
          notas={notas}
          estatus={estatus}
          onFolioInternoChange={setFolioInterno}
          onNumeroEscrituraChange={setNumeroEscritura}
          onFechaFirmaChange={setFechaFirma}
          onNotasChange={setNotas}
          onEstatusChange={setEstatus}
        />

        {/* Participantes */}
        <ParticipantesManager
          participantes={participantes as any}
          rolesDisponibles={rolesDisponibles}
          onAdd={handleAddParticipante as any}
          onUpdate={handleUpdateParticipante as any}
          onRemove={handleRemoveParticipante as any}
          minParticipantes={1}
        />

        {/* Presupuesto */}
        {tipo && (
          <PresupuestoSection
            tipo={tipo}
            valorBase={valorBase}
            honorarios={honorarios}
            isr={isr}
            onValorBaseChange={setValorBase}
            onHonorariosChange={setHonorarios}
            onIsrChange={setIsr}
            taxConfig={taxConfig}
          />
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex justify-between pt-4 border-t">
        <Button variant="outline" onClick={() => router.push("/escrituras")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Cancelar
        </Button>

        <Button onClick={handleSubmit} disabled={!isValid} className="btn-accent">
          <Save className="h-4 w-4 mr-2" />
          Guardar Escritura
        </Button>
      </div>

      {/* WhatsApp Modal */}
      <WhatsAppModal
        open={showWhatsAppModal}
        onOpenChange={setShowWhatsAppModal}
        escritura={savedEscritura}
        onSend={handleSendWhatsApp}
        onSkip={handleSkipWhatsApp}
      />

      {/* Confirm change tipo */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>¿Cambiar tipo de escritura?</DialogTitle>
            <DialogDescription>
              Tienes datos capturados. Si cambias el tipo, se borrarán los datos
              ingresados (participantes, valores y campos del formulario).
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0 cursor-pointer">
            <Button type="button" variant="outline" onClick={cancelChangeTipo}>
              Cancelar
            </Button>
            <Button type="button" className="btn-accent cursor-pointer" onClick={confirmChangeTipo}>
              Sí, cambiar y borrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
