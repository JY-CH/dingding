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
  recordingDuration?: number; // 녹음 시간 설정 추가
}

export const useAudioAnalysis = ({
  onResult,
  targetChord,
  confidenceThreshold = 0.7,
  recordingDuration = 1.0, // 기본값은 1초
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

  // 녹음 타이머 처리를 위한 Ref
  const recordingTimerRef = useRef<number | null>(null);

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
        recordingDuration, // 템플릿 매칭에도 선택된 녹음 시간 사용
        confidenceThreshold,
      );
    }
  }, [isSuccess, templateData, confidenceThreshold, recordingDuration]);

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
    onError: (error) => {
      console.error('백엔드 분석 오류:', error);
      setError(`백엔드 분석 오류: ${(error as Error).message}`);

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
        setError(`오디오 컨텍스트 초기화 실패: ${(error as Error).message}`);
      }
    }
    return audioContextRef.current;
  }, []);

  // 녹음 중지
  const stopRecording = useCallback(() => {
    // 진행 중인 타이머가 있다면 취소
    if (recordingTimerRef.current !== null) {
      clearTimeout(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      console.log('녹음 중지 요청...');
      try {
        mediaRecorderRef.current.stop();
        console.log('녹음 중지 성공');
      } catch (error) {
        console.error('녹음 중지 오류:', error);
        setError(`녹음 중지 오류: ${(error as Error).message}`);
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

  // 녹음 시작
  const startRecording = useCallback(async () => {
    setError(null);

    try {
      // 이미 녹음 중이면 중지
      if (isRecording) {
        stopRecording();
        return;
      }

      console.log(`녹음 시작 (설정 시간: ${recordingDuration}초)`);

      // 오디오 스트림 요청 - 고품질 설정 추가
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100, // 권장 샘플 레이트
          channelCount: 1, // 모노 채널
        },
      });
      streamRef.current = stream;

      // 브라우저 호환성 확인
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

      console.log('선택된 MIME 타입:', selectedType || '기본 타입');

      const mediaRecorder = new MediaRecorder(
        stream,
        selectedType ? { mimeType: selectedType } : undefined,
      );
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
        // 오디오 데이터 생성 - MIME 타입 명시
        const audioBlob = new Blob(chunksRef.current, { type: selectedType || 'audio/wav' });
        console.log('녹음된 오디오 정보:', {
          size: audioBlob.size,
          type: audioBlob.type,
          chunks: chunksRef.current.length,
        });

        setAudioBlob(audioBlob);

        try {
          // 프론트엔드 처리
          const audioContext = initAudioContext();
          if (!audioContext) {
            throw new Error('오디오 컨텍스트가 초기화되지 않았습니다.');
          }

          const arrayBuffer = await audioBlob.arrayBuffer();
          console.log('오디오 버퍼 크기:', arrayBuffer.byteLength);

          if (arrayBuffer.byteLength === 0) {
            throw new Error('녹음된 오디오 데이터가 없습니다.');
          }

          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          console.log('디코딩된 오디오:', {
            duration: audioBuffer.duration,
            sampleRate: audioBuffer.sampleRate,
            numberOfChannels: audioBuffer.numberOfChannels,
          });

          // 템플릿 매칭으로 분석
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

            // 항상 백엔드 분석 요청
            console.log('백엔드 분석 요청...');
            analyzeAudio(audioBlob);
          } else {
            // 템플릿 매처가 없는 경우 백엔드로 직접 요청
            console.log('템플릿 매처 없음, 백엔드 분석 요청...');
            analyzeAudio(audioBlob);
          }
        } catch (error) {
          console.error('오디오 프론트엔드 처리 오류:', error);
          setError(`오디오 처리 오류: ${(error as Error).message}`);

          // 오류 발생해도 백엔드 분석 진행
          if (chunksRef.current.length > 0) {
            console.log('오류 발생, 백엔드 분석만 요청...');
            analyzeAudio(audioBlob);
          }
        }
      };

      // 녹음 시작
      mediaRecorder.start();
      setIsRecording(true);

      // 사용자가 선택한 시간 후에 자동 종료
      const duration = recordingDuration || 1.0;
      console.log(`${duration}초 후 자동 종료 예약`);

      // 기존 타이머가 있다면 취소
      if (recordingTimerRef.current !== null) {
        clearTimeout(recordingTimerRef.current);
      }

      // 새 타이머 설정
      recordingTimerRef.current = window.setTimeout(() => {
        console.log(`${duration}초 경과, 녹음 자동 종료`);
        if (isRecording) {
          stopRecording();
        }
        recordingTimerRef.current = null;
      }, duration * 1000);
    } catch (error) {
      console.error('오디오 녹음 오류:', error);
      setError(`마이크 접근 또는 녹음 시작 실패: ${(error as Error).message}`);
    }
  }, [
    analyzeAudio,
    initAudioContext,
    isRecording,
    onResult,
    recordingDuration,
    stopRecording,
    targetChord,
  ]);

  // 자원 정리
  const cleanup = useCallback(() => {
    console.log('오디오 자원 정리...');
    // 진행 중인 타이머가 있다면 취소
    if (recordingTimerRef.current !== null) {
      clearTimeout(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

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
