
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth"; // tu instancia betterAuth
import { z } from "zod";
import { CreateUserSchema } from "@/features/users/schema";

export async function POST(req: Request) {
  const body = await req.json();

  const parsed = CreateUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Datos inválidos", errors: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { email, password, fullName, username, role } = parsed.data;
  // Better Auth admin create user
  const newUser = await auth.api.createUser({
    body: {
      email,
      password,
      name: fullName,
      role,
      data: {
        username,
        role
      },
    },
  });

  return NextResponse.json(newUser);
}