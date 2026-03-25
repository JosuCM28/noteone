'use server';

import z from "zod";
import { CreateUserSchema, UpdateUserSchema, ResetPasswordSchema } from "./schema";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { signUp, signUpForAdmin } from "../auth/actions";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";


export async function postUser(values: z.infer<typeof CreateUserSchema>) {
    const parsed = CreateUserSchema.parse(values);

    const res = await signUpForAdmin({
        username: parsed.username,
        password: parsed.password,
        name: parsed.fullName,
        email: parsed.email,
        role: parsed.role,
    });

    return res;
}

export async function getUser(id: string) {
    const user = await prisma.user.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            username: true,
            isActive: true,
            createdAt: true,
        }
    })
    if (!user) {
        throw new Error("No se encontró el usuario");
    }
    return user;
}

export async function getUsers() {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            username: true,
            isActive: true,
            createdAt: true,
        }
    })
    return users;
}

export async function updateUser(id: string, values: z.infer<typeof UpdateUserSchema>) {
    const parsed = UpdateUserSchema.parse(values);
    const user = await prisma.user.update({
        where: {
            id,
        },
        data: {
            name: parsed.fullName,
            username: parsed.username,
            email: parsed.email,
            role: parsed.role,
        }
    })
    if (!user) {
        throw new Error("No se encontró el usuario");
    }
    return user;
}

export async function resetUserPassword(id: string, values: z.infer<typeof ResetPasswordSchema>) {
    const parsed = ResetPasswordSchema.parse(values);
    const res = await auth.api.setUserPassword({
        body: {
            newPassword: parsed.password,
            userId: id,
        },
        headers: await headers(),
    });
    return res;
}

export async function deleteUser(id: string) {
    const user = await prisma.user.findUnique({
        where: {
            id,
        }
    })
    if (!user) {
        throw new Error("No se encontró el usuario");
    }
    await prisma.user.delete({
        where: {
            id: user.id,
        }
    })
}


export async function userStatusTable(userId: string, isActive: boolean) {
    const user = await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            isActive
        }
    })
    if (!user) {
        throw new Error("No se encontró el usuario");
    }
    revalidatePath("/users");
}

