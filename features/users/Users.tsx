'use client';
import { useState } from 'react';
import { Plus, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserRole } from '@/features/shared/types';

export default function Usuarios() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState({ nombre: '', usuario: '', password: '', rol: 'operador' as UserRole });

    const openNew = () => { setEditId(null); setForm({ nombre: '', usuario: '', password: '', rol: 'operador' }); setDialogOpen(true); };


    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-serif text-2xl lg:text-3xl font-bold">Usuarios</h1>
                    <p className="text-muted-foreground">Administrar usuarios del sistema</p>
                </div>
                <Button onClick={openNew} className="btn-accent"><Plus className="h-4 w-4 mr-2" />Nuevo usuario</Button>
            </div>

            <Card className="shadow-premium">
                <CardContent className="p-0">
                    <table className="table-premium">
                        <thead><tr><th>Nombre</th><th>Usuario</th><th>Rol</th><th>Estado</th><th className="hidden sm:table-cell">Creado</th><th>Acciones</th></tr></thead>

                    </table>
                </CardContent>
            </Card>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>{editId ? 'Editar Usuario' : 'Nuevo Usuario'}</DialogTitle></DialogHeader>
                    <div className="space-y-4">
                        <div><Label>Nombre completo</Label><Input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} /></div>
                        <div><Label>Usuario</Label><Input value={form.usuario} onChange={e => setForm(f => ({ ...f, usuario: e.target.value }))} /></div>
                        <div><Label>{editId ? 'Nueva contraseña (opcional)' : 'Contraseña'}</Label><Input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} /></div>
                        <div><Label>Rol</Label>
                            <Select value={form.rol} onValueChange={v => setForm(f => ({ ...f, rol: v as UserRole }))}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent><SelectItem value="admin">Administrador</SelectItem><SelectItem value="operador">Operador</SelectItem></SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter><Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button><Button className="btn-accent">Guardar</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
