import { useState, useEffect } from "react";
import type { ObjectData } from "@/types";

const DEFAULT_OBJECT_ID = "0xeeb34a78eaf4ae873c679db294296778676de4a335f222856716d1ad6ed54e45";

export function useObjectData(rpcUrl: string, objectId: string = DEFAULT_OBJECT_ID) {
  const [objectData, setObjectData] = useState<ObjectData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchObjectData = async () => {
      try {
        setIsLoading(true);
        setObjectData(null);

        const response = await fetch(
          `/api/object?rpcUrl=${encodeURIComponent(rpcUrl)}`
        );
        const data = await response.json() as ObjectData;

        if (response.ok) {
          setObjectData(data);
        } else {
          setObjectData({ error: data.error || "Failed to fetch object" });
        }
      } catch (error: any) {
        console.error("Error fetching object:", error);
        setObjectData({
          error: error?.message || "Failed to fetch object",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchObjectData();
  }, [rpcUrl]);

  return { objectData, isLoading };
}

