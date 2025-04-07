// src/hooks/useAudioAnalysis.ts
import { useState, useRef, useCallback, useEffect } from 'react';

import { useQuery, useMutation } from '@tanstack/react-query';

import { guitarChordApi } from './guitarChordApi';
import TemplateMatcher from '../utils/TemplateMatcher';

// 타입 정의
interface TemplateDataResponse {
  templates: any[];
  duration: number;
}

interface UseAudioAnalysisProps {
  onResult?: (result: {
    chord: string;
    confidence: number;
    source: 'frontend' | 'backend';
    isCorrect?: boolean;
  }) => void;
  targetChord?: string;
  confidenceThreshold?: number;
}

// WAV 파일로 변환하는 함수
const audioToWav = async (audioBuffer: AudioBuffer, sampleRate: number = 22050): Promise<Blob> => {
  // WAV 파일 헤더 생성을 위한 함수
  function createWavHeader(
    sampleRate: number,
    bitsPerSample: number,
    channels: number,
    dataLength: number,
  ) {
    const buffer = new ArrayBuffer(44);
    const view = new DataView(buffer);

    // RIFF 식별자
    view.setUint8(0, 'R'.charCodeAt(0));
    view.setUint8(1, 'I'.charCodeAt(0));
    view.setUint8(2, 'F'.charCodeAt(0));
    view.setUint8(3, 'F'.charCodeAt(0));

    // 파일 크기
    view.setUint32(4, 36 + dataLength, true);

    // WAVE 식별자
    view.setUint8(8, 'W'.charCodeAt(0));
    view.setUint8(9, 'A'.charCodeAt(0));
    view.setUint8(10, 'V'.charCodeAt(0));
    view.setUint8(11, 'E'.charCodeAt(0));

    // fmt 청크 마커
    view.setUint8(12, 'f'.charCodeAt(0));
    view.setUint8(13, 'm'.charCodeAt(0));
    view.setUint8(14, 't'.charCodeAt(0));
    view.setUint8(15, ' '.charCodeAt(0));

    // fmt 청크 길이
    view.setUint32(16, 16, true);

    // 오디오 포맷 (1 = PCM)
    view.setUint16(20, 1, true);

    // 채널 수
    view.setUint16(22, channels, true);

    // 샘플 레이트
    view.setUint32(24, sampleRate, true);

    // 바이트 레이트
    view.setUint32(28, sampleRate * channels * (bitsPerSample / 8), true);

    // 블록 얼라인
    view.setUint16(32, channels * (bitsPerSample / 8), true);

    // 비트 퍼 샘플
    view.setUint16(34, bitsPerSample, true);

    // 데이터 청크 마커
    view.setUint8(36, 'd'.charCodeAt(0));
    view.setUint8(37, 'a'.charCodeAt(0));
    view.setUint8(38, 't'.charCodeAt(0));
    view.setUint8(39, 'a'.charCodeAt(0));

    // 데이터 청크 길이
    view.setUint32(40, dataLength, true);

    return buffer;
  }

  // 모노로 다운믹스
  const numberOfChannels = 1;
  const length = Math.round(audioBuffer.duration * sampleRate);

  // 오프라인 오디오 컨텍스트 생성
  const offlineCtx = new OfflineAudioContext(numberOfChannels, length, sampleRate);

  // 소스 노드 생성 및 연결
  const source = offlineCtx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(offlineCtx.destination);

  // 렌더링 시작
  source.start(0);
  const renderedBuffer = await offlineCtx.startRendering();

  // PCM 데이터 추출
  const channelData = renderedBuffer.getChannelData(0);

  // Float32Array를 Int16Array로 변환 (16비트 PCM)
  const intData = new Int16Array(channelData.length);
  for (let i = 0; i < channelData.length; i++) {
    // float32를 int16으로 변환 (-1.0 ~ 1.0 -> -32768 ~ 32767)
    const s = Math.max(-1, Math.min(1, channelData[i]));
    intData[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }

  // 데이터 길이 계산 (2바이트 * 샘플 수)
  const dataLength = intData.length * 2;

  // WAV 헤더 생성
  const headerBuffer = createWavHeader(sampleRate, 16, numberOfChannels, dataLength);

  // 최종 WAV 파일 조합
  const wavBuffer = new Uint8Array(headerBuffer.byteLength + dataLength);
  wavBuffer.set(new Uint8Array(headerBuffer), 0);
  wavBuffer.set(new Uint8Array(intData.buffer), headerBuffer.byteLength);

  // Blob 생성 및 반환
  return new Blob([wavBuffer], { type: 'audio/wav' });
};

export const useAudioAnalysis = ({
  onResult,
  targetChord,
  confidenceThreshold = 0.7,
}: UseAudioAnalysisProps = {}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [localResult, setLocalResult] = useState<{ chord: string; confidence: number } | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const templateMatcherRef = useRef<TemplateMatcher | null>(null);

  // 템플릿 데이터 가져오기
  const {
    data: templateData,
    isLoading: isLoadingTemplates,
    isSuccess,
  } = useQuery<TemplateDataResponse, Error>({
    queryKey: ['templateData'],
    queryFn: guitarChordApi.getTemplateData,
    staleTime: Infinity, // 캐시 영구 보존
  });

  // 템플릿 데이터 로딩 후 초기화
  useEffect(() => {
    if (isSuccess && templateData) {
      console.log('템플릿 데이터 로드 완료:', templateData);
      templateMatcherRef.current = new TemplateMatcher(
        templateData.templates,
        templateData.duration,
        confidenceThreshold,
      );
    }
  }, [isSuccess, templateData, confidenceThreshold]);

  // 백엔드 API 호출 뮤테이션
  const { mutate: analyzeAudio, isPending: isAnalyzing } = useMutation({
    mutationFn: guitarChordApi.analyzeAudio,
    onSuccess: (data) => {
      console.log('백엔드 분석 결과:', data);
      if (onResult) {
        onResult({
          chord: data.chord,
          confidence: data.confidence,
          source: 'backend',
          isCorrect: targetChord ? data.chord === targetChord : undefined,
        });
      }
      setError(null);
    },
    onError: (err: any) => {
      console.error('백엔드 분석 오류:', err);
      setError(err?.message || '백엔드 분석 중 오류가 발생했습니다.');

      // 백엔드 오류 발생 시 프론트엔드 결과라도 전달
      if (localResult && onResult) {
        onResult({
          ...localResult,
          source: 'frontend',
          isCorrect: targetChord ? localResult.chord === targetChord : undefined,
        });
      }
    },
  });

  // 오디오 컨텍스트 초기화
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        console.log('오디오 컨텍스트 초기화 성공:', audioContextRef.current.sampleRate);
      } catch (error) {
        console.error('오디오 컨텍스트 초기화 실패:', error);
        setError('오디오 컨텍스트를 초기화할 수 없습니다.');
      }
    }
    return audioContextRef.current;
  }, []);

  // 녹음 시작
  const startRecording = useCallback(async () => {
    setError(null);
    try {
      // 이미 녹음 중인 경우 처리
      if (isRecording) {
        console.warn('이미 녹음 중입니다.');
        return;
      }

      console.log('오디오 녹음 시작 시도...');

      // 오디오 스트림 요청 - 고품질 설정
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
          channelCount: 1,
        },
      });
      streamRef.current = stream;
      console.log('오디오 스트림 획득 성공');

      // 브라우저 지원 MIME 타입 확인
      const supportedTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/mp4',
        'audio/wav',
      ];

      let selectedType = '';
      for (const type of supportedTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          selectedType = type;
          break;
        }
      }

      console.log('선택된 MIME 타입:', selectedType || '기본값');

      // 레코더 설정
      const options = selectedType ? { mimeType: selectedType } : undefined;
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      // 청크 초기화
      chunksRef.current = [];

      // 데이터 수집
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      // 녹음 완료 처리
      mediaRecorder.onstop = async () => {
        console.log('녹음 완료, 처리 시작...');

        try {
          // 녹음된 데이터로 Blob 생성
          const rawBlob = new Blob(chunksRef.current, { type: selectedType || 'audio/wav' });
          console.log('녹음된 오디오 정보:', {
            size: rawBlob.size,
            type: rawBlob.type,
            chunks: chunksRef.current.length,
          });

          // 오디오 디코딩
          const audioContext = initAudioContext();
          if (!audioContext) {
            throw new Error('오디오 컨텍스트를 초기화할 수 없습니다.');
          }

          const arrayBuffer = await rawBlob.arrayBuffer();
          console.log('오디오 버퍼 크기:', arrayBuffer.byteLength);

          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          console.log('오디오 디코딩 성공:', {
            duration: audioBuffer.duration,
            sampleRate: audioBuffer.sampleRate,
            channels: audioBuffer.numberOfChannels,
          });

          // WAV로 변환 (백엔드 호환성 향상)
          const wavBlob = await audioToWav(audioBuffer, 22050);
          console.log('WAV 변환 성공:', {
            size: wavBlob.size,
            type: wavBlob.type,
          });

          setAudioBlob(wavBlob);

          // 프론트엔드 분석
          if (templateMatcherRef.current) {
            console.log('템플릿 매칭 분석 시작...');
            const result = await templateMatcherRef.current.processAudio(audioBuffer);
            console.log('템플릿 매칭 결과:', result);

            setLocalResult(result);

            // 프론트엔드 결과 콜백
            if (onResult) {
              onResult({
                ...result,
                source: 'frontend',
                isCorrect: targetChord ? result.chord === targetChord : undefined,
              });
            }
          }

          // 백엔드 분석 - 항상 실행
          console.log('백엔드 분석 요청 시작...');
          analyzeAudio(wavBlob);
        } catch (error) {
          console.error('오디오 처리 오류:', error);
          setError(`오디오 처리 중 오류: ${(error as Error).message}`);

          // 오류가 있어도 원본 블롭으로 백엔드 분석 시도
          if (chunksRef.current.length > 0) {
            const fallbackBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
            console.log('오류 복구: 원본 오디오로 백엔드 분석 시도');
            analyzeAudio(fallbackBlob);
          }
        }
      };

      // 녹음 시작
      mediaRecorder.start();
      setIsRecording(true);
      console.log('녹음 시작됨');

      // 지정된 길이만큼 녹음 후 자동 종료
      const duration = templateData?.duration || 1.0;
      setTimeout(() => {
        if (isRecording) {
          console.log(`${duration}초 후 녹음 자동 종료`);
          stopRecording();
        }
      }, duration * 1000);
    } catch (error) {
      console.error('오디오 녹음 시작 오류:', error);
      setError(`마이크 접근 또는 녹음 시작 실패: ${(error as Error).message}`);
    }
  }, [analyzeAudio, initAudioContext, isRecording, onResult, targetChord, templateData]);

  // 녹음 중지
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      console.log('녹음 중지 요청...');
      try {
        mediaRecorderRef.current.stop();
        console.log('녹음 중지 성공');
      } catch (error) {
        console.error('녹음 중지 오류:', error);
      }
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (error) {
          console.error('오디오 트랙 중지 오류:', error);
        }
      });
      console.log('오디오 스트림 트랙 종료');
    }

    setIsRecording(false);
  }, []);

  // 자원 정리
  const cleanup = useCallback(() => {
    console.log('오디오 자원 정리 시작...');
    stopRecording();

    if (audioContextRef.current) {
      try {
        audioContextRef.current.close().catch(console.error);
        audioContextRef.current = null;
        console.log('오디오 컨텍스트 닫힘');
      } catch (error) {
        console.error('오디오 컨텍스트 정리 오류:', error);
      }
    }

    setAudioBlob(null);
    setLocalResult(null);
    setError(null);
    console.log('오디오 자원 정리 완료');
  }, [stopRecording]);

  return {
    isRecording,
    isAnalyzing,
    isLoadingTemplates,
    startRecording,
    stopRecording,
    cleanup,
    audioBlob,
    localResult,
    templateData,
    error,
  };
};
