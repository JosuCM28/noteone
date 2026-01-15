'use client';
// Edit page - reuses the Nueva form with prefilled data
// For now, redirects to the detail page
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Construction } from 'lucide-react';
import Link from 'next/link';
import { Escritura } from '@/features/shared/types';

type EscrituraEditProps = {
  escritura: Escritura;
};

export default function EscrituraEdit({ escritura }: EscrituraEditProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useRouter();

  if (!escritura) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="text-xl font-semibold mb-2">Escritura no encontrada</h2>
        <Button asChild>
          <Link href="/escrituras">Volver a escrituras</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/escrituras/${id}`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="font-serif text-2xl font-bold">
          Editar Escritura: {escritura.folioInterno}
        </h1>
      </div>

      <Card className="shadow-premium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Construction className="h-5 w-5 text-warning" />
            Función en desarrollo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            La edición completa de escrituras estará disponible próximamente.
            Por ahora, puede cambiar el estatus desde la vista de detalle.
          </p>
          <Button asChild>
            <Link href={`/escrituras/${id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al detalle
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
