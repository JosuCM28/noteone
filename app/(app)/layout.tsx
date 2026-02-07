// src/app/(app)/layout.tsx
import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { IdleLogout } from "@/components/layout/AutoLogOut";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (

    <AppShell>
      <IdleLogout />
      {children}
      </AppShell>);
}