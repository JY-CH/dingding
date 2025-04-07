import axios from 'axios';

import { TemplateDataResponse, PredictionResult } from '../types/guitar-chord';

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const guitarChordApi = {
  // 템플릿 데이터 가져오기
  async getTemplateData(): Promise<TemplateDataResponse> {
    console.log('API URL:', API_URL);
    const response = await axios.get<TemplateDataResponse>(`${API_URL}/template-data`);
    console.log('템플릿 데이터:', response.data);
    return response.data;
  },

  // 오디오 파일 분석
  async analyzeAudio(audioBlob: Blob): Promise<PredictionResult> {
    try {
      // WAV 형식인지 확인
      const arrayBuffer = await audioBlob.arrayBuffer();
      const view = new Uint8Array(arrayBuffer);

      // WAV 헤더 확인 (RIFF로 시작해야 함)
      const isWav =
        view.length > 4 &&
        view[0] === 82 && // R
        view[1] === 73 && // I
        view[2] === 70 && // F
        view[3] === 70; // F

      if (!isWav) {
        console.error('유효한 WAV 파일이 아닙니다!', {
          header: Array.from(view.slice(0, 16))
            .map((b) => b.toString(16).padStart(2, '0'))
            .join(' '),
          chars: String.fromCharCode(...view.slice(0, 4)),
        });
        throw new Error('유효한 WAV 파일이 아닙니다. 파일 변환에 문제가 있습니다.');
      }

      console.log('유효한 WAV 헤더 확인됨:', String.fromCharCode(...view.slice(0, 4)));

      // FormData 생성 및 WAV 파일 추가
      const formData = new FormData();
      const filename = `recorded_audio_${Date.now()}.wav`;
      formData.append('file', audioBlob, filename);

      console.log('전송하는 파일 정보:', {
        name: filename,
        type: 'audio/wav',
        size: audioBlob.size,
      });

      // 백엔드에 전송
      const response = await axios.post<PredictionResult>(`${API_URL}/predict-chord`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
      });

      return response.data;
    } catch (error) {
      console.error('오디오 분석 API 오류:', error);
      throw error;
    }
  },
};
