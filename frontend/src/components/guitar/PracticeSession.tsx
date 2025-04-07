import React, { useEffect, useState, useCallback } from 'react';

import { AnimatePresence, motion } from 'framer-motion';

import { useAudioAnalysis } from '@/services/useAudioAnalysis';

import useIndexedDB from '../../hooks/useIndexedDB';
import { useWebSocketStore } from '../../store/useWebSocketStore';
import { Exercise, Performance } from '../../types/guitar';

interface PracticeSessionProps {
  exercise: Exercise;
  onComplete: (performance: Performance) => void;
  onReady: (ready: boolean) => void;
  onStepChange: (step: number) => void;
  sampleExercise: {
    title: string;
    description: string;
    steps: {
      description: string;
      duration: number;
      chord?: string;
    }[];
  };
  onRoomIdChange?: (roomId: string) => void;
}

const PracticeSession: React.FC<PracticeSessionProps> = ({
  exercise,
  onComplete,
  onReady,
  onStepChange,
  onRoomIdChange,
}) => {
  const { connect, disconnect, isConnected, score } = useWebSocketStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [selectTime, setSelectTime] = useState(0);
  const [messages, setMessages] = useState<any[]>([]);
  const [audioResults, setAudioResults] = useState<{
    chord: string;
    confidence: number;
    isCorrect: boolean;
  } | null>(null);

  // indexedDB 훅을 사용하여 데이터 저장 및 읽기
  const { saveData, getAllData } = useIndexedDB('PracticeSessionDB', 'sessionData');

  // 음성 분석 훅 사용
  const handleAudioResult = useCallback(
    (result: {
      chord: string;
      confidence: number;
      source: 'frontend' | 'backend';
      isCorrect?: boolean;
    }) => {
      console.log('음성 분석 결과:', result);

      // 현재 단계의 목표 코드와 결과 비교
      const currentChord = exercise.chords[currentStep];
      const isCorrect = result.chord === currentChord;

      setAudioResults({
        chord: result.chord,
        confidence: result.confidence,
        isCorrect: isCorrect,
      });

      // 메시지 저장 (기존 메시지 저장 방식과 통합)
      setMessages((prev) => [
        ...prev,
        {
          type: 'AI',
          message: JSON.stringify({
            detectedChord: result.chord,
            targetChord: currentChord,
            confidence: result.confidence,
            isCorrect: isCorrect,
            score: isCorrect ? Math.round(result.confidence * 100) : 0,
            feedback: `감지된 코드: ${result.chord}, 목표 코드: ${currentChord}, 일치: ${isCorrect ? '예' : '아니오'}`,
          }),
          timestamp: new Date().toISOString(),
        },
      ]);
    },
    [exercise.chords, currentStep],
  );

  const {
    isRecording,
    isAnalyzing,
    isLoadingTemplates,
    startRecording,
    stopRecording,
    cleanup: cleanupAudio,
  } = useAudioAnalysis({
    onResult: handleAudioResult,
    targetChord: exercise.chords[currentStep],
    confidenceThreshold: 0.5,
  });

  const calculateAverageScore = async (): Promise<number> => {
    try {
      const sessionData = await getAllData();
      console.log('IndexedDB에서 가져온 데이터:', sessionData);

      // 점수만 추출하여 평균 계산
      const scores = sessionData.map((data: any) => {
        try {
          const parsedMessage = JSON.parse(data.message || '{}');
          return parsedMessage.score || 0;
        } catch {
          return 0;
        }
      });

      const totalScore = scores.reduce((acc: number, score: number) => acc + score, 0);
      const averageScore = scores.length > 0 ? totalScore / scores.length : 0;

      console.log('평균 점수:', averageScore);
      return averageScore;
    } catch (error) {
      console.error('평균 점수 계산 중 오류:', error);
      return 0; // 오류 발생 시 0 반환
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      saveData(lastMessage)
        .then(() => console.log('IndexedDB에 데이터 저장 성공:', lastMessage))
        .catch((error) => console.error('IndexedDB 저장 실패:', error));
    }
  }, [messages, saveData]);

  const handleComplete = async () => {
    // 녹음 중이라면 중지
    if (isRecording) {
      stopRecording();
    }

    if (currentStep === exercise.chords.length - 1) {
      try {
        const averageScore = await calculateAverageScore(); // 함수 호출
        const sessionData = await getAllData();

        onComplete({
          totalScore: score || 0,
          accuracy: (score || 0) / 100,
          correctChords: Math.round((score || 0) / 10),
          totalChords: exercise.chords.length,
          duration: 120,
          sessionData,
          averageScore, // 평균 점수 포함
        });

        setIsReady(false);
      } catch (error) {
        console.error('완료 처리 중 오류:', error);
      }
    } else {
      setCurrentStep(currentStep + 1);

      // 자동으로 다음 코드 녹음 시작
      if (isReady && !isRecording && !isAnalyzing) {
        setTimeout(() => {
          startRecording();
        }, 500); // 다음 코드로 넘어간 후 0.5초 후 녹음 시작
      }
    }
  };

  // 웹소켓 연결 상태 변경 시 상위 컴포넌트에 알림
  useEffect(() => {
    onReady(isConnected);
  }, [isConnected, onReady]);

  // 현재 단계 변경 시 상위 컴포넌트에 알림
  useEffect(() => {
    onStepChange(currentStep);

    // 단계 변경 시 자동 녹음 시작
    if (isReady && !isRecording && !isAnalyzing) {
      setTimeout(() => {
        startRecording();
      }, 1000); // 단계 변경 후 1초 후 녹음 시작
    }
  }, [currentStep, onStepChange, isReady, isRecording, isAnalyzing, startRecording]);

  const handleStart = () => {
    // UUID v4 형식으로 roomId 생성
    const roomId = `room_${crypto.randomUUID()}`;
    console.log('Generated roomId:', roomId);

    // 웹소켓 연결
    connect(roomId);

    // 상위 컴포넌트에 roomId 전달
    if (onRoomIdChange) {
      onRoomIdChange(roomId);
    }

    setIsReady(true);

    // 연습 시작 시 첫 번째 코드 녹음 시작 (약간의 지연 추가)
    setTimeout(() => {
      startRecording();
    }, 1000);
  };

  // 컴포넌트 언마운트 시 웹소켓 연결 해제 및 오디오 자원 정리
  useEffect(() => {
    return () => {
      disconnect();
      cleanupAudio();
    };
  }, [disconnect, cleanupAudio]);

  return (
    <div className="bg-white/5 rounded-xl p-6">
      <AnimatePresence mode="wait">
        {!isReady ? (
          <motion.div
            key="preparation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <h3 className="text-2xl font-bold text-white mb-4">{exercise.title}</h3>
            <div className="bg-white/5 rounded-lg p-4 mb-6">
              <h4 className="text-lg font-medium text-amber-500 mb-2">준비사항</h4>
              <ul className="text-zinc-400 space-y-2">
                {exercise.requirements.map((req, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-row items-center justify-center gap-4 ">
              <div>
                <label htmlFor="selectTime" className="text-white font-medium">
                  연습 시간 선택 :
                </label>
                <span> </span>
                <select
                  id="selectTime"
                  value={selectTime}
                  onChange={(e) => setSelectTime(Number(e.target.value))}
                  className="bg-white/5 text-black rounded-lg p-2"
                >
                  <option value={0} disabled>
                    시간 선택
                  </option>
                  <option value={1}>1초</option>
                  <option value={2}>2초</option>
                  <option value={3}>3초</option>
                  <option value={4}>4초</option>
                  <option value={5}>5초</option>
                </select>
              </div>
              <div>
                <button
                  onClick={() => {
                    if (selectTime > 0) {
                      handleStart();
                    } else {
                      alert('연습 시간을 선택해주세요!');
                    }
                  }}
                  className="px-6 py-3 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors"
                >
                  연습 시작
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="practice"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* 진행 상태 표시 */}
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-amber-500 bg-amber-500/20">
                    진행률
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-amber-500">
                    {Math.round((currentStep / exercise.chords.length) * 100)}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-white/5">
                <motion.div
                  style={{ width: `${(currentStep / exercise.chords.length) * 100}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-amber-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStep / exercise.chords.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* 음성 분석 상태 표시 */}
            <div className="flex justify-between items-center bg-white/10 rounded-lg p-3 text-white">
              <div>
                {isRecording ? (
                  <span className="inline-flex items-center text-red-500">
                    <span className="animate-ping h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                    녹음 중...
                  </span>
                ) : isAnalyzing ? (
                  <span className="inline-flex items-center text-amber-500">
                    <span className="animate-spin h-4 w-4 border-2 border-amber-500 border-t-transparent rounded-full mr-2"></span>
                    분석 중...
                  </span>
                ) : isLoadingTemplates ? (
                  <span className="inline-flex items-center text-blue-500">
                    <span className="animate-pulse h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
                    템플릿 로딩 중...
                  </span>
                ) : (
                  <span>준비 완료</span>
                )}
              </div>
              <div>
                <button
                  onClick={startRecording}
                  disabled={isRecording || isAnalyzing}
                  className={`px-3 py-1 rounded text-sm ${
                    isRecording || isAnalyzing
                      ? 'bg-gray-500 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  녹음
                </button>
              </div>
            </div>

            {/* 점수 표시 */}
            <div className="bg-white/5 rounded-lg p-4 text-center">
              <h3 className="text-2xl font-bold text-amber-500">현재 일치율</h3>
              <div className="text-4xl font-bold text-white mt-2">
                {audioResults
                  ? audioResults.isCorrect
                    ? `${Math.round(audioResults.confidence * 100)}점`
                    : '0점'
                  : score
                    ? `${score}점`
                    : '0점'}
              </div>

              {/* 음성 분석 결과 표시 */}
              {audioResults && (
                <div
                  className={`mt-2 text-lg ${audioResults.isCorrect ? 'text-green-400' : 'text-red-400'}`}
                >
                  감지된 코드: {audioResults.chord}
                  {audioResults.isCorrect ? ' ✓' : ` ✗ (목표: ${exercise.chords[currentStep]})`}
                </div>
              )}
            </div>

            {/* 현재 코드 표시 */}
            <div className="text-center">
              <motion.div
                key={currentStep}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="text-6xl font-bold text-white mb-4"
              >
                {exercise.chords[currentStep]}
              </motion.div>
              <p className="text-zinc-400">
                다음 코드: {exercise.chords[currentStep + 1] || '마지막 코드'}
              </p>
            </div>

            {/* 컨트롤 버튼 */}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                disabled={currentStep === 0}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={handleComplete} // handleComplete 함수 호출
                className="px-6 py-2 rounded-lg bg-amber-500 text-white font-medium hover:bg-amber-600 transition-colors"
              >
                {currentStep === exercise.chords.length - 1 ? '완료' : '다음'}
              </button>
              {/* 취소 버튼 */}
              <button
                onClick={() => {
                  disconnect(); // WebSocket 연결 해제
                  cleanupAudio(); // 오디오 자원 정리
                  alert('연습이 취소되었습니다.');
                  window.location.reload(); // 페이지 새로고침
                }}
                className="px-6 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
              >
                취소
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PracticeSession;
