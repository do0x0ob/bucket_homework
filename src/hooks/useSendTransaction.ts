import { useState } from "react";
import { useSuiClient, useSignAndExecuteTransaction, useCurrentAccount } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";

const SUI_DECIMALS = 9;
const ESTIMATED_GAS_BUDGET = 0.01;

export function useSendTransaction() {
  const client = useSuiClient();
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [txHash, setTxHash] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendTransaction = async (toAddress: string, amount: string) => {
    if (!account?.address || !toAddress.trim() || !amount.trim()) {
      setError("Invalid input parameters");
      return;
    }

    if (!toAddress.startsWith("0x") || toAddress.length < 10) {
      setError("Invalid address format");
      setTxHash("Error: Invalid address format");
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Invalid amount");
      setTxHash("Error: Invalid amount");
      return;
    }

    try {
      setIsSending(true);
      setError(null);
      setTxHash("");

      const balanceData = await client.getBalance({
        owner: account.address,
      });
      
      const balanceInSui = parseFloat(balanceData.totalBalance) / Math.pow(10, SUI_DECIMALS);
      const requiredAmount = amountNum + ESTIMATED_GAS_BUDGET;

      if (balanceInSui < requiredAmount) {
        const errorMsg = `Insufficient balance! Current balance: ${balanceInSui.toFixed(4)} SUI, Required: ${requiredAmount.toFixed(4)} SUI (including ${ESTIMATED_GAS_BUDGET} SUI estimated gas fee)`;
        setError(errorMsg);
        setTxHash(`Error: ${errorMsg}`);
        setIsSending(false);
        return;
      }

      const amountInMist = Math.floor(amountNum * Math.pow(10, SUI_DECIMALS));
      const tx = new Transaction();
      const [coin] = tx.splitCoins(tx.gas, [amountInMist]);
      tx.transferObjects([coin], toAddress);

      signAndExecute(
        {
          transaction: tx,
        },
        {
          onSuccess: async (result) => {
            setTxHash(result.digest);

            try {
              await client.waitForTransaction({
                digest: result.digest,
                options: {
                  showEffects: true,
                  showBalanceChanges: true,
                },
              });
            } catch (waitError) {
              console.error("Error waiting for transaction:", waitError);
            }
          },
          onError: (err: any) => {
            console.error("Transaction error:", err);
            let errorMessage = "Transaction failed";
            
            if (err?.message) {
              if (err.message.includes("Insufficient")) {
                errorMessage = "Insufficient balance to complete transaction";
              } else if (err.message.includes("Invalid")) {
                errorMessage = "Invalid transaction parameters";
              } else if (err.message.includes("rejected")) {
                errorMessage = "User rejected the transaction";
              } else {
                errorMessage = `Transaction failed: ${err.message}`;
              }
            }
            
            setError(errorMessage);
            setTxHash(`Error: ${errorMessage}`);
          },
        }
      );
    } catch (err: any) {
      console.error("Error sending transaction:", err);
      let errorMessage = "Failed to send transaction";
      
      if (err?.message) {
        if (err.message.includes("balance") || err.message.includes("Insufficient")) {
          errorMessage = "Insufficient balance to complete transaction";
        } else {
          errorMessage = `Failed to send transaction: ${err.message}`;
        }
      }
      
      setError(errorMessage);
      setTxHash(`Error: ${errorMessage}`);
    } finally {
      setIsSending(false);
    }
  };

  const reset = () => {
    setTxHash("");
    setError(null);
  };

  return {
    txHash,
    isSending,
    error,
    sendTransaction,
    reset,
  };
}

