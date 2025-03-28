import React, { useState, useEffect, useRef } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { GiGuitar } from 'react-icons/gi';
import { HiOutlineVideoCamera, HiOutlineVideoCameraSlash } from 'react-icons/hi2';
import { IoStatsChartOutline } from 'react-icons/io5';
import { RiMusicLine, RiSettings4Line } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';

import AudioVisualizer3D from '../components/guitar/AudioVisualizer3D';
import FretboardVisualizer from '../components/guitar/FretboardVisualizer';
import PracticeSession from '../components/guitar/PracticeSession';
import { GuitarString, Visualization, Exercise } from '../types/guitar';

const PlayPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<'practice' | 'performance'>('practice');
  const [isWebcamOn, setIsWebcamOn] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [currentChord] = useState<string | null>(null);
  const [, setPracticeStreak] = useState(0);

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
  const animationFrameRef = useRef<number | null>(null); // null 초기값 추가

  // 시각화 데이터
  const [visualization, setVisualization] = useState<Visualization>({
    type: '3d',
    data: new Array(128).fill(0),
    peak: 1,
  });

  // 예시 연습 세션
  const sampleExercise: Exercise = {
    id: '1',
    title: '기본 코드 연습',
    difficulty: 'beginner',
    type: 'chord',
    bpm: 60,
    duration: 300,
    description: '기본적인 오픈 코드를 연습합니다',
    requirements: [
      '기타 튜닝이 되어있어야 합니다',
      '웹캠이 필요합니다',
      '조용한 환경이 필요합니다',
    ],
    chords: ['Em', 'C', 'G', 'D'],
    thumbnail: '/guitar-practice.jpg',
  };

  useEffect(() => {
    let isActive = true; // cleanup을 위한 flag

    const initAudio = async () => {
      try {
        const context = new AudioContext();
        const analyserNode = context.createAnalyser();
        analyserNode.fftSize = 64;
        analyserNode.smoothingTimeConstant = 0.8;

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const source = context.createMediaStreamSource(stream);
        source.connect(analyserNode);

        if (isActive) {
          setAudioContext(context);
          setAnalyser(analyserNode);

          const updateVisualization = () => {
            if (!isActive) return;

            const dataArray = new Uint8Array(analyserNode.frequencyBinCount);
            analyserNode.getByteFrequencyData(dataArray);

            setVisualization((prev) => ({
              ...prev,
              data: Array.from(dataArray).map((value) => (value / 255) * 0.7),
              peak: Math.max(...dataArray) / 255 || 1,
            }));

            animationFrameRef.current = requestAnimationFrame(updateVisualization);
          };

          updateVisualization();
        }
      } catch (err) {
        console.error('마이크 접근 실패:', err);
      }
    };

    initAudio();

    // 클린업
    return () => {
      isActive = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      audioContext?.close();
    };
  }, []); // 빈 의존성 배열 유지

  // 새로운 상태들 추가
  const [settings, setSettings] = useState({
    metronomeEnabled: true,
    autoRecording: true,
    showFingerings: true,
    difficulty: 'intermediate',
    webcamMirrored: true,
  });

  // const stats = useState({
  //   totalPracticeTime: 0,
  //   accuracyTrend: [65, 70, 75, 72, 78, 80, 85],
  //   completedExercises: 42,
  //   currentStreak: 7,
  // });

  return (
    <div className="flex-1 overflow-auto bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 h-full">
      {/* 상단 네비게이션 바 */}
      <nav className="bg-black/30 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GiGuitar className="w-6 h-6 text-amber-500" />
            <h1 className="text-xl font-bold text-white">ThingThing Guitar</h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-zinc-400 rounded-lg hover:bg-zinc-700 hover:text-white transition-colors">
              <GiGuitar className="w-5 h-5" />
              연습 모드
            </button>
            <button
              onClick={() => navigate('/performance')}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
            >
              <RiMusicLine className="w-5 h-5" />
              연주 모드
            </button>
            <button
              onClick={() => setShowStats(!showStats)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
            >
              <IoStatsChartOutline className="w-5 h-5 text-zinc-400 group-hover:text-amber-500" />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
            >
              <RiSettings4Line className="w-5 h-5 text-zinc-400 group-hover:text-amber-500" />
            </button>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                <span className="text-amber-500 font-medium">7</span>
              </div>
              <div className="text-sm">
                <div className="text-zinc-400">연습 스트릭</div>
                <div className="text-white font-medium">7일 연속</div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="p-8">
        {/* 메인 콘텐츠 그리드 */}
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
          {/* 왼쪽 사이드바 */}
          <div className="col-span-3 space-y-6">
            {/* 모드 선택 카드 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setSelectedMode('practice')}
                className={`w-full p-4 flex items-center gap-3 transition-all ${
                  selectedMode === 'practice'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
                    : 'hover:bg-white/5 text-zinc-400'
                }`}
              >
                <GiGuitar className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">연습 모드</div>
                  <div className="text-sm opacity-80">단계별 연습과 피드백</div>
                </div>
              </button>
              <button
                onClick={() => {
                  setSelectedMode('performance');
                  navigate('/performance');
                }}
                className={`w-full p-4 flex items-center gap-3 transition-all ${
                  selectedMode === 'performance'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
                    : 'hover:bg-white/5 text-zinc-400'
                }`}
              >
                <RiMusicLine className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">연주 모드</div>
                  <div className="text-sm opacity-80">실시간 연주 분석</div>
                </div>
              </button>
            </motion.div>

            {/* 통계 카드 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">연습 통계</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-zinc-400 text-sm">총 연습 시간</div>
                  <div className="text-2xl font-bold text-white">42.5h</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-zinc-400 text-sm">평균 정확도</div>
                  <div className="text-2xl font-bold text-green-500">85%</div>
                </div>
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
                {isWebcamOn ? (
                  <>
                    <Webcam
                      audio={false}
                      className="rounded-lg w-full"
                      mirrored={settings.webcamMirrored}
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
                        onClick={() => setIsWebcamOn(false)}
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
                      onClick={() => setIsWebcamOn(true)}
                      className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
                    >
                      웹캠 켜기
                    </button>
                  </div>
                )}
              </div>
            </motion.div>

            {/* 연습 세션 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6"
            >
              <PracticeSession
                exercise={sampleExercise}
                onComplete={(performance) => {
                  console.log('Practice completed:', performance);
                  setPracticeStreak((prev) => prev + 1);
                }}
              />
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
              <FretboardVisualizer strings={strings} frets={12} activeNotes={['E', 'A', 'D']} />
            </motion.div>

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
                    코드 진행이 정확합니다
                  </motion.div>
                  <motion.div
                    key="feedback-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="p-3 rounded-lg bg-amber-500/20 text-amber-400"
                  >
                    스트럼 패턴을 더 일정하게 유지해보세요
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
    </div>
  );
};

export default PlayPage;
