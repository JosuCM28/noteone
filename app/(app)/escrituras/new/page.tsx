'use server';
import { EscrituraNueva } from '@/features/escrituras'
import { getTaxes } from '@/features/escrituras/actions';

const EscrituraNuevaPage = async () => {
  const taxes = await getTaxes();
  const taxesUI = taxes.map((t) => ({ ...t, value: Number(t.value) }));
  console.log(taxes);
  return (
    <EscrituraNueva taxes={taxesUI} />
  )
}

export default EscrituraNuevaPage