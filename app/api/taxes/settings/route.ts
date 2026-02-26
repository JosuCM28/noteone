import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // ajusta la ruta a tu prisma client

export async function PUT(req: Request) {
    const body = await req.json().catch(() => null);

    const tipo = body?.tipo as string | undefined;
    const rows = body?.rows as Array<{ key: string; name: string; value: number }> | undefined;

    if (!tipo || !Array.isArray(rows)) {
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // ✅ Seguridad: solo guardar rows que pertenezcan a ese tipo
    const safeRows = rows
        .filter((r) => r && r.key === tipo && typeof r.name === "string")
        .map((r) => ({
            key: tipo,
            name: r.name,
            value: String(Number(r.value ?? 0)), // Decimal safe
        }));

    try {
        await prisma.$transaction(async (tx) => {
            // ✅ reemplaza SOLO la config de ese tipo
            await tx.taxes.deleteMany({ where: { key: tipo } });

            if (safeRows.length) {
                await tx.taxes.createMany({ data: safeRows });
            }
        });

        return NextResponse.json({ ok: true });
    } catch (e: any) {
        return NextResponse.json(
            { error: e?.message ?? "DB error" },
            { status: 500 }
        );
    }
}