
import { clsx, type ClassValue } from "clsx"
import { Ban, Building, FileEdit, Gift, PenTool, Scroll, Users, XCircle, Home } from "lucide-react";
import { twMerge } from "tailwind-merge"

import { randomInt } from "crypto";
import { prisma } from "./prisma";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const iconMap: Record<string, any> = {
  scroll: Scroll,
  home: Home,
  gift: Gift,
  ban: Ban,
  'x-circle': XCircle,
  users: Users,
  'pen-tool': PenTool,
  building: Building,
  'file-edit': FileEdit,
};

const UI_TO_ENUM ={
certificadoCatastral: 'CERTIFICADO_CATASTRAL',
constanciaAdeudo: 'CONSTANCIAS_ADEUDOS',
derechoRegistro: 'DERECHO_REGISTRO',
porcentaje: 'TRASLADO'
}
export type UI_TYPES = keyof typeof UI_TO_ENUM

export function getTaxType(name: UI_TYPES) {
  return UI_TO_ENUM[name]
}

