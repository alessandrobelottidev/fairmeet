import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { type UserRole } from "@/lib/auth";

// Public paths that don't require authentication
const publicPaths = [
  "/login",
  "/register",
  "/control-panel/login",
  "/control-panel/register",
  "/reset-password",
  "/reset-password/",
];

// Define route configs
const routeConfigs = {
  "/control-panel": {
    allowedRoles: ["business_owner", "gov_entity", "admin"] as UserRole[],
    loginPath: "/control-panel/login",
  },
  "/": {
    allowedRoles: ["basic"] as UserRole[],
    loginPath: "/login",
  },
};

async function validateUser(request: NextRequest) {
  try {
    // First try with existing access token
    const accessToken = request.cookies.get("accessToken")?.value;
    if (!accessToken) return null;

    // Get all cookies from the request
    const cookieHeader = request.headers.get("cookie");

    let response = await fetch(`${process.env.API_URL}/v1/auth/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Cookie: cookieHeader || "", // Forward all cookies
      },
      credentials: "include",
    });

    // If token expired (401), try to refresh
    if (response.status === 401) {
      const refreshResponse = await fetch(
        `${process.env.API_URL}/v1/auth/reauth`,
        {
          method: "POST",
          headers: {
            Cookie: cookieHeader || "", // Forward all cookies here too
          },
          credentials: "include",
        }
      );

      // If refresh failed, user needs to login again
      if (!refreshResponse.ok) return null;

      // Got new access token
      const refreshData = await refreshResponse.json();

      // Try me endpoint again with new token
      response = await fetch(`${process.env.API_URL}/v1/auth/me`, {
        headers: {
          Authorization: `Bearer ${refreshData.accessToken}`,
          Cookie: cookieHeader || "", // And here
        },
        credentials: "include",
      });

      if (!response.ok) return null;

      const userData = await response.json();
      return {
        user: userData.user,
        newToken: refreshData.accessToken,
      };
    }

    if (!response.ok) return null;

    const userData = await response.json();
    return {
      user: userData.user,
      newToken: null,
    };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Determine which config to use based on path
  const config = pathname.startsWith("/control-panel")
    ? routeConfigs["/control-panel"]
    : routeConfigs["/"];

  // Validate user and potentially refresh token
  const result = await validateUser(request);

  // If no valid user session, redirect to login
  if (!result) {
    return NextResponse.redirect(new URL(config.loginPath, request.url));
  }

  const { user, newToken } = result;

  // Check role access
  if (!config.allowedRoles.includes(user.role as UserRole)) {
    // Redirect to appropriate section based on role
    const correctPath = user.role === "basic" ? "/map" : "/control-panel/";
    const response = NextResponse.redirect(new URL(correctPath, request.url));

    // If we have a new token, set it in the response
    if (newToken) {
      response.cookies.set("accessToken", newToken, {
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
    }

    return response;
  }

  // User is authenticated and authorized
  const response = NextResponse.next();

  // If we got a new token from refresh, set it
  if (newToken) {
    response.cookies.set("accessToken", newToken, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all paths except static files and api
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
