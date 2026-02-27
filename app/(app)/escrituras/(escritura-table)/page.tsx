import { EscriturasLista } from '@/features/escrituras'
import { MOCK_ESCRITURAS } from '@/features/shared/data/mock-data'
import { DataTableDeed } from './data-table'
import { columnsList } from './columns'
import { getEscriturasForTable } from '@/features/escrituras/action'

const EscrituraPage = async () => {
  const escrituras = await getEscriturasForTable();

  const safeEscrituras = escrituras.map((escritura) => ({
    ...escritura,
    baseValue: escritura.baseValue?.toNumber() ?? 0,
  }));

  return (
    // <EscriturasLista escrituras={MOCK_ESCRITURAS} />
    <DataTableDeed columns={columnsList} data={safeEscrituras} />
  )
}
export default EscrituraPage