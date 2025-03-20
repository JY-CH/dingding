// src/services/api.ts
const API_URL = 'https://your-api-endpoint.com/api';

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

// 나머지 API 호출 함수들...