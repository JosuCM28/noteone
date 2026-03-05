import { EscrituraDetail, EscrituraEdit } from '@/features/escrituras'
import { getEscritura, getEscrituraForView } from '@/features/escrituras/action';



const EscrituraViewPage = async ({
    params,
}: {
    params: Promise<{ id: string }>;
}) => {
    const { id } = await params;
    const escritura = await getEscrituraForView(id);
    console.log(escritura);
    return (
        <EscrituraDetail escritura={escritura} />
    )
}
export default EscrituraViewPage