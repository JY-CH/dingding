import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { useAuthStore } from '@/store/useAuthStore';
import { ERROR_CODES } from '@/utils/errorHandler';

const _axios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string, // API 서버 주소
  timeout: 5000, // 요청이 5초(5000ms) 이상 걸릴 경우 자동으로 요청을 중단합니다
  withCredentials: true, // 쿠키를 주고받기 위한 설정
  headers: {
    'Content-Type': 'application/json', // 요청 본문이 JSON 형식임을 명시
  },
});

// 로그인 후 사용되는 axios 인스턴스 (access token 포함)
const _axiosAuth = _axios.create();

// 요청 인터셉터 설정
_axiosAuth.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = localStorage.getItem('accessToken'); // 토큰 가져오기
  if (token && config.headers) {
    config.headers['X-Access-Token'] = `Bearer ${token}`; // 토큰 헤더 설정
  }
  return config; // 설정된 헤더를 반환
});

_axiosAuth.interceptors.response.use(
  async (response: AxiosResponse) => {
    const customCode = response.data?.body?.code;

    // Access Token 만료
    if (customCode === ERROR_CODES.EXPIRED_ACCESS_TOKEN) {
      const originalRequest = response.config as AxiosRequestConfig & { _retry?: boolean };

      if (!originalRequest._retry) {
        originalRequest._retry = true;
        try {
          // 새로운 access token 요청
          const tokenResponse = await _axios.post('/auth/token');

          const BEARER_PREFIX = 'Bearer ';
          const newAccessToken =
            tokenResponse.headers['X-Access-Token']?.substring(BEARER_PREFIX.length) ||
            tokenResponse.headers['X-Access-Token']?.substring(BEARER_PREFIX.length);

          if (newAccessToken) {
            useAuthStore.getState().loginAuth(newAccessToken);
          }

          // 새로운 토큰으로 헤더 업데이트
          if (originalRequest.headers) {
            originalRequest.headers['X-Access-Token'] = `Bearer ${newAccessToken}`;
          }

          // 원래 요청 재시도
          return _axiosAuth(originalRequest);
        } catch (error) {
          useAuthStore.getState().logoutAuth();
          return Promise.reject(error);
        }
      }
    }

    // 모든 토큰 만료 및 유효하지 않은 토큰
    if (
      customCode === ERROR_CODES.EXPIRED_ACCESS_TOKEN ||
      customCode === ERROR_CODES.EXPIRED_REFRESH_TOKEN ||
      customCode === ERROR_CODES.INVALID_REFRESH_TOKEN ||
      customCode === ERROR_CODES.NOT_FOUND_REFRESH_TOKEN
    ) {
      useAuthStore.getState().logoutAuth();
      return Promise.reject(response);
    }

    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export { _axios, _axiosAuth };
