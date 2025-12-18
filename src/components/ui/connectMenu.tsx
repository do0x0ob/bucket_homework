import { cn } from "@/lib/utils";
import Image from "next/image";
import { useCurrentAccount, useDisconnectWallet } from "@mysten/dapp-kit";
import { BiExit } from "react-icons/bi";
import { SlMagnifier } from "react-icons/sl";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "./dropdown-menu";
import { useMemo } from "react";
import useMediaSize from "@/hooks/useMediaSize";
import { ClipboardCopyIcon } from "lucide-react";
import { toast } from "react-toastify";
import RpcMenu from "./rpcMenu";
import NetworkMenu from "./networkMenu";

import { useUserStore } from "@/stores/useUserStore";

const ConnectMenu = ({
  walletAddress,
  suiName,
}: {
  walletAddress: string;
  suiName: string | undefined | null;
}) => {
  const { network } = useUserStore();
  const screenWidth = useMediaSize();
  const isDesktop = screenWidth >= 1280;
  const { mutate: disconnectWallet } = useDisconnectWallet();

  const displayName = useMemo(() => {
    if (suiName) {
      if (suiName.length > 14) {
        return suiName.slice(0, 4) + "..." + suiName.slice(-3);
      }

      return suiName;
    }

    if (walletAddress) {
      return walletAddress?.slice(0, 4) + "..." + walletAddress?.slice(-4);
    }

    return undefined;
  }, [walletAddress, suiName]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger 
        className="h-fit border-2 border-black bg-[#f4d03f] px-4 py-2 font-semibold text-sm uppercase tracking-wider outline-none ring-0 transition-all duration-150 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none hover:bg-[#f7d94c]"
        style={{ boxShadow: "2px 2px 0px 0px #000" }}
      >
        <div className="flex items-center gap-2">
          <div className={cn("w-3 aspect-square border border-black bg-[#52b788]")} />
          <span className="text-black">{displayName ? displayName : "Connect"}</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={"end"}
        className="relative flex w-48 flex-col items-center bg-[#f5f5f0] border-2 border-black overflow-hidden p-2"
        style={{ boxShadow: "4px 4px 0px 0px #000" }}
      >
        <DropdownMenuGroup className="w-full p-0 m-0 space-y-1">
          <DropdownMenuItem className="DropdownMenuItem w-full p-0">
            <button
              className="w-full flex items-center justify-start gap-2 px-3 py-2 text-sm font-semibold uppercase tracking-wider text-black border-2 border-black bg-white hover:bg-[#f4d03f] transition-all duration-150 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
              style={{ boxShadow: "2px 2px 0px 0px #000" }}
              onClick={() => {
                window.navigator.clipboard.writeText(walletAddress);
                toast.info("Your address copied to clipboard");
              }}
            >
              <ClipboardCopyIcon
                strokeWidth={2}
                className="h-4 w-4 text-black"
              />
              <span>Copy Address</span>
            </button>
          </DropdownMenuItem>
          <DropdownMenuItem className="DropdownMenuItem w-full p-0">
            <Link
              href={`https://suivision.xyz/account/${walletAddress}?network=${network?.toLowerCase()}`}
              target="_blank"
              className="w-full"
            >
              <button className="w-full flex items-center justify-start gap-2 px-3 py-2 text-sm font-semibold uppercase tracking-wider text-black border-2 border-black bg-white hover:bg-[#52b788] transition-all duration-150 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                style={{ boxShadow: "2px 2px 0px 0px #000" }}
              >
                <SlMagnifier strokeWidth={2} className="h-4 w-4 text-black" />
                <span>Explorer</span>
              </button>
            </Link>
          </DropdownMenuItem>
          <NetworkMenu />
          <RpcMenu />
          <DropdownMenuItem className="DropdownMenuItem w-full p-0">
            <button
              className="w-full flex items-center justify-start gap-2 px-3 py-2 text-sm font-semibold uppercase tracking-wider text-white border-2 border-black bg-[#d62828] hover:bg-[#e63946] transition-all duration-150 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
              style={{ boxShadow: "2px 2px 0px 0px #000" }}
              onClick={() => disconnectWallet()}
            >
              <BiExit strokeWidth={1} className="h-4 w-4 text-white" />
              <span>Disconnect</span>
            </button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ConnectMenu;
