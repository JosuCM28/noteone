import { redirect } from "next/navigation";
import { verificarEscritura } from "@/features/escrituras/action";
import { ShieldCheck, ShieldX, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const STATUS_LABELS: Record<string, string> = {
  por_liquidar: "Por Liquidar",
  liquidado: "Liquidado",
  proceso_pago: "En Proceso de Pago",
  registro: "En Registro",
  proceso_entrega: "En Proceso de Entrega",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

function formatMXN(amount: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(amount);
}

interface PageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function VerificarReciboPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const id = params.id?.trim() ?? "";

  let result: Awaited<ReturnType<typeof verificarEscritura>> = null;
  let searched = false;

  if (id) {
    searched = true;
    result = await verificarEscritura(id);
  }

  const participantesA = result?.participants.filter((p) => p.side === "A") ?? [];
  const participantesB = result?.participants.filter((p) => p.side === "B") ?? [];

  return (
    <div className="mx-auto max-w-2xl space-y-6 py-8 px-4">
      <div>
        <h1 className="font-serif text-2xl font-bold lg:text-3xl">
          Verificar Recibo
        </h1>
        <p className="text-muted-foreground mt-1">
          Ingresa el ID de la escritura para comprobar su autenticidad.
        </p>
      </div>

      {/* Search form */}
      <form
        action={async (formData: FormData) => {
          "use server";
          const id = (formData.get("id") as string | null)?.trim() ?? "";
          redirect(`/verificar-recibo?id=${encodeURIComponent(id)}`);
        }}
        className="flex gap-3"
      >
        <Input
          name="id"
          defaultValue={id}
          placeholder="Ej: clxyz1234abcd..."
          className="flex-1"
          autoComplete="off"
        />
        <Button type="submit" className="btn-accent cursor-pointer shrink-0">
          <Search className="mr-2 h-4 w-4" />
          Consultar
        </Button>
      </form>

      {/* Result */}
      {searched && (
        <>
          {result ? (
            <div className="space-y-4">
              {/* Verified banner */}
              <div className="flex items-center gap-3 rounded-xl border border-green-300 bg-green-50 px-5 py-4">
                <ShieldCheck className="h-7 w-7 shrink-0 text-green-600" />
                <div>
                  <p className="font-semibold text-green-800">
                    Escritura verificada
                  </p>
                  <p className="text-sm text-green-700">
                    Este comprobante existe y es auténtico en el sistema notarial.
                  </p>
                </div>
              </div>

              {/* Details card */}
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="border-b border-slate-200 bg-slate-50 px-5 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Datos de la Escritura
                  </p>
                </div>
                <div className="px-5 py-4 space-y-2 text-sm">
                  <Row label="ID" value={result.id} mono />
                  <Row label="Folio interno" value={result.folio} />
                  <Row label="No. de escritura" value={result.deedNumber ?? "En proceso"} />
                  <Row label="Tipo" value={result.typeLabel} />
                  <Row
                    label="Estatus"
                    value={STATUS_LABELS[result.status] ?? result.status}
                  />
                  <Row label="Total Parte A" value={formatMXN(result.totalA)} />
                  <Row label="Total Parte B" value={formatMXN(result.totalB)} />
                </div>

                {/* Participants */}
                {(participantesA.length > 0 || participantesB.length > 0) && (
                  <>
                    <div className="border-t border-slate-200 bg-slate-50 px-5 py-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Participantes
                      </p>
                    </div>
                    <div className="px-5 py-4 space-y-3 text-sm">
                      {participantesA.map((p, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                            Parte A
                          </span>
                          <span className="font-medium">{p.name}</span>
                          <span className="text-muted-foreground text-xs">
                            {p.role}
                          </span>
                        </div>
                      ))}
                      {participantesB.map((p, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                            Parte B
                          </span>
                          <span className="font-medium">{p.name}</span>
                          <span className="text-muted-foreground text-xs">
                            {p.role}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-xl border border-red-300 bg-red-50 px-5 py-4">
              <ShieldX className="h-7 w-7 shrink-0 text-red-600" />
              <div>
                <p className="font-semibold text-red-800">
                  Escritura no encontrada
                </p>
                <p className="text-sm text-red-700">
                  El ID proporcionado no corresponde a ninguna escritura en el sistema. Verifique que lo haya ingresado correctamente.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex gap-2">
      <span className="w-36 shrink-0 text-muted-foreground">{label}:</span>
      <span className={`font-medium break-all ${mono ? "font-mono text-xs" : ""}`}>
        {value}
      </span>
    </div>
  );
}
