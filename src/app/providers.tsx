"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { PRIVY_APP_ID } from "@/lib/constants";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        loginMethods: ["google"],
        appearance: {
          theme: "light",
          accentColor: "#3182CE",
          logo: "/logo.png",
        },
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
