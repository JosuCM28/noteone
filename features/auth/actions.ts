'use server';

import { auth } from '@/lib/auth';
import { SignInForm, SignUpForm } from './types';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export const signIn = async (values: SignInForm) => {
    const { username, password } = values;

    // Verificar estado de la cuenta antes de intentar el login
    const user = await prisma.user.findFirst({
        where: { username },
        select: { isActive: true },
    });

    if (user && user.isActive === false) {
        return { error: 'ACCOUNT_DISABLED' as const };
    }

    const res = await auth.api.signInUsername({
        body: {
            username,
            password,
        }
    });
    return res;
}
//persona que se registra por su cuenta
export const signUp = async (values: SignUpForm) => {
    const { username, password, name, email } = values;
    const res = await auth.api.signUpEmail({
        body: {
            username,
            password,
            name,
            email,
        }
    })
    return res;
}
//la creacion de usuario para roles
export const signUpForAdmin = async (values: SignUpForm) => {
    const { username, password, name, email, role } = values;
    const newUser = await auth.api.createUser({
        body: {
            email, // required
            password, // required
            name, // required
            role,
            data: {
                username,
            },
        },

    });
    return newUser;
};

export async function getAuthUserId() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect('/login');
    }

    const userId = session.user.id;
    return userId;
}

export async function getAuthUserRole() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect('/login');
    }

    const userRole = session.user.role;
    return userRole;
}
