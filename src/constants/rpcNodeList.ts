import type { Network, RpcNode } from "@/types";

export function getRpcNodes(network: Network): RpcNode[] {
  const suiscanRpc = `https://rpc-${network}.suiscan.xyz/`;

  return [
    {
      name: "Sui Official",
      url: `https://fullnode.${network}.sui.io/`,
      latency: 0,
    },
    {
      name: "Blockvision",
      url: `https://sui-${network}-endpoint.blockvision.org/`,
      latency: 0,
    },
    {
      name: "Suiscan",
      url: suiscanRpc,
      latency: 0,
    },
  ];
}
