import { EscrituraEdit } from '@/features/escrituras'
import { getEscritura } from '@/features/escrituras/action';



const EscrituraPage = async ({
    params,
}: {
    params: Promise<{ id: string }>;
}) => {
    const { id } = await params;
    const escritura = await getEscritura(id);
    console.log(escritura);
    return (
        <EscrituraEdit escritura={escritura} />
    )
}
export default EscrituraPage