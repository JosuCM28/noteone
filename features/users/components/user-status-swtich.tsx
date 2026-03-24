"use client";

import { useState, useTransition } from "react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { userStatusTable } from "@/features/users/action";

interface UserStatusSwitchProps {
  userId: string;
  initialChecked: boolean;
  disabled?: boolean;
}

export function UserStatusSwitch({
  userId,
  initialChecked,
  disabled = false,
}: UserStatusSwitchProps) {
  const [checked, setChecked] = useState(initialChecked);
  const [isPending, startTransition] = useTransition();

  const handleChange = (nextChecked: boolean) => {
    if (isPending || disabled) return;

    const previous = checked;
    setChecked(nextChecked);

    startTransition(async () => {
      try {
        await userStatusTable(userId, nextChecked);
        toast.success("Estado cambiado exitosamente");
      } catch (error) {
        setChecked(previous);
        console.error("Error cambiando estado", error);
        toast.error("Error cambiando estado");
      }
    });
  };

  return (
    <Switch
      checked={checked}
      disabled={disabled || isPending}
      onCheckedChange={handleChange}
    />
  );
}