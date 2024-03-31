import { Request } from "express";

export function isBackOfficeRequest(req: Request): boolean {
  return req.headers["request-from"] === "BO";
}

