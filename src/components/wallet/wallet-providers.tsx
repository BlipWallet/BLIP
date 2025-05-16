"use client";

import { ReactNode, useMemo, useEffect, useState } from "react";
import { WagmiConfig, createConfig, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

// Solana 어댑터 CSS 임포트
import "@solana/wallet-adapter-react-ui/styles.css";

// WalletConnect 프로젝트 ID (실제 프로젝트에서는 환경 변수로 관리)
// https://cloud.walletconnect.com/에서 가입하고 프로젝트 ID를 받아야 합니다.
const projectId = "";

// 리액트 쿼리 클라이언트 생성
const queryClient = new QueryClient();

// 지갑 메타데이터 설정
const metadata = {
  name: "BLIP",
  description: "솔라나 블록체인 기반 월렛 서비스",
  url: "https://blip.com", // 프로젝트 URL
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

// Wagmi 설정 생성 (sepolia 테스트넷 사용)
const wagmiConfig = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(sepolia.rpcUrls.default.http[0]),
  },
});

// 전역 객체에 Wagmi 설정 할당
if (typeof window !== "undefined") {
  (window as any).wagmiConfig = wagmiConfig;
}

export function WalletProviders({ children }: { children: ReactNode }) {
  // 클라이언트 사이드 마운트 여부 확인
  const [mounted, setMounted] = useState(false);

  // Web3Modal 초기화 - 클라이언트 사이드에서만 실행
  useEffect(() => {
    setMounted(true);

    const initializeWeb3Modal = async () => {
      if (typeof window === "undefined") return;

      try {
        console.log("Web3Modal 초기화 시작...");

        // 모듈 동적 임포트
        let createWeb3Modal;
        try {
          const web3ModalModule = await import("@web3modal/wagmi");
          createWeb3Modal = web3ModalModule.createWeb3Modal;
          console.log("Web3Modal 모듈 임포트 성공");
        } catch (importError) {
          console.error("Web3Modal 모듈 임포트 실패:", importError);
          return;
        }

        // Web3Modal 인스턴스 생성 - 자동 연결 비활성화
        const web3ModalInstance = createWeb3Modal({
          wagmiConfig,
          projectId,
          featuredWalletIds: [], // 기본 지갑 목록
          themeMode: "light",
          themeVariables: {
            "--w3m-accent": "#3182CE", // 메인 색상
          },
          enableAnalytics: false, // 분석 기능 비활성화
          enableOnramp: false, // Onramp 기능 비활성화
        });

        console.log(
          "Web3Modal 초기화 완료:",
          web3ModalInstance ? "성공" : "실패"
        );
      } catch (error) {
        console.error("Web3Modal 초기화 오류:", error);
      }
    };

    if (mounted) {
      initializeWeb3Modal();
    }
  }, [mounted]);

  // 커스텀 RPC 엔드포인트 사용 (공개 RPC 엔드포인트는 요청 제한이 있음)
  const CUSTOM_RPC_ENDPOINT = "https://api.devnet.solana.com"; // 테스트넷 URL 사용

  // Solana 연결 설정
  const network = WalletAdapterNetwork.Mainnet; // 테스트넷으로 설정 (프로덕션에서는 Mainnet으로 변경)
  const endpoint = useMemo(() => CUSTOM_RPC_ENDPOINT, []);

  // Solana 지갑 어댑터 설정
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
    ],
    []
  );

  return (
    <QueryClientProvider client={queryClient}>
      {/* EVM 지갑 프로바이더 */}
      <WagmiConfig config={wagmiConfig}>
        {/* Solana 지갑 프로바이더 - 자동 연결 없음 */}
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider
            wallets={wallets}
            autoConnect={true}
            onError={(error) => console.error("솔라나 지갑 오류:", error)}
          >
            <WalletModalProvider>{children}</WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
}
