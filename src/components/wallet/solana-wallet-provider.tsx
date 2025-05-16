"use client";

import { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

// 기본 스타일 가져오기
import "@solana/wallet-adapter-react-ui/styles.css";

interface SolanaWalletProviderProps {
  children: React.ReactNode;
}

// 커스텀 RPC 엔드포인트 (RPC 서비스 제공업체 URL로 변경 필요)
const CUSTOM_RPC_ENDPOINT = "";

export function SolanaWalletProvider({ children }: SolanaWalletProviderProps) {
  // 네트워크 선택 (메인넷 또는 개발용 테스트넷)
  const network = WalletAdapterNetwork.Mainnet;
  // const network = WalletAdapterNetwork.Devnet;

  // 엔드포인트 생성 - 커스텀 RPC 엔드포인트 사용
  const endpoint = useMemo(() => CUSTOM_RPC_ENDPOINT, []);
  // 기존 코드: const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // 지갑 어댑터 생성
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
