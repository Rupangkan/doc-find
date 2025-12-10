"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  userName: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
  });
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = window.localStorage.getItem("token");
      const storedUser = window.localStorage.getItem("user");
      
      if (storedToken && storedUser) {
        try {
          setAuthState({
            token: storedToken,
            user: JSON.parse(storedUser),
          });
        } catch (error) {
          console.error("Failed to parse stored user data:", error);
          window.localStorage.removeItem("token");
          window.localStorage.removeItem("user");
        }
      }
    }
  }, []);

  const login = (user: User, token: string) => {
    setAuthState({ user, token });
    if (typeof window !== "undefined") {
      window.localStorage.setItem("token", token);
      window.localStorage.setItem("user", JSON.stringify(user));
    }
  };

  const logout = () => {
    setAuthState({ user: null, token: null });
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("user");
    }
    router.push("/login");
  };

  const isAuthenticated = authState.token !== null && authState.user !== null;

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        token: authState.token,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
