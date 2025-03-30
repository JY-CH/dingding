import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  username: string;
  // 필요한 다른 사용자 정보들 추가
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      setAuth: (user, token) => set({
        user,
        accessToken: token,
        isAuthenticated: true,
      }),
      clearAuth: () => set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
      }),
    }),
    {
      name: 'auth-storage',
    }
  )
); 