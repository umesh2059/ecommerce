"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);

    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setLoading(false);
      router.push("/");
      router.refresh();
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Log out"
      onClick={handleLogout}
      disabled={loading}
    >
      <LogOut className="size-5" />
    </Button>
  );
}