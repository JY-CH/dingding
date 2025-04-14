import { useState, useEffect, useRef, useCallback } from 'react';

import { TemplateData, PredictionResult } from '../types/guitar-chord';
import TemplateMatcher from '../utils/TemplateMatcher';

interface UseAudioCaptureProps {
  templates: TemplateData[];
  duration: number;
  backendUrl: string;
  enabled: boolean;
  onChordDetected?: (result: {
    chord: string;
    confidence: number;
    source: 'frontend' | 'backend';
  }) => void;
}

const useAudioCapture = ({
  templates,
  duration,
  backendUrl,
  enabled,
  onChordDetected,
}: UseAudioCaptureProps) => {
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [processingBackend, setProcessingBackend] = useState<boolean>(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const analyserNodeRef = useRef<AnalyserNode | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const templateMatcherRef = useRef<TemplateMatcher | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // 템플릿 매처 초기화
  useEffect(() => {
    if (templates.length > 0) {
      templateMatcherRef.current = new TemplateMatcher(templates, duration, 0.7);
    }
  }, [templates, duration]);

  // 오디오 컨텍스트 초기화
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  // 마이크 액세스 시작
  const startCapture = useCallback(async () => {
    if (!enabled) return;

    try {
      setError(null);

      // 오디오 컨텍스트 초기화
      const audioContext = initAudioContext();

      // 마이크 접근 허용 요청
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      mediaStreamRef.current = stream;

      // 오디오 소스 및 분석기 노드 설정
      const sourceNode = audioContext.createMediaStreamSource(stream);
      sourceNodeRef.current = sourceNode;

      const analyserNode = audioContext.createAnalyser();
      analyserNode.fftSize = 2048;
      analyserNodeRef.current = analyserNode;

      sourceNode.connect(analyserNode);

      // 미디어 레코더 설정
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        chunksRef.current = [];

        // 프론트엔드에서 처리
        processFrontend(audioBlob);
      };

      // 캡처 시작
      recorder.start();
      setIsCapturing(true);

      // 지정된 시간 후 캡처 중지
      setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop();
        }
      }, duration * 1000);
    } catch (err) {
      console.error('오디오 캡처 에러:', err);
      setError(err instanceof Error ? err.message : '알 수 없는 오류');
      setIsCapturing(false);
    }
  }, [enabled, duration, initAudioContext]);

  // 캡처 중지
  const stopCapture = useCallback(() => {
    if (recorderRef.current && recorderRef.current.state === 'recording') {
      recorderRef.current.stop();
    }

    if (sourceNodeRef.current) {
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    setIsCapturing(false);
  }, []);

  // 프론트엔드에서 오디오 처리
  const processFrontend = async (audioBlob: Blob) => {
    if (!templateMatcherRef.current || !audioContextRef.current) return;

    try {
      // Blob을 ArrayBuffer로 변환
      const arrayBuffer = await audioBlob.arrayBuffer();

      // AudioBuffer로 디코딩
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);

      // 템플릿 매칭
      const result = await templateMatcherRef.current.processAudio(audioBuffer);

      // 충분한 신뢰도인지 확인
      if (templateMatcherRef.current.isConfident(result.confidence)) {
        // 충분한 신뢰도가 있으면 결과 반환
        if (onChordDetected) {
          onChordDetected({
            ...result,
            source: 'frontend',
          });
        }
      } else {
        // 신뢰도가 낮으면 백엔드에 요청
        processBackend(audioBlob);
      }
    } catch (err) {
      console.error('프론트엔드 오디오 처리 에러:', err);
      // 프론트엔드 처리에 실패하면 백엔드로 요청
      processBackend(audioBlob);
    }
  };

  // 백엔드로 오디오 전송
  const processBackend = async (audioBlob: Blob) => {
    if (!backendUrl) return;

    try {
      setProcessingBackend(true);

      // 파일 업로드용 FormData 생성
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.wav');

      // 백엔드 API 호출
      const response = await fetch(`${backendUrl}/predict-chord`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PredictionResult = await response.json();

      // 결과 반환
      if (onChordDetected) {
        onChordDetected({
          chord: data.chord,
          confidence: data.confidence,
          source: 'backend',
        });
      }
    } catch (err) {
      console.error('백엔드 오디오 처리 에러:', err);
      setError(err instanceof Error ? err.message : '백엔드 처리 오류');
    } finally {
      setProcessingBackend(false);
    }
  };

  // 정리 함수
  useEffect(() => {
    return () => {
      stopCapture();
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(console.error);
        audioContextRef.current = null;
      }
    };
  }, [stopCapture]);

  return {
    isCapturing,
    processingBackend,
    error,
    startCapture,
    stopCapture,
  };
};

export default useAudioCapture;
