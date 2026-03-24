'use server';

import z from "zod";
import { CreateUserSchema } from "./schema";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { signUp, signUpForAdmin } from "../auth/actions";
import { revalidatePath } from "next/cache";


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

export async function updateUser(id: string, values: z.infer<typeof CreateUserSchema>) {
    const user = await prisma.user.update({
        where: {
            id,
        },
        data: {
            name: values.fullName,
            username: values.username,
            email: values.email,
            password: values.password,
            role: values.role,
        }
    })
    if (!user) {
        throw new Error("No se encontró el usuario");
    }
    return user;
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

