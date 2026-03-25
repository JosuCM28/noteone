"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2, Edit2, Save, X, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Side = "A" | "B";

export type DraftParticipant = {
  id: string;
  role: string;
  side: Side; // ✅ ahora siempre vive en el participante
  name: string;
  phone: string | null;
  email?: string | null;
};

interface ParticipantesManagerProps {
  participantes: DraftParticipant[];
  rolesDisponibles: string[];

  /**
   * ✅ Pásalos desde tu pantalla:
   * personaARoleLabel={tipoConfig?.personaALabel}
   * personaBRoleLabel={tipoConfig?.personaBLabel}
   *
   * Si no los pasas, se infiere:
   * rolesDisponibles[0] -> A, rolesDisponibles[1] -> B (si existe)
   */
  personaARoleLabel?: string;
  personaBRoleLabel?: string;

  onAdd: (participante: Omit<DraftParticipant, "id">) => void;
  onUpdate: (id: string, updates: Partial<Omit<DraftParticipant, "id">>) => void;
  onRemove: (id: string) => void;
  minParticipantes?: number;
}

type ParticipantFormData = {
  role: string;
  side: Side; // ✅ side controlado automáticamente
  name: string;
  phone: string;
  email: string;
};

const emptyForm: ParticipantFormData = {
  role: "",
  side: "A",
  name: "",
  phone: "",
  email: "",
};

function sideFromRole(params: {
  role: string;
  personaARoleLabel?: string;
  personaBRoleLabel?: string;
  rolesDisponibles: string[];
}): Side {
  const { role, personaARoleLabel, personaBRoleLabel, rolesDisponibles } = params;

  // 1) si viene explícito, úsalo
  if (personaARoleLabel && role === personaARoleLabel) return "A";
  if (personaBRoleLabel && role === personaBRoleLabel) return "B";

  // 2) fallback: asume que el 1er rol es A y el 2do es B
  if (rolesDisponibles[0] && role === rolesDisponibles[0]) return "A";
  if (rolesDisponibles[1] && role === rolesDisponibles[1]) return "B";

  // 3) default seguro
  return "A";
}

export function ParticipantesManager({
  participantes,
  rolesDisponibles,
  personaARoleLabel,
  personaBRoleLabel,
  onAdd,
  onUpdate,
  onRemove,
  minParticipantes = 1,
}: ParticipantesManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ParticipantFormData>(emptyForm);

  const canRemove = participantes.length > minParticipantes;

  const inferred = useMemo(() => {
    return {
      personaA: personaARoleLabel ?? rolesDisponibles[0] ?? "",
      personaB: personaBRoleLabel ?? rolesDisponibles[1] ?? "",
    };
  }, [personaARoleLabel, personaBRoleLabel, rolesDisponibles]);

  const handleSubmit = () => {
    if (!formData.role || !formData.name || !formData.phone) return;

    // ✅ fuerza side siempre de acuerdo al rol seleccionado
    const forcedSide = sideFromRole({
      role: formData.role,
      personaARoleLabel: inferred.personaA || undefined,
      personaBRoleLabel: inferred.personaB || undefined,
      rolesDisponibles,
    });

    if (editingId) {
      onUpdate(editingId, {
        role: formData.role,
        side: forcedSide,
        name: formData.name,
        phone: formData.phone || null,
        email: formData.email || null,
      });
      setEditingId(null);
    } else {
      onAdd({
        role: formData.role,
        side: forcedSide,
        name: formData.name,
        phone: formData.phone || null,
        email: formData.email || null,
      });
    }

    setFormData(emptyForm);
    setShowForm(false);
  };

  const handleEdit = (p: DraftParticipant) => {
    setFormData({
      role: p.role,
      side: p.side ?? "A",
      name: p.name,
      phone: p.phone ?? "",
      email: p.email ?? "",
    });
    setEditingId(p.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5" />
            Participantes
            <Badge variant="secondary" className="ml-2">
              {participantes.length}
            </Badge>
          </CardTitle>

          {!showForm && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={() => setShowForm(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Agregar
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* List */}
        {participantes.length > 0 && (
          <div className="space-y-2">
            {participantes.map((p) => (
              <div
                key={p.id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border bg-muted/30",
                  editingId === p.id && "border-primary"
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{p.role}</Badge>
                    <Badge variant="secondary">{p.side}</Badge>
                    <span className="font-medium truncate">{p.name}</span>
                  </div>

                  <p className="text-sm text-muted-foreground mt-1">
                    {p.phone ?? "—"}
                    {p.email ? ` • ${p.email}` : ""}
                  </p>
                </div>

                <div className="flex items-center gap-1 ml-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="cursor-pointer"
                    onClick={() => handleEdit(p)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(p.id)}
                    disabled={!canRemove}
                    className="cursor-pointer text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="p-4 border rounded-lg bg-background space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">
                {editingId ? "Editar Participante" : "Nuevo Participante"}
              </h4>
              <Button type="button" variant="ghost" size="icon" className="cursor-pointer" onClick={handleCancel}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="mb-3">Role *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(v) => {
                    // ✅ al cambiar role, forzar side automáticamente
                    const forcedSide = sideFromRole({
                      role: v,
                      personaARoleLabel: inferred.personaA || undefined,
                      personaBRoleLabel: inferred.personaB || undefined,
                      rolesDisponibles,
                    });

                    setFormData((prev) => ({
                      ...prev,
                      role: v,
                      side: forcedSide,
                    }));
                  }}
                >
                  <SelectTrigger className="w-full ">
                    <SelectValue placeholder="Selecciona role" />
                  </SelectTrigger>
                  <SelectContent>
                    {rolesDisponibles.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

              </div>

              <div>
                <Label className="mb-3">Nombre Completo*</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Milton Stanley"
                />
              </div>

              <div>
                <Label className="mb-3">Numero de Telefono*</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="55 1234 5678"
                />
              </div>

              <div>
                <Label className="mb-3">Correo</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="mail@example.com"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" className="cursor-pointer" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button
                type="button"
                className="cursor-pointer"
                onClick={handleSubmit}
                disabled={!formData.role || !formData.name || !formData.phone}
              >
                <Save className="h-4 w-4 mr-1" />
                {editingId ? "Actualizar" : "Agregar"}
              </Button>
            </div>
          </div>
        )}

        {participantes.length === 0 && !showForm && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No hay participantes, agrega al menos uno para continuar.
          </p>
        )}
      </CardContent>
    </Card>
  );
}