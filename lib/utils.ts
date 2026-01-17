
import { clsx, type ClassValue } from "clsx"
import { Ban, Building, FileEdit, Gift, PenTool, Scroll, Users, XCircle, Home } from "lucide-react";
import { twMerge } from "tailwind-merge"

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

