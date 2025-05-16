"use client";

import { useState, useEffect } from "react";
import {
  fetchQuote,
  Quote,
  swapFromSolana,
  swapFromEvm,
} from "@mayanfinance/swap-sdk";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import { Button } from "@/components/ui/button";
import { WalletConnectButton } from "@/components/wallet/wallet-connect-button";
import { Connection } from "@solana/web3.js";

// 네트워크 환경 상수
const IS_TEST_ENVIRONMENT = false;

// 지원되는 체인 타입 정의
type ChainName =
  | "solana"
  | "ethereum"
  | "bsc"
  | "avalanche"
  | "polygon"
  | "arbitrum"
  | "optimism"
  | "base";

// 토큰 타입 정의
interface Token {
  name: string;
  contract: string;
  isTestnet?: boolean;
}

// Quote 타입 확장
interface SwapQuote extends Quote {
  outAmount: number;
  minOutAmount: number;
  eta: number;
  fee: number;
}

// 지원되는 체인 정의
const SUPPORTED_CHAINS = [
  { id: "solana" as ChainName, name: "Solana", symbol: "SOL" },
  { id: "ethereum" as ChainName, name: "Ethereum", symbol: "ETH" },
  { id: "bsc" as ChainName, name: "Binance Smart Chain", symbol: "BNB" },
  { id: "avalanche" as ChainName, name: "Avalanche", symbol: "AVAX" },
  { id: "polygon" as ChainName, name: "Polygon", symbol: "MATIC" },
  { id: "arbitrum" as ChainName, name: "Arbitrum", symbol: "ETH" },
  { id: "optimism" as ChainName, name: "Optimism", symbol: "ETH" },
  { id: "base" as ChainName, name: "Base", symbol: "ETH" },
];

// 테스트넷 토큰 정의
const TESTNET_TOKENS: Record<ChainName, Token[]> = {
  solana: [
    {
      name: "SOL",
      contract: "So11111111111111111111111111111111111111112",
      isTestnet: true,
    },
    {
      name: "USDC",
      contract: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
      isTestnet: true,
    }, // Devnet USDC
  ],
  ethereum: [
    {
      name: "ETH",
      contract: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      isTestnet: true,
    },
    {
      name: "USDC",
      contract: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
      isTestnet: true,
    }, // Sepolia USDC
  ],
  // 다른 체인은 기존과 동일하게 유지
  bsc: [
    { name: "BNB", contract: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" },
    { name: "USDT", contract: "0x55d398326f99059ff775485246999027b3197955" },
  ],
  avalanche: [
    { name: "AVAX", contract: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" },
    { name: "USDC", contract: "0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e" },
  ],
  polygon: [
    { name: "MATIC", contract: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" },
    { name: "USDC", contract: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174" },
  ],
  arbitrum: [
    { name: "ETH", contract: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" },
    { name: "USDC", contract: "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8" },
  ],
  optimism: [
    { name: "ETH", contract: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" },
    { name: "USDC", contract: "0x7f5c764cbc14f9669b88837ca1490cca17c31607" },
  ],
  base: [
    { name: "ETH", contract: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" },
    { name: "USDC", contract: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913" },
  ],
};

// 메인넷 토큰 정의 (기존 코드와 동일)
const MAINNET_TOKENS: Record<ChainName, Token[]> = {
  solana: [
    { name: "SOL", contract: "So11111111111111111111111111111111111111112" },
    { name: "USDC", contract: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" },
  ],
  ethereum: [
    { name: "ETH", contract: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" },
    { name: "USDC", contract: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" },
  ],
  bsc: [
    { name: "BNB", contract: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" },
    { name: "USDT", contract: "0x55d398326f99059ff775485246999027b3197955" },
  ],
  avalanche: [
    { name: "AVAX", contract: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" },
    { name: "USDC", contract: "0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e" },
  ],
  polygon: [
    { name: "MATIC", contract: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" },
    { name: "USDC", contract: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174" },
  ],
  arbitrum: [
    { name: "ETH", contract: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" },
    { name: "USDC", contract: "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8" },
  ],
  optimism: [
    { name: "ETH", contract: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" },
    { name: "USDC", contract: "0x7f5c764cbc14f9669b88837ca1490cca17c31607" },
  ],
  base: [
    { name: "ETH", contract: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" },
    { name: "USDC", contract: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913" },
  ],
};

// 환경에 따라 토큰 목록 선택
const TOKENS = IS_TEST_ENVIRONMENT ? TESTNET_TOKENS : MAINNET_TOKENS;

export function SwapForm() {
  // 상태 관리
  const [fromChain, setFromChain] = useState<ChainName>("solana");
  const [toChain, setToChain] = useState<ChainName>("ethereum");
  const [fromToken, setFromToken] = useState<Token>(TOKENS[fromChain][0]);
  const [toToken, setToToken] = useState<Token>(TOKENS[toChain][0]);
  const [amount, setAmount] = useState("0.01");
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<SwapQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [swapping, setSwapping] = useState(false);
  const [error, setError] = useState("");
  const [txHash, setTxHash] = useState("");

  // 솔라나 지갑 연결
  const {
    publicKey: solanaWallet,
    signTransaction,
    connected: solanaConnected,
  } = useWallet();
  const { connection } = useConnection();

  // 이더리움 지갑 연결 상태
  const [ethConnected, setEthConnected] = useState(false);

  // 출발 체인이 변경되면 해당 체인의 첫 번째 토큰으로 설정
  useEffect(() => {
    setFromToken(TOKENS[fromChain][0]);
  }, [fromChain]);

  // 도착 체인이 변경되면 해당 체인의 첫 번째 토큰으로 설정
  useEffect(() => {
    setToToken(TOKENS[toChain][0]);
  }, [toChain]);

  // 이더리움 지갑 연결 상태 체크 - 더 이상 자동으로 체크하지 않도록 수정
  useEffect(() => {
    // 실제 연결 상태는 WalletConnectButton에서 관리하므로 여기서는 간소화
    const checkEthWalletConnection = async () => {
      if (typeof window !== "undefined" && (window as any).ethereum) {
        try {
          const accounts = await (window as any).ethereum.request({
            method: "eth_accounts",
          });
          setEthConnected(accounts.length > 0);
        } catch (error) {
          console.error("이더리움 지갑 확인 오류:", error);
          setEthConnected(false);
        }
      } else {
        setEthConnected(false);
      }
    };

    // 주기적으로 확인하지 않고 필요할 때만 확인
    if (fromChain !== "solana") {
      checkEthWalletConnection();
    }
  }, [fromChain]);

  // 체인 전환 함수
  const switchChains = () => {
    const tempChain = fromChain;
    const tempToken = fromToken;

    setFromChain(toChain);
    setFromToken(toToken);
    setToChain(tempChain);
    setToToken(tempToken);
  };

  // 현재 선택된 체인에 맞는 지갑이 연결되어 있는지 확인
  const isWalletConnected = () => {
    if (fromChain === "solana") {
      return solanaConnected && solanaWallet;
    } else {
      return ethConnected;
    }
  };

  // 견적 가져오기
  const getQuote = async () => {
    setLoading(true);
    setError("");
    setQuotes([]);
    setSelectedQuote(null);
    setTxHash("");

    try {
      const amountNumber = parseFloat(amount);

      if (isNaN(amountNumber) || amountNumber <= 0) {
        throw new Error("유효한 금액을 입력해주세요");
      }

      console.log("견적 요청 정보:", {
        amount: amountNumber,
        fromToken: fromToken.contract,
        toToken: toToken.contract,
        fromChain,
        toChain,
        isTestnet: IS_TEST_ENVIRONMENT,
      });

      // 타입 캐스팅을 통해 isTestnet 속성 추가
      const quoteParams = {
        amount: amountNumber,
        fromToken: fromToken.contract,
        toToken: toToken.contract,
        fromChain,
        toChain,
        slippageBps: 300, // 3% 슬리피지
        gasDrop: 0.001, // 목적지 체인에서 가스비로 사용할 금액
      };

      // 테스트넷인 경우 isTestnet 추가 (SDK가 지원하는 경우)
      const quoteParamsWithTestnet = IS_TEST_ENVIRONMENT
        ? { ...quoteParams, isTestnet: IS_TEST_ENVIRONMENT, network: "testnet" }
        : quoteParams;

      console.log("견적 요청 정보:", quoteParamsWithTestnet);

      const fetchedQuotes = await fetchQuote(
        quoteParamsWithTestnet as any // 타입 캐스팅
      );

      console.log("받은 견적:", fetchedQuotes);
      setQuotes(fetchedQuotes);

      if (fetchedQuotes.length > 0) {
        // Quote 객체를 SwapQuote로 타입 캐스팅
        setSelectedQuote(fetchedQuotes[0] as unknown as SwapQuote);
      } else {
        setError("사용 가능한 견적이 없습니다.");
      }
    } catch (err) {
      console.error("견적 가져오기 오류:", err);
      setError(
        err instanceof Error
          ? err.message
          : "견적을 가져오는 중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  // 솔라나 트랜잭션 서명 래퍼 함수
  const signSolanaTransaction = async (transaction: any) => {
    if (!signTransaction) {
      throw new Error("솔라나 지갑이 연결되지 않았습니다.");
    }
    // 트랜잭션 디버깅 정보 출력
    console.log("서명할 트랜잭션:", transaction);
    try {
      const signedTx = await signTransaction(transaction);
      console.log("서명 완료된 트랜잭션:", signedTx);
      return signedTx;
    } catch (error) {
      console.error("트랜잭션 서명 중 오류:", error);
      throw error;
    }
  };

  // 스왑 실행
  const executeSwap = async () => {
    if (!selectedQuote || !isWalletConnected()) return;

    setSwapping(true);
    setError("");
    setTxHash("");

    try {
      let hash;

      if (fromChain === "solana") {
        // 솔라나에서 출발하는 스왑
        if (!solanaWallet) {
          throw new Error("솔라나 지갑이 연결되지 않았습니다.");
        }

        // 수신자 주소 설정 (단순화를 위해 동일한 주소로 설정)
        const destWallet =
          toChain === "solana"
            ? solanaWallet.toString()
            : "0x0000000000000000000000000000000000000000"; // 임시 이더리움 주소

        console.log("솔라나 스왑 실행:", {
          quote: selectedQuote,
          sender: solanaWallet.toString(),
          recipient: destWallet,
        });

        // 실제 트랜잭션 로직
        try {
          // 기본 방식으로 호출
          console.log("SDK 호출 시도 - 메인넷");

          const result = await swapFromSolana(
            selectedQuote,
            solanaWallet.toString(), // 발신자 주소
            destWallet, // 수신자 주소
            {}, // 레퍼러 정보 (비워두기)
            signSolanaTransaction,
            connection
          );

          console.log("스왑 결과:", result);

          // 결과가 문자열이면 그대로 사용, 객체면 signature 속성 사용
          hash = typeof result === "string" ? result : result.signature || "";
        } catch (error) {
          console.error("SDK 호출 실패:", error);
          throw error;
        }
      } else {
        // EVM 체인에서 출발하는 스왑
        // 실제로는 Wagmi의 signer 가져오기
        const provider = (window as any).ethereum;

        if (!provider) {
          throw new Error("이더리움 공급자를 찾을 수 없습니다.");
        }

        // 임시 구현 - 실제로는 이더리움 트랜잭션 결과 반환
        const destWallet =
          toChain === "solana"
            ? solanaWallet
              ? solanaWallet.toString()
              : ""
            : "0x0000000000000000000000000000000000000000"; // 임시

        console.log("이더리움 스왑 실행:", {
          quote: selectedQuote,
          recipient: destWallet,
        });

        try {
          // 실제 구현에서는 아래와 같이 SDK 호출
          // ethereum provider에서 signer 가져오기
          const accounts = await provider.request({ method: "eth_accounts" });
          if (!accounts || accounts.length === 0) {
            throw new Error("이더리움 계정에 접근할 수 없습니다.");
          }

          console.log("EVM 지갑 주소:", accounts[0]);

          // swapFromEvm 함수 타입 오류 방지를 위한 타입 캐스팅 사용
          // SDK 버전에 따라 인자 수가 다를 수 있음
          // @ts-ignore - SDK 타입 정의와 실제 구현이 다를 수 있음
          const result = await swapFromEvm(
            selectedQuote,
            destWallet,
            "", // 레퍼러 주소
            provider,
            provider, // signer 대신 provider 사용 (실제로는 정확한 signer를 사용해야 함)
            null, // permit
            null, // overrides
            null // payload
          );

          // 결과 처리 (문자열 또는 트랜잭션 객체)
          if (typeof result === "string") {
            hash = result;
          } else if (result && result.hash) {
            hash = result.hash;
          } else {
            hash = JSON.stringify(result).slice(0, 64); // 결과값을 문자열로 변환
          }
        } catch (error) {
          console.error("EVM 스왑 실패:", error);
          throw error;
        }
      }

      setTxHash(hash);
      console.log("스왑 트랜잭션 해시:", hash);
    } catch (err) {
      console.error("스왑 실행 오류:", err);
      setError(
        err instanceof Error ? err.message : "스왑 실행 중 오류가 발생했습니다."
      );
    } finally {
      setSwapping(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-semibold mb-4">
        Cross-Chain Swap {IS_TEST_ENVIRONMENT ? "(Testnet)" : ""}
      </h3>

      {/* 지갑 연결 버튼 섹션 */}
      <div className="mb-6 flex flex-col sm:flex-row gap-2 justify-center">
        <WalletConnectButton walletType="solana" className="w-full" />
        <WalletConnectButton walletType="ethereum" className="w-full" />
      </div>

      {/* 출발 정보 선택 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Source Chain
        </label>
        <select
          className="w-full p-2 border border-gray-300 rounded-md"
          value={fromChain}
          onChange={(e) => setFromChain(e.target.value as ChainName)}
        >
          {SUPPORTED_CHAINS.map((chain) => (
            <option key={chain.id} value={chain.id}>
              {chain.name} ({chain.symbol})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Source Token
        </label>
        <select
          className="w-full p-2 border border-gray-300 rounded-md"
          value={fromToken.name}
          onChange={(e) => {
            const selected = TOKENS[fromChain].find(
              (t) => t.name === e.target.value
            );
            if (selected) setFromToken(selected);
          }}
        >
          {TOKENS[fromChain].map((token) => (
            <option key={token.name} value={token.name}>
              {token.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Amount
        </label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.0"
        />
      </div>

      {/* 체인 전환 버튼 */}
      <div className="flex justify-center mb-6">
        <button
          onClick={switchChains}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 10v12" />
            <path d="M15 4v12" />
            <path d="m3 14 4-4 4 4" />
            <path d="m21 8-4 4-4-4" />
          </svg>
        </button>
      </div>

      {/* 도착 정보 선택 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Destination Chain
        </label>
        <select
          className="w-full p-2 border border-gray-300 rounded-md"
          value={toChain}
          onChange={(e) => setToChain(e.target.value as ChainName)}
        >
          {SUPPORTED_CHAINS.map((chain) => (
            <option key={chain.id} value={chain.id}>
              {chain.name} ({chain.symbol})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Destination Token
        </label>
        <select
          className="w-full p-2 border border-gray-300 rounded-md"
          value={toToken.name}
          onChange={(e) => {
            const selected = TOKENS[toChain].find(
              (t) => t.name === e.target.value
            );
            if (selected) setToToken(selected);
          }}
        >
          {TOKENS[toChain].map((token) => (
            <option key={token.name} value={token.name}>
              {token.name}
            </option>
          ))}
        </select>
      </div>

      {/* 견적 가져오기 버튼 */}
      <Button onClick={getQuote} className="w-full mb-4" disabled={loading}>
        {loading ? "Getting Quote..." : "Get Quote"}
      </Button>

      {/* 오류 메시지 */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
          {error}
        </div>
      )}

      {/* 견적 정보 */}
      {selectedQuote && (
        <div className="mb-6 p-4 bg-blue-50 rounded-md">
          <h4 className="font-medium mb-2">Quote Information</h4>
          <div className="text-sm">
            <p className="flex justify-between py-1 border-b border-blue-100">
              <span>Estimated Slippage:</span>
              <span>{selectedQuote.slippageBps / 100}%</span>
            </p>
            <p className="flex justify-between py-1 border-b border-blue-100">
              <span>Estimated Fees:</span>
              <span>
                {selectedQuote.fee !== undefined && selectedQuote.fee !== null
                  ? `${selectedQuote.fee} ${fromToken.name}`
                  : selectedQuote.type === "SWIFT"
                  ? "No fee"
                  : `0 ${fromToken.name}`}
              </span>
            </p>
            <p className="flex justify-between py-1">
              <span>Estimated Time:</span>
              <span>
                {selectedQuote.eta ||
                  selectedQuote.etaSeconds ||
                  (selectedQuote.clientEta
                    ? selectedQuote.clientEta.replace("s", "")
                    : "10")}{" "}
                seconds
              </span>
            </p>
          </div>
        </div>
      )}

      {/* 트랜잭션 해시 표시 */}
      {txHash && (
        <div className="mb-6 p-4 bg-green-50 rounded-md">
          <h4 className="font-medium mb-2">Transaction Complete!</h4>
          <div className="text-sm">
            <p className="break-all">Transaction Hash: {txHash}</p>
            <p className="mt-2">
              Transaction has been successfully submitted. It might take a few
              minutes to confirm.
            </p>
          </div>
        </div>
      )}

      {/* 스왑 실행 버튼 */}
      <Button
        onClick={executeSwap}
        className="w-full"
        disabled={!selectedQuote || !isWalletConnected() || loading || swapping}
        variant="default"
      >
        {swapping
          ? "Processing Swap..."
          : !isWalletConnected()
          ? "Connect Wallet"
          : "Execute Swap"}
      </Button>
    </div>
  );
}
