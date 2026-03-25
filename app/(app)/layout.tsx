// src/app/(app)/layout.tsx
import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { IdleLogout } from "@/components/layout/AutoLogOut";
import { getAuthUserRole } from "@/features/auth/actions";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const userRole = await getAuthUserRole();
  return (

    <AppShell userRole={userRole}>
      <IdleLogout />
      {children}
    </AppShell>);
}