
import { clsx, type ClassValue } from "clsx"
import { Ban, Building, FileEdit, Gift, PenTool, Scroll, Users, XCircle, Home } from "lucide-react";
import { twMerge } from "tailwind-merge"

import { randomInt } from "crypto";
import { prisma } from "./prisma";
import { EstatusEscritura } from "@/features/shared/types";
import { ESTATUS_CONFIG } from "@/features/shared/data/mock-data";
import { get } from "http";

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

const UI_TO_ENUM = {
  certificadoCatastral: 'CERTIFICADO_CATASTRAL',
  constanciaAdeudo: 'CONSTANCIAS_ADEUDOS',
  derechoRegistro: 'DERECHO_REGISTRO',
  porcentaje: 'TRASLADO'
}
export type UI_TYPES = keyof typeof UI_TO_ENUM

export function getTaxType(name: UI_TYPES) {
  return UI_TO_ENUM[name]
}

export const getRandomFolio = () => {
  const year = new Date().getFullYear();
  const random = crypto.getRandomValues(new Uint32Array(1))[0] % 900000 + 100000;
  return `FI-${year}-${random}`;
}

export function getStatusMeta(status: EstatusEscritura) {
  return ESTATUS_CONFIG.find((s) => s.value === status);
}
export function getStatusLabel(status: EstatusEscritura) {
  return getStatusMeta(status)?.label ?? status;
}
