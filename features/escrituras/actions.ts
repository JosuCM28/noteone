"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";



export async function getTaxes() {
    return prisma.taxes.findMany(
        {
            select: {
                name: true,
                value: true,
            }
        }
    );
}