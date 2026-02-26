'use server';
import { EscrituraNueva } from '@/features/escrituras'
import { getTaxes } from '@/features/settings/action'

const EscrituraNuevaPage = async () => {
  const taxes = await getTaxes();
  console.log(taxes);
  return (
    <EscrituraNueva taxes={taxes} />
  )
}

export default EscrituraNuevaPage