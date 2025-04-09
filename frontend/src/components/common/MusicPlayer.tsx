import React, { useState, useEffect } from 'react';

import { Song } from '../../types/performance';

interface MusicPlayerProps {
  songs: Song[];
  initialSongIndex?: number;
  isExpanded: boolean;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ songs, initialSongIndex = 0 }) => {
  const [currentSongIndex, setCurrentSongIndex] = useState(initialSongIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [currentTime, setCurrentTime] = useState(0);
  const [showVolume, setShowVolume] = useState(false);

  // songs 배열이 비어있는 경우를 처리
  if (!songs || songs.length === 0) {
    return null; // 또는 로딩/에러 상태를 표시
  }

  const currentSong = songs[currentSongIndex];

  useEffect(() => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  }, [currentSongIndex]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    setCurrentSongIndex((prev) => (prev === 0 ? songs.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSongIndex((prev) => (prev === songs.length - 1 ? 0 : prev + 1));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setVolume(value);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`
      w-full
      bg-gradient-to-r from-zinc-900/80 to-zinc-800/80 
      backdrop-blur-md
      h-20 px-4 
      flex items-center gap-4 z-40 
      border-t border-white/5
    `}>
      {/* Album Cover & Song Info */}
      <div className="flex items-center gap-4 min-w-[288px] w-72">
        <div className="relative w-14 h-14 flex-shrink-0">
          <img
            src={currentSong.thumbnail}
            alt={currentSong.title}
            className="w-full h-full object-cover rounded shadow-lg"
          />
          {isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded opacity-0 hover:opacity-100 transition-opacity">
              <button
                onClick={handlePlayPause}
                className="w-8 h-8 flex items-center justify-center bg-amber-500 rounded-full text-white hover:bg-amber-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 9v6m4-6v6M9 9h1m4 0h1"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
        <div>
          <h3 className="text-white font-medium text-sm">{currentSong.title}</h3>
          <p className="text-zinc-400 text-xs">{currentSong.artist}</p>
        </div>
      </div>

      {/* Player Controls & Progress */}
      <div className="flex-1 flex flex-col justify-center min-w-[400px]">
        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-2">
          <button
            onClick={handlePrevious}
            className="p-2 text-zinc-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 16l-4-4 4-4M7 16a2 2 0 100-4 2 2 0 000 4z M7 16v1a2 2 0 104 0v-3"
              />
            </svg>
          </button>
          <button
            onClick={handlePlayPause}
            className="w-10 h-10 flex items-center justify-center bg-white rounded-full text-zinc-900 hover:bg-amber-500 hover:text-white transition-all"
          >
            {isPlaying ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 9v6m4-6v6M9 9h1m4 0h1"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
              </svg>
            )}
          </button>
          <button
            onClick={handleNext}
            className="p-2 text-zinc-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 16l4-4-4-4m10 0v12"
              />
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-3 px-4">
          <span className="text-xs text-zinc-400 w-10 text-right">
            {formatTime(currentTime)}
          </span>
          <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-zinc-400 w-10">
            {currentSong.duration}
          </span>
        </div>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-2 min-w-[120px]">
        <button
          onClick={() => setShowVolume(!showVolume)}
          className="p-2 text-zinc-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M12 18l-4-4H4a1 1 0 01-1-1V11a1 1 0 011-1h4l4-4v12z"
            />
          </svg>
        </button>
        {showVolume && (
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="w-20 accent-amber-500"
          />
        )}
      </div>
    </div>
  );
};

export default MusicPlayer;
