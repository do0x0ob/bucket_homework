import { useCurrentAccount, useDisconnectWallet } from "@mysten/dapp-kit";
import { ReactNode, useMemo, useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { RetroCard } from "@/components/ui/retro-card";
import { RetroButton } from "@/components/ui/retro-button";
import { ConnectModal } from "@mysten/dapp-kit";
import { useUserStore } from "@/stores/useUserStore";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { NETWORK_LIST } from "@/constants/networkList";
import { getRpcNodes } from "@/constants/rpcNodeList";
import { NetworkIcon } from "lucide-react";
import type { Network, NetworkType } from "@/types";
import { getNetworkType } from "@/lib/network";

interface NetworkGuardProps {
  mainnetView: ReactNode;
  testnetView: ReactNode;
  welcomeView?: ReactNode;
}

export const NetworkGuard = ({
  mainnetView,
  testnetView,
  welcomeView,
}: NetworkGuardProps) => {
  const account = useCurrentAccount();
  const { walletAddress } = useContext(AppContext);
  const { mutate: disconnectWallet } = useDisconnectWallet();
  const { network, setNetwork, setRpcUrl } = useUserStore();

  const networkType = useMemo<NetworkType>(() => {
    return getNetworkType(network, !!account && !!walletAddress);
  }, [account, walletAddress, network]);

  // Welcome/Connect View
  if (networkType === "disconnected") {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        {welcomeView || (
          <RetroCard className="text-center">
            <h1 className="text-3xl lg:text-4xl font-semibold mb-4 tracking-wide text-black">
              Welcome!
            </h1>
            <p className="text-base mb-6 text-gray-600">
              Connect your wallet to get started
            </p>
            <ConnectModal
              trigger={
                <RetroButton variant="primary" className="mx-auto">
                  Connect Wallet
                </RetroButton>
              }
            />
          </RetroCard>
        )}
        
        <RetroCard>
          <h2 className="text-2xl font-bold mb-4 uppercase tracking-wider text-black text-left">
            Features
          </h2>
          <div className="space-y-4 text-left">
            <div className="border-2 border-black p-4 bg-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-4 h-4 bg-[#52b788] border-2 border-black"></div>
                <h3 className="font-bold uppercase text-sm text-black">Mainnet Features</h3>
              </div>
              <ul className="list-none space-y-3 ml-7 text-sm text-gray-700 font-mono">
                <li>
                  <span className="text-gray-400 font-bold mr-2">[US 1-1]</span>
                  <span className="text-black font-bold">Wallet Connection</span>
                  <span className="mx-2">—</span>
                  View your SUI balance and address
                </li>
                <li>
                  <span className="text-gray-400 font-bold mr-2">[US 1-2]</span>
                  <span className="text-black font-bold">Address Lookup</span>
                  <span className="mx-2">—</span>
                  Query any address&apos;s full token portfolio
                </li>
              </ul>
            </div>
            <div className="border-2 border-black p-4 bg-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-4 h-4 bg-[#f4d03f] border-2 border-black"></div>
                <h3 className="font-bold uppercase text-sm text-black">Testnet Features</h3>
              </div>
              <ul className="list-none space-y-3 ml-7 text-sm text-gray-700 font-mono">
                <li>
                  <span className="text-gray-400 font-bold mr-2">[US 3]</span>
                  <span className="text-black font-bold">Object Inspector</span>
                  <span className="mx-2">—</span>
                  Fetch and inspect contract objects
                </li>
                <li>
                  <span className="text-gray-400 font-bold mr-2">[US 4]</span>
                  <span className="text-black font-bold">Transaction Sender</span>
                  <span className="mx-2">—</span>
                  Send SUI transfers with explorer integration
                </li>
              </ul>
            </div>
            <div className="mt-4 p-3 bg-[#f4d03f] border-2 border-black">
              <p className="text-xs font-semibold uppercase tracking-wider text-black font-mono">
                💡 Tip: Switch networks via the wallet menu after connecting
              </p>
            </div>
          </div>
        </RetroCard>
      </div>
    );
  }

  const networkBadgeColor =
    networkType === "mainnet"
      ? "bg-[#52b788]"
      : networkType === "testnet"
      ? "bg-[#f4d03f]"
      : "bg-gray-400";

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <RetroCard>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none ring-0">
                <div
                  className={`${networkBadgeColor} border-2 border-black px-4 py-2 font-bold uppercase text-sm cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-2`}
                  style={{ boxShadow: "2px 2px 0px 0px #000" }}
                >
                  <NetworkIcon size={16} />
                  {networkType === "mainnet"
                    ? "Mainnet"
                    : networkType === "testnet"
                    ? "Testnet"
                    : "Unknown Network"}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                sideOffset={8}
                className="bg-[#f5f5f0] border-2 border-black p-2 min-w-[140px]"
                style={{ boxShadow: "4px 4px 0px 0px #000" }}
              >
                {NETWORK_LIST.map((_network) => (
                  <DropdownMenuItem
                    key={_network}
                    className="p-0 mb-1 last:mb-0 focus:bg-transparent"
                  >
                    <button
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm font-semibold uppercase tracking-wider border-2 border-black transition-all duration-150 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${
                        network === _network
                          ? "bg-[#52b788] text-black hover:bg-[#6bc99a]"
                          : "bg-white text-black hover:bg-[#f4d03f]"
                      }`}
                      style={{ boxShadow: "2px 2px 0px 0px #000" }}
                      onClick={() => {
                        setNetwork(_network);
                        setRpcUrl(getRpcNodes(_network as Network)[0].url);
                      }}
                    >
                      {_network}
                    </button>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {walletAddress && (
              <div className="font-mono text-sm text-gray-700">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </div>
            )}
          </div>
          <RetroButton
            variant="neutral"
            onClick={() => disconnectWallet()}
            className="text-xs"
          >
            Disconnect
          </RetroButton>
        </div>
        <div className="flex items-start gap-2 pt-3 border-t-2 border-black">
          <div className={`w-4 h-4 border-2 border-black flex-shrink-0 ${
            networkType === "mainnet" ? "bg-[#f4d03f]" : "bg-[#52b788]"
          }`} />
          <p className="text-xs font-semibold uppercase tracking-wider text-black flex-1">
            {networkType === "mainnet" 
              ? "Switch to Testnet to access Object Inspector and Transaction Sender."
              : networkType === "testnet"
              ? "Switch to Mainnet to access Wallet Card and Address Lookup."
              : "Switch networks via the wallet menu to access different features."}
          </p>
        </div>
      </RetroCard>

      {networkType === "mainnet" && mainnetView}
      {networkType === "testnet" && testnetView}
      {networkType === "unknown" && (
        <RetroCard>
          <p className="text-center text-red-600 font-semibold uppercase">
            Unknown Network Detected
          </p>
          <p className="text-center text-sm mt-2 text-gray-700">
            Please connect to Mainnet or Testnet
          </p>
        </RetroCard>
      )}
    </div>
  );
};

