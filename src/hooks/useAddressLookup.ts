import { useState } from "react";
import type { TokenBalance } from "@/types";
import { formatTokenBalance } from "@/lib/format";

const DEFAULT_DECIMALS = 9;

export function useAddressLookup() {
  const [lookupAddress, setLookupAddress] = useState<string>("");
  const [lookupBalances, setLookupBalances] = useState<TokenBalance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLookup = async (address: string, rpcUrl: string) => {
    if (!address.trim()) {
      return;
    }

    try {
      setIsLoading(true);
      setHasSearched(true);
      setError(null);
      setLookupBalances([]);

      const response = await fetch(
        `/api/balance?address=${encodeURIComponent(address)}&rpcUrl=${encodeURIComponent(rpcUrl)}`
      );
      const data = await response.json();

      if (response.ok && data.balances) {
        const formattedBalances = data.balances.map((item: TokenBalance) => {
          const decimals = item.decimals ?? DEFAULT_DECIMALS;
          return {
            ...item,
            balance: formatTokenBalance(item.balance, decimals),
          };
        });
        setLookupBalances(formattedBalances);
      } else {
        setError(data.error || "Failed to fetch balances");
        setLookupBalances([
          {
            coinType: "Error",
            balance: data.error || "Failed to fetch balances",
          },
        ]);
      }
    } catch (err: any) {
      console.error("Error looking up address:", err);
      const errorMessage = err?.message || "Failed to fetch balances";
      setError(errorMessage);
      setLookupBalances([
        {
          coinType: "Error",
          balance: errorMessage,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    lookupAddress,
    setLookupAddress,
    lookupBalances,
    isLoading,
    hasSearched,
    error,
    handleLookup,
  };
}

