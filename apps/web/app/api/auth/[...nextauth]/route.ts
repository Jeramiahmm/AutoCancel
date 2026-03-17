import NextAuth from "next-auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authOptions } from "@/src/lib/auth";
import { getProductionCriticalAuthIssues } from "@/src/lib/env";

const handler = NextAuth(authOptions);

function redirectToAuthError(request: Request, code = "auth_unavailable") {
  const url = new URL("/auth/error", request.url);
  url.searchParams.set("error", code);
  return NextResponse.redirect(url);
}

async function runAuthHandler(request: NextRequest, context: unknown) {
  const productionIssues = getProductionCriticalAuthIssues();
  if (productionIssues.length > 0) {
    console.error("[auth.route] refusing auth request due to production config issues", productionIssues);
    return redirectToAuthError(request, "auth_unavailable");
  }

  try {
    return await handler(request, context as never);
  } catch (error) {
    console.error("[auth.route] nextauth handler failed", error);
    return redirectToAuthError(request, "auth_unavailable");
  }
}

export async function GET(request: NextRequest, context: unknown) {
  return runAuthHandler(request, context);
}

export async function POST(request: NextRequest, context: unknown) {
  return runAuthHandler(request, context);
}
