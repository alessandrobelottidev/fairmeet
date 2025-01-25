"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export type UserRole = "admin" | "business_owner" | "gov_entity" | "basic";

interface User {
  handle: string;
  email: string;
  role: UserRole;
}

function getRedirectPath(role: UserRole): string {
  switch (role) {
    case "business_owner":
    case "gov_entity":
      return "/control-panel";
    case "basic":
      return "/home";
    default:
      return "/login";
  }
}

function handleSetCookies(response: Response) {
  const setCookieHeaders = response.headers.getSetCookie();
  const cookieStore = cookies();

  setCookieHeaders.forEach(async (cookie) => {
    const [cookieName, ...parts] = cookie.split(";")[0].split("=");
    const cookieValue = parts.join("=");

    (await cookieStore).set(cookieName, cookieValue, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: cookieName === "refreshTkn",
      sameSite: "lax",
    });
  });
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const origin = (await headers()).get("origin");

  const response = await fetch(`${API_URL}/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: origin || "",
    },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Login failed");
  }

  const data = await response.json();

  // Handle any cookies from the response
  handleSetCookies(response);

  // Set access token
  (
    await // Set access token
    cookies()
  ).set("accessToken", data.accessToken, {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  redirect(getRedirectPath(data.user.role));
}

export async function register(formData: FormData) {
  const handle = formData.get("handle") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const origin = (await headers()).get("origin");

  const response = await fetch(`${API_URL}/v1/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: origin || "",
    },
    body: JSON.stringify({ handle, email, password }),
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Registration failed");
  }

  const data = await response.json();

  // Handle any cookies from the response
  handleSetCookies(response);

  // Set access token
  (
    await // Set access token
    cookies()
  ).set("accessToken", data.accessToken, {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  redirect("/");
}

export async function logout() {
  const cookieStore = cookies();
  const accessToken = (await cookieStore).get("accessToken")?.value;
  const origin = (await headers()).get("origin");
  const cookieHeader = (await headers()).get("cookie");

  const response = await fetch(`${API_URL}/v1/auth/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Origin: origin || "",
      Cookie: cookieHeader || "",
    },
    credentials: "include",
  });

  // Handle any cookies from the response
  handleSetCookies(response);

  // Remove access token
  (
    await // Remove access token
    cookieStore
  ).delete("accessToken");

  redirect("/login");
}

export async function logoutControlPanel() {
  const cookieStore = cookies();
  const accessToken = (await cookieStore).get("accessToken")?.value;
  const origin = (await headers()).get("origin");
  const cookieHeader = (await headers()).get("cookie");

  const response = await fetch(`${API_URL}/v1/auth/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Origin: origin || "",
      Cookie: cookieHeader || "",
    },
    credentials: "include",
  });

  // Handle any cookies from the response
  handleSetCookies(response);

  // Remove access token
  (
    await // Remove access token
    cookieStore
  ).delete("accessToken");

  redirect("/control-panel/login");
}

export async function requestPasswordReset(formData: FormData) {
  const email = formData.get("email") as string;
  const origin = (await headers()).get("origin");

  const response = await fetch(`${API_URL}/v1/auth/forgotpass`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: origin || "",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Password reset request failed");
  }

  // No need to handle cookies for password reset request
  redirect("/reset-password/check-email");
}

export async function resetPassword(formData: FormData) {
  const token = formData.get("token") as string;
  const password = formData.get("password") as string;
  const origin = (await headers()).get("origin");

  const response = await fetch(`${API_URL}/v1/auth/resetpass/${token}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Origin: origin || "",
    },
    body: JSON.stringify({
      resetToken: token,
      password,
      passwordConfirm: password,
    }),
  });

  console.log(response);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Password reset failed");
  }

  redirect("/login");
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = cookies();
  const accessToken = (await cookieStore).get("accessToken")?.value;

  if (!accessToken) return null;

  try {
    const origin = (await headers()).get("origin");
    const response = await fetch(`${API_URL}/v1/auth/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Origin: origin || "",
      },
      credentials: "include",
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.user;
  } catch {
    return null;
  }
}

export async function getAuthStatus() {
  const user = await getCurrentUser();
  return {
    user,
    isAuthenticated: !!user,
  };
}

// Helper to refresh token - can be used by middleware or other server components
export async function refreshAccessToken(): Promise<string | null> {
  try {
    const origin = (await headers()).get("origin");
    const response = await fetch(`${API_URL}/v1/auth/reauth`, {
      method: "POST",
      headers: {
        Origin: origin || "",
      },
      credentials: "include",
    });

    if (!response.ok) return null;

    const data = await response.json();

    // Handle any cookies from the response
    handleSetCookies(response);

    // Set new access token
    (
      await // Set new access token
      cookies()
    ).set("accessToken", data.accessToken, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return data.accessToken;
  } catch {
    return null;
  }
}
