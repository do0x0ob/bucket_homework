import { useState, useEffect } from "react";
import { useSuiClient, useCurrentAccount } from "@mysten/dapp-kit";
import { formatTokenBalance } from "@/lib/format";

const SUI_DECIMALS = 9;

export function useBalance() {
  const client = useSuiClient();
  const account = useCurrentAccount();
  const [balance, setBalance] = useState<string>("0");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!account?.address) {
        setBalance("0");
        return;
      }

      try {
        setIsLoading(true);
        const balanceData = await client.getBalance({
          owner: account.address,
        });
        setBalance(formatTokenBalance(balanceData.totalBalance, SUI_DECIMALS));
      } catch (error) {
        console.error("Error fetching balance:", error);
        setBalance("0");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
  }, [account?.address, client]);

  return { balance, isLoading };
}

