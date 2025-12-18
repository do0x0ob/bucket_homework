import type { NextApiRequest, NextApiResponse } from "next";

export function validateMethod(
  req: NextApiRequest,
  res: NextApiResponse,
  allowedMethods: string[]
): boolean {
  if (!allowedMethods.includes(req.method || "")) {
    res.status(405).json({ error: "Method not allowed" });
    return false;
  }
  return true;
}

export function validateQueryParam(
  req: NextApiRequest,
  res: NextApiResponse,
  paramName: string
): string | null {
  const value = req.query[paramName];
  if (!value || typeof value !== "string") {
    res.status(400).json({ error: `${paramName} is required` });
    return null;
  }
  return value;
}

export function validateQueryParams(
  req: NextApiRequest,
  res: NextApiResponse,
  paramNames: string[]
): Record<string, string> | null {
  const params: Record<string, string> = {};
  for (const paramName of paramNames) {
    const value = validateQueryParam(req, res, paramName);
    if (!value) {
      return null;
    }
    params[paramName] = value;
  }
  return params;
}

export function handleApiError(
  res: NextApiResponse,
  error: unknown,
  defaultMessage: string = "Internal server error"
) {
  console.error("API Error:", error);
  const message = error instanceof Error ? error.message : defaultMessage;
  res.status(500).json({ error: message });
}

