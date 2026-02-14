import { useState } from 'react';
import { Plus, Trash2, Edit2, Save, X, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Participante } from '@/features/shared/types';
import { cn } from '@/lib/utils';

interface ParticipantesManagerProps {
    participantes: Participante[];
    rolesDisponibles: string[];
    onAdd: (participante: Omit<Participante, 'id'>) => void;
    onUpdate: (id: string, updates: Partial<Participante>) => void;
    onRemove: (id: string) => void;
    minParticipantes?: number;
}

interface ParticipanteFormData {
    rol: string;
    nombre: string;
    telefono: string;
    email: string;
}

const emptyForm: ParticipanteFormData = {
    rol: '',
    nombre: '',
    telefono: '',
    email: '',
};

export function ParticipantesManager({
    participantes,
    rolesDisponibles,
    onAdd,
    onUpdate,
    onRemove,
    minParticipantes = 1,
}: ParticipantesManagerProps) {
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<ParticipanteFormData>(emptyForm);

    const handleSubmit = () => {
        if (!formData.rol || !formData.nombre || !formData.telefono) return;

        if (editingId) {
            onUpdate(editingId, {
                rol: formData.rol,
                nombre: formData.nombre,
                telefono: formData.telefono,
                email: formData.email || undefined,
            });
            setEditingId(null);
        } else {
            onAdd({
                rol: formData.rol,
                nombre: formData.nombre,
                telefono: formData.telefono,
                email: formData.email || undefined,
            });
        }

        setFormData(emptyForm);
        setShowForm(false);
    };

    const handleEdit = (participante: Participante) => {
        setFormData({
            rol: participante.rol,
            nombre: participante.nombre,
            telefono: participante.telefono,
            email: participante.email || '',
        });
        setEditingId(participante.id);
        setShowForm(true);
    };

    const handleCancel = () => {
        setFormData(emptyForm);
        setEditingId(null);
        setShowForm(false);
    };

    const canRemove = participantes.length > minParticipantes;

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
                            onClick={() => setShowForm(true)}
                        >
                            <Plus className="h-4 w-4 mr-1" />
                            Agregar
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* List of participants */}
                {participantes.length > 0 && (
                    <div className="space-y-2">
                        {participantes.map((p) => (
                            <div
                                key={p.id}
                                className={cn(
                                    'flex items-center justify-between p-3 rounded-lg border bg-muted/30',
                                    editingId === p.id && 'border-primary'
                                )}
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline">{p.rol}</Badge>
                                        <span className="font-medium truncate">{p.nombre}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {p.telefono}
                                        {p.email && ` • ${p.email}`}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1 ml-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
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
                                        className="text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add/Edit Form */}
                {showForm && (
                    <div className="p-4 border rounded-lg bg-background space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="font-medium">
                                {editingId ? 'Editar Participante' : 'Nuevo Participante'}
                            </h4>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={handleCancel}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <Label>Rol *</Label>
                                <Select
                                    value={formData.rol}
                                    onValueChange={(v) => setFormData((prev) => ({ ...prev, rol: v }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar rol" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {rolesDisponibles.map((rol) => (
                                            <SelectItem key={rol} value={rol}>
                                                {rol}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Nombre Completo *</Label>
                                <Input
                                    value={formData.nombre}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, nombre: e.target.value }))
                                    }
                                    placeholder="Nombre completo"
                                />
                            </div>
                            <div>
                                <Label>Teléfono *</Label>
                                <Input
                                    value={formData.telefono}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, telefono: e.target.value }))
                                    }
                                    placeholder="55 1234 5678"
                                />
                            </div>
                            <div>
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, email: e.target.value }))
                                    }
                                    placeholder="correo@ejemplo.com"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={handleCancel}>
                                Cancelar
                            </Button>
                            <Button
                                type="button"
                                onClick={handleSubmit}
                                disabled={!formData.rol || !formData.nombre || !formData.telefono}
                            >
                                <Save className="h-4 w-4 mr-1" />
                                {editingId ? 'Actualizar' : 'Agregar'}
                            </Button>
                        </div>
                    </div>
                )}

                {participantes.length === 0 && !showForm && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        No hay participantes agregados. Agrega al menos uno para continuar.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
