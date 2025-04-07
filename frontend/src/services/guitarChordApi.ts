import axios from 'axios';

import { TemplateDataResponse, PredictionResult } from '../types/guitar-chord';

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const guitarChordApi = {
  // 템플릿 데이터 가져오기
  async getTemplateData(): Promise<TemplateDataResponse> {
    console.log(API_URL);
    const response = await axios.get<TemplateDataResponse>(`${API_URL}/template-data`);
    console.log('템플릿 데이터:', response.data); // 디버깅용 로그 추가
    return response.data;
  },

  // 오디오 파일 분석
  async analyzeAudio(audioBlob: Blob): Promise<PredictionResult> {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.wav');

    const response = await axios.post<PredictionResult>(`${API_URL}/predict-chord`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
