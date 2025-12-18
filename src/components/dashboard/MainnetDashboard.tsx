"use client";

import { useState, useMemo, useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { useUserStore } from "@/stores/useUserStore";
import { RetroCard } from "@/components/ui/retro-card";
import { RetroButton } from "@/components/ui/retro-button";
import { RetroInput } from "@/components/ui/retro-input";
import { RetroDivider } from "@/components/ui/retro-divider";
import { useBalance } from "@/hooks/useBalance";
import { useAddressLookup } from "@/hooks/useAddressLookup";

export const MainnetDashboard = () => {
  const { walletAddress } = useContext(AppContext);
  const { rpcUrl } = useUserStore();
  const { balance: suiBalance, isLoading } = useBalance();
  const {
    lookupAddress,
    setLookupAddress,
    lookupBalances,
    isLoading: isLookupLoading,
    handleLookup,
  } = useAddressLookup();

  const [hideZeroBalance, setHideZeroBalance] = useState(false);

  const filteredBalances = useMemo(() => {
    if (!hideZeroBalance) return lookupBalances;
    return lookupBalances.filter((item) => {
      const isSUI = item.coinType === "0x2::sui::SUI";
      // Remove commas before converting to Number to handle formatted strings like "1,000.00"
      const balanceValue = Number(item.balance.replace(/,/g, ""));
      return isSUI || (!isNaN(balanceValue) && balanceValue > 0);
    });
  }, [lookupBalances, hideZeroBalance]);

  const onLookup = () => {
    handleLookup(lookupAddress, rpcUrl);
  };


  return (
    <div className="space-y-6">
      <RetroCard>
        <h2 className="text-2xl font-bold uppercase tracking-wider mb-4 text-black">
          Wallet Card
        </h2>
        <RetroDivider />
        <div className="space-y-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
              Address
            </div>
            <div className="font-mono text-sm md:text-lg text-black break-all">
              {walletAddress ? walletAddress : "Not connected"}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
              SUI Balance
            </div>
            <div className="font-mono text-2xl font-bold text-black">
              {isLoading ? "Loading..." : `${suiBalance} SUI`}
            </div>
          </div>
        </div>
      </RetroCard>

      <RetroCard>
        <h2 className="text-2xl font-bold uppercase tracking-wider mb-4 text-black">
          Address Lookup
        </h2>
        <RetroDivider />
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <RetroInput
                label="Sui Address"
                placeholder="0x..."
                value={lookupAddress}
                onChange={(e) => setLookupAddress(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onLookup();
                  }
                }}
              />
            </div>
            <div className="flex items-end">
              <RetroButton
                variant="secondary"
                onClick={onLookup}
                disabled={isLookupLoading || !lookupAddress.trim()}
              >
                {isLookupLoading ? "Querying..." : "Query"}
              </RetroButton>
            </div>
          </div>

          {lookupBalances.length > 0 && (
            <div className="mt-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span> Data Grid</span>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className={`w-4 h-4 border-2 border-black transition-colors ${hideZeroBalance ? 'bg-[#52b788]' : 'bg-white group-hover:bg-gray-100'}`} />
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={hideZeroBalance}
                      onChange={(e) => setHideZeroBalance(e.target.checked)}
                    />
                    <span className="text-gray-500 font-normal normal-case">Hide 0 Balance</span>
                  </label>
                </div>
                <span className="text-gray-500 font-normal normal-case">
                  {filteredBalances.length} {filteredBalances.length === 1 ? 'token' : 'tokens'}
                </span>
              </div>
              <div className="border-2 border-black max-h-[500px] overflow-auto relative bg-[#f5f5f0]">
                <table className="w-full font-mono text-sm border-collapse">
                  <thead className="sticky top-[-1px] z-10 bg-black">
                    <tr className="bg-black text-[#f4d03f]">
                      <th className="border-2 border-black px-4 py-2 text-left uppercase bg-black outline outline-1 outline-black shadow-[0_1px_0_0_#000]">
                        Coin Type
                      </th>
                      <th className="border-2 border-black px-4 py-2 text-right uppercase bg-black min-w-[120px] outline outline-1 outline-black shadow-[0_1px_0_0_#000]">
                        Balance
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBalances.map((item, index) => {
                      const isSUI = item.coinType === "0x2::sui::SUI";
                      return (
                        <tr
                          key={index}
                          className={`${
                            isSUI
                              ? "bg-[#52b788] hover:bg-[#6bc99a]"
                              : "bg-white even:bg-gray-50 hover:bg-gray-100"
                          }`}
                        >
                          <td className="border-2 border-black px-4 py-2 text-black break-all text-xs">
                            {item.coinType}
                          </td>
                          <td className={`border-2 border-black px-4 py-2 text-right ${isSUI ? "font-bold" : ""} text-black`}>
                            {item.balance}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {filteredBalances.length > 10 && (
                <div className="mt-2 text-xs text-gray-500 text-center">
                  ↕ scroll to see all
                </div>
              )}
            </div>
          )}
        </div>
      </RetroCard>
    </div>
  );
};

