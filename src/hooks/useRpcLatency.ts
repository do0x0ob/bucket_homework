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
      const response = await fetch(rpcNode.url, {
        method: "POST",
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "sui_getChainIdentifier",
          params: [],
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const endTs = Date.now();
      const latency = endTs - startTs;

      setNodes((prev) =>
        prev.map((node) =>
          node.name === rpcNode.name ? { ...node, latency } : node
        )
      );
    } catch (error) {
      console.warn(`Failed to measure latency for ${rpcNode.name}`, error);
      setNodes((prev) =>
        prev.map((node) =>
          node.name === rpcNode.name ? { ...node, latency: -1 } : node
        )
      );
    }
  }, []);

  const loadLatencies = useCallback(async () => {
    await Promise.all(nodesRef.current.map((node) => loadLatency(node)));
  }, [loadLatency]);

  useEffect(() => {
    setNodes((prev) => {
      const urlSet = new Set(rpcNodes.map((n) => n.url));
      const prevUrlSet = new Set(prev.map((n) => n.url));
      
      if (
        urlSet.size === prevUrlSet.size &&
        [...urlSet].every((url) => prevUrlSet.has(url))
      ) {
        nodesRef.current = rpcNodes;
        return prev.map((prevNode) => {
          const newNode = rpcNodes.find((n) => n.url === prevNode.url);
          return newNode ? { ...newNode, latency: prevNode.latency } : prevNode;
        });
      }
      
      nodesRef.current = rpcNodes;
      return rpcNodes;
    });
  }, [nodeUrls]);

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

