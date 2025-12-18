import type { NextApiRequest, NextApiResponse } from "next";
import { SuiClient } from "@mysten/sui/client";
import type { ObjectData } from "@/types";
import { validateMethod, validateQueryParam, handleApiError } from "@/lib/api-utils";

const DEFAULT_OBJECT_ID = "0xeeb34a78eaf4ae873c679db294296778676de4a335f222856716d1ad6ed54e45";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ObjectData>
) {
  if (!validateMethod(req, res, ["GET"])) {
    return;
  }

  const rpcUrl = validateQueryParam(req, res, "rpcUrl");
  if (!rpcUrl) {
    return;
  }

  try {
    const client = new SuiClient({ url: rpcUrl });
    const object = await client.getObject({
      id: DEFAULT_OBJECT_ID,
      options: {
        showContent: true,
        showOwner: true,
        showType: true,
      },
    });

    if (!object.data) {
      return res.status(404).json({ error: "Object not found" });
    }

    const data: ObjectData = {};

    if (object.data.content && "fields" in object.data.content) {
      const fields = object.data.content.fields as Record<string, unknown>;
      if (fields.admin) {
        data.admin = String(fields.admin);
      }
      if (fields.balance) {
        data.balance = String(fields.balance);
      }
    }

    if (object.data.owner && typeof object.data.owner === "object") {
      if ("AddressOwner" in object.data.owner && !data.admin) {
        data.admin = String(object.data.owner.AddressOwner);
      }
    }

    res.status(200).json(data);
  } catch (error) {
    handleApiError(res, error, "Failed to fetch object");
  }
}

