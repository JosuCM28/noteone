"server-only"

import { PrismaClient } from "@/generated/prisma/client";
import {PrismaPg} from "@prisma/adapter-pg";

const globalFromPrisma = globalThis as unknown as { 
    prisma: PrismaClient | undefined
}

const adapter =new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
})

export const prisma = globalFromPrisma.prisma || new PrismaClient({
    adapter
})

if (process.env.NODE_ENV !== 'production') globalFromPrisma.prisma = prisma