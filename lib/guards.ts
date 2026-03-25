'use server';
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAuthUserRole } from "@/features/auth/actions";
import { UserRol } from "@/features/auth/types";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

/** Verifica que la cuenta esté activa; si fue deshabilitada, redirige al login */
export async function requireActiveAccount() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return;

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { isActive: true },
    });

    if (user && user.isActive === false) {
        redirect('/login?disabled=1');
    }
}

export async function requireRol(role: UserRol, mode: 'redirect' | 'notFound') {
    await requireActiveAccount();
    const userRole = await getAuthUserRole();
    if (userRole !== role) {
        if (mode === 'redirect') redirect('/login');
        notFound();
    }
}

export async function requiereAdmin() {
    await requireRol('admin', 'redirect');
}
export async function requiereUser() {
    await requireRol('user', 'redirect');
}

