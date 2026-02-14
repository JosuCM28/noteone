import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { EstatusEscritura } from '@/features/shared/types';
import { ESTATUS_CONFIG } from '@/features/shared/data/mock-data';

interface DatosGeneralesSectionProps {
  folioInterno: string;
  numeroEscritura: string;
  fechaFirma: string;
  notas: string;
  estatus: EstatusEscritura;
  onFolioInternoChange: (value: string) => void;
  onNumeroEscrituraChange: (value: string) => void;
  onFechaFirmaChange: (value: string) => void;
  onNotasChange: (value: string) => void;
  onEstatusChange: (value: EstatusEscritura) => void;
}

export function DatosGeneralesSection({
  folioInterno,
  numeroEscritura,
  fechaFirma,
  notas,
  estatus,
  onFolioInternoChange,
  onNumeroEscrituraChange,
  onFechaFirmaChange,
  onNotasChange,
  onEstatusChange,
}: DatosGeneralesSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="h-5 w-5" />
          Datos Generales
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Label>Folio Interno *</Label>
            <Input
              value={folioInterno}
              onChange={(e) => onFolioInternoChange(e.target.value)}
              placeholder="FI-2024-XXX"
            />
          </div>
          <div>
            <Label>Número de Escritura *</Label>
            <Input
              value={numeroEscritura}
              onChange={(e) => onNumeroEscrituraChange(e.target.value)}
              placeholder="1234"
            />
          </div>
          <div>
            <Label>Fecha de Firma</Label>
            <Input
              type="date"
              value={fechaFirma}
              onChange={(e) => onFechaFirmaChange(e.target.value)}
            />
          </div>
          <div>
            <Label>Estatus Inicial</Label>
            <Select value={estatus} onValueChange={(v) => onEstatusChange(v as EstatusEscritura)}>
              <SelectTrigger>
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
        </div>
        <div>
          <Label>Notas</Label>
          <Textarea
            value={notas}
            onChange={(e) => onNotasChange(e.target.value)}
            placeholder="Notas adicionales sobre la escritura..."
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
}
