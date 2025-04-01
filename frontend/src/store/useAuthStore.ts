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
}
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setAuth: (user, token) =>
        set({
          user,
          accessToken: token,
          isAuthenticated: true,
        }),

      clearAuth: async () => {
        try {
          // 🚀 로그아웃 API 요청
          const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include', // 쿠키 포함하여 서버 요청
          });

          if (!response.ok) {
            throw new Error('로그아웃에 실패했습니다.');
          }

          // ✅ 상태 초기화
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
          });
          console.log('로그아웃 후 상태:', useAuthStore.getState());

          // 로그인 페이지로 리다이렉트
          window.location.href = '/login';
        } catch (error) {
          console.error('로그아웃 실패:', error);
        }
      },
    }),
    { name: 'auth-storage' },
  ),
);
