import React, { useState, useEffect, useCallback } from 'react';

import { useAudioAnalysis } from '@/services/useAudioAnalysis';

interface GuitarChordRecognizerProps {
  targetChord?: string;
  onChordDetected?: (result: {
    chord: string;
    confidence: number;
    isCorrect: boolean;
    source: 'frontend' | 'backend';
  }) => void;
  enabled?: boolean;
  confidenceThreshold?: number;
}

const GuitarChordRecognizer: React.FC<GuitarChordRecognizerProps> = ({
  targetChord,
  onChordDetected,
  enabled = true,
  confidenceThreshold = 0.7,
}) => {
  const [detectedChord, setDetectedChord] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number>(0);
  const [source, setSource] = useState<'frontend' | 'backend' | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleResult = useCallback(
    (result: {
      chord: string;
      confidence: number;
      source: 'frontend' | 'backend';
      isCorrect?: boolean;
    }) => {
      setDetectedChord(result.chord);
      setConfidence(result.confidence);
      setSource(result.source);
      setIsCorrect(result.isCorrect ?? null);

      if (onChordDetected && result.isCorrect !== undefined) {
        onChordDetected({
          chord: result.chord,
          confidence: result.confidence,
          source: result.source,
          isCorrect: result.isCorrect,
        });
      }
    },
    [onChordDetected],
  );

  const { isRecording, isAnalyzing, isLoadingTemplates, startRecording, stopRecording, cleanup } =
    useAudioAnalysis({
      onResult: handleResult,
      targetChord,
      confidenceThreshold,
    });

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return (
    <div className="guitar-chord-recognizer">
      <div className="recognizer-controls">
        <button
          className={`record-button ${isRecording ? 'recording' : ''}`}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={!enabled || isLoadingTemplates || isAnalyzing}
        >
          {isRecording ? '녹음 중지' : '코드 인식'}
        </button>

        {isLoadingTemplates && <p className="status-message">템플릿 데이터 로드 중...</p>}

        {isRecording && (
          <p className="status-message recording">
            <span className="recording-indicator" />
            코드 듣는 중...
          </p>
        )}

        {isAnalyzing && (
          <p className="status-message">
            <span className="loading-spinner" />
            서버에서 분석 중...
          </p>
        )}
      </div>

      {detectedChord && (
        <div
          className={`result-container ${isCorrect === true ? 'correct' : isCorrect === false ? 'incorrect' : ''}`}
        >
          <h3 className="detected-chord">
            인식된 코드: <strong>{detectedChord}</strong>
          </h3>
          <div className="confidence-meter">
            <div
              className="confidence-bar"
              style={{ width: `${Math.min(confidence * 100, 100)}%` }}
            />
            <span className="confidence-value">{(confidence * 100).toFixed(1)}%</span>
          </div>
          <div className="meta-info">
            <span className="source-tag">
              {source === 'frontend' ? '클라이언트 분석' : '서버 분석'}
            </span>
            {targetChord && (
              <span className={`target-info ${isCorrect ? 'correct' : 'incorrect'}`}>
                {isCorrect ? '정확함' : `오답 (정답: ${targetChord})`}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GuitarChordRecognizer;
