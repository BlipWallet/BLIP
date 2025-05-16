"use client";

import { useState, useEffect, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Button } from "@/components/ui/button";

// Wallet type definition
type WalletType = "solana" | "ethereum";

interface WalletConnectButtonProps {
  walletType: WalletType;
  className?: string;
}

export function WalletConnectButton({
  walletType,
  className = "",
}: WalletConnectButtonProps) {
  // Solana wallet hooks
  const { connected, publicKey, disconnect: disconnectSolana } = useWallet();
  const { setVisible } = useWalletModal();

  // Ethereum connection state
  const [ethConnected, setEthConnected] = useState(false);
  const [ethAddress, setEthAddress] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [hasEthereumProvider, setHasEthereumProvider] = useState(false);
  const [hasMetaMask, setHasMetaMask] = useState(false);

  // Add debug information
  const addDebugInfo = useCallback((info: string) => {
    setDebugInfo((prev) => [info, ...prev.slice(0, 4)]);
  }, []);

  // Toggle debug information display
  const toggleDebugInfo = useCallback(() => {
    setShowDebugInfo((prev) => !prev);
  }, []);

  // Initialize ethereum provider checks
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasProvider = Boolean(window.ethereum);
      setHasEthereumProvider(hasProvider);
      setHasMetaMask(Boolean(window.ethereum?.isMetaMask));

      if (hasProvider && walletType === "ethereum") {
        checkEthWalletConnection();
        addDebugInfo("Ethereum provider found");
      } else if (walletType === "ethereum") {
        addDebugInfo("No Ethereum provider found");
      }
    }
  }, [walletType]);

  // Check if ethereum provider exists
  const checkEthereumProvider = useCallback(() => {
    return hasEthereumProvider;
  }, [hasEthereumProvider]);

  // Check for MetaMask specifically
  const checkForMetaMask = useCallback(() => {
    return hasMetaMask;
  }, [hasMetaMask]);

  // Check Ethereum wallet connection status
  const checkEthWalletConnection = useCallback(async () => {
    if (!hasEthereumProvider) {
      addDebugInfo("No Ethereum provider detected");
      return false;
    }

    try {
      // Using window.ethereum with null check
      if (typeof window !== "undefined" && window.ethereum) {
        const provider = window.ethereum;

        try {
          const accounts = await provider.request({
            method: "eth_accounts",
          });

          if (accounts && accounts.length > 0) {
            setEthConnected(true);
            setEthAddress(accounts[0]);
            addDebugInfo(`Connected to account: ${accounts[0].slice(0, 6)}...`);
            return true;
          } else {
            setEthConnected(false);
            setEthAddress("");
            addDebugInfo("No accounts available");
            return false;
          }
        } catch (err) {
          addDebugInfo("Error getting accounts");
          setEthConnected(false);
          setEthAddress("");
          return false;
        }
      }
      return false;
    } catch (error) {
      addDebugInfo("Error checking wallet");
      setEthConnected(false);
      setEthAddress("");
      return false;
    }
  }, [addDebugInfo, hasEthereumProvider]);

  // Connect to Ethereum wallet with very simple approach
  const connectEthWallet = useCallback(() => {
    try {
      setIsConnecting(true);
      setErrorMsg(null);

      if (!hasEthereumProvider) {
        setErrorMsg("Ethereum wallet required");
        addDebugInfo("No provider found when trying to connect");
        setIsConnecting(false);
        return;
      }

      addDebugInfo("Attempting to connect to Ethereum wallet");

      // Safe access to window.ethereum
      if (typeof window !== "undefined" && window.ethereum) {
        const provider = window.ethereum;

        // Simple promise-based approach
        provider
          .request({
            method: "eth_requestAccounts",
          })
          .then((accounts: string[]) => {
            if (accounts && accounts.length > 0) {
              setEthConnected(true);
              setEthAddress(accounts[0]);
              addDebugInfo(`Connected to: ${accounts[0].slice(0, 6)}...`);
            } else {
              setErrorMsg("No accounts found");
              addDebugInfo("No accounts returned after request");
            }
            setIsConnecting(false);
          })
          .catch((error: any) => {
            const errorCode = error?.code;
            const errorMessage = error?.message || "Unknown error";

            addDebugInfo(
              `Connection error: ${errorCode}, ${errorMessage.slice(0, 30)}...`
            );

            if (errorCode === 4001) {
              setErrorMsg("Connection request rejected");
            } else if (errorCode === -32002) {
              setErrorMsg("Request already in progress");
            } else {
              setErrorMsg("Connection failed");
            }

            setIsConnecting(false);
          });
      } else {
        setErrorMsg("Ethereum provider not found");
        setIsConnecting(false);
      }
    } catch (error) {
      addDebugInfo("Unexpected error during connection attempt");
      setErrorMsg("An unexpected error occurred");
      setIsConnecting(false);
    }
  }, [hasEthereumProvider, addDebugInfo]);

  // Disconnect from Ethereum wallet
  const disconnectEthWallet = useCallback(() => {
    setEthConnected(false);
    setEthAddress("");
    setErrorMsg(null);
    addDebugInfo("Manually disconnected from Ethereum wallet");
  }, [addDebugInfo]);

  // Connect to Solana wallet
  const connectSolanaWallet = useCallback(() => {
    setVisible(true);
  }, [setVisible]);

  // Event handlers for connect/disconnect
  const handleConnect = useCallback(() => {
    if (walletType === "solana") {
      connectSolanaWallet();
    } else {
      connectEthWallet();
    }
  }, [walletType, connectSolanaWallet, connectEthWallet]);

  const handleDisconnect = useCallback(() => {
    if (walletType === "solana") {
      disconnectSolana();
    } else {
      disconnectEthWallet();
    }
  }, [walletType, disconnectSolana, disconnectEthWallet]);

  // Handler for installing MetaMask
  const handleInstallMetaMask = useCallback(() => {
    window.open("https://metamask.io/download/", "_blank");
    addDebugInfo("Opened MetaMask installation page");
  }, [addDebugInfo]);

  // Determine connection status and address
  const isConnected = walletType === "solana" ? connected : ethConnected;
  const walletAddress =
    walletType === "solana"
      ? publicKey
        ? `${publicKey.toString().slice(0, 6)}...${publicKey
            .toString()
            .slice(-4)}`
        : ""
      : ethAddress
      ? `${ethAddress.slice(0, 6)}...${ethAddress.slice(-4)}`
      : "";

  // Button text based on connection state
  const getButtonText = () => {
    if (isConnected) {
      return `${
        walletType === "solana" ? "Solana" : "Ethereum"
      }: ${walletAddress}`;
    }

    if (walletType === "ethereum") {
      if (isConnecting) return "Connecting...";
      if (!hasEthereumProvider) return "Install MetaMask";
    }

    return `Connect ${walletType === "solana" ? "Solana" : "Ethereum"} Wallet`;
  };

  return (
    <div className="flex flex-col items-center">
      <Button
        onClick={
          isConnected
            ? handleDisconnect
            : walletType === "ethereum" && !hasEthereumProvider
            ? handleInstallMetaMask
            : handleConnect
        }
        className={`transition-colors ${className}`}
        variant={isConnected ? "outline" : "default"}
        disabled={walletType === "ethereum" && isConnecting}
      >
        {getButtonText()}
      </Button>

      {errorMsg && walletType === "ethereum" && (
        <div className="text-red-500 text-xs mt-1">{errorMsg}</div>
      )}

      {walletType === "ethereum" && (
        <button
          onClick={toggleDebugInfo}
          className="text-xs text-gray-400 mt-1 hover:text-gray-600"
        >
          {showDebugInfo ? "Hide Debug Info" : "Show Debug Info"}
        </button>
      )}

      {showDebugInfo && walletType === "ethereum" && (
        <div className="text-xs mt-2 p-2 border border-gray-200 rounded bg-gray-50 max-w-[300px] text-left">
          <p>MetaMask installed: {hasMetaMask ? "Yes" : "No"}</p>
          <p>
            Ethereum provider:{" "}
            {hasEthereumProvider ? "Available" : "Not available"}
          </p>
          <p>
            Connection status: {ethConnected ? "Connected" : "Not connected"}
          </p>
          <p>Logs:</p>
          <ul className="list-disc pl-4">
            {debugInfo.map((info, i) => (
              <li key={i}>{info}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
