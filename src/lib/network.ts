import type { Network, NetworkType } from "@/types";

export const DEFAULT_MAINNET_RPC = "https://fullnode.mainnet.sui.io/";
export const DEFAULT_TESTNET_RPC = "https://fullnode.testnet.sui.io/";

export function normalizeNetwork(network: string): Network {
  const normalized = network.toLowerCase();
  return normalized === "mainnet" ? "mainnet" : "testnet";
}

export function getNetworkType(
  network: string,
  isConnected: boolean
): NetworkType {
  if (!isConnected) {
    return "disconnected";
  }

  const normalized = normalizeNetwork(network);
  return normalized === "mainnet" ? "mainnet" : "testnet";
}

export function getDefaultRpcUrl(network: Network): string {
  return network === "mainnet" ? DEFAULT_MAINNET_RPC : DEFAULT_TESTNET_RPC;
}

export function getRpcUrl(network: string, customRpcUrl: string): string {
  const normalized = normalizeNetwork(network);
  return customRpcUrl || getDefaultRpcUrl(normalized);
}

