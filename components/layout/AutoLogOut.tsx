"use client";

import { useEffect, useRef } from "react";
import { authClient } from "@/lib/auth-client"; // tu instancia del cliente

const IDLE_MS = 30 * 60 * 1000;

export function IdleLogout() {
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reset = async () => {
    if (t.current) clearTimeout(t.current);
    t.current = setTimeout(async () => {
      await authClient.signOut(); // cierra sesión
      window.location.href = "/login";
    }, IDLE_MS);
  };

  useEffect(() => {
    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));

    reset(); // arranca el contador
    return () => {
      events.forEach((e) => window.removeEventListener(e, reset as any));
      if (t.current) clearTimeout(t.current);
    };
  }, []);

  return null;
}
