export type Network = "mainnet" | "testnet";

export type NetworkType = "mainnet" | "testnet" | "unknown" | "disconnected";

export type RpcNode = {
  name: string;
  url: string;
  latency: number;
};

export type TokenInfo = {
  symbol: string;
  iconPath: string;
  isLST?: boolean;
};

export type TokenBalance = {
  coinType: string;
  balance: string;
  decimals?: number;
};

export type ObjectData = {
  admin?: string;
  id?: string;
  balance?: string;
  error?: string;
};

