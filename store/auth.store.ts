import { create } from "zustand";
import { IUser } from "@/types";

interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  hasCheckedAuth: boolean;
  login: (user: IUser) => void;
  logout: () => void;
  setUser: (user: IUser | null) => void;
  setHasCheckedAuth: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  hasCheckedAuth: false,
  login: (user) => set({ user, isAuthenticated: true, hasCheckedAuth: true }),
  logout: () =>
    set({ user: null, isAuthenticated: false, hasCheckedAuth: true }),
  setUser: (user) =>
    set({
      user,
      isAuthenticated: Boolean(user),
      hasCheckedAuth: true,
    }),
  setHasCheckedAuth: (value) => set({ hasCheckedAuth: value }),
}));
