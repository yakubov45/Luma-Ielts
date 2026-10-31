"use client";

import { onAuthStateChanged, type User } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase/client";

export interface AuthState {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isTeacher: boolean;
}

const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
  isAdmin: false,
  isTeacher: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    isAdmin: false,
    isTeacher: false,
  });

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const tokenResult = await user.getIdTokenResult();
          setState({
            user,
            loading: false,
            isAdmin: tokenResult.claims.admin === true,
            isTeacher: tokenResult.claims.teacher === true,
          });
        } catch {
          setState({
            user,
            loading: false,
            isAdmin: false,
            isTeacher: false,
          });
        }
      } else {
        setState({
          user: null,
          loading: false,
          isAdmin: false,
          isTeacher: false,
        });
      }
    });
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
