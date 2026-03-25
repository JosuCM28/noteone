import { DataTableDeed } from './data-table'
import { columnsList } from './columns'
import { getEscriturasForTable } from '@/features/escrituras/action'

interface EscrituraPageProps {
  searchParams: Promise<{ status?: string }>
}

const EscrituraPage = async ({ searchParams }: EscrituraPageProps) => {
  const { status } = await searchParams;

  const escrituras = await getEscriturasForTable();

  const safeEscrituras = escrituras.map((escritura) => ({
    ...escritura,
    baseValue: escritura.baseValue?.toNumber() ?? 0,
  }));

  return (
    <DataTableDeed
      columns={columnsList}
      data={safeEscrituras}
      initialStatus={status}
    />
  )
}

export default EscrituraPage
