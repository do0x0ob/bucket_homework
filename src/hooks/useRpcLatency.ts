import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import type { RpcNode } from "@/types";

export function useRpcLatency(rpcNodes: RpcNode[], enabled: boolean = false) {
  const [nodes, setNodes] = useState<RpcNode[]>(rpcNodes);
  const intervalRef = useRef<NodeJS.Timeout>();
  const nodesRef = useRef<RpcNode[]>(rpcNodes);

  const nodeUrls = useMemo(
    () => rpcNodes.map((n) => n.url).join(","),
    [rpcNodes]
  );

  const loadLatency = useCallback(async (rpcNode: RpcNode) => {
    try {
      const startTs = Date.now();
      await fetch(rpcNode.url, {
        method: "POST",
        body: `{"jsonrpc":"2.0","id":1,"method":"rpc.discover","params":[]}`,
        headers: {
          "Content-Type": "application/json",
        },
      });
      const endTs = Date.now();
      const latency = endTs - startTs;

      setNodes((prev) =>
        prev.map((node) =>
          node.name === rpcNode.name ? { ...node, latency } : node
        )
      );
    } catch (error) {
      console.warn(`Failed to measure latency for ${rpcNode.name}`, error);
    }
  }, []);

  const loadLatencies = useCallback(async () => {
    await Promise.all(nodesRef.current.map((node) => loadLatency(node)));
  }, [loadLatency]);

  useEffect(() => {
    nodesRef.current = rpcNodes;
    setNodes(rpcNodes);
  }, [nodeUrls, rpcNodes]);

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
      return;
    }

    loadLatencies();
    intervalRef.current = setInterval(loadLatencies, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
    };
  }, [enabled, loadLatencies]);

  return nodes;
}

