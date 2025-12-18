import { useCurrentAccount } from "@mysten/dapp-kit";
import { PropsWithChildren, createContext, useMemo } from "react";
import { useResolveSuiNSName } from "@mysten/dapp-kit";

interface AppContextValue {
  walletAddress: string | undefined;
  suiName: string | null | undefined;
}

export const AppContext = createContext<AppContextValue>({
  walletAddress: undefined,
  suiName: undefined,
});

export const AppContextProvider = ({ children }: PropsWithChildren) => {
  const account = useCurrentAccount();
  const walletAddress = useMemo(() => account?.address, [account]);
  const { data: suiName } = useResolveSuiNSName(walletAddress);

  const value = useMemo(
    () => ({
      walletAddress,
      suiName,
    }),
    [walletAddress, suiName]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
