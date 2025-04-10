import React, { useEffect, useRef, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { Settings } from 'lucide-react';
import { HiOutlineVideoCamera, HiOutlineVideoCameraSlash } from 'react-icons/hi2';
import Webcam from 'react-webcam';

import GameModeNavbar from '../components/common/GameModeNavbar';
import AudioVisualizer3D from '../components/guitar/AudioVisualizer3D';
import FretboardVisualizer from '../components/guitar/FretboardVisualizer';
import PracticeSelection from '../components/guitar/PracticeSelection';
import PracticeSession from '../components/guitar/PracticeSession';
import { useWebSocketStore } from '../store/useWebSocketStore';
import { Exercise, GuitarString, Visualization } from '../types/guitar';

const PlayPage: React.FC = () => {
  const { sendMessage, isConnected, messages } = useWebSocketStore();
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [currentChord] = useState<string | null>(null);
  const [, setPracticeStreak] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showPracticeModal, setShowPracticeModal] = useState(false);
  const [defaultExercise, setDefaultExercise] = useState({
    chords: ['C', 'G', 'F'],
    duration: 30,
    repeatCount: 3,
    bpm: 60,
  });
  // 기타 줄 상태
  const [strings] = useState<GuitarString[]>([
    { note: 'E', frequency: 82.41, octave: 2, isPlaying: false, intensity: 0 },
    { note: 'A', frequency: 110.0, octave: 2, isPlaying: false, intensity: 0 },
    { note: 'D', frequency: 146.83, octave: 3, isPlaying: false, intensity: 0 },
    { note: 'G', frequency: 196.0, octave: 3, isPlaying: false, intensity: 0 },
    { note: 'B', frequency: 246.94, octave: 3, isPlaying: false, intensity: 0 },
    { note: 'E', frequency: 329.63, octave: 4, isPlaying: false, intensity: 0 },
  ]);

  // AudioContext 관련 state들
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [, setAnalyser] = useState<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // 시각화 데이터
  const [visualization, setVisualization] = useState<Visualization>({
    type: '3d',
    data: new Array(256).fill(0),
    peak: 1,
  });

  const handleExerciseSelect = (
    chords: string[],
    duration: number,
    repeatCount: number,
    bpm: number,
  ) => {
    setDefaultExercise({ chords, duration, repeatCount, bpm });
    setSelectedExercise({
      id: crypto.randomUUID(),
      title: '연습 세션',
      difficulty: 'beginner',
      type: 'chord',
      bpm,
      duration,
      repeatCount,
      description: '선택한 코드를 연습합니다.',
      requirements: ['기타', '마이크'],
      chords,
      thumbnail: '',
      steps: chords.map((chord) => ({
        description: `${chord} 코드 연습`,
        duration: duration / chords.length,
        chord,
      })),
    });
  };

  const webcamRef = useRef<Webcam>(null);

  useEffect(() => {
    let isActive = true;

    const initAudio = async () => {
      try {
        const context = new AudioContext();
        const analyserNode = context.createAnalyser();
        analyserNode.fftSize = 256;
        analyserNode.smoothingTimeConstant = 0.3;

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const source = context.createMediaStreamSource(stream);
        source.connect(analyserNode);

        if (isActive) {
          setAudioContext(context);
          setAnalyser(analyserNode);

          const updateVisualization = () => {
            if (!isActive || !analyserNode) return;

            const dataArray = new Uint8Array(analyserNode.frequencyBinCount);
            analyserNode.getByteFrequencyData(dataArray);

            setVisualization((prev) => {
              const newData = Array.from(dataArray).map((value) => (value / 255) * 0.8);
              return {
                ...prev,
                data: newData,
                peak: Math.max(...dataArray) / 255 || 1,
              };
            });

            animationFrameRef.current = requestAnimationFrame(updateVisualization);
          };

          updateVisualization();
        }
      } catch (err) {
        console.error('마이크 접근 실패:', err);
      }
    };

    initAudio();

    return () => {
      isActive = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      audioContext?.close();
    };
  }, []);

  // 새로운 상태들 추가
  const [settings, setSettings] = useState({
    metronomeEnabled: true,
    autoRecording: true,
    showFingerings: true,
    difficulty: 'intermediate',
    webcamMirrored: true,
  });

  // 웹캠 캡처 및 이미지 전송
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    const captureAndSendImage = async () => {
      try {
        const webcam = webcamRef.current;
        if (!webcam || !isConnected || !selectedExercise || !currentRoomId) {
          return;
        }

        const imageData = webcam.getScreenshot();
        if (!imageData) {
          return;
        }

        sendMessage({
          type: 'image',
          data: imageData,
          chord: selectedExercise.chords[currentStep],
          room_id: currentRoomId,
        });
      } catch (error) {
        console.error('이미지 처리 중 오류:', error);
      }
    };

    if (isReady) {
      intervalId = setInterval(captureAndSendImage, 200);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isReady, isConnected, currentStep, sendMessage, selectedExercise, currentRoomId]);

  const handleComplete = (performance: any) => {
    console.log('Practice completed:', performance);
    setPracticeStreak((prev) => prev + 1);
  };

  const handleRoomIdChange = (roomId: string) => {
    setCurrentRoomId(roomId);
  };

  return (
    <div className="flex-1 overflow-auto bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 h-full">
      {/* 네비바 - 4rem 고정 */}
      <div className="h-16">
        <GameModeNavbar
          showStats={showStats}
          setShowStats={setShowStats}
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          currentMode="practice"
        />
      </div>

      <div className="p-8">
        {/* 메인 콘텐츠 그리드 */}
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
          {/* 왼쪽 사이드바 */}
          <div className="col-span-3 space-y-6">
            {/* 음향 시각화 - 위치 이동 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-white/5 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">음향 시각화</h3>
              <AudioVisualizer3D visualization={visualization} />
            </motion.div>

            {/* 연습 설정 카드 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 rounded-xl p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">연습 설정</h3>
                {!isReady && (
                  <button
                    onClick={() => setShowPracticeModal(true)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Settings className="w-5 h-5 text-amber-500" />
                  </button>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-zinc-400 mb-2">선택된 코드</h4>
                  <div className="flex flex-wrap gap-2">
                    {(selectedExercise?.chords || defaultExercise.chords).map((chord, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-amber-500/20 text-amber-500 rounded text-sm"
                      >
                        {chord}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-zinc-400 mb-2">연습 시간</h4>
                  <p className="text-white">
                    {selectedExercise?.duration || defaultExercise.duration}초
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-zinc-400 mb-2">반복 횟수</h4>
                  <p className="text-white">
                    {selectedExercise?.repeatCount || defaultExercise.repeatCount}회
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-zinc-400 mb-2">연습 속도</h4>
                  <p className="text-white">{selectedExercise?.bpm || defaultExercise.bpm} BPM</p>
                </div>
              </div>
            </motion.div>

            {/* 현재 코드 카드 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white/5 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">현재 코드</h3>
              {/* 진행률 표시 */}
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-amber-500 bg-amber-500/20">
                    진행률
                  </span>
                  <span className="text-xs font-semibold inline-block text-amber-500">
                    {Math.round(
                      (currentStep /
                        (selectedExercise?.chords.length || defaultExercise.chords.length)) *
                        100,
                    )}
                    %
                  </span>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-white/5">
                  <motion.div
                    style={{
                      width: `${(currentStep / (selectedExercise?.chords.length || defaultExercise.chords.length)) * 100}%`,
                    }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-amber-500"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(currentStep / (selectedExercise?.chords.length || defaultExercise.chords.length)) * 100}%`,
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
              <div className="text-4xl font-bold text-amber-500 text-center">
                {selectedExercise?.chords[currentStep] || defaultExercise.chords[currentStep]}
              </div>
            </motion.div>
          </div>

          {/* 중앙 패널 */}
          <div className="col-span-6">
            {/* 웹캠 영역 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 rounded-xl overflow-hidden"
            >
              <div className="relative aspect-video">
                {settings.webcamMirrored ? (
                  <>
                    <Webcam
                      ref={webcamRef}
                      audio={false}
                      className="rounded-lg w-full"
                      mirrored={settings.webcamMirrored}
                      screenshotFormat="image/jpeg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 right-4 flex items-center gap-2">
                      <button
                        onClick={() =>
                          setSettings((s) => ({ ...s, webcamMirrored: !s.webcamMirrored }))
                        }
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-colors"
                      >
                        미러링 {settings.webcamMirrored ? 'ON' : 'OFF'}
                      </button>
                      <button
                        onClick={() => setSettings((s) => ({ ...s, webcamMirrored: false }))}
                        className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg backdrop-blur-sm transition-colors"
                      >
                        <HiOutlineVideoCameraSlash className="w-5 h-5" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
                    <HiOutlineVideoCamera className="w-12 h-12 text-zinc-400 mb-4" />
                    <button
                      onClick={() => setSettings((s) => ({ ...s, webcamMirrored: true }))}
                      className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
                    >
                      웹캠 켜기
                    </button>
                  </div>
                )}
              </div>
            </motion.div>

            {/* 연습 세션 또는 연습 선택 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6"
            >
              {selectedExercise ? (
                <PracticeSession
                  exercise={selectedExercise}
                  onComplete={handleComplete}
                  onRoomIdChange={handleRoomIdChange}
                  onReady={setIsReady}
                  onStepChange={setCurrentStep}
                  sampleExercise={{
                    chords: selectedExercise.chords,
                    duration: selectedExercise.duration,
                  }}
                />
              ) : (
                <div className="text-center">
                  <PracticeSelection
                    isOpen={true}
                    onClose={() => {}}
                    onExerciseSelect={handleExerciseSelect}
                    currentExercise={defaultExercise}
                  />
                </div>
              )}
            </motion.div>
          </div>

          {/* 오른쪽 패널 */}
          <div className="col-span-3 space-y-6">
            {/* 프렛보드 시각화 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">프렛보드</h3>
                {currentChord && (
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-500 text-sm">
                    {currentChord}
                  </span>
                )}
              </div>
              <FretboardVisualizer
                strings={strings}
                frets={12}
                activeNotes={
                  selectedExercise?.chords[currentStep]
                    ? [selectedExercise.chords[currentStep]]
                    : []
                }
                currentChord={
                  selectedExercise?.chords[currentStep]
                    ? {
                        name: selectedExercise.chords[currentStep],
                      }
                    : undefined
                }
              />
            </motion.div>

            {/* 실시간 피드백 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/5 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">실시간 피드백</h3>
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key="feedback-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="p-3 rounded-lg bg-green-500/20 text-green-400"
                  >
                    {messages.length > 0
                      ? messages[messages.length - 1].message.split('이미지 분석:')[1].trim()
                      : '기타 코드를 감지하지 못했습니다.'}
                  </motion.div>
                  <motion.div
                    key="feedback-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="p-3 rounded-lg bg-amber-500/20 text-amber-400"
                  >
                    {messages.length > 0 &&
                      (() => {
                        const match =
                          messages[messages.length - 1].message.match(/점수:\s*([\d.]+)점/);
                        const score = match ? parseFloat(match[1]) : 0;

                        if (score >= 60) return '잘하고 있어요! 👍';
                        else if (score >= 30) return '조금 더 자세를 신경 써보세요!';
                        else return '혹시 다른 코드를 잡고 있는 건 아닐까요? 🤔';
                      })()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 설정 모달 */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-900 rounded-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-white mb-6">설정</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white">메트로놈</span>
                  <button
                    onClick={() =>
                      setSettings((s) => ({ ...s, metronomeEnabled: !s.metronomeEnabled }))
                    }
                    className={`px-4 py-2 rounded-lg ${
                      settings.metronomeEnabled ? 'bg-amber-500' : 'bg-zinc-700'
                    }`}
                  >
                    {settings.metronomeEnabled ? '켜짐' : '꺼짐'}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white">자동 녹화</span>
                  <button
                    onClick={() => setSettings((s) => ({ ...s, autoRecording: !s.autoRecording }))}
                    className={`px-4 py-2 rounded-lg ${
                      settings.autoRecording ? 'bg-amber-500' : 'bg-zinc-700'
                    }`}
                  >
                    {settings.autoRecording ? '켜짐' : '꺼짐'}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white">운지법 표시</span>
                  <button
                    onClick={() =>
                      setSettings((s) => ({ ...s, showFingerings: !s.showFingerings }))
                    }
                    className={`px-4 py-2 rounded-lg ${
                      settings.showFingerings ? 'bg-amber-500' : 'bg-zinc-700'
                    }`}
                  >
                    {settings.showFingerings ? '켜짐' : '꺼짐'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 연습 설정 모달 */}
      <PracticeSelection
        isOpen={showPracticeModal}
        onClose={() => setShowPracticeModal(false)}
        onExerciseSelect={handleExerciseSelect}
        currentExercise={defaultExercise}
      />
    </div>
  );
};

export default PlayPage;
