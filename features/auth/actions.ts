'use server';

import { auth } from '@/lib/auth';
import { SignInForm, SignUpForm } from './types';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export const signIn = async (values: SignInForm) => {
    const { username, password } = values;
    const res = await auth.api.signInUsername({
        body: {
            username,
            password,
        }

    })
return res;
}

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
