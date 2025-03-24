import React, { useState, useEffect, useRef } from 'react';
import { Song } from '../../types';

interface MusicPlayerProps {
  songs: Song[];
  initialSongIndex?: number;
  isExpanded: boolean;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ songs, initialSongIndex = 0, isExpanded }) => {
  const [currentSongIndex, setCurrentSongIndex] = useState(initialSongIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  
  // songs 배열이 비어있는 경우를 처리
  if (!songs || songs.length === 0) {
    return null; // 또는 로딩/에러 상태를 표시
  }

  const currentSong = songs[currentSongIndex];

  useEffect(() => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    
    const timer = setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(err => console.log('Playback failed:', err));
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [currentSongIndex]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => console.log('Playback failed:', err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    setCurrentSongIndex(prev => (prev === 0 ? songs.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSongIndex(prev => (prev === songs.length - 1 ? 0 : prev + 1));
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setCurrentTime(current);
      setProgress((current / duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && audioRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const newTime = percent * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(percent * 100);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setVolume(value);
    if (audioRef.current) {
      audioRef.current.volume = value / 100;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`
      fixed bottom-0 right-0 bg-gradient-to-r from-zinc-900 to-zinc-800 h-20 px-4 
      flex items-center gap-4 z-40 border-t border-white/5
      transition-[left] duration-300 ease-in-out
      ${isExpanded ? 'left-64' : 'left-20'}
    `}>
      {/* Album Cover & Song Info */}
      <div className="flex items-center gap-4 w-72">
        <div className="relative w-14 h-14 flex-shrink-0">
          <img 
            src={currentSong.cover} 
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6M9 9h1m4 0h1" />
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
      <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto">
        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-2">
          <button 
            onClick={handlePrevious}
            className="p-2 text-zinc-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 16l-4-4 4-4M7 16a2 2 0 100-4 2 2 0 000 4z M7 16v1a2 2 0 104 0v-3" />
            </svg>
          </button>
          <button 
            onClick={handlePlayPause}
            className="w-10 h-10 flex items-center justify-center bg-white rounded-full text-zinc-900 hover:bg-amber-500 hover:text-white transition-all"
          >
            {isPlaying ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6M9 9h1m4 0h1" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              </svg>
            )}
          </button>
          <button 
            onClick={handleNext}
            className="p-2 text-zinc-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 16l4-4-4-4M17 16a2 2 0 100-4 2 2 0 000 4z M17 16v1a2 2 0 11-4 0v-3" />
            </svg>
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="flex items-center gap-3 px-4">
          <span className="text-xs text-zinc-400">{formatTime(currentTime)}</span>
          <div 
            ref={progressRef}
            onClick={handleProgressClick}
            className="flex-1 h-1 bg-zinc-700 rounded-full cursor-pointer relative"
          >
            <div 
              className="absolute top-0 left-0 h-full bg-amber-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-zinc-400">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume & Additional Controls */}
      <div className="flex items-center gap-4 w-72 justify-end">
        <div className="relative">
          <button 
            onClick={() => setShowVolume(!showVolume)}
            className="p-2 text-zinc-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          </button>
          {showVolume && (
            <div className="absolute bottom-full right-0 mb-2 p-2 bg-zinc-800 rounded-lg shadow-lg">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={volume} 
                onChange={handleVolumeChange}
                className="w-24 h-1 rounded-full appearance-none bg-zinc-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500"
              />
            </div>
          )}
        </div>
        <button 
          onClick={() => setIsLiked(!isLiked)}
          className={`p-2 ${isLiked ? 'text-amber-500' : 'text-zinc-400 hover:text-white'} transition-colors`}
        >
          <svg className="w-5 h-5" fill={isLiked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      <audio 
        ref={audioRef}
        src={currentSong.audio}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleNext}
      />
    </div>
  );
};

export default MusicPlayer; 