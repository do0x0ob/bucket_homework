import { useSuiClient } from "@mysten/dapp-kit";
import { useState, useEffect, useMemo } from "react";

const SUI_COIN_TYPE = "0x2::sui::SUI";
const DEFAULT_DECIMALS = 9;

export function useCoinMetadata(coinTypes: string[]) {
  const client = useSuiClient();
  const [metadataMap, setMetadataMap] = useState<Map<string, number>>(new Map());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMetadata = async () => {
      if (coinTypes.length === 0) return;

      setIsLoading(true);
      const uniqueCoinTypes = [...new Set(coinTypes)];
      const map = new Map<string, number>();

      await Promise.all(
        uniqueCoinTypes.map(async (coinType) => {
          try {
            if (coinType === SUI_COIN_TYPE) {
              map.set(coinType, DEFAULT_DECIMALS);
              return;
            }

            const metadata = await client.getCoinMetadata({ coinType });
            if (metadata) {
              map.set(coinType, metadata.decimals);
            } else {
              map.set(coinType, DEFAULT_DECIMALS);
            }
          } catch (error) {
            console.warn(`Failed to fetch metadata for ${coinType}`, error);
            map.set(coinType, DEFAULT_DECIMALS);
          }
        })
      );

      setMetadataMap(map);
      setIsLoading(false);
    };

    fetchMetadata();
  }, [coinTypes, client]);

  const getDecimals = useMemo(() => {
    return (coinType: string): number => {
      return metadataMap.get(coinType) ?? DEFAULT_DECIMALS;
    };
  }, [metadataMap]);

  return { getDecimals, isLoading };
}

