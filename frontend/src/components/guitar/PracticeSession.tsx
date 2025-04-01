import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useMemo } from 'react';
import { useWebSocketStore } from '../../store/useWebSocketStore';
import { Exercise, Performance } from '../../types/guitar';

interface PracticeSessionProps {
  exercise: Exercise;
  onComplete: (performance: Performance) => void;
  isReady: boolean;
  setIsReady: (ready: boolean) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  messages: Array<{ type: string; message: string }>;
}

const PracticeSession: React.FC<PracticeSessionProps> = ({
  exercise,
  onComplete,
  isReady,
  setIsReady,
  currentStep,
  setCurrentStep,
  messages,
}) => {
  const { connect, disconnect, isConnected, score } = useWebSocketStore();

  // 현재 연습 중인 코드와 AI가 분석한 코드를 비교하여 점수를 계산
  const currentScore = useMemo(() => {
    if (!messages || messages.length === 0) return 0;

    // 가장 최근의 AI 메시지를 찾습니다
    const lastAiMessage = [...messages].reverse().find((msg) => msg.type === 'AI');
    if (!lastAiMessage) return 0;

    try {
      // AI 메시지를 파싱합니다
      const aiResponse = JSON.parse(lastAiMessage.message);
      if (!aiResponse.feedback) return 0;

      // 감지된 코드 정보를 추출
      const detectedChord = aiResponse.feedback.match(/감지된 코드: ([A-G][#b]?m?)/)?.[1];

      // 현재 연습 중인 코드와 일치하는지 확인
      return detectedChord === exercise.chords[currentStep] ? aiResponse.score : 0;
    } catch (error) {
      // 기존 문자열 형식으로 처리
      const detectedChord = lastAiMessage.message.match(/감지된 코드: ([A-G][#b]?m?)/)?.[1];
      return detectedChord === exercise.chords[currentStep] ? score : 0;
    }
  }, [messages, exercise.chords, currentStep, score]);

  const handleStart = () => {
    setIsReady(true);
    // URL에 roomId 추가
    const newUrl = `/practice/${exercise.id}`;
    window.history.pushState({}, '', newUrl);
    connect(exercise.id);
  };

  const handleStop = () => {
    setIsReady(false);
    // URL에서 roomId 제거
    window.history.pushState({}, '', '/practice');
    disconnect();
  };

  // 웹소켓 연결 해제
  useEffect(() => {
    return () => {
      if (isConnected) {
        console.log('연습 종료 - 웹소켓 연결 해제');
        disconnect();
      }
    };
  }, [disconnect, isConnected]);

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
            <button
              onClick={handleStart}
              className="px-6 py-3 bg-amber-500 text-white rounded-lg font-medium
                hover:bg-amber-600 transition-colors"
            >
              연습 시작
            </button>
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

            {/* 점수 표시 */}
            <div className="bg-white/5 rounded-lg p-4 text-center">
              <h3 className="text-2xl font-bold text-amber-500">현재 일치율</h3>
              <div className="text-4xl font-bold text-white mt-2">
                {currentScore ? `${currentScore}점` : '0점'}
              </div>
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
                onClick={() => {
                  if (currentStep === exercise.chords.length - 1) {
                    onComplete({
                      totalScore: score || 0,
                      accuracy: (score || 0) / 100,
                      correctChords: Math.round((score || 0) / 10),
                      totalChords: exercise.chords.length,
                      duration: 120,
                    });
                  } else {
                    setCurrentStep(currentStep + 1);
                  }
                }}
                className="px-6 py-2 rounded-lg bg-amber-500 text-white font-medium hover:bg-amber-600 transition-colors"
              >
                {currentStep === exercise.chords.length - 1 ? '완료' : '다음'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PracticeSession;
