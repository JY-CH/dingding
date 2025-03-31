import { jwtDecode } from 'jwt-decode';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// JWT 디코딩 결과 타입 정의
interface DecodedToken {
  id: number | null;
  email: string | null;
  nickname: string | null;
  // 필요한 다른 필드가 있다면 추가
}

// Zustand 상태 타입 정의
interface AuthState {
  userData: DecodedToken; // 디코딩된 사용자 데이터
  isLogin: boolean; // 로그인 여부
  isInitialized: boolean; // 초기화 여부
  loginAuth: (token: string) => void; // 로그인 함수
  logoutAuth: () => void; // 로그아웃 함수
  initializeAuth: () => void; // 초기화 함수
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userData: { id: null, email: null, nickname: null },
      isLogin: false,
      isInitialized: false,

      // 토큰 저장 및 userData 업데이트
      loginAuth: (token: string) => {
        const decoded = jwtDecode<DecodedToken>(token); // 토큰 디코딩
        localStorage.setItem('accessToken', token);
        set({ userData: decoded, isLogin: true });
      },

      // 토큰 제거 및 userData 초기화
      logoutAuth: () => {
        localStorage.removeItem('accessToken');
        set({ userData: { id: null, email: null, nickname: null }, isLogin: false });
      },

      // 토큰 및 userData 초기화 함수
      initializeAuth: () => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          const decoded = jwtDecode<DecodedToken>(token); // 토큰 디코딩
          set({ userData: decoded, isLogin: true, isInitialized: true });
        } else {
          set({ isInitialized: true });
        }
      },
    }),
    {
      name: 'auth-storage', // 로컬 스토리지에 저장될 키 이름
    },
  ),
);
