'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Scroll,
  Home,
  Gift,
  Ban,
  XCircle,
  Users,
  PenTool,
  Building,
  FileEdit,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Stepper } from '@/components/shared/Stepper';

import { BudgetBreakdown } from '../components/BudgetBreakdown';
import { WhatsAppModal } from '../components/WhatsAppModal';
import { TIPOS_ESCRITURA, ESTATUS_CONFIG, IMPUESTOS_FIJOS } from '@/features/shared/data/mock-data';
import { TipoEscritura, EstatusEscritura, Persona, Presupuesto, Escritura, ParticipantForm, DraftParticipant } from '@/features/shared/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import z from 'zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { escrituraSchema } from '@/features/auth/schemas';
import { Pencil, Trash2, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ParticipantsTable } from '../components/ParticipantsTable';


const iconMap: Record<string, any> = {
  scroll: Scroll,
  home: Home,
  gift: Gift,
  ban: Ban,
  'x-circle': XCircle,
  users: Users,
  'pen-tool': PenTool,
  building: Building,
  'file-edit': FileEdit,
};


const ISR_TIPOS: TipoEscritura[] = ['compraventa', 'donacion'];
const STEPS = ['Tipo', 'Datos', 'Presupuesto', 'Honorarios', 'Confirmar'];

export default function EscrituraNueva() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [tipo, setTipo] = useState<TipoEscritura | null>(null);
  const [folioInterno, setFolioInterno] = useState('');
  const [numeroEscritura, setNumeroEscritura] = useState('');
  const [fechaFirma, setFechaFirma] = useState('');
  const [notas, setNotas] = useState('');
  const [personaA, setPersonaA] = useState<Persona>({ rolLabel: '', nombre: '', telefono: '' });
  const [personaB, setPersonaB] = useState<Persona>({ rolLabel: '', nombre: '', telefono: '' });
  const [valorBase, setValorBase] = useState(0);
  const [honorarios, setHonorarios] = useState(0);
  const [isr, setIsr] = useState(0);
  const [estatus, setEstatus] = useState<EstatusEscritura>('por-liquidar');
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [savedEscritura, setSavedEscritura] = useState<Escritura | null>(null);
  const [draft, setDraft] = useState({ nombre: "", rol: "", telefono: "" });

  // Participantes
  const emptyParticipantForm: ParticipantForm = { nombre: "", rol: "", telefono: "" };

  const [participants, setParticipants] = useState<DraftParticipant[]>([]);
  const [participantModalOpen, setParticipantModalOpen] = useState(false);
  const [participantSide, setParticipantSide] = useState<"A" | "B">("A");
  const [participantForm, setParticipantForm] = useState<ParticipantForm>(emptyParticipantForm);
  const [editingParticipantId, setEditingParticipantId] = useState<string | null>(null);

  const tipoConfig = TIPOS_ESCRITURA.find((t) => t.value === tipo);

  const traslado = valorBase * 0.05;
  const subtotal =
    valorBase +
    traslado +
    IMPUESTOS_FIJOS.derechoRegistro +
    IMPUESTOS_FIJOS.certificadoCatastral +
    IMPUESTOS_FIJOS.constanciasAdeudo;

  const totalFinal = subtotal + honorarios + (tipo === 'compraventa' ? isr : 0);

  const presupuesto: Presupuesto = {
    valorBase,
    traslado,
    derechoRegistro: IMPUESTOS_FIJOS.derechoRegistro,
    certificadoCatastral: IMPUESTOS_FIJOS.certificadoCatastral,
    constanciasAdeudo: IMPUESTOS_FIJOS.constanciasAdeudo,
    subtotalPresupuesto: subtotal,
    honorarios,
    isr: tipo === 'compraventa' ? isr : 0,
    totalFinal,
  };

  const handleTipoSelect = (t: TipoEscritura) => {
    setTipo(t);
    const config = TIPOS_ESCRITURA.find((c) => c.value === t);
    if (config) {
      setPersonaA((prev) => ({ ...prev, rolLabel: config.personaALabel }));
      if (config.personaBLabel) setPersonaB((prev) => ({ ...prev, rolLabel: config.personaBLabel! }));
    }
  };

  const canProceed = () => {
    if (step === 0) return !!tipo;
    if (step === 1) {
      const baseOk = !!folioInterno && !!numeroEscritura;

      const aOk = participantsA.length >= 1;

      const bRequired = !!tipoConfig?.personaBLabel;
      const bOk = !bRequired || participantsB.length >= 1; 

      return baseOk && aOk && bOk;
    }
    if (step === 2) return valorBase > 0;
    if (step === 3) {
      const honorariosOk = honorarios > 0;

      const isrAplica = !!tipo && ISR_TIPOS.includes(tipo);
      const isrOk = !isrAplica || isr > 0;

      return honorariosOk && isrOk;
    }

    return true;
  };

  const handleSubmit = () => {
    toast.success('Escritura creada correctamente');
    // setSavedEscritura(escritura);
    setShowWhatsAppModal(true);
  };

  const handleSendWhatsApp = () => {
    toast.success('Recibo enviado por WhatsApp');
    setShowWhatsAppModal(false);
    if (savedEscritura) router.push(`/escrituras/${savedEscritura.id}`);
  };

  const handleSkipWhatsApp = () => {
    setShowWhatsAppModal(false);
    if (savedEscritura) router.push(`/escrituras/${savedEscritura.id}`);
  };

  const handleFinalSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // enviar a DB
  };

  const form = useForm<z.infer<typeof escrituraSchema>>({
    resolver: zodResolver(escrituraSchema),
    defaultValues: {
      tipo: '',
      folioInterno: '',
      numeroEscritura: '',
      fechaFirma: '',
      notas: '',
      participants: [],
      valorBase: 0,
      traslado: 0,
      presupuesto: 0,
      honorarios: 0,
      isr: 0,
      estatus: 'por-validar',
    },
    mode: 'onChange',
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "participants",
  });

  const addParticipant = () => {
    if (!draft.nombre || !draft.rol || !draft.telefono) return;

    append({
      nombre: draft.nombre.trim(),
      rol: draft.rol.trim(),
      telefono: draft.telefono.trim(),
    });

    setDraft({ nombre: "", rol: "", telefono: "" });
  };

  // Participante Modal--------------------------------------------------------------------------------------------------
  const openAddParticipantModal = (side: "A" | "B") => {
    setParticipantSide(side);
    setEditingParticipantId(null);

    // rol por default según el bloque donde das click
    const defaultRol =
      side === "A"
        ? (tipoConfig?.personaALabel ?? "Participante")
        : (tipoConfig?.personaBLabel ?? "Participante");

    setParticipantForm({ nombre: "", rol: defaultRol, telefono: "" });
    setParticipantModalOpen(true);
  };

  const openEditParticipantModal = (id: string) => {
    const p = participants.find((x) => x.id === id);
    if (!p) return;

    setEditingParticipantId(id);
    setParticipantSide(p.side);
    setParticipantForm({ nombre: p.nombre, rol: p.rol, telefono: p.telefono });
    setParticipantModalOpen(true);
  };

  const saveParticipantDraft = () => {
    const nombre = participantForm.nombre.trim();
    const rol = participantForm.rol.trim();
    const telefono = participantForm.telefono.trim();

    if (!nombre || !rol || !telefono) {
      toast.error("Completa nombre, rol y teléfono");
      return;
    }

    if (editingParticipantId) {
      setParticipants((prev) =>
        prev.map((p) =>
          p.id === editingParticipantId
            ? { ...p, nombre, rol, telefono, side: participantSide }
            : p
        )
      );
    } else {
      setParticipants((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          nombre,
          rol,
          telefono,
          side: participantSide,
        },
      ]);
    }

    setParticipantModalOpen(false);
    setEditingParticipantId(null);
    setParticipantForm(emptyParticipantForm);
  };

  const deleteParticipantDraft = (id: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  };

  // Participantes A
  const participantsA = participants.filter((p) => p.side === "A");
  const participantsB = participants.filter((p) => p.side === "B");
  //---------------------------------------------------------------------------------------------------------------------

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 animate-fade-in px-4 sm:px-6">
      <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">Nueva Escritura</h1>

      <Stepper steps={STEPS} step={step} />

      {/* Step Content */}
      <form onSubmit={handleFinalSubmit}>
        <Card className="shadow-premium">
          <CardContent className="p-4 sm:p-6">
            {step === 0 && (
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {TIPOS_ESCRITURA.map((t) => {
                  const Icon = iconMap[t.icon] || Scroll;

                  return (
                    <button
                      key={t.value}
                      onClick={() => handleTipoSelect(t.value)}
                      className={cn(
                        'p-3 sm:p-4 rounded-xl border-2 text-left transition-all hover:border-primary/50 cursor-pointer',
                        tipo === t.value ? 'border-primary bg-primary/5' : 'border-border'
                      )}
                    >
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6 mb-2 text-primary" />
                      <p className="font-medium text-sm sm:text-base">{t.label}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{t.description}</p>
                    </button>
                  );
                })}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4 sm:space-y-6">
                <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                  <div>
                    <Label>Folio Interno *</Label>
                    <Input
                      value={folioInterno}
                      onChange={(e) => setFolioInterno(e.target.value)}
                      placeholder="FI-2024-XXX"
                      className="text-sm"
                    />
                  </div>

                  <div>
                    <Label>Número de Escritura *</Label>
                    <Input
                      value={numeroEscritura}
                      onChange={(e) => setNumeroEscritura(e.target.value)}
                      placeholder="1234"
                      className="text-sm"
                    />
                  </div>

                  <div>
                    <Label>Fecha de Firma</Label>
                    <Input
                      type="date"
                      value={fechaFirma}
                      onChange={(e) => setFechaFirma(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                  {/* Persona A */}
                  <div className="space-y-3 p-3 sm:p-4 border rounded-lg">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-sm">{tipoConfig?.personaALabel}</p>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openAddParticipantModal("A")}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Agregar
                      </Button>
                    </div>



                    {/* Tabla drafts A */}
                    <ParticipantsTable
                      title={`Participantes (${tipoConfig?.personaALabel ?? "Persona A"})`}
                      items={participantsA}
                      onEdit={openEditParticipantModal}
                      onDelete={deleteParticipantDraft}
                      maxVisible={1}
                    />

                  </div>

                  {/* Persona B */}
                  {tipoConfig?.personaBLabel && (
                    <div className="space-y-3 p-3 sm:p-4 border rounded-lg">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-sm">{tipoConfig.personaBLabel}</p>

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => openAddParticipantModal("B")}
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Agregar
                        </Button>
                      </div>

                      {/* Tabla drafts B */}
                      <ParticipantsTable
                        title={`Participantes (${tipoConfig?.personaBLabel ?? "Persona B"})`}
                        items={participantsB}
                        onEdit={openEditParticipantModal}
                        onDelete={deleteParticipantDraft}
                        maxVisible={1}
                      />

                    </div>
                  )}
                </div>

                <div>
                  <Label>Notas</Label>
                  <Textarea
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    rows={3}
                    className="text-sm"
                  />
                </div>

                {/* ✅ Modal shadcn para agregar/editar */}
                <Dialog open={participantModalOpen} onOpenChange={setParticipantModalOpen}>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        {editingParticipantId ? "Editar participante" : "Agregar participante"}
                      </DialogTitle>
                      <DialogDescription>
                        Captura nombre, rol y teléfono. Se guardará como borrador hasta el envío final.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3">
                      <div>
                        <Label>Nombre *</Label>
                        <Input
                          value={participantForm.nombre}
                          onChange={(e) => setParticipantForm((p) => ({ ...p, nombre: e.target.value }))}
                        />
                      </div>

                      <div>
                        <Label>Rol *</Label>
                        <Input
                          value={participantForm.rol}
                          onChange={(e) => setParticipantForm((p) => ({ ...p, rol: e.target.value }))}
                        />
                      </div>

                      <div>
                        <Label>Teléfono *</Label>
                        <Input
                          value={participantForm.telefono}
                          onChange={(e) => setParticipantForm((p) => ({ ...p, telefono: e.target.value }))}
                          placeholder="2221234567"
                        />
                      </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setParticipantModalOpen(false)}
                      >
                        Cancelar
                      </Button>

                      <Button type="button" className="btn-accent" onClick={saveParticipantDraft}>
                        {editingParticipantId ? "Guardar cambios" : "Agregar"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}


            {step === 2 && (
              <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <Label>Valor Base (MXN)</Label>
                    <Input type="number" value={valorBase || ''} onChange={(e) => setValorBase(Number(e.target.value))} className="text-sm" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    El traslado (5%) y los impuestos fijos se calculan automáticamente.
                  </p>
                </div>
                <div className="p-3 sm:p-4 bg-muted/30 rounded-lg">
                  <BudgetBreakdown presupuesto={presupuesto} tipo={tipo!} showIsr={false} />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <Label>Honorarios (MXN)</Label>
                    <Input type="number" value={honorarios || ''} onChange={(e) => setHonorarios(Number(e.target.value))} className="text-sm" />
                  </div>

                  <div>
                    <Label>ISR (MXN)</Label>
                    <Input
                      type="number"
                      value={isr || ''}
                      onChange={(e) => setIsr(Number(e.target.value))}
                      disabled={tipo !== 'compraventa'}
                      className="text-sm"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {tipo === 'compraventa' ? 'ISR solo aplica al vendedor' : 'No aplica para este tipo'}
                    </p>
                  </div>
                </div>

                <div className="p-3 sm:p-4 bg-muted/30 rounded-lg">
                  <BudgetBreakdown presupuesto={presupuesto} tipo={tipo!} />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <div>
                  <Label>Estatus Inicial</Label>
                  <Select value={estatus} onValueChange={(v) => setEstatus(v as EstatusEscritura)}>
                    <SelectTrigger className="text-sm">
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
                </div>

                <div className="p-3 sm:p-4 bg-muted/30 rounded-lg space-y-2 text-sm">
                  <p className="text-sm">
                    <strong>Folio:</strong> {folioInterno} | <strong>Escritura:</strong> #{numeroEscritura}
                  </p>
                  <p className="text-sm">
                    <strong>Tipo:</strong> {tipoConfig?.label}
                  </p>
                  <p className="text-sm">
                    <strong>{personaA.rolLabel}:</strong> {personaA.nombre}
                  </p>
                  {personaB.nombre && (
                    <p className="text-sm">
                      <strong>{personaB.rolLabel}:</strong> {personaB.nombre}
                    </p>
                  )}
                  <BudgetBreakdown presupuesto={presupuesto} tipo={tipo!} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </form>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <Button
          variant="outline"
          onClick={() => (step === 0 ? router.push('/escrituras') : setStep((s) => s - 1))}
          className="w-full sm:w-auto"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {step === 0 ? 'Cancelar' : 'Anterior'}
        </Button>

        {step < STEPS.length - 1 ? (
          <Button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canProceed()}
            className="btn-accent w-full sm:w-auto cursor-pointer"
          >
            Siguiente
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} className="btn-accent w-full sm:w-auto">
            Guardar Escritura
          </Button>
        )}
      </div>

      {/* WhatsApp Modal */}
      <WhatsAppModal
        open={showWhatsAppModal}
        onOpenChange={setShowWhatsAppModal}
        escritura={savedEscritura}
        onSend={handleSendWhatsApp}
        onSkip={handleSkipWhatsApp}
      />
    </div>
  );
}
