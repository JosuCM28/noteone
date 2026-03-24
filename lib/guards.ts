'use server';
import { getAuthUserRole } from "@/features/auth/actions";
import { UserRol } from "@/features/auth/types";
import { notFound, redirect } from "next/navigation";

export async function requireRol(role: UserRol, mode: 'redirect' | 'notFound') {
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