'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Scroll, UserPlus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Stepper } from '@/components/shared/Stepper';
import { BudgetBreakdown } from '../components/BudgetBreakdown';
import { WhatsAppModal } from '../components/WhatsAppModal';
import { ParticipantsTable } from '../components/ParticipantsTable';

import {
  TIPOS_ESCRITURA,
  ESTATUS_CONFIG,
  IMPUESTOS_FIJOS,
} from '@/features/shared/data/mock-data';

import {
  TipoEscritura,
  EstatusEscritura,
  Presupuesto,
  Escritura,
  DraftParticipant,
  Tax,
} from '@/features/shared/types';

import { cn, iconMap } from '@/lib/utils';
import { toast } from 'sonner';

import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';

import { EscrituraSchema, ParticipantSchema } from '@/features/auth/schemas';


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Field, FieldError, FieldLabel } from '@/components/ui/field';

interface EscrituraNuevaProps {
  taxes: Tax[];
}

// Si aplica ISR para estos tipos
const ISR_TIPOS: TipoEscritura[] = ['compraventa', 'donacion'];
const STEPS = ['Tipo', 'Datos', 'Presupuesto', 'Honorarios', 'Confirmar'];

/**
 * Helpers RHF
 */
function shouldShowError(fieldState: any, submitCount: number) {
  return (fieldState.isTouched || submitCount > 0) && !!fieldState.error;
}

function numberFromInput(value: string) {
  // "" => undefined (para que Zod pueda decidir si es válido)
  if (value === '') return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}


export default function EscrituraNueva({ taxes }: EscrituraNuevaProps) {
  const router = useRouter();

  // Stepper y UI
  const [step, setStep] = useState(0);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [savedEscritura, setSavedEscritura] = useState<Escritura | null>(null);

  // Participantes (draft UI)
  const [participants, setParticipants] = useState<DraftParticipant[]>([]);
  const [participantModalOpen, setParticipantModalOpen] = useState(false);
  const [participantSide, setParticipantSide] = useState<'A' | 'B'>('A');
  const [editingParticipantId, setEditingParticipantId] = useState<string | null>(
    null
  );
  const getRandomFolio = () => {
    const year = new Date().getFullYear();
    const random = crypto.getRandomValues(new Uint32Array(1))[0] % 900000 + 100000;
    return `FI-${year}-${random}`;
  }

  /**
   * RHF principal (Escritura)
   */
  const form = useForm<z.infer<typeof EscrituraSchema>>({
    resolver: zodResolver(EscrituraSchema),
    defaultValues: {
      tipo: '',
      folioInterno: getRandomFolio(),
      numeroEscritura: '',
      notas: '',
      participants: [],
      valorBase: 0,
      traslado: 0,
      presupuesto: 0,
      honorarios: 0,
      isr: 0,
      estatus: 'por-liquidar',
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const values = useWatch({
    control: form.control,
  });
  useEffect(() => {
    console.log(values);
  }, [values]);

  const submitCount = form.formState.submitCount;


  // Observa valores RHF (sin estados duplicados)
  const tipo = useWatch({ control: form.control, name: 'tipo' }) as
    | TipoEscritura
    | '';
  const folioInterno = useWatch({ control: form.control, name: 'folioInterno' });
  const numeroEscritura = useWatch({
    control: form.control,
    name: 'numeroEscritura',
  });
  const notas = useWatch({ control: form.control, name: 'notas' });

  const valorBase = useWatch({ control: form.control, name: 'valorBase' }) || 0;
  const honorarios = useWatch({ control: form.control, name: 'honorarios' }) || 0;
  const isr = useWatch({ control: form.control, name: 'isr' }) || 0;
  const estatus = useWatch({ control: form.control, name: 'estatus' }) as
    | EstatusEscritura
    | undefined;

  // Config del tipo seleccionado
  const tipoConfig = useMemo(
    () => TIPOS_ESCRITURA.find((t) => t.value === tipo),
    [tipo]
  );

  // Participantes A/B
  const participantsA = useMemo(
    () => participants.filter((p) => p.side === 'A'),
    [participants]
  );
  const participantsB = useMemo(
    () => participants.filter((p) => p.side === 'B'),
    [participants]
  );

  /**
   * Mantén `participants` también dentro del form principal (para submit final).
   */
  useEffect(() => {
    form.setValue(
      'participants',
      participants.map((p) => ({
        nombre: p.nombre,
        rol: p.rol,
        telefono: p.telefono,
      })),
      { shouldValidate: true, shouldDirty: true }
    );
  }, [participants, form]);

  /**
   * Cálculos (misma lógica, pero sin estados duplicados)
   * Nota: mantengo tus reglas tal cual.
   */
  const traslado = useMemo(() => {
    const rate = taxes.find((t) => t.name === "TRASLADO")?.value ?? 0;
    return valorBase * rate;
  }, [valorBase, taxes]);

  // Si tu schema tiene campo traslado, lo puedes mantener sincronizado
  useEffect(() => {
    form.setValue('traslado', traslado, { shouldDirty: true });
  }, [traslado, form]);

  const subtotal = useMemo(() => {
    return (
      valorBase +
      traslado +
      IMPUESTOS_FIJOS.derechoRegistro +
      IMPUESTOS_FIJOS.certificadoCatastral +
      IMPUESTOS_FIJOS.constanciasAdeudo
    );
  }, [valorBase, traslado]);

  const totalFinal = useMemo(() => {
    // mantengo tu lógica sin cambiar intención
    const base = subtotal + honorarios;

    const extra =
      tipo === 'compraventa'
        ? isr || 0
        : tipo === 'donacion'
          ? traslado
          : 0;

    return base + extra;
  }, [subtotal, honorarios, tipo, isr, traslado]);

  const presupuesto: Presupuesto = useMemo(
    () => ({
      valorBase,
      traslado,
      derechoRegistro: taxes.find((t) => t.name === 'DERECHO_REGISTRO')?.value ?? 0,
      certificadoCatastral: taxes.find((t) => t.name === 'CERTIFICADO_CATASTALES')?.value ?? 0,
      constanciasAdeudo: taxes.find((t) => t.name === 'CONSTANCIAS_ADEUTOS')?.value ?? 0,
      subtotalPresupuesto: subtotal,
      honorarios,
      isr: tipo === 'compraventa' ? isr : 0,
      totalFinal,
    }),
    [valorBase, traslado, subtotal, honorarios, isr, tipo, totalFinal]
  );

  /**
   * Reset cuando cambias de tipo (sin tocar lógica, pero actualiza RHF también)
   */
  const resetDraftByType = () => {
    setParticipants([]);
    setParticipantModalOpen(false);
    setEditingParticipantId(null);
    setParticipantSide('A');

    form.reset(
      {
        ...form.getValues(),
        folioInterno: getRandomFolio(),
        numeroEscritura: '',
        notas: '',
        participants: [],
        valorBase: 0,
        traslado: 0,
        presupuesto: 0,
        honorarios: 0,
        isr: 0,
        estatus: 'por-validar',
      },
      {
        keepDefaultValues: true,
      }
    );
  };

  const handleTipoSelect = (t: TipoEscritura) => {
    if (tipo && tipo !== t) resetDraftByType();
    form.setValue('tipo', t, { shouldDirty: true, shouldValidate: true });
  };

  /**
   * Validación de navegación (misma lógica)
   */
  const canProceed = () => {
    if (step === 0) return !!tipo;

    if (step === 1) {
      const folio = form.getValues('folioInterno')?.trim();
      const numero = form.getValues('numeroEscritura')?.trim();

      const baseOk = !!folio && !!numero;

      const aOk = participantsA.length >= 1;

      const bRequired = !!tipoConfig?.personaBLabel;
      const bOk = !bRequired || participantsB.length >= 1;

      return baseOk && aOk && bOk;
    }

    if (step === 2) return (form.getValues('valorBase') || 0) > 0;

    if (step === 3) {
      const honorariosOk = (form.getValues('honorarios') || 0) > 0;
      const isrAplica = !!tipo && ISR_TIPOS.includes(tipo);
      const isrOk = !isrAplica || ((form.getValues('isr') || 0) > 0);
      return honorariosOk && isrOk;
    }

    return true;
  };

  const handleBack = () => {
    if (step === 0) return router.push('/escrituras');
    setStep((s) => s - 1);
  };

  const handleNext = async () => {
    if (step === STEPS.length - 1) {
      // dispara submit real de RHF
      await form.handleSubmit(handleFinalSubmit)();
      return;
    }
    setStep((s) => s + 1);
  };

  /**
   * Submit final (misma intención; aquí tú llamas tu saveEscritura)
   */
  const handleFinalSubmit = async (values: z.infer<typeof EscrituraSchema>) => {
    try {
      // Mantén sincronizados valores calculados
      const payload = {
        ...values,
        traslado,
        presupuesto: totalFinal, // si tu schema usa "presupuesto" como total
      };

      // TODO: reemplaza con tu función real:
      // const res = await saveEscritura(payload);
      // if (!res?.escritura) { ... }

      toast.success('Escritura creada correctamente');
      // setSavedEscritura(res.escritura);
      setSavedEscritura(null);
      setShowWhatsAppModal(true);
    } catch (error) {
      console.log(error);
      toast.error('Error al guardar escritura');
    }
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

  /**
   * Modal RHF para participante (sin estado duplicado para inputs)
   */
  const participantRHF = useForm<z.infer<typeof ParticipantSchema>>({
    resolver: zodResolver(ParticipantSchema),
    defaultValues: { nombre: '', rol: '', telefono: '' },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const openAddParticipantModal = (side: 'A' | 'B') => {
    setParticipantSide(side);
    setEditingParticipantId(null);

    const defaultRol =
      side === 'A'
        ? (tipoConfig?.personaALabel ?? 'Participante')
        : (tipoConfig?.personaBLabel ?? 'Participante');

    participantRHF.reset({ nombre: '', rol: defaultRol, telefono: '' });
    setParticipantModalOpen(true);
  };

  const openEditParticipantModal = (id: string) => {
    const p = participants.find((x) => x.id === id);
    if (!p) return;

    setEditingParticipantId(id);
    setParticipantSide(p.side);

    participantRHF.reset({
      nombre: p.nombre ?? '',
      rol: p.rol ?? '',
      telefono: p.telefono ?? '',
    });

    setParticipantModalOpen(true);
  };

  const deleteParticipantDraft = (id: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  };

  const upsertParticipantDraft = (data: z.infer<typeof ParticipantSchema>) => {
    const nombre = data.nombre.trim();
    const rol = data.rol.trim();
    const telefono = data.telefono.trim();

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
    participantRHF.reset({ nombre: '', rol: '', telefono: '' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 animate-fade-in px-4 sm:px-6">
      <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
        Nueva Escritura
      </h1>

      <Stepper steps={STEPS} step={step} />

      <form onSubmit={form.handleSubmit(handleFinalSubmit)} className="space-y-6">
        <Card className="shadow-premium">
          <CardContent className="p-4 sm:p-6">
            {/* STEP 0 */}
            {step === 0 && (
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {TIPOS_ESCRITURA.map((t) => {
                  const Icon = iconMap[t.icon] || Scroll;

                  return (
                    <button
                      type="button"
                      key={t.value}
                      onClick={() => handleTipoSelect(t.value)}
                      className={cn(
                        'p-3 sm:p-4 rounded-xl border-2 text-left transition-all hover:border-primary/50 cursor-pointer',
                        tipo === t.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border'
                      )}
                    >
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6 mb-2 text-primary" />
                      <p className="font-medium text-sm sm:text-base">{t.label}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {t.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}

            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-4 sm:space-y-6">
                <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                  <Controller
                    name="folioInterno"
                    control={form.control}
                    render={({ field, fieldState }) => {
                      const showError = shouldShowError(fieldState, submitCount);
                      return (
                        <Field data-invalid={showError}>
                          <FieldLabel htmlFor="folioInterno">
                            Folio Interno <span className="text-red-500">*</span>
                          </FieldLabel>
                          <Input
                            {...field}
                            id="folioInterno"
                            type="text"
                            aria-invalid={showError}
                            placeholder="FI-Year-Number-XXX"
                            className="input-focus"
                           readOnly
                          />
                          {showError && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      );
                    }}
                  />

                  <Controller
                    name="numeroEscritura"
                    control={form.control}
                    render={({ field, fieldState }) => {
                      const showError = shouldShowError(fieldState, submitCount);
                      return (
                        <Field data-invalid={showError}>
                          <FieldLabel htmlFor="numeroEscritura">
                            Número de Escritura <span className="text-red-500">*</span>
                          </FieldLabel>
                          <Input
                            {...field}
                            id="numeroEscritura"
                            type="text"
                            aria-invalid={showError}
                            placeholder="1234"
                            className="input-focus"
                            disabled={form.formState.isSubmitting}
                          />
                          {showError && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      );
                    }}
                  />
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
                        onClick={() => openAddParticipantModal('A')}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Agregar
                      </Button>
                    </div>

                    <ParticipantsTable
                      title={`Participantes (${tipoConfig?.personaALabel ?? 'Persona A'})`}
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
                          onClick={() => openAddParticipantModal('B')}
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Agregar
                        </Button>
                      </div>

                      <ParticipantsTable
                        title={`Participantes (${tipoConfig?.personaBLabel ?? 'Persona B'})`}
                        items={participantsB}
                        onEdit={openEditParticipantModal}
                        onDelete={deleteParticipantDraft}
                        maxVisible={1}
                      />
                    </div>
                  )}
                </div>

                <Controller
                  name="notas"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    const showError = shouldShowError(fieldState, submitCount);
                    return (
                      <Field data-invalid={showError}>
                        <FieldLabel htmlFor="notas">Notas</FieldLabel>
                        <Textarea
                          {...field}
                          id="notas"
                          rows={3}
                          className="text-sm"
                          disabled={form.formState.isSubmitting}
                        />
                        {showError && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    );
                  }}
                />

                {/* Modal participante */}
                <Dialog
                  open={participantModalOpen}
                  onOpenChange={(open) => {
                    setParticipantModalOpen(open);
                    if (!open) return;
                    // el reset ya se hace al abrir (add/edit)
                  }}
                >
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        {editingParticipantId ? 'Editar participante' : 'Agregar participante'}
                      </DialogTitle>
                      <DialogDescription>
                        Captura nombre, rol y teléfono. Se guardará como borrador hasta el envío final.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3">
                      <Controller
                        name="nombre"
                        control={participantRHF.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={!!fieldState.error}>
                            <FieldLabel>Nombre *</FieldLabel>
                            <Input {...field} />
                            {fieldState.error && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />

                      <Controller
                        name="rol"
                        control={participantRHF.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={!!fieldState.error}>
                            <FieldLabel>Rol *</FieldLabel>
                            <Input {...field} />
                            {fieldState.error && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />

                      <Controller
                        name="telefono"
                        control={participantRHF.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={!!fieldState.error}>
                            <FieldLabel>Teléfono *</FieldLabel>
                            <Input {...field} placeholder="2221234567" />
                            {fieldState.error && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setParticipantModalOpen(false);
                          participantRHF.reset({ nombre: '', rol: '', telefono: '' });
                        }}
                      >
                        Cancelar
                      </Button>

                      <Button
                        type="button"
                        className="btn-accent"
                        onClick={participantRHF.handleSubmit(upsertParticipantDraft)}
                        disabled={!participantRHF.formState.isValid}
                      >
                        {editingParticipantId ? 'Guardar cambios' : 'Agregar'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
                <div>
                  <Controller
                    name="valorBase"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={!!fieldState.error}>
                        <FieldLabel>Valor Base (MXN)</FieldLabel>
                        <Input
                          type="number"
                          value={field.value === 0 ? '' : String(field.value ?? '')}
                          onChange={(e) => field.onChange(numberFromInput(e.target.value) ?? 0)}
                          className="text-sm"
                          placeholder="0"
                        />
                        {fieldState.error && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <p className="text-sm text-muted-foreground pt-3 lg:ml-2">
                    El traslado y los impuestos fijos se calculan automáticamente.
                  </p>
                </div>

                <div className="sm:p-4 bg-muted/30 rounded-lg">
                  <BudgetBreakdown
                    presupuesto={presupuesto}
                    tipo={tipo as TipoEscritura}
                    showIsr={false}
                  />
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
                <div className="space-y-4">
                  <Controller
                    name="honorarios"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={!!fieldState.error}>
                        <FieldLabel>Honorarios (MXN)</FieldLabel>
                        <Input
                          type="number"
                          value={field.value === 0 ? '' : String(field.value ?? '')}
                          onChange={(e) => field.onChange(numberFromInput(e.target.value) ?? 0)}
                          className="text-sm"
                          placeholder="0"
                        />
                        {fieldState.error && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <Controller
                    name="isr"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={!!fieldState.error}>
                        <FieldLabel>ISR (MXN)</FieldLabel>
                        <Input
                          type="number"
                          value={field.value === 0 ? '' : String(field.value ?? '')}
                          onChange={(e) => field.onChange(numberFromInput(e.target.value) ?? 0)}
                          disabled={tipo !== 'compraventa'}
                          className="text-sm"
                          placeholder="0"
                        />
                        {fieldState.error && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </div>

                <div className="p-3 sm:p-4 bg-muted/30 rounded-lg">
                  <BudgetBreakdown presupuesto={presupuesto} tipo={tipo as TipoEscritura} />
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div className="space-y-4">
                <Controller
                  name="estatus"
                  control={form.control}
                  render={({ field }) => (
                    <div className='ml-4 flex gap-2'>
                      <Label >Estatus Inicial:</Label>
                      <Select
                        value={field.value}
                        onValueChange={(v) => field.onChange(v)}
                      >
                        <SelectTrigger >
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
                  )}
                />

                <div className="p-3 sm:p-4 bg-muted/30 rounded-lg space-y-2 text-sm">
                  <p className="text-sm">
                    <strong>Folio:</strong> {folioInterno} | <strong>Escritura:</strong> #
                    {numeroEscritura}
                  </p>
                  <p className="text-sm">
                    <strong>Tipo:</strong> {tipoConfig?.label}
                  </p>

                  <BudgetBreakdown presupuesto={presupuesto} tipo={tipo as TipoEscritura} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </form>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <Button variant="outline" onClick={handleBack} className="w-full sm:w-auto">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {step === 0 ? 'Cancelar' : 'Anterior'}
        </Button>

        <Button
          type="button"
          onClick={handleNext}
          disabled={!canProceed()}
          className="btn-accent w-full sm:w-auto cursor-pointer"
        >
          {step === STEPS.length - 1 ? 'Crear Escritura' : 'Siguiente'}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

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
