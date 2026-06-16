import { Response } from "express";

interface ApiMeta {
  timestamp: string;
  version: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors: unknown | null;
  meta: ApiMeta;
}

const buildMeta = (extra?: Partial<ApiMeta>): ApiMeta => ({
  timestamp: new Date().toISOString(),
  version: "v1",
  ...extra,
});

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = "Success",
  statusCode = 200,
  meta?: Partial<ApiMeta>
): Response => {
  const body: ApiResponse<T> = {
    success: true,
    message,
    data,
    errors: null,
    meta: buildMeta(meta),
  };
  return res.status(statusCode).json(body);
};

export const sendError = (
  res: Response,
  message = "Error",
  statusCode = 400,
  errors: unknown = null
): Response => {
  const body: ApiResponse<null> = {
    success: false,
    message,
    data: null,
    errors,
    meta: buildMeta(),
  };
  return res.status(statusCode).json(body);
};
