"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AuthCheckProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function AuthCheck({ children, redirectTo = "/login" }: AuthCheckProps) {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push(redirectTo);
    }
  }, [ready, authenticated, router, redirectTo]);

  if (!ready || !authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}
