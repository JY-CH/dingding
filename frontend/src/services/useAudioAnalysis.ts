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

// AudioBuffer를 WAV Blob으로 변환하는 함수
const encodeWAV = (audioBuffer: AudioBuffer, sampleRate: number = 22050): Promise<Blob> => {
  return new Promise((resolve) => {
    // 모노로 변환
    const numChannels = 1;
    const numSamples = Math.floor(audioBuffer.duration * sampleRate);
    const buffer = new ArrayBuffer(44 + numSamples * 2);
    const view = new DataView(buffer);

    // WAV 헤더 작성 (RIFF 포맷)
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    // "RIFF" 청크 Descriptor
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + numSamples * 2, true);
    writeString(8, 'WAVE');

    // "fmt " 서브청크
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true); // fmt 청크 크기
    view.setUint16(20, 1, true); // PCM 포맷 (1)
    view.setUint16(22, numChannels, true); // 채널 수
    view.setUint32(24, sampleRate, true); // 샘플레이트
    view.setUint32(28, sampleRate * numChannels * 2, true); // 바이트레이트
    view.setUint16(32, numChannels * 2, true); // 블록 얼라인
    view.setUint16(34, 16, true); // 비트퍼샘플

    // "data" 서브청크
    writeString(36, 'data');
    view.setUint32(40, numSamples * 2, true); // 데이터 크기

    // 단순하게 직접 변환하는 방식으로 수정
    // 오디오 데이터를 모노로 변환하고 리샘플링
    const channelData = audioBuffer.getChannelData(0);
    const resampleRatio = audioBuffer.sampleRate / sampleRate;
    let offset = 44;

    for (let i = 0; i < numSamples; i++) {
      // 간단한 리샘플링 (선형 보간)
      const originalIndex = Math.floor(i * resampleRatio);
      const sample = originalIndex < channelData.length ? channelData[originalIndex] : 0;

      // 샘플 클리핑 및 16비트 변환
      const clippedSample = Math.max(-1, Math.min(1, sample));
      view.setInt16(
        offset,
        clippedSample < 0 ? clippedSample * 0x8000 : clippedSample * 0x7fff,
        true,
      );
      offset += 2;
    }

    resolve(new Blob([buffer], { type: 'audio/wav' }));
  });
};

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
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
          sampleRate: 48000,
          latencyHint: 'interactive',
        });
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

      // 오디오 스트림 요청 - 상세 설정
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000,
          channelCount: 1,
          sampleSize: 24,
        },
        video: false,
      });

      // 오디오 트랙 설정 확인 및 게인 조정
      const audioTracks = stream.getAudioTracks();
      const audioTrack = audioTracks[0];
      console.log('오디오 트랙 설정:', audioTrack.getSettings());

      // 오디오 트랙 활성화 및 게인 설정
      audioTrack.enabled = true;
      if ('gain' in audioTrack) {
        (audioTrack as any).gain.value = 10.0;
      }

      streamRef.current = stream;

      // MediaRecorder 설정
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 512000,
      });

      mediaRecorderRef.current = mediaRecorder;

      // 청크 초기화
      chunksRef.current = [];

      // 데이터 수집 - 더 자주 데이터 수집
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          console.log('수집된 오디오 청크:', e.data.size);
          chunksRef.current.push(e.data);
        }
      };

      // 녹음 완료 처리
      mediaRecorder.onstop = async () => {
        try {
          // 이미 처리 중이면 중복 실행 방지
          if (chunksRef.current.length === 0) {
            console.log('이미 처리된 녹음입니다.');
            return;
          }

          // WebM 파일 생성
          const webmBlob = new Blob(chunksRef.current, { type: 'audio/webm;codecs=opus' });
          console.log('WebM 파일 생성:', {
            size: webmBlob.size,
            type: webmBlob.type,
            chunks: chunksRef.current.length,
          });

          // 청크 초기화 (중복 처리 방지)
          chunksRef.current = [];

          // 오디오 컨텍스트 초기화
          const audioContext = initAudioContext();
          if (!audioContext) {
            throw new Error('오디오 컨텍스트가 초기화되지 않았습니다.');
          }

          // WebM 파일 디코딩
          const arrayBuffer = await webmBlob.arrayBuffer();
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          console.log('디코딩된 오디오:', {
            duration: audioBuffer.duration,
            sampleRate: audioBuffer.sampleRate,
            numberOfChannels: audioBuffer.numberOfChannels,
          });

          // WAV로 변환 - 고품질 설정
          const wavBlob = await encodeWAV(audioBuffer, 48000);
          console.log('WAV 변환 완료:', {
            size: wavBlob.size,
            type: wavBlob.type,
          });

          // 템플릿 매칭
          if (templateMatcherRef.current) {
            console.log('템플릿 매칭 분석 시작...');
            const result = await templateMatcherRef.current.processAudio(audioBuffer);
            console.log('템플릿 매칭 결과:', result);

            setLocalResult(result);

            if (onResult) {
              onResult({
                ...result,
                source: 'frontend',
                isCorrect: targetChord ? result.chord === targetChord : undefined,
              });
            }
          }

          // WAV 파일 저장
          setAudioBlob(wavBlob);

          // 백엔드 분석 요청
          /*
          console.log('WAV 형식으로 백엔드 분석 요청...');
          analyzeAudio(wavBlob);
          */

        } catch (error) {
          console.error('오디오 처리 오류:', error);
          setError(`오디오 처리 오류: ${(error as Error).message}`);
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
  }, [isRecording, recordingDuration, stopRecording, initAudioContext, onResult, targetChord, analyzeAudio]);

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
