"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardDemoRedirect() {
  const router = useRouter();

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("lastEventId") : null;
    if (stored) {
      router.replace(`/dashboard/${stored}`);
    } else {
      router.replace("/organizer/dashboard");
    }
  }, [router]);

  return null;
}
