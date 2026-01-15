'use client';
import { useState } from 'react';

import { useRouter } from 'next/router';
import { ArrowLeft, ArrowRight, Check, Scroll, Home, Gift, Ban, XCircle, Users, PenTool, Building, FileEdit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { BudgetBreakdown } from '../components/BudgetBreakdown';
import { WhatsAppModal } from '../components/WhatsAppModal';
import { TIPOS_ESCRITURA, ESTATUS_CONFIG, IMPUESTOS_FIJOS } from '@/features/shared/data/mock-data';
import { TipoEscritura, EstatusEscritura, Persona, Presupuesto, Escritura } from '@/features/shared/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const iconMap: Record<string, any> = { scroll: Scroll, home: Home, gift: Gift, ban: Ban, 'x-circle': XCircle, users: Users, 'pen-tool': PenTool, building: Building, 'file-edit': FileEdit };
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

  const tipoConfig = TIPOS_ESCRITURA.find(t => t.value === tipo);
  const traslado = valorBase * 0.05;
  const subtotal = valorBase + traslado + IMPUESTOS_FIJOS.derechoRegistro + IMPUESTOS_FIJOS.certificadoCatastral + IMPUESTOS_FIJOS.constanciasAdeudo;
  const totalFinal = subtotal + honorarios + (tipo === 'compraventa' ? isr : 0);

  const presupuesto: Presupuesto = {
    valorBase, traslado,
    derechoRegistro: IMPUESTOS_FIJOS.derechoRegistro,
    certificadoCatastral: IMPUESTOS_FIJOS.certificadoCatastral,
    constanciasAdeudo: IMPUESTOS_FIJOS.constanciasAdeudo,
    subtotalPresupuesto: subtotal, honorarios,
    isr: tipo === 'compraventa' ? isr : 0, totalFinal,
  };

  const handleTipoSelect = (t: TipoEscritura) => {
    setTipo(t);
    const config = TIPOS_ESCRITURA.find(c => c.value === t);
    if (config) {
      setPersonaA(prev => ({ ...prev, rolLabel: config.personaALabel }));
      if (config.personaBLabel) setPersonaB(prev => ({ ...prev, rolLabel: config.personaBLabel! }));
    }
  };

  const canProceed = () => {
    if (step === 0) return !!tipo;
    if (step === 1) return folioInterno && numeroEscritura && personaA.nombre && personaA.telefono && (!tipoConfig?.personaBLabel || (personaB.nombre && personaB.telefono));
    return true;
  };

  const handleSubmit = () => {
    // const escritura = addEscritura({
    //   numeroEscritura, folioInterno, tipo: tipo!, estatus,
    //   fechaFirma: fechaFirma ? new Date(fechaFirma) : null,
    //   notas: notas || null,
    //   personaA, personaB: tipoConfig?.personaBLabel ? personaB : undefined,
    //   presupuesto, adjuntos: [],
    //   reciboEnviado: false,
    //   fechaUltimoEnvio: null,
    // });
    toast.success('Escritura creada correctamente');
    // setSavedEscritura(escritura);
    setShowWhatsAppModal(true);
  };

  const handleSendWhatsApp = () => {
    toast.success('Recibo enviado por WhatsApp');
    setShowWhatsAppModal(false);
    if (savedEscritura) {
      router.push(`/escrituras/${savedEscritura.id}`);
    }
  };

  const handleSkipWhatsApp = () => {
    setShowWhatsAppModal(false);
    if (savedEscritura) {
      router.push(`/escrituras/${savedEscritura.id}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <h1 className="font-serif text-2xl font-bold">Nueva Escritura</h1>

      {/* Stepper */}
      <div className="flex items-center justify-between">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center">
            <div className={cn('step-indicator', i < step ? 'completed' : i === step ? 'active' : 'pending')}>
              {i < step ? <Check className="h-5 w-5" /> : i + 1}
            </div>
            <span className={cn('ml-2 text-sm hidden sm:inline', i === step ? 'font-medium' : 'text-muted-foreground')}>{s}</span>
            {i < STEPS.length - 1 && <div className="w-8 lg:w-16 h-px bg-border mx-2" />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card className="shadow-premium">
        <CardContent className="p-6">
          {step === 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {TIPOS_ESCRITURA.map(t => {
                const Icon = iconMap[t.icon] || Scroll;
                return (
                  <button key={t.value} onClick={() => handleTipoSelect(t.value)}
                    className={cn('p-4 rounded-xl border-2 text-left transition-all hover:border-primary/50', tipo === t.value ? 'border-primary bg-primary/5' : 'border-border')}>
                    <Icon className="h-6 w-6 mb-2 text-primary" />
                    <p className="font-medium">{t.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t.description}</p>
                  </button>
                );
              })}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label>Folio Interno *</Label><Input value={folioInterno} onChange={e => setFolioInterno(e.target.value)} placeholder="FI-2024-XXX" /></div>
                <div><Label>Número de Escritura *</Label><Input value={numeroEscritura} onChange={e => setNumeroEscritura(e.target.value)} placeholder="1234" /></div>
                <div><Label>Fecha de Firma</Label><Input type="date" value={fechaFirma} onChange={e => setFechaFirma(e.target.value)} /></div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-3 p-4 border rounded-lg">
                  <p className="font-medium text-sm">{tipoConfig?.personaALabel}</p>
                  <div><Label>Nombre *</Label><Input value={personaA.nombre} onChange={e => setPersonaA(p => ({ ...p, nombre: e.target.value }))} /></div>
                  <div><Label>Teléfono *</Label><Input value={personaA.telefono} onChange={e => setPersonaA(p => ({ ...p, telefono: e.target.value }))} /></div>
                </div>
                {tipoConfig?.personaBLabel && (
                  <div className="space-y-3 p-4 border rounded-lg">
                    <p className="font-medium text-sm">{tipoConfig.personaBLabel}</p>
                    <div><Label>Nombre *</Label><Input value={personaB.nombre} onChange={e => setPersonaB(p => ({ ...p, nombre: e.target.value }))} /></div>
                    <div><Label>Teléfono *</Label><Input value={personaB.telefono} onChange={e => setPersonaB(p => ({ ...p, telefono: e.target.value }))} /></div>
                  </div>
                )}
              </div>
              <div><Label>Notas</Label><Textarea value={notas} onChange={e => setNotas(e.target.value)} rows={3} /></div>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <div><Label>Valor Base (MXN)</Label><Input type="number" value={valorBase || ''} onChange={e => setValorBase(Number(e.target.value))} /></div>
                <p className="text-sm text-muted-foreground">El traslado (5%) y los impuestos fijos se calculan automáticamente.</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg"><BudgetBreakdown presupuesto={presupuesto} tipo={tipo!} showIsr={false} /></div>
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <div><Label>Honorarios (MXN)</Label><Input type="number" value={honorarios || ''} onChange={e => setHonorarios(Number(e.target.value))} /></div>
                <div>
                  <Label>ISR (MXN)</Label>
                  <Input type="number" value={isr || ''} onChange={e => setIsr(Number(e.target.value))} disabled={tipo !== 'compraventa'} />
                  <p className="text-xs text-muted-foreground mt-1">{tipo === 'compraventa' ? 'ISR solo aplica al vendedor' : 'No aplica para este tipo'}</p>
                </div>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg"><BudgetBreakdown presupuesto={presupuesto} tipo={tipo!} /></div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div><Label>Estatus Inicial</Label>
                <Select value={estatus} onValueChange={v => setEstatus(v as EstatusEscritura)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{ESTATUS_CONFIG.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                <p><strong>Folio:</strong> {folioInterno} | <strong>Escritura:</strong> #{numeroEscritura}</p>
                <p><strong>Tipo:</strong> {tipoConfig?.label}</p>
                <p><strong>{personaA.rolLabel}:</strong> {personaA.nombre}</p>
                {personaB.nombre && <p><strong>{personaB.rolLabel}:</strong> {personaB.nombre}</p>}
                <BudgetBreakdown presupuesto={presupuesto} tipo={tipo!} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => step === 0 ? router.push('/escrituras') : setStep(s => s - 1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />{step === 0 ? 'Cancelar' : 'Anterior'}
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={() => setStep(s => s + 1)} disabled={!canProceed()} className="btn-accent">
            Siguiente<ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} className="btn-accent">
            <Check className="h-4 w-4 mr-2" />Guardar Escritura
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
