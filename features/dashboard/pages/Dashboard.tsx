import Link  from 'next/link';
import { FileText, Clock, Truck, CheckCircle, ArrowRight, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/features/escrituras/components/StatusBadge';
import { Money } from '@/components/shared/Money';
import { TIPOS_ESCRITURA } from '@/features/shared/data/mock-data';
import { Escritura } from '@/features/shared/types';

type DashboardProps = {
  escrituras: Escritura[];
};


export default function Dashboard({ escrituras }: DashboardProps) {
  const stats = {
    total: escrituras.length,
    porLiquidar: escrituras.filter(e => e.estatus === 'por-liquidar').length,
    enRegistro: escrituras.filter(e => e.estatus === 'registro').length,
    entregadas: escrituras.filter(e => e.estatus === 'entregado').length,
  };

  const recentEscrituras = escrituras.slice(0, 5);

  const getTipoLabel = (tipo: string) => {
    return TIPOS_ESCRITURA.find(t => t.value === tipo)?.label || tipo;
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto sm:p-6 lg:p-8 pt-10 sm:pt-8 lg:pt-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
            Bienvenido Josue{/* Bienvenido, {user?.nombre.split(' ')[0]} */}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Aquí está el resumen de actividad de la notaría
          </p>
        </div>
        <Button asChild className="btn-accent w-full sm:w-fit">
          <Link href="/escrituras/new">
            Nueva escritura
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="metric-card">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Total Escrituras</p>
                <p className="text-2xl sm:text-3xl font-bold mt-1">{stats.total}</p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-success shrink-0" />
              <span className="text-success font-medium">+12%</span>
              <span className="hidden sm:inline">vs. mes anterior</span>
              <span className="sm:hidden">vs mes anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Por Liquidar</p>
                <p className="text-2xl sm:text-3xl font-bold mt-1">{stats.porLiquidar}</p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-warning/10 flex items-center justify-center flex-shrink-0">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-warning" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-warning rounded-full transition-all duration-500"
                  style={{ width: `${stats.total ? (stats.porLiquidar / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">En Registro</p>
                <p className="text-2xl sm:text-3xl font-bold mt-1">{stats.enRegistro}</p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-info/10 flex items-center justify-center flex-shrink-0">
                <Truck className="h-5 w-5 sm:h-6 sm:w-6 text-info" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-info rounded-full transition-all duration-500"
                  style={{ width: `${stats.total ? (stats.enRegistro / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Entregadas</p>
                <p className="text-2xl sm:text-3xl font-bold mt-1">{stats.entregadas}</p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-success" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-success rounded-full transition-all duration-500"
                  style={{ width: `${stats.total ? (stats.entregadas / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Escrituras */}
      <Card className="shadow-premium">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle >Últimas Escrituras</CardTitle>
            <CardDescription>Las escrituras más recientes en el sistema</CardDescription>
          </div>
          <Button variant="outline" asChild>
            <Link href="/escrituras">
              Ver todas
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="table-premium">
              <thead>
                <tr>
                  <th>Folio</th>
                  <th>Tipo</th>
                  <th className="hidden md:table-cell">Persona(s)</th>
                  <th className="hidden sm:table-cell">Total</th>
                  <th>Estatus</th>
                </tr>
              </thead>
              <tbody>
                {recentEscrituras.map((escritura) => (
                  <tr key={escritura.id} className="group">
                    <td>
                      <Link 
                        href={`/escrituras/${escritura.id}`}
                        className="font-medium hover:text-primary transition-colors"
                      >
                        {escritura.folioInterno}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        #{escritura.numeroEscritura}
                      </p>
                    </td>
                    <td className="text-sm">
                      {getTipoLabel(escritura.tipo)}
                    </td>
                    <td className="hidden md:table-cell text-sm">
                      <p>{escritura.personaA.nombre}</p>
                      {escritura.personaB && (
                        <p className="text-muted-foreground text-xs">
                          {escritura.personaB.nombre}
                        </p>
                      )}
                    </td>
                    <td className="hidden sm:table-cell">
                      <Money amount={escritura.presupuesto.totalFinal} className="text-sm" />
                    </td>
                    <td>
                      <StatusBadge status={escritura.estatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {escrituras.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="font-medium mb-1">No hay escrituras</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Comience creando su primera escritura
              </p>
              <Button asChild className="btn-accent">
                <Link href="/escrituras/nueva">Crear escritura</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
