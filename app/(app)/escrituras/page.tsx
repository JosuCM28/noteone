import { EscriturasLista } from '@/features/escrituras'
import { MOCK_ESCRITURAS } from '@/features/shared/data/mock-data'

const EscrituraPage = () => {
  return (
    <EscriturasLista escrituras={MOCK_ESCRITURAS} />
  )
}
export default EscrituraPage