import Link from 'next/link';
import {
  FileText,
  Clock,
  Truck,
  CheckCircle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/features/escrituras/components/StatusBadge';
import type { EstatusEscritura } from '@/features/shared/types';

/* ─── tipos locales ─────────────────────────────────── */
type Stats = {
  total: number;
  porLiquidar: number;
  enRegistro: number;
  entregadas: number;
};

type RecentWriting = {
  id: string;
  folio: string;
  deedNumber: string | null;
  typeLabel: string;
  status: string;
  totalA: number;
  totalB: number;
  participantA: { name: string } | null;
  participantB: { name: string } | null;
};

type DashboardProps = {
  userName: string;
  stats: Stats;
  recentWritings: RecentWriting[];
};

function formatMXN(n: number) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(n);
}

function pct(part: number, total: number) {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}

type KpiCardProps = {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconBg: string;
  bar?: { value: number; total: number; color: string };
  trending?: string;
  href: string;
};

function KpiCard({ label, value, icon, iconBg, bar, trending, href }: KpiCardProps) {
  return (
    <Link href={href} className="block group">
      <Card className="metric-card transition-shadow hover:shadow-md cursor-pointer h-full">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                {label}
              </p>
              <p className="text-2xl sm:text-3xl font-bold mt-1">{value}</p>
            </div>
            <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}>
              {icon}
            </div>
          </div>

          {/* Trending (solo Total) */}
          {trending && (
            <div className="mt-3 sm:mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-success shrink-0" />
              <span className="text-success font-medium">{trending}</span>
              <span>vs. mes anterior</span>
            </div>
          )}

          {/* Barra de progreso */}
          {bar && (
            <div className="mt-3 sm:mt-4">
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${bar.color}`}
                  style={{ width: `${pct(bar.value, bar.total)}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

/* ─── componente principal ──────────────────────────── */
export default function Dashboard({ userName, stats, recentWritings }: DashboardProps) {
  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto sm:p-6 lg:p-8 pt-10 sm:pt-8 lg:pt-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-2xl lg:text-3xl font-bold tracking-tight font-serif">
            Bienvenido, {userName}
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

      {/* KPIs */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Total Escrituras"
          value={stats.total}
          icon={<FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />}
          iconBg="bg-primary/10"
          trending="+12%"
          href="/escrituras"
        />
        <KpiCard
          label="Pendiente de Pago"
          value={stats.porLiquidar}
          icon={<Clock className="h-5 w-5 sm:h-6 sm:w-6 text-warning" />}
          iconBg="bg-warning/10"
          bar={{ value: stats.porLiquidar, total: stats.total, color: 'bg-warning' }}
          href="/escrituras?status=por_liquidar"
        />
        <KpiCard
          label="En Registro"
          value={stats.enRegistro}
          icon={<Truck className="h-5 w-5 sm:h-6 sm:w-6 text-info" />}
          iconBg="bg-info/10"
          bar={{ value: stats.enRegistro, total: stats.total, color: 'bg-info' }}
          href="/escrituras?status=registro"
        />
        <KpiCard
          label="Entregadas"
          value={stats.entregadas}
          icon={<CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-success" />}
          iconBg="bg-success/10"
          bar={{ value: stats.entregadas, total: stats.total, color: 'bg-success' }}
          href="/escrituras?status=entregado"
        />
      </div>

      {/* Últimas escrituras */}
      <Card className="shadow-premium">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-serif">Últimas Escrituras</CardTitle>
            <CardDescription>Las escrituras más recientes en el sistema</CardDescription>
          </div>
          <Button variant="outline" asChild className="cursor-pointer">
            <Link href="/escrituras">
              Ver todas
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>

        <CardContent>
          {recentWritings.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="font-medium mb-1">No hay escrituras</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Comience creando su primera escritura
              </p>
              <Button asChild className="btn-accent">
                <Link href="/escrituras/new">Crear escritura</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table-premium w-full">
                <thead>
                  <tr>
                    <th className="uppercase tracking-wide text-xs text-muted-foreground font-semibold">
                      Folio
                    </th>
                    <th className="uppercase tracking-wide text-xs text-muted-foreground font-semibold">
                      Tipo
                    </th>
                    <th className="uppercase tracking-wide text-xs text-muted-foreground font-semibold hidden md:table-cell">
                      Persona(s)
                    </th>
                    <th className="uppercase tracking-wide text-xs text-muted-foreground font-semibold hidden sm:table-cell">
                      Total
                    </th>
                    <th className="uppercase tracking-wide text-xs text-muted-foreground font-semibold">
                      Estatus
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentWritings.map((w) => (
                    <tr key={w.id} className="hover:bg-muted/40 transition-colors">
                      {/* Folio */}
                      <td className="py-4">
                        <Link
                          href={`/escrituras/${w.id}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {w.folio}
                        </Link>
                        {w.deedNumber && (
                          <p className="text-xs text-muted-foreground">#{w.deedNumber}</p>
                        )}
                      </td>

                      {/* Tipo */}
                      <td className="text-sm py-4">{w.typeLabel}</td>

                      {/* Personas */}
                      <td className="hidden md:table-cell text-sm py-4">
                        {w.participantA && (
                          <p className="font-medium">{w.participantA.name}</p>
                        )}
                        {w.participantB && (
                          <p className="text-xs text-muted-foreground">
                            {w.participantB.name}
                          </p>
                        )}
                        {!w.participantA && !w.participantB && (
                          <span className="text-muted-foreground italic">—</span>
                        )}
                      </td>

                      {/* Total */}
                      <td className="hidden sm:table-cell font-semibold text-sm py-4">
                        {formatMXN(w.totalA + w.totalB)}
                      </td>

                      {/* Estatus */}
                      <td className="py-4">
                        <StatusBadge status={w.status as EstatusEscritura} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
