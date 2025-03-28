// src/services/api.ts
const API_URL = 'https://j12d105.p.ssafy.io/api';

interface LoginRequest {
  loginId: string;
  password: string;
}

interface LoginResponse {
  username: string;
  accesToken: string;
}

interface ErrorResponse {
  status: number;
  message: string;
  error: string;
}
// 회원가입 인터페이스 추가
interface SignupRequest {
  loginId: string;
  password: string;
  username: string;
}

interface SignupResponse {
  loginId: string;
  username: string;
}

// 리프레시 토큰 응답 인터페이스
interface RefreshTokenResponse {
  accessToken: string;
}

// 먼저 setupTokenRefresh 함수를 선언
export const setupTokenRefresh = () => {
  let isRefreshing = false;
  let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
  }> = [];

  const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token!);
      }
    });
    failedQueue = [];
  };

  // API 요청을 보내기 전에 실행되는 함수
  const handleRequest = async (url: string, options: RequestInit = {}) => {
    // 액세스 토큰이 만료되었을 때
    if (needsTokenRefresh()) {
      // 토큰 만료 체크 함수 (별도 구현 필요)
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const response = await refreshAccessToken();
          const { accessToken } = response;

          // 새 액세스 토큰 저장
          localStorage.setItem('accessToken', accessToken);

          isRefreshing = false;
          processQueue(null, accessToken);
        } catch (error) {
          processQueue(error, null);
          // 리프레시 실패 시 로그인 페이지로 리다이렉트
          window.location.href = '/login';
          throw error;
        }
      }

      // 토큰 갱신 중인 경우 대기
      const token = await new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      });

      // 헤더에 새 토큰 추가
      if (!options.headers) {
        options.headers = {};
      }
      (options.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    return fetch(url, options);
  };

  return handleRequest;
};

// 토큰 만료 체크 함수 (JWT 디코딩 필요)
const needsTokenRefresh = (): boolean => {
  const token = localStorage.getItem('accessToken');
  if (!token) return true;

  // JWT 디코딩하여 만료 시간 확인
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

// 그 다음에 apiClient 초기화
const apiClient = setupTokenRefresh();

export const fetchProfileData = async () => {
  const response = await fetch(`${API_URL}/profile`);
  if (!response.ok) {
    throw new Error('프로필 데이터를 가져오는데 실패했습니다');
  }
  return await response.json();
};

export const fetchStats = async () => {
  const response = await fetch(`${API_URL}/stats`);
  if (!response.ok) {
    throw new Error('통계 데이터를 가져오는데 실패했습니다');
  }
  return await response.json();
};

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  // 204 No Content
  if (response.status === 204) {
    throw new Error('회원 정보가 없습니다.');
  }

  // 400 Bad Request
  if (response.status === 400) {
    throw new Error('필수 정보가 누락되었습니다.');
  }

  // 성공이 아닌 경우
  if (!response.ok) {
    const errorData = data as ErrorResponse;
    throw new Error(errorData.message || '로그인에 실패했습니다');
  }

  return data as LoginResponse;
};
// 회원가입 로직
export const signup = async (userData: SignupRequest): Promise<SignupResponse> => {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  // 409 Conflict - 이미 가입한 회원
  if (response.status === 409) {
    throw new Error('이미 가입한 회원입니다.');
  }

  // 400 Bad Request - 필수 정보 누락
  if (response.status === 400) {
    throw new Error('필수 정보가 누락되었습니다.');
  }

  // 그 외 에러
  if (!response.ok) {
    const errorData = data as ErrorResponse;
    throw new Error(errorData.message || '회원가입에 실패했습니다');
  }

  return data as SignupResponse;
};

// 리프레시 토큰 갱신 함수
export const refreshAccessToken = async (): Promise<RefreshTokenResponse> => {
  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // credentials: 'include'를 설정하여 쿠키가 자동으로 전송되도록 함
    credentials: 'include',
  });

  // 401 Unauthorized - 리프레시 토큰 만료
  if (response.status === 401) {
    throw new Error('세션이 만료되었습니다. 다시 로그인해주세요.');
  }

  // 403 Forbidden - 리프레시 토큰 없음
  if (response.status === 403) {
    throw new Error('인증 정보가 없습니다. 다시 로그인해주세요.');
  }

  // 500 Internal Server Error
  if (response.status === 500) {
    throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
  }

  // 그 외 에러
  if (!response.ok) {
    throw new Error('토큰 갱신에 실패했습니다.');
  }

  const data = await response.json();
  return data as RefreshTokenResponse;
};

// API 요청 시 apiClient 사용
export const fetchProtectedData = async () => {
  const response = await apiClient(`${API_URL}/protected-route`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });

  return response.json();
};

// 나머지 API 호출 함수들...
