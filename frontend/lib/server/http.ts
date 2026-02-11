import { NextResponse } from "next/server";

export const ok = (data: unknown, init?: ResponseInit) => NextResponse.json({ success: true, data }, init);

export const okMessage = (message: string, data?: unknown, init?: ResponseInit) =>
  NextResponse.json({ success: true, message, ...(data !== undefined ? { data } : {}) }, init);

export const fail = (message: string, status = 400) => NextResponse.json({ success: false, message }, { status });

export const errorResponse = (error: unknown) => {
  const status = (error as { status?: number })?.status || 500;
  const isProduction = process.env.NODE_ENV === "production";
  const fallback = status === 500 ? "Internal server error." : "Request failed.";
  const detailed = (error as Error)?.message || fallback;
  const message = isProduction ? fallback : detailed;
  return NextResponse.json({ success: false, message }, { status });
};
