// src/services/auth.service.ts
import Cookies from "js-cookie";

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupCredentials extends LoginCredentials {
  handle: string;
}

class AuthService {
  private baseUrl: string;
  private refreshPromise: Promise<string | null> | null = null;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  }

  private async refreshToken(): Promise<string | null> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/auth/reauth`, {
        method: "POST",
        credentials: "include", // Important for sending/receiving cookies
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const data = await response.json();

      // Store new access token
      Cookies.set("accessToken", data.accessToken, {
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      return data.accessToken;
    } catch (error) {
      return null;
    }
  }

  // Helper method to make authenticated requests with automatic token refresh
  async makeAuthenticatedRequest(url: string, options: RequestInit = {}) {
    const accessToken = Cookies.get("accessToken");

    // First attempt with current access token
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });

    // If unauthorized, try to refresh token
    if (response.status === 401) {
      // Ensure only one refresh request at a time
      if (!this.refreshPromise) {
        this.refreshPromise = this.refreshToken();
      }

      const newToken = await this.refreshPromise;
      this.refreshPromise = null;

      if (newToken) {
        // Retry the original request with new token
        return fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${newToken}`,
          },
          credentials: "include",
        });
      }
    }

    return response;
  }

  async getCurrentUser() {
    try {
      const response = await this.makeAuthenticatedRequest(
        `${this.baseUrl}/v1/auth/me`
      );

      if (!response.ok) {
        throw new Error("Failed to get user");
      }

      const data = await response.json();
      return data.user;
    } catch {
      return null;
    }
  }

  async login(credentials: LoginCredentials) {
    const response = await fetch(`${this.baseUrl}/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Login failed");
    }

    const data = await response.json();

    // Store access token in cookie
    Cookies.set("accessToken", data.accessToken, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return data;
  }

  async signup(credentials: SignupCredentials) {
    const response = await fetch(`${this.baseUrl}/v1/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Signup failed");
    }

    const data = await response.json();

    // Store access token in cookie
    Cookies.set("accessToken", data.accessToken, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return data;
  }

  async logout() {
    const response = await this.makeAuthenticatedRequest(
      `${this.baseUrl}/v1/auth/logout`,
      {
        method: "POST",
      }
    );

    // Remove access token regardless of response
    Cookies.remove("accessToken");

    if (!response.ok) {
      throw new Error("Logout failed");
    }
  }
}

export const authService = new AuthService();
