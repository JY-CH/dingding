import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import GameModeNavbar from '../components/common/GameModeNavbar';
import WebcamView from '../components/performance/WebcamView';
import Playlist from '../components/performance/Playlist';
import ChordTimeline from '../components/performance/ChordTimeline';
import AudioVisualizer3D from '../components/guitar/AudioVisualizer3D';
import ChordTimeline from '../components/performance/ChordTimeline';
import Playlist from '../components/performance/Playlist';
import RealtimeFeedback from '../components/performance/RealtimeFeedback';
import WebcamView from '../components/performance/WebcamView';
import { Visualization } from '../types/guitar';
import { Song } from '../types/performance';

const PerformancePage: React.FC = () => {
  const location = useLocation();
  const initialPlaylist = location.state?.playlist || [];
  
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isWebcamOn, setIsWebcamOn] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [, setAnalyser] = useState<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // 시각화 데이터
  const [visualization, setVisualization] = useState<Visualization>({
    type: '3d',
    data: new Array(128).fill(0),
    peak: 1,
  });

  // 오디오 초기화 및 시각화 효과
  useEffect(() => {
    let isActive = true;

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

    return () => {
      isActive = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      audioContext?.close();
    };
  }, []);

  const handleSongSelect = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(false);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      {/* 네비바 */}
      <div className="h-16">
        <GameModeNavbar
          showStats={showStats}
          setShowStats={setShowStats}
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          currentMode="performance"
        />
      </div>

      {/* 상단 컴포넌트 영역 */}
      <div className="h-[calc(44vh-4rem)] flex gap-4 p-4">
        {/* 플레이리스트 */}
        <motion.div 
          className="w-[70%] h-full bg-black/20 rounded-xl overflow-auto"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Playlist onSongSelect={handleSongSelect} initialSongs={initialPlaylist} />
        </motion.div>
        
        {/* 오른쪽 영역: 음향 시각화 + 웹캠 */}
        <div className="w-[30%] h-full flex gap-4">
          {/* 음향 시각화 (데시벨 측정기) */}
          <motion.div 
            className="w-[8%] h-full bg-black/20 rounded-xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <AudioVisualizer3D visualization={visualization} />
          </motion.div>
          
          {/* 웹캠 */}
          <motion.div 
            className="w-[92%] h-full bg-black/20 rounded-xl overflow-hidden"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <WebcamView isWebcamOn={isWebcamOn} setIsWebcamOn={setIsWebcamOn} />
          </motion.div>
        </div>
      </div>

      {/* 코드 타임라인 영역 */}
      <motion.div 
        className="flex-1 p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="h-full bg-black/20 rounded-xl overflow-hidden">
          <ChordTimeline
            isPlaying={isPlaying}
            currentSong={currentSong}
            notes={[]}
            currentChord={null}
            onPlayingChange={setIsPlaying}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default PerformancePage;
