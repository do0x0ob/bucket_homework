import {
  DropdownMenuSubTriggerLeft,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuItem,
} from "./dropdown-menu";
import { useUserStore } from "@/stores/useUserStore";
import { NetworkIcon } from "lucide-react";
import { getRpcNodes } from "@/constants/rpcNodeList";
import { NETWORK_LIST } from "@/constants/networkList";
import type { Network } from "@/types";

const NetworkMenu = () => {
  const { network, setNetwork, setRpcUrl } = useUserStore();

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTriggerLeft className="w-full h-fit flex items-center justify-between px-3 py-2 text-sm font-semibold uppercase tracking-wider text-black border-2 border-black bg-white hover:bg-[#f4d03f] transition-all duration-150 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
        style={{ boxShadow: "2px 2px 0px 0px #000" }}
      >
        <div className="flex items-center gap-2">
          <NetworkIcon strokeWidth={2} className="h-4 w-4 text-black" />
          <span>Network</span>
        </div>
      </DropdownMenuSubTriggerLeft>
      <DropdownMenuSubContent
        sideOffset={8}
        alignOffset={8}
        className="relative w-48 bg-[#f5f5f0] border-2 border-black p-2"
        style={{ boxShadow: "4px 4px 0px 0px #000" }}
      >
        {NETWORK_LIST.map((_network, idx) => (
          <DropdownMenuItem
            className="w-full p-0 mb-1 last:mb-0"
            key={`network-${_network}-${idx}`}
          >
            <button
              className={`w-full flex items-center justify-between px-3 py-2 text-sm font-semibold uppercase tracking-wider border-2 border-black transition-all duration-150 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${
                network == _network 
                  ? "bg-[#52b788] text-black hover:bg-[#6bc99a]" 
                  : "bg-white text-black hover:bg-[#f4d03f] opacity-70"
              }`}
              style={{ boxShadow: "2px 2px 0px 0px #000" }}
              onClick={() => {
                setNetwork(_network);
                setRpcUrl(getRpcNodes(_network as Network)[0].url);
              }}
            >
              <span>{_network}</span>
            </button>
          </DropdownMenuItem>
        ))}
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
};

export default NetworkMenu;
