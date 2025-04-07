import axios from 'axios';

import { TemplateDataResponse, PredictionResult } from '../types/guitar-chord';

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const guitarChordApi = {
  // 템플릿 데이터 가져오기
  async getTemplateData(): Promise<TemplateDataResponse> {
    console.log('API URL:', API_URL);
    const response = await axios.get<TemplateDataResponse>(`${API_URL}/template-data`);
    console.log('템플릿 데이터:', response.data); // 디버깅용 로그 추가
    return response.data;
  },

  // 오디오 파일 분석
  async analyzeAudio(audioBlob: Blob): Promise<PredictionResult> {
    // 오디오 MIME 타입 확인
    const mimeType = audioBlob.type || 'audio/wav';
    console.log('오디오 MIME 타입:', mimeType);

    // 파일명에 확장자 추가 (MIME 타입에 따라)
    const extension = mimeType.includes('wav')
      ? 'wav'
      : mimeType.includes('mp3')
        ? 'mp3'
        : mimeType.includes('webm')
          ? 'webm'
          : 'wav';

    // 타임스탬프를 포함한 고유 파일명 생성
    const filename = `recorded_audio_${Date.now()}.${extension}`;

    // FormData 생성 및 파일 추가
    const formData = new FormData();
    formData.append('file', audioBlob, filename);

    // 디버깅 정보
    console.log('전송하는 파일 정보:', {
      name: filename,
      type: mimeType,
      size: audioBlob.size,
    });

    try {
      // 파일 전송 요청
      const response = await axios.post<PredictionResult>(`${API_URL}/predict-chord`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // 큰 파일 처리를 위한 타임아웃 설정 (밀리초)
        timeout: 30000,
      });

      console.log('분석 응답:', response.data);
      return response.data;
    } catch (error) {
      console.error('오디오 분석 오류:', error);

      // axios 에러 상세 정보 출력
      if (axios.isAxiosError(error)) {
        console.error('요청 정보:', error.config);
        console.error('응답 정보:', error.response?.data);
        console.error('상태 코드:', error.response?.status);
      }

      throw error;
    }
  },
};
