"use client";

import { useState } from "react";
import { Download, Loader2, FileText, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { generatePDFBase64, type TipoPDF } from "../pdf/generate-pdf";

interface PDFActionsPanelProps {
  deedId: string;
  folio: string;
  hasParticipantesB: boolean;
}

function base64ToBlob(base64: string): Blob {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: "application/pdf" });
}

function triggerDownload(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function PDFActionsPanel({
  deedId,
  folio,
  hasParticipantesB,
}: PDFActionsPanelProps) {
  const [loading, setLoading] = useState<TipoPDF | null>(null);

  const handleDownload = async (tipo: TipoPDF) => {
    setLoading(tipo);
    try {
      const base64 = await generatePDFBase64(deedId, tipo);
      const blob = base64ToBlob(base64);
      const labels: Record<TipoPDF, string> = {
        A: "recibo-parte-a",
        B: "recibo-parte-b",
        admin: "reporte-admin",
      };
      triggerDownload(blob, `${labels[tipo]}-${folio}.pdf`);
      toast.success("PDF descargado correctamente");
    } catch {
      toast.error("Error al generar el PDF. Inténtelo de nuevo.");
    } finally {
      setLoading(null);
    }
  };

  const buttons: { tipo: TipoPDF; label: string; show: boolean }[] = [
    { tipo: "A", label: "Recibo Parte A", show: true },
    { tipo: "B", label: "Recibo Parte B", show: hasParticipantesB },
    { tipo: "admin", label: "Reporte Completo", show: true },
  ];

  return (
    <Card className="shadow-premium">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 font-serif text-base">
          <FileText className="h-4 w-4 text-primary" />
          Documentos PDF
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {buttons
          .filter((b) => b.show)
          .map(({ tipo, label }) => (
            <Button
              key={tipo}
              variant="outline"
              className="w-full justify-start gap-2 cursor-pointer"
              onClick={() => handleDownload(tipo)}
              disabled={loading !== null}
            >
              {loading === tipo ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileDown className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="flex-1 text-left text-sm">
                {loading === tipo ? "Generando..." : label}
              </span>
              {loading !== tipo && (
                <Download className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </Button>
          ))}
      </CardContent>
    </Card>
  );
}
