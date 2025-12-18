"use client";

import { useState, useEffect, useRef } from "react";
import { useUserStore } from "@/stores/useUserStore";
import { RetroCard } from "@/components/ui/retro-card";
import { RetroButton } from "@/components/ui/retro-button";
import { RetroInput } from "@/components/ui/retro-input";
import { RetroDivider } from "@/components/ui/retro-divider";
import { RetroCodeBlock } from "@/components/ui/retro-code-block";
import { useObjectData } from "@/hooks/useObjectData";
import { useSendTransaction } from "@/hooks/useSendTransaction";

const OBJECT_ID = "0xeeb34a78eaf4ae873c679db294296778676de4a335f222856716d1ad6ed54e45";

export const TestnetPlayground = () => {
  const { rpcUrl, network } = useUserStore();
  const { objectData, isLoading: isLoadingObject } = useObjectData(rpcUrl, OBJECT_ID);
  const { txHash, isSending, error, sendTransaction } = useSendTransaction();
  
  const [sendToAddress, setSendToAddress] = useState<string>("");
  const [sendAmount, setSendAmount] = useState<string>("");
  const previousTxHashRef = useRef<string>("");

  const getExplorerUrl = (hash: string) => {
    return `https://suiexplorer.com/txblock/${hash}?network=${network?.toLowerCase()}`;
  };

  useEffect(() => {
    if (txHash && !txHash.startsWith("Error:") && txHash !== previousTxHashRef.current) {
      setSendToAddress("");
      setSendAmount("");
      previousTxHashRef.current = txHash;
    }
  }, [txHash]);

  const handleSend = () => {
    sendTransaction(sendToAddress, sendAmount);
  };

  return (
    <div className="space-y-6">
      <RetroCard>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold uppercase tracking-wider text-black">
            Object Inspector
          </h2>
          <div className={`w-3 h-3 border-2 border-black ${isLoadingObject ? 'bg-[#f4d03f] animate-pulse' : 'bg-[#52b788]'}`} />
        </div>
        
        <RetroDivider />

        <div className="space-y-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">ID</div>
            <div className="bg-[#f5f5f0] border-2 border-black p-3 font-mono text-xs md:text-sm break-all">
              {OBJECT_ID}
            </div>
          </div>

          {isLoadingObject ? (
            <div className="p-4 border-2 border-black border-dashed text-center font-mono text-sm text-gray-500">
              Loading data...
            </div>
          ) : objectData?.error ? (
            <div className="p-4 bg-red-50 border-2 border-black text-red-600 font-mono text-sm">
              Error: {objectData.error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {objectData?.admin && (
                 <div className="border-2 border-black p-4 bg-white relative">
                   <div className="absolute -top-3 left-3 px-1 bg-white text-xs font-bold uppercase tracking-wider border-2 border-black">
                     Admin
                   </div>
                   <div className="font-mono text-xs md:text-sm break-all pt-2">
                     {objectData.admin}
                   </div>
                 </div>
               )}
               
               {objectData?.balance && (
                 <div className="border-2 border-black p-4 bg-white relative">
                   <div className="absolute -top-3 left-3 px-1 bg-white text-xs font-bold uppercase tracking-wider border-2 border-black">
                     Balance
                   </div>
                   <div className="font-mono text-xl font-bold pt-1 text-[#52b788]">
                     {objectData.balance}
                   </div>
                 </div>
               )}
            </div>
          )}
        </div>
      </RetroCard>

      <RetroCard>
        <h2 className="text-2xl font-bold uppercase tracking-wider mb-4 text-black">
          Transaction Sender
        </h2>
        <RetroDivider />
        <div className="space-y-4">
          <RetroInput
            label="Target Address"
            placeholder="0x..."
            value={sendToAddress}
            onChange={(e) => setSendToAddress(e.target.value)}
          />
          <RetroInput
            label="Amount (SUI)"
            type="number"
            step="0.000000001"
            placeholder="0.0"
            value={sendAmount}
            onChange={(e) => setSendAmount(e.target.value)}
          />
          <RetroButton
            variant="primary"
            onClick={handleSend}
            disabled={isSending || !sendToAddress.trim() || !sendAmount.trim()}
            className="w-full"
          >
            {isSending ? "Sending..." : "Send SUI"}
          </RetroButton>

          {(txHash || error) && (
            <div className="mt-4">
              <RetroCodeBlock title="Transaction Status">
                {error ? (
                  <span className="text-red-500">Error: {error}</span>
                ) : txHash.startsWith("Error:") ? (
                  <span className="text-red-500">{txHash}</span>
                ) : (
                  <div className="space-y-2">
                    <div className="text-[#52b788]">Success! Transaction Hash:</div>
                    <a
                      href={getExplorerUrl(txHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#52b788] hover:underline break-all block"
                    >
                      {txHash}
                    </a>
                  </div>
                )}
              </RetroCodeBlock>
            </div>
          )}
        </div>
      </RetroCard>
    </div>
  );
};

