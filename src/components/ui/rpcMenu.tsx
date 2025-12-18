import {
  DropdownMenuSubTriggerLeft,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuItem,
} from "./dropdown-menu";
import { useState } from "react";
import { useUserStore } from "@/stores/useUserStore";
import { Hexagon } from "lucide-react";
import { getRpcNodes } from "@/constants/rpcNodeList";
import { useRpcLatency } from "@/hooks/useRpcLatency";
import type { Network } from "@/types";

const RpcMenu = () => {
  const { rpcUrl, setRpcUrl, network } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);
  const rpcNodes = getRpcNodes(network as Network);
  const nodesWithLatency = useRpcLatency(rpcNodes, isOpen);

  return (
    <DropdownMenuSub onOpenChange={setIsOpen}>
      <DropdownMenuSubTriggerLeft className="w-full h-fit flex items-center justify-between px-3 py-2 text-sm font-semibold uppercase tracking-wider text-black border-2 border-black bg-white hover:bg-[#f4d03f] transition-all duration-150 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
        style={{ boxShadow: "2px 2px 0px 0px #000" }}
      >
        <div className="flex items-center gap-2">
          <Hexagon strokeWidth={2} className="h-4 w-4 text-black" />
          <span>RPC Setting</span>
        </div>
      </DropdownMenuSubTriggerLeft>
      <DropdownMenuSubContent
        sideOffset={8}
        alignOffset={8}
        className="relative w-48 bg-[#f5f5f0] border-2 border-black p-2"
        style={{ boxShadow: "4px 4px 0px 0px #000" }}
      >
        {nodesWithLatency.map((rpcNode, idx) => (
          <DropdownMenuItem
            className="w-full p-0 mb-1 last:mb-0"
            key={`rpc-node-${rpcNode.name}-${idx}`}
          >
            <button
              className={`w-full flex items-center justify-between px-3 py-2 text-sm font-semibold uppercase tracking-wider border-2 border-black transition-all duration-150 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${
                rpcNode.url === rpcUrl 
                  ? "bg-[#52b788] text-black hover:bg-[#6bc99a]" 
                  : "bg-white text-black hover:bg-[#f4d03f] opacity-70"
              }`}
              style={{ boxShadow: "2px 2px 0px 0px #000" }}
              onClick={() => {
                setRpcUrl(rpcNode.url);
              }}
            >
              <span className="font-mono text-xs">{rpcNode.name}</span>
              <div className="flex gap-1 items-center">
                <div className={`w-2 h-2 border border-black ${
                  rpcNode.latency === undefined ? "bg-gray-300" : rpcNode.latency < 100 ? "bg-[#52b788]" : rpcNode.latency < 300 ? "bg-[#f4d03f]" : "bg-[#d62828]"
                }`} />
                <span className="text-xs font-mono text-black">{rpcNode.latency !== undefined ? `${rpcNode.latency}ms` : "--- ms"}</span>
              </div>
            </button>
          </DropdownMenuItem>
        ))}
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
};

export default RpcMenu;
