import React, { useCallback, useEffect, useRef, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';

import { useAudioAnalysis } from '@/services/useAudioAnalysis';

import { useMutation } from '@tanstack/react-query';
import { useIndexedDB } from '../../hooks/useIndexedDB';
import { _axiosAuth } from '../../services/JYapi';
import RecordingService from '../../services/recordingApi';
import { useWebSocketStore } from '../../store/useWebSocketStore';
import { Exercise } from '../../types/guitar';

interface PracticeSessionProps {
  exercise: Exercise;
  onComplete: (performance: any) => void;
  onRoomIdChange: (roomId: string) => void;
  onReady: (isReady: boolean) => void;
  onStepChange: (step: number) => void;
  sampleExercise: {
    chords: string[];
    duration: number;
  };
}

const PracticeSession: React.FC<PracticeSessionProps> = ({
  exercise,
  onComplete,
  onReady,
  onStepChange,
  onRoomIdChange,
}) => {
  // 웹소켓 관련
  const { connect, disconnect, isConnected, messages: wsMessages } = useWebSocketStore();

  // 상태 관리
  const [currentStep, setCurrentStep] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [selectTime, setSelectTime] = useState(0);
  const [messages, setMessages] = useState<any[]>([]);
  const [videoResults, setVideoResults] = useState<{
    chord: string;
    confidence: number;
    isCorrect: boolean;
    score: number;
    feedback: string;
  } | null>(null);
  const [audioResults, setAudioResults] = useState<{
    chord: string;
    confidence: number;
    isCorrect: boolean;
  } | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isAudioRecording, setIsAudioRecording] = useState(false);
  const [isAudioAnalyzing, setIsAudioAnalyzing] = useState(false);

  // 화면 녹화 관련 상태 및 참조
  const recordingServiceRef = useRef<RecordingService | null>(null);
  const [isScreenRecording, setIsScreenRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState('00:00:00');
  const [uploadingStatus, setUploadingStatus] = useState<{
    isUploading: boolean;
    success: boolean | null;
    message: string;
  }>({
    isUploading: false,
    success: null,
    message: '',
  });
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(1);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // IndexedDB 훅
  const { saveData, getAllData, clearAllData } = useIndexedDB('PracticeSessionDB', 'sessionData');

  // 점수 저장 mutation
  const saveScoreMutation = useMutation({
    mutationFn: async (scoreData: any[]) => {
      console.log('점수 데이터 전송:', scoreData);
      try {
        const response = await _axiosAuth.post('/chord/score', scoreData);
        console.log('API 응답:', response);
        return response.data;
      } catch (error: any) {
        console.error('API 요청 실패:', {
          url: '/api/chord/score',
          data: scoreData,
          error: error.response?.data || error.message,
        });
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('점수 저장 성공:', data);
    },
    onError: (error: any) => {
      console.error('점수 저장 중 오류:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    },
  });

  // RecordingService 초기화
  useEffect(() => {
    recordingServiceRef.current = new RecordingService();

    // 녹화 시간 업데이트 리스너 설정
    recordingServiceRef.current.onProgress((duration) => {
      const totalSeconds = Math.floor(duration / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setRecordingTime(
        `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
      );
    });

    return () => {
      if (recordingServiceRef.current) {
        recordingServiceRef.current.cleanup();
      }
    };
  }, []);

  // 음성 분석 결과 처리
  const handleAudioResult = useCallback(
    (result: {
      chord: string;
      confidence: number;
      source: 'frontend' | 'backend';
      isCorrect?: boolean;
    }) => {
      console.log('음성 분석 결과:', result);

      const currentChord = exercise.chords[currentStep];
      const isCorrect = result.chord === currentChord;

      // 실시간으로 코드만 표시
      setAudioResults({
        chord: result.chord,
        confidence: result.confidence,
        isCorrect,
      });

      // 녹음이 완료된 후에만 점수 계산 및 메시지 저장
      if (!isAudioRecording && !isAudioAnalyzing) {
        const audioScore = isCorrect ? Math.round(result.confidence * 100) : 0;

        // 비디오 분석 결과가 도착할 때까지 기다림
        if (!videoResults) {
          console.log('비디오 분석 결과를 기다립니다...');
          return;
        }

        // 새로운 비디오 분석 결과만 사용
        const videoScore = videoResults.score || 0;
        const totalScore = Math.round(audioScore * 0.5 + videoScore * 0.5);

        const message = {
          type: 'ANALYSIS',
          message: JSON.stringify({
            detectedChord: result.chord,
            targetChord: currentChord,
            audioScore,
            videoScore,
            totalScore,
            isCorrect,
            feedback: `음성 분석 - 감지된 코드: ${result.chord}, 목표 코드: ${currentChord}, 일치: ${isCorrect ? '예' : '아니오'}`,
          }),
          timestamp: new Date().toISOString(),
        };

        console.log('저장할 메시지:', message);
        setMessages((prev) => [...prev, message]);
      }
    },
    [exercise.chords, currentStep, isAudioRecording, isAudioAnalyzing, videoResults],
  );

  // 음성 분석 훅
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
    recordingDuration, // 선택한 녹음 시간 전달
  });

  // 음성 분석 상태 동기화
  useEffect(() => {
    setIsAudioRecording(isRecording);
    setIsAudioAnalyzing(isAnalyzing);
  }, [isRecording, isAnalyzing]);

  // 웹소켓 메시지 처리
  useEffect(() => {
    if (wsMessages.length > 0) {
      const lastMessage = wsMessages[wsMessages.length - 1];
      console.log('웹소켓 메시지 도착:', lastMessage);

      if (lastMessage.type === 'AI') {
        // feedback에서 점수와 코드 추출
        let videoScore = 0;
        let detectedChord = '감지되지 않음';

        if (lastMessage.message) {
          console.log('메시지 내용:', lastMessage.message);

          // 점수 추출 (예: "점수: 45.0점")
          const scoreMatch = lastMessage.message.match(/점수: (\d+\.?\d*)점/);
          if (scoreMatch) {
            videoScore = parseFloat(scoreMatch[1]);
            console.log('추출된 점수:', videoScore);
          }

          // 감지된 코드 추출 (예: "감지된 코드: A(45.32%)")
          const chordMatch = lastMessage.message.match(/감지된 코드: (\w+)/);
          if (chordMatch) {
            detectedChord = chordMatch[1];
            console.log('추출된 코드:', detectedChord);
          }
        }

        const isCorrect = videoScore > 0;
        const feedback = lastMessage.message || '';

        // videoResults 업데이트
        const newVideoResults = {
          chord: detectedChord,
          confidence: videoScore / 100,
          isCorrect,
          score: videoScore,
          feedback,
        };
        console.log('새로운 videoResults:', newVideoResults);
        setVideoResults(newVideoResults);

        // 메시지에 결과 저장
        const audioScore = audioResults?.isCorrect ? Math.round(audioResults.confidence * 100) : 0;
        const totalScore = Math.round(audioScore * 0.5 + videoScore * 0.5);

        const savedMessage = {
          type: 'ANALYSIS',
          message: JSON.stringify({
            detectedChord,
            targetChord: exercise.chords[currentStep],
            audioScore,
            videoScore,
            totalScore,
            isCorrect,
            feedback,
          }),
          timestamp: new Date().toISOString(),
        };

        console.log('저장할 메시지:', savedMessage);
        setMessages((prev) => [...prev, savedMessage]);
      }
    }
  }, [wsMessages, exercise.chords, currentStep, audioResults]);

  // videoResults 변경 감지
  useEffect(() => {
    console.log('videoResults 상태 변경:', videoResults);
  }, [videoResults]);

  // 지정 시간 동안 녹음 시작 및 종료
  const startRecordingWithDuration = useCallback((duration: number) => {
    if (startRecording) {
      console.log(`${duration}초 동안 녹음 시작...`);
      startRecording();

      setTimeout(() => {
        console.log(`${duration}초 지남, 녹음 중지...`);
        if (stopRecording) {
          stopRecording();
        }
      }, duration * 1000);
    }
  }, []);

  // IndexedDB에 메시지 저장
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      console.log('IndexedDB에 저장할 메시지:', lastMessage);
      saveData(lastMessage)
        .then(() => console.log('IndexedDB에 데이터 저장 성공:', lastMessage))
        .catch((error) => console.error('IndexedDB 저장 실패:', error));
    }
  }, [messages, saveData]);

  // 통합 점수 계산 및 표시
  const calculateTotalScore = useCallback(() => {
    if (!audioResults || !videoResults) return 0;

    const audioScore = audioResults.isCorrect ? Math.round(audioResults.confidence * 100) : 0;
    const videoScore = videoResults.score || 0;

    console.log('점수 계산 디버깅:', {
      audioResults,
      videoResults,
      audioScore,
      videoScore,
    });

    // 5:5 비율로 점수 합산 (오디오:비디오)
    const totalScore = Math.round(audioScore * 0.5 + videoScore * 0.5);
    console.log('최종 점수:', totalScore);
    return totalScore;
  }, [audioResults, videoResults]);

  // 완료 처리 함수
  const handleComplete = async () => {
    const isLastStep = currentStep === exercise.chords.length - 1;
    console.log('완료 처리 시작:', { isLastStep, currentStep, totalSteps: exercise.chords.length });

    if (isLastStep) {
      // 마지막 단계일 때만 녹음을 중지
      if (isRecording) {
        stopRecording();
      }

      try {
        console.log('녹화 중지 시도...');
        if (!recordingServiceRef.current) {
          console.error('녹화 서비스가 초기화되지 않았습니다.');
          throw new Error('녹화 서비스가 초기화되지 않았습니다.');
        }

        const blob = await recordingServiceRef.current.stopRecording();
        console.log('녹화 중지 완료, blob:', blob ? '존재' : '없음');

        if (blob) {
          console.log('녹화 파일 처리 시작...');
          // 연습 종료: 웹소켓 연결 해제, 오디오 정리, 상태 종료
          disconnect();
          cleanupAudio();
          setIsReady(false);
          setRecordedBlob(blob);
          setShowUploadModal(true);
        } else {
          console.log('녹화 파일이 없어서 fallback 처리로 진행');
        }
      } catch (error) {
        console.error('화면 녹화 중지 중 오류:', error);
      }

      // blob 없이 완료 처리 fallback
      try {
        const finalScore = await calculateTotalScore();
        const sessionData = await getAllData();
        console.log('세션 데이터:', sessionData);

        // 코드별 점수 계산
        const chordScores = new Map();
        let totalScoreSum = 0;
        let totalCount = 0;

        sessionData.forEach((data: any) => {
          try {
            const parsedMessage = JSON.parse(data.message || '{}');
            if (parsedMessage.detectedChord && parsedMessage.totalScore !== undefined) {
              const chord = parsedMessage.detectedChord;
              if (!chordScores.has(chord)) {
                chordScores.set(chord, { totalScore: 0, count: 0 });
              }
              const current = chordScores.get(chord);
              current.totalScore += parsedMessage.totalScore;
              current.count += 1;

              // 전체 점수 합산
              totalScoreSum += parsedMessage.totalScore;
              totalCount += 1;
            }
          } catch (error) {
            console.error('메시지 파싱 오류:', error);
          }
        });

        // 코드별 평균 점수 계산
        const chordAverages = Array.from(chordScores.entries()).map(([chord, data]) => ({
          chord,
          averageScore: Math.round(data.totalScore / data.count),
          count: data.count,
        }));

        // 전체 평균 점수 계산
        const overallAverage = totalCount > 0 ? Math.round(totalScoreSum / totalCount) : 0;

        console.log('코드별 평균 점수:', chordAverages);
        console.log('전체 평균 점수:', overallAverage);

        // API 요청을 위한 데이터 형식 변환
        const scoreData = chordAverages
          .map(({ chord, averageScore, count }) => {
            const songId = getSongIdFromChord(chord);
            if (songId === 0) {
              console.warn(`알 수 없는 코드: ${chord}`);
              return null;
            }
            return {
              songId,
              score: averageScore,
              count,
            };
          })
          .filter(Boolean);

        console.log('전송할 점수 데이터:', scoreData);
        await saveScoreMutation.mutateAsync(scoreData);
        console.log('점수 저장 요청 완료');

        onComplete({
          totalScore: finalScore,
          accuracy: finalScore / 100,
          correctChords: Math.round(finalScore / 10),
          totalChords: exercise.chords.length,
          duration: 120,
          sessionData,
          averageScore: overallAverage,
          chordAverages,
          audioResults: audioResults || { chord: '', confidence: 0, isCorrect: false },
          videoResults: videoResults || { chord: '', confidence: 0, isCorrect: false },
        });
        console.log('데이터 초기화 준비');
        disconnect();
        cleanupAudio();
        setIsReady(false);
      } catch (error) {
        console.error('완료 처리 중 오류:', error);
        setIsReady(false);
      }
    } else {
      // 다음 단계일 때는 녹화를 중지하지 않고 다음 단계로 진행
      setCurrentStep(currentStep + 1);
      if (isReady && !isRecording && !isAnalyzing) {
        setTimeout(() => {
          startRecordingWithDuration(recordingDuration);
        }, 500);
      }
    }
    console.log('----------------------------------------------------');
  };

  // 코드를 songId로 변환하는 함수
  const getSongIdFromChord = (chord: string): number => {
    const chordToId: { [key: string]: number } = {
      A: 1,
      B: 2,
      C: 3,
      D: 4,
      E: 5,
      F: 6,
      G: 7,
      Am: 8,
      Bm: 9,
      Cm: 10,
      Dm: 11,
      Em: 12,
      Fm: 13,
      Gm: 14,
    };
    return chordToId[chord] || 0;
  };

  // 웹소켓 연결 상태 변경 시 상위 컴포넌트에 알림
  useEffect(() => {
    onReady(isConnected);
  }, [isConnected, onReady]);

  // 단계 변경 시 상위 컴포넌트 알림 및 녹음 시작
  useEffect(() => {
    onStepChange(currentStep);
    if (isReady && !isRecording && !isAnalyzing) {
      setTimeout(() => {
        startRecordingWithDuration(recordingDuration);
      }, 1000);
    }
  }, [
    currentStep,
    onStepChange,
    isReady,
    isRecording,
    isAnalyzing,
    startRecordingWithDuration,
    recordingDuration,
  ]);

  // 선택한 시간이 변경될 때 녹음 시간 업데이트
  useEffect(() => {
    if (selectTime > 0) {
      setRecordingDuration(selectTime);
    }
  }, [selectTime]);

  // 연습 시작 처리
  const handleStart = async () => {
    if (selectTime <= 0) {
      alert('녹음 시간을 선택해주세요!');
      return;
    }

    setShowShareModal(true);
  };

  const handleShareConfirm = async () => {
    try {
      // 녹화 서비스 초기화 확인
      if (!recordingServiceRef.current) {
        console.error('녹화 서비스가 초기화되지 않았습니다.');
        alert('녹화 서비스를 초기화하는데 실패했습니다. 페이지를 새로고침해주세요.');
        return;
      }

      // 녹화 시작
      // console.log('녹화 시작 시도...');
      const success = await recordingServiceRef.current.startRecording();

      if (!success) {
        // console.error('녹화 시작 실패');
        setIsScreenRecording(false);
        setCurrentStep(0);
        alert('화면 공유가 취소되었거나 녹화를 시작할 수 없습니다. 다시 시도해주세요.');
        return;
      }

      // console.log('녹화 시작 성공');
      setIsScreenRecording(true);
      setShowShareModal(false);

      // 화면 공유가 성공적으로 시작된 후 1초 후에 연습 시작
      setTimeout(() => {
        setIsReady(true);
        // isReady가 true가 된 후에 웹소켓 연결 시작
        const roomId = `room_${crypto.randomUUID()}`;
        connect(roomId);
        if (onRoomIdChange) {
          onRoomIdChange(roomId);
        }
      }, 1000);
    } catch (error) {
      setIsScreenRecording(false);
      setCurrentStep(0);
      alert('녹화를 시작하는데 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 언마운트 시 웹소켓 연결 및 오디오, 녹화 자원 정리
  useEffect(() => {
    return () => {
      disconnect();
      cleanupAudio();
      if (recordingServiceRef.current && recordingServiceRef.current.state !== 'inactive') {
        recordingServiceRef.current.stopRecording();
        // .catch((error) => console.error('화면 녹화 중지 중 오류:', error));
      }
    };
  }, [disconnect, cleanupAudio]);

  useEffect(() => {
    if (recordedBlob) {
      // 기존 URL이 있다면 revoke
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      const newUrl = URL.createObjectURL(recordedBlob);
      setPreviewUrl(newUrl);
    }
  }, [recordedBlob]);

  return (
    <div className="flex-1 overflow-auto bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 h-full">
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
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
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
              <div className="flex flex-row items-center justify-center gap-4">
                <div>
                  <label htmlFor="selectTime" className="text-white font-medium">
                    녹음 시간 설정:
                  </label>
                  <select
                    id="selectTime"
                    value={selectTime}
                    onChange={(e) => setSelectTime(Number(e.target.value))}
                    className="bg-zinc-800 text-amber-500 rounded-lg p-2 ml-2 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  >
                    <option value={0} disabled className="bg-zinc-800 text-amber-500">
                      녹음 시간 선택
                    </option>
                    <option value={1} className="bg-zinc-800 text-amber-500">
                      1초
                    </option>
                    <option value={2} className="bg-zinc-800 text-amber-500">
                      2초
                    </option>
                    <option value={3} className="bg-zinc-800 text-amber-500">
                      3초
                    </option>
                    <option value={4} className="bg-zinc-800 text-amber-500">
                      4초
                    </option>
                    <option value={5} className="bg-zinc-800 text-amber-500">
                      5초
                    </option>
                  </select>
                </div>
                <div>
                  <button
                    onClick={() => {
                      if (selectTime > 0) {
                        handleStart();
                      } else {
                        alert('녹음 시간을 선택해주세요!');
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
              {/* 화면 녹화 상태 */}
              <div className="flex justify-between items-center bg-white/10 rounded-lg p-3 text-white mb-2">
                <div>
                  {isScreenRecording ? (
                    <span className="inline-flex items-center text-red-500">
                      <span className="animate-ping h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                      화면 녹화 중... ({recordingTime})
                    </span>
                  ) : recordingServiceRef.current?.state === 'paused' ? (
                    <span className="text-yellow-500">화면 녹화 일시 중지됨</span>
                  ) : recordingServiceRef.current?.state === 'stopping' ? (
                    <span className="text-blue-500">화면 녹화 종료 중...</span>
                  ) : recordingServiceRef.current?.state === 'inactive' ? (
                    <span className="text-green-500">화면 녹화 완료</span>
                  ) : (
                    <span>화면 녹화 대기 중</span>
                  )}
                </div>
              </div>

              {/* 업로드 상태 메시지 */}
              {uploadingStatus.message && (
                <div
                  className={`p-3 rounded-lg mb-4 ${
                    uploadingStatus.success === true
                      ? 'bg-green-900/50 text-green-300'
                      : uploadingStatus.success === false
                        ? 'bg-red-900/50 text-red-300'
                        : 'bg-blue-900/50 text-blue-300'
                  }`}
                >
                  {uploadingStatus.message}
                  {uploadingStatus.isUploading && (
                    <span className="ml-2 inline-flex items-center">
                      <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                    </span>
                  )}
                </div>
              )}

              {/* 음성 분석 및 녹음 상태 */}
              <div className="flex justify-between items-center bg-white/10 rounded-lg p-3 text-white">
                <div>
                  {isRecording ? (
                    <span className="inline-flex items-center text-red-500">
                      <span className="animate-ping h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                      녹음 중... ({recordingDuration}초)
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
                    onClick={() => startRecordingWithDuration(recordingDuration)}
                    disabled={isRecording || isAnalyzing}
                    className={`px-3 py-1 rounded text-sm ${
                      isRecording || isAnalyzing
                        ? 'bg-gray-500 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    녹음 ({recordingDuration}초)
                  </button>
                </div>
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
                  onClick={handleComplete}
                  className="px-6 py-2 rounded-lg bg-amber-500 text-white font-medium hover:bg-amber-600 transition-colors"
                >
                  {currentStep === exercise.chords.length - 1 ? '완료' : '다음'}
                </button>
                <button
                  onClick={async () => {
                    try {
                      setUploadingStatus({
                        isUploading: true,
                        success: null,
                        message: '연습 취소 중...',
                      });

                      setIsReady(false);
                      disconnect();
                      cleanupAudio();

                      if (
                        recordingServiceRef.current &&
                        recordingServiceRef.current.state !== 'inactive'
                      ) {
                        const blob = await recordingServiceRef.current.stopRecording();
                        console.log('화면 녹화 중지됨, 파일 크기:', blob?.size || 0);
                      }

                      setUploadingStatus({
                        isUploading: false,
                        success: true,
                        message: '연습이 취소되었습니다.',
                      });

                      setTimeout(() => {
                        setCurrentStep(0);
                        setMessages([]);
                        setAudioResults(null);
                        setVideoResults(null);
                        setUploadingStatus({ isUploading: false, success: null, message: '' });
                      }, 1500);
                    } catch (error) {
                      console.error('취소 처리 중 오류:', error);
                      setUploadingStatus({
                        isUploading: false,
                        success: false,
                        message: '취소 중 오류가 발생했습니다.',
                      });
                    }
                  }}
                  className="px-6 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
                  disabled={uploadingStatus.isUploading}
                >
                  취소
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 화면 공유 모달 */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-900 rounded-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-4">화면 공유 필요</h3>
              <p className="text-zinc-300 mb-6">
                연습을 시작하기 위해서는 화면 공유가 필요합니다. 화면 공유를 통해 연습 과정을
                녹화하고 분석할 수 있습니다.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleShareConfirm}
                  className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                >
                  화면 공유 시작
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 업로드 모달 */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-zinc-800 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">연습 영상 업로드</h3>
            <p className="text-zinc-300 mb-4">
              연습 영상을 서버에 업로드하시겠습니까? 업로드한 영상은 나중에 확인할 수 있습니다.
            </p>
            {previewUrl && (
              <div className="mb-4">
                <h4 className="text-amber-500 font-medium mb-2">미리보기</h4>
                <video className="w-full rounded-lg" src={previewUrl} controls />
              </div>
            )}
            {uploadingStatus.message && (
              <div
                className={`p-3 rounded-lg mb-4 ${
                  uploadingStatus.success === true
                    ? 'text-green-500'
                    : uploadingStatus.success === false
                      ? 'text-red-500'
                      : 'text-blue-500'
                }`}
              >
                {uploadingStatus.message}
                {uploadingStatus.isUploading && (
                  <span className="ml-2 inline-flex items-center">
                    <span className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></span>
                  </span>
                )}
              </div>
            )}
            <div className="flex justify-end gap-4">
              <button
                onClick={async () => {
                  setShowUploadModal(false);
                  try {
                    const finalScore = await calculateTotalScore();
                    const sessionData = await getAllData();
                    onComplete({
                      totalScore: finalScore,
                      accuracy: finalScore / 100,
                      correctChords: Math.round(finalScore / 10),
                      totalChords: exercise.chords.length,
                      duration: 120,
                      sessionData,
                    });
                    setIsReady(false);
                  } catch (error) {
                    console.error('완료 처리 중 오류:', error);
                    setIsReady(false);
                  }
                }}
                className="px-4 py-2 bg-zinc-600 text-white rounded-lg hover:bg-zinc-500 transition-colors"
                disabled={uploadingStatus.isUploading}
              >
                업로드 안 함
              </button>
              <button
                onClick={async () => {
                  if (!recordedBlob || !recordingServiceRef.current) {
                    setShowUploadModal(false);
                    return;
                  }
                  try {
                    setUploadingStatus({
                      isUploading: true,
                      success: null,
                      message: '녹화 파일 업로드 중... 페이지를 벗어나지 마세요.',
                    });
                    const finalScore = await calculateTotalScore();
                    const sessionData = await getAllData();
                    const uploadResult = await recordingServiceRef.current.uploadRecording({
                      songId: 15,
                      score: finalScore || 0,
                      mode: 'PRACTICE',
                      videoTime: recordingTime,
                    });
                    console.log('업로드 데이터:', {
                      songId: 15,
                      score: finalScore || 0,
                      mode: 'PRACTICE',
                      videoTime: recordingTime,
                    });
                    console.log('업로드 결과:', uploadResult);
                    setUploadingStatus({
                      isUploading: false,
                      success: uploadResult.success,
                      message: uploadResult.success ? '업로드 완료!' : '',
                    });
                    setTimeout(
                      () => {
                        setShowUploadModal(false);
                        onComplete({
                          totalScore: finalScore,
                          accuracy: finalScore / 100,
                          correctChords: Math.round(finalScore / 10),
                          totalChords: exercise.chords.length,
                          duration: 120,
                          sessionData,
                        });
                        setIsReady(false);
                        clearAllData();
                        console.log('데이터 초기화 완료');
                      },
                      uploadResult.success ? 1000 : 2000,
                    );
                  } catch (error) {
                    console.error('업로드 중 오류:', error);
                    setUploadingStatus({
                      isUploading: false,
                      success: true,
                      message: '업로드 완료! 결과 페이지로 이동합니다.',
                    });
                    setTimeout(async () => {
                      setShowUploadModal(false);
                      const finalScore = await calculateTotalScore();
                      onComplete({
                        totalScore: finalScore,
                        accuracy: finalScore / 100,
                        correctChords: Math.round(finalScore / 10),
                        totalChords: exercise.chords.length,
                        duration: 120,
                        sessionData: await getAllData(),
                      });
                      setIsReady(false);
                      window.location.reload();
                    }, 1000);
                  }
                }}
                className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                disabled={uploadingStatus.isUploading}
              >
                업로드하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticeSession;
