// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/login", "/control-panel/login"];
const pathConfigs = {
  "/control-panel": {
    allowedRoles: ["business_owner", "gov_entity"],
    loginPath: "/control-panel/login",
  },
  "/": {
    allowedRoles: ["basic"],
    loginPath: "/login",
  },
};

async function validateToken(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;

  if (!accessToken) {
    return null;
  }

  try {
    // First try with current access token
    let response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/me`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      }
    );

    // If token is invalid, try refreshing
    if (response.status === 401) {
      const refreshResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/reauth`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!refreshResponse.ok) {
        return null;
      }

      const refreshData = await refreshResponse.json();

      // Retry with new token
      response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/auth/me`, {
        headers: {
          Authorization: `Bearer ${refreshData.accessToken}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        return null;
      }
    }

    const data = await response.json();
    return data.user;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (publicPaths.some((path) => pathname === path)) {
    return NextResponse.next();
  }

  const config = pathname.startsWith("/control-panel")
    ? pathConfigs["/control-panel"]
    : pathConfigs["/"];

  const user = await validateToken(request);

  if (!user) {
    return NextResponse.redirect(new URL(config.loginPath, request.url));
  }

  if (!config.allowedRoles.includes(user.role)) {
    const correctPath = user.role === "basic" ? "/" : "/control-panel";
    return NextResponse.redirect(new URL(correctPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|static|[\\w-]+\\.\\w+).*)"],
};
