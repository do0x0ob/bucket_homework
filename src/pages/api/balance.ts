import type { NextApiRequest, NextApiResponse } from "next";
import { SuiClient } from "@mysten/sui/client";
import type { TokenBalance } from "@/types";
import { validateMethod, validateQueryParam, handleApiError } from "@/lib/api-utils";

const SUI_COIN_TYPE = "0x2::sui::SUI";
const DEFAULT_DECIMALS = 9;

interface BalanceResponse {
  balances: TokenBalance[];
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BalanceResponse>
) {
  if (!validateMethod(req, res, ["GET"])) {
    return;
  }

  const address = validateQueryParam(req, res, "address");
  const rpcUrl = validateQueryParam(req, res, "rpcUrl");

  if (!address || !rpcUrl) {
    return;
  }

  try {
    const client = new SuiClient({ url: rpcUrl });
    const allBalances = await client.getAllBalances({ owner: address });

    const uniqueCoinTypes = [...new Set(allBalances.map((b) => b.coinType))];
    const metadataMap = new Map<string, number>();

    await Promise.all(
      uniqueCoinTypes.map(async (coinType: string) => {
        try {
          if (coinType === SUI_COIN_TYPE) {
            metadataMap.set(coinType, DEFAULT_DECIMALS);
            return;
          }

          const metadata = await client.getCoinMetadata({ coinType });
          if (metadata) {
            metadataMap.set(coinType, metadata.decimals);
          } else {
            metadataMap.set(coinType, DEFAULT_DECIMALS);
          }
        } catch (err) {
          console.warn(`Failed to fetch metadata for ${coinType}`, err);
          metadataMap.set(coinType, DEFAULT_DECIMALS);
        }
      })
    );

    const balances: TokenBalance[] = allBalances.map((balance) => ({
      coinType: balance.coinType,
      balance: balance.totalBalance,
      decimals: metadataMap.get(balance.coinType) ?? DEFAULT_DECIMALS,
    }));

    balances.sort((a, b) => {
      if (a.coinType === SUI_COIN_TYPE) return -1;
      if (b.coinType === SUI_COIN_TYPE) return 1;
      return 0;
    });

    res.status(200).json({ balances });
  } catch (error) {
    handleApiError(res, error, "Failed to fetch balances");
  }
}

