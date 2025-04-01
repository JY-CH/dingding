import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  username: string;
  userProfile: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  getUser: () => User | null; // 현재 로그인된 사용자 정보를 반환
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setAuth: (user, token) =>
        set({
          user,
          accessToken: token,
          isAuthenticated: true,
        }),

      clearAuth: () => {
        // 상태 초기화
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        });
        console.log('로그아웃 후 상태:', useAuthStore.getState());

        // 로그인 페이지로 리다이렉트
        window.location.href = '/login';
      },

      // 현재 로그인된 사용자 정보를 반환하는 메서드
      getUser: () => {
        const { user } = get();
        return user;
      },
    }),
    { name: 'auth-storage' },
  ),
);
