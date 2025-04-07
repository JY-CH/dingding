// src/hooks/useAudioAnalysis.ts
import { useState, useRef, useCallback, useEffect } from 'react';

import { useQuery, useMutation } from '@tanstack/react-query';

import { guitarChordApi } from './guitarChordApi';
import TemplateMatcher from '../utils/TemplateMatcher';

// 타입 정의 추가
interface TemplateDataResponse {
  templates: any[]; // 적절한 타입으로 변경
  duration: number;
  // 기타 필요한 속성들
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

  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const templateMatcherRef = useRef<TemplateMatcher | null>(null);

  // 템플릿 데이터 가져오기 - 타입 명시 및 onSuccess 제거
  const {
    data: templateData,
    isLoading: isLoadingTemplates,
    isSuccess,
  } = useQuery<TemplateDataResponse, Error>({
    queryKey: ['templateData'],
    queryFn: guitarChordApi.getTemplateData,
    staleTime: Infinity, // 캐시 영구 보존
  });

  // useEffect를 사용하여 데이터 로딩 완료 후 처리
  useEffect(() => {
    if (isSuccess && templateData) {
      // 템플릿 매처 초기화
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
      if (onResult) {
        onResult({
          chord: data.chord,
          confidence: data.confidence,
          source: 'backend',
          isCorrect: targetChord ? data.chord === targetChord : undefined,
        });
      }
    },
  });

  // 오디오 컨텍스트 초기화
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  // 녹음 시작
  const startRecording = useCallback(async () => {
    try {
      // 오디오 스트림 요청
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // 레코더 설정
      const mediaRecorder = new MediaRecorder(stream);
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
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);

        // 프론트엔드 처리
        const audioContext = initAudioContext();
        const arrayBuffer = await audioBlob.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        // 템플릿 매칭으로 분석
        if (templateMatcherRef.current) {
          const result = await templateMatcherRef.current.processAudio(audioBuffer);
          setLocalResult(result);

          // 프론트엔드 결과 콜백
          if (onResult) {
            onResult({
              ...result,
              source: 'frontend',
              isCorrect: targetChord ? result.chord === targetChord : undefined,
            });
          }

          // 신뢰도가 낮은 경우 백엔드 분석 요청
          if (!templateMatcherRef.current.isConfident(result.confidence)) {
            analyzeAudio(audioBlob);
          }
        } else {
          // 템플릿 매처가 없는 경우 백엔드로 직접 요청
          analyzeAudio(audioBlob);
        }
      };

      // 녹음 시작
      mediaRecorder.start();
      setIsRecording(true);

      // 지정된 길이만큼 녹음 후 자동 종료
      const duration = templateData?.duration || 1.0;
      setTimeout(() => stopRecording(), duration * 1000);
    } catch (error) {
      console.error('오디오 녹음 오류:', error);
    }
  }, [analyzeAudio, initAudioContext, onResult, targetChord, templateData]);

  // 녹음 중지
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    setIsRecording(false);
  }, []);

  // 자원 정리
  const cleanup = useCallback(() => {
    stopRecording();
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(console.error);
      audioContextRef.current = null;
    }
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
  };
};
