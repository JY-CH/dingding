import React, { useState, useRef, useEffect } from 'react';

import { motion } from 'framer-motion';
import { ArrowLeft, Volume2, VolumeX, Music, Code, Download } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface Song {
  title: string;
  artist: string;
  thumbnail: string;
  score?: number;
}

interface LocationState {
  song: Song;
  videoUrl: string;
}

const VideoStreamingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const videoRef = useRef<HTMLVideoElement>(null);

  // 상태 관리
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<'chords' | 'sheet'>('chords');

  // 예시 코드 데이터
  const mockChords = [
    { time: 5, chord: 'Am', duration: 4 },
    { time: 9, chord: 'C', duration: 4 },
    { time: 13, chord: 'G', duration: 4 },
    { time: 17, chord: 'F', duration: 4 },
    { time: 21, chord: 'Dm', duration: 2 },
    { time: 23, chord: 'E', duration: 2 },
  ];

  // 현재 시간에 맞는 코드 찾기
  const currentChord = mockChords.find(
    (chord) => currentTime >= chord.time && currentTime < chord.time + chord.duration,
  );

  // 비디오 URL이 없는 경우 기본값 설정
  const videoUrl = state?.videoUrl || '/src/assets/sample-video.mp4';
  const song = state?.song || {
    title: '비디오 제목',
    artist: '연습 모드',
    thumbnail: '/src/assets/노래.jpg',
    score: 85,
  };

  // 비디오 이벤트 핸들러
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  // 볼륨 변경 핸들러
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // 비디오 재생/일시정지 토글
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  // 음소거 토글
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // 시간 포맷팅 (초 -> mm:ss)
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // 시크바 위치 변경 핸들러
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  // 볼륨 변경 핸들러
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-white overflow-y-auto custom-scrollbar pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 및 뒤로가기 버튼 */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 bg-zinc-800/50 rounded-full hover:bg-zinc-700 transition-colors"
            aria-label="뒤로 가기"
          >
            <ArrowLeft size={20} className="text-amber-500" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{song.title}</h1>
            <p className="text-zinc-400 flex items-center gap-1 mt-1">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  song.artist === '연습 모드'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-blue-500/20 text-blue-400'
                }`}
              >
                {song.artist}
              </span>
              {song.score && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400 ml-2">
                  점수: {song.score}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽: 비디오 플레이어 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="bg-zinc-800/80 backdrop-blur-sm rounded-xl border border-white/5 overflow-hidden shadow-xl">
              {/* 비디오 컨테이너 */}
              <div className="relative aspect-video">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="w-full h-full object-contain bg-black"
                  onClick={togglePlay}
                >
                  동영상을 지원하지 않는 브라우저입니다.
                </video>

                {/* 오버레이 컨트롤 (일시정지 시에만 표시) */}
                {!isPlaying && (
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer"
                    onClick={togglePlay}
                  >
                    <div className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center">
                      <svg className="w-8 h-8 text-white ml-1" fill="white" viewBox="0 0 24 24">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              {/* 비디오 컨트롤 */}
              <div className="p-4 border-t border-white/5">
                {/* 프로그레스 바 */}
                <div className="mb-4">
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <div className="flex justify-between text-xs text-zinc-400 mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* 컨트롤 버튼 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={togglePlay}
                      className="focus:outline-none text-white hover:text-amber-500 transition-colors"
                      aria-label={isPlaying ? '일시정지' : '재생'}
                    >
                      {isPlaying ? (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <rect x="6" y="4" width="4" height="16" rx="1" />
                          <rect x="14" y="4" width="4" height="16" rx="1" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      )}
                    </button>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={toggleMute}
                        className="focus:outline-none text-white hover:text-amber-500 transition-colors"
                        aria-label={isMuted ? '음소거 해제' : '음소거'}
                      >
                        {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-20 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      className="flex items-center gap-1 text-xs bg-zinc-700 hover:bg-zinc-600 py-1 px-3 rounded-full transition-colors"
                      aria-label="비디오 다운로드"
                    >
                      <Download size={14} />
                      <span>다운로드</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 오른쪽: 코드 및 악보 정보 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col"
          >
            {/* 탭 선택 */}
            <div className="flex border-b border-white/10 mb-4">
              <button
                onClick={() => setActiveTab('chords')}
                className={`py-2 px-4 font-medium focus:outline-none ${
                  activeTab === 'chords'
                    ? 'text-amber-500 border-b-2 border-amber-500'
                    : 'text-zinc-400 hover:text-white transition-colors'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Code size={16} />
                  <span>코드</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('sheet')}
                className={`py-2 px-4 font-medium focus:outline-none ${
                  activeTab === 'sheet'
                    ? 'text-amber-500 border-b-2 border-amber-500'
                    : 'text-zinc-400 hover:text-white transition-colors'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Music size={16} />
                  <span>악보</span>
                </div>
              </button>
            </div>

            {/* 탭 내용 */}
            <div className="flex-grow bg-zinc-800/70 backdrop-blur-sm rounded-xl border border-white/5 overflow-hidden shadow-xl">
              {activeTab === 'chords' && (
                <div className="p-6 h-full">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold mb-3">현재 코드</h3>
                    <div className="flex items-center justify-center h-24 bg-gradient-to-r from-amber-500/10 to-zinc-800/10 rounded-xl border border-white/5">
                      {currentChord ? (
                        <span className="text-4xl font-bold text-amber-500">
                          {currentChord.chord}
                        </span>
                      ) : (
                        <span className="text-zinc-500 text-lg">코드 정보 없음</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold mb-3">코드 시퀀스</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {mockChords.map((chord, index) => (
                        <div
                          key={index}
                          className={`p-3 border rounded-lg flex flex-col items-center justify-center transition-all ${
                            currentChord?.chord === chord.chord
                              ? 'bg-amber-500/20 border-amber-500/50 shadow-lg shadow-amber-500/10'
                              : 'bg-zinc-700/30 border-white/5 hover:bg-zinc-700/50'
                          }`}
                        >
                          <span
                            className={`text-xl font-bold ${
                              currentChord?.chord === chord.chord ? 'text-amber-500' : 'text-white'
                            }`}
                          >
                            {chord.chord}
                          </span>
                          <span className="text-xs text-zinc-400 mt-1">
                            {formatTime(chord.time)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'sheet' && (
                <div className="p-6 h-full">
                  <h3 className="text-lg font-bold mb-3">악보</h3>
                  <div className="bg-zinc-700/30 rounded-xl border border-white/5 p-4 h-[400px] flex items-center justify-center">
                    <div className="text-center text-zinc-500">
                      <Music size={48} className="mx-auto mb-3 opacity-40" />
                      <p>이 노래의 악보 정보가 없습니다.</p>
                      <p className="text-sm mt-2">나중에 다시 확인해주세요</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default VideoStreamingPage;
