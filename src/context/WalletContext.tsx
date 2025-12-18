import { useMemo } from "react";
import {
  SuiClientProvider,
  WalletProvider,
  lightTheme,
  createNetworkConfig,
} from "@mysten/dapp-kit";
import { type StateStorage } from "zustand/middleware";
import { useUserStore } from "@/stores/useUserStore";
import { normalizeNetwork, DEFAULT_MAINNET_RPC, DEFAULT_TESTNET_RPC } from "@/lib/network";

interface SuiWalletProviderProps {
  children: React.ReactNode;
}

const createMemoryStorage = (): StateStorage => {
  const storage: Record<string, string> = {};
  return {
    getItem: (key: string) => storage[key] || null,
    setItem: (key: string, value: string) => {
      storage[key] = value;
    },
    removeItem: (key: string) => {
      delete storage[key];
    },
  };
};

const SuiWalletProvider = ({ children }: SuiWalletProviderProps) => {
  const { rpcUrl, network } = useUserStore();

  const { networkConfig, defaultNetwork } = useMemo(() => {
    const normalizedNetwork = normalizeNetwork(network);
    const mainnetRpc = normalizedNetwork === "mainnet" ? rpcUrl : DEFAULT_MAINNET_RPC;
    const testnetRpc = normalizedNetwork === "testnet" ? rpcUrl : DEFAULT_TESTNET_RPC;

    const config = createNetworkConfig({
      mainnet: { url: mainnetRpc },
      testnet: { url: testnetRpc },
    });

    return {
      networkConfig: config.networkConfig,
      defaultNetwork: normalizedNetwork,
    };
  }, [network, rpcUrl]);

  const storage: StateStorage =
    typeof window !== "undefined"
      ? (localStorage as StateStorage)
      : createMemoryStorage();

  return (
    <SuiClientProvider
      key={`${defaultNetwork}-${rpcUrl}`}
      networks={networkConfig}
      defaultNetwork={defaultNetwork}
    >
      <WalletProvider
        theme={lightTheme}
        autoConnect={typeof window !== "undefined"}
        storage={storage}
        storageKey="sui-wallet"
      >
        {children}
      </WalletProvider>
    </SuiClientProvider>
  );
};

export default SuiWalletProvider;
