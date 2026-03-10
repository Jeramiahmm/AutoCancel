import { NextResponse } from "next/server";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function fail(message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      details,
    },
    { status },
  );
}

export function handleApiError(error: unknown) {
  if (error instanceof Error) {
    return fail(error.message, error.message.includes("Unauthorized") ? 401 : 400);
  }
  return fail("Unknown error", 500);
}
