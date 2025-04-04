import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth";
import type { AuthState } from "@/store/auth";
import React from "react";

export const API_BASE_URL = "https://clippy.life";

interface AuthResponse {
  access_token: string;
  user: UserProfile;
}

interface UserProfile {
  id: string;
  walletAddress: string;
  username: string | null;
  email: string | null;
  avatar: string | null;
}

interface AuthRequest {
  walletAddress: string;
  signature: string;
  publicKey?: string;
}

async function authenticate(data: AuthRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Authentication failed");
  }

  return response.json();
}

async function fetchUserProfile(): Promise<UserProfile> {
  const token = useAuthStore.getState().token;
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch user profile");
  }

  return response.json();
}

async function logout(): Promise<void> {
  const token = useAuthStore.getState().token;
  if (token) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  }
}

export function useAuth() {
  const setAuth = useAuthStore((state: AuthState) => state.setAuth);
  const clearAuth = useAuthStore((state: AuthState) => state.clearAuth);

  const loginMutation = useMutation({
    mutationFn: authenticate,
    onSuccess: (data: AuthResponse) => {
      setAuth(data.access_token, data.user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearAuth();
    },
  });

  return {
    ...loginMutation,
    logout: logoutMutation.mutate,
  };
}

export function useProfile() {
  const token = useAuthStore((state: AuthState) => state.token);
  const setAuth = useAuthStore((state: AuthState) => state.setAuth);

  const queryOptions: UseQueryOptions<UserProfile, Error> = {
    queryKey: ["profile"],
    queryFn: fetchUserProfile,
    enabled: !!token,
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  };

  const query = useQuery<UserProfile, Error>(queryOptions);

  // Update store when data changes
  React.useEffect(() => {
    if (query.data) {
      const currentToken = useAuthStore.getState().token;
      if (currentToken) {
        setAuth(currentToken, query.data);
      }
    }
  }, [query.data, setAuth]);

  return query;
}

export function getStoredAuth(): {
  token: string | null;
  user: UserProfile | null;
} {
  if (typeof window === "undefined") {
    return { token: null, user: null };
  }

  const token = localStorage.getItem("access_token");
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  return { token, user };
}

export function clearAuth() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
}
