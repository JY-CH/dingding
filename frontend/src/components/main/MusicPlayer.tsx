import React, { useState, useEffect, useRef } from 'react';

import { Song } from '../../types';

interface MusicPlayerProps {
  songs: Song[];
  initialSongIndex?: number;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ songs, initialSongIndex = 0 }) => {
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

  const currentSong = songs[currentSongIndex];

  useEffect(() => {
    // Reset state on song change
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);

    // Start playing after a short delay to allow audio element to load
    const timer = setTimeout(() => {
      if (audioRef.current) {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => console.log('Playback failed:', err));
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [currentSongIndex]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => console.log('Playback failed:', err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    setCurrentSongIndex((prev) => (prev === 0 ? songs.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSongIndex((prev) => (prev === songs.length - 1 ? 0 : prev + 1));
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
    <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-xl p-4 text-white shadow-xl backdrop-blur-lg relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-amber-500/30 to-rose-500/30 opacity-20"></div>

      {/* Background album art with blur */}
      <div className="absolute -right-10 -bottom-10 w-40 h-40 opacity-10 blur-xl z-0">
        <img
          src={currentSong.cover}
          alt={currentSong.title}
          className="w-full h-full object-cover rounded-full"
        />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-4">
        {/* Album Cover */}
        <div className="relative w-48 h-48 md:w-48 md:h-48 flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-rose-500/20 rounded-lg rotate-12 scale-[0.97] group-hover:rotate-6 transition-transform duration-700"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-rose-500/20 rounded-lg -rotate-12 scale-[0.97] group-hover:rotate-6 transition-transform duration-700"></div>
          <img
            src={currentSong.cover}
            alt={currentSong.title}
            className="w-full h-full object-cover rounded-lg shadow-xl relative z-10 transition-all duration-500 group-hover:shadow-amber-500/20"
          />
          {isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg z-20 opacity-0 group-hover:opacity-100 transition-opacity">
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
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg z-20 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handlePlayPause}
                className="w-8 h-8 flex items-center justify-center bg-amber-500 rounded-full text-white hover:bg-amber-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Player Controls */}
        <div className="flex-1 w-full">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h2 className="text-xl font-bold text-white">{currentSong.title}</h2>
              <p className="text-amber-400 text-sm">{currentSong.artist}</p>
              <p className="text-zinc-400 text-xs">{currentSong.album}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-1.5 rounded-full ${isLiked ? 'text-rose-500' : 'text-zinc-400 hover:text-white'} transition-colors`}
              >
                <svg
                  className="w-4 h-4"
                  fill={isLiked ? 'currentColor' : 'none'}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowVolume(!showVolume)}
                  className="p-1.5 rounded-full text-zinc-400 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                  </svg>
                </button>
                {showVolume && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-zinc-800 rounded-lg shadow-lg w-24">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-full h-1.5 rounded-full appearance-none bg-zinc-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500"
                    />
                  </div>
                )}
              </div>
              <button className="p-1.5 rounded-full text-zinc-400 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div
            ref={progressRef}
            onClick={handleProgressClick}
            className="h-1.5 bg-zinc-700 rounded-full mb-1.5 cursor-pointer relative overflow-hidden"
          >
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-xs text-zinc-400 mb-3">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-center gap-4">
            <button className="p-1.5 rounded-full text-zinc-400 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </button>
            <button
              onClick={handlePrevious}
              className="p-2 rounded-full text-white hover:text-amber-400 transition-colors"
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
              className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-amber-500 to-rose-500 rounded-full text-white shadow-lg hover:shadow-amber-500/25 transition-all"
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
              className="p-2 rounded-full text-white hover:text-amber-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 16l4-4-4-4M17 16a2 2 0 100-4 2 2 0 000 4z M17 16v1a2 2 0 11-4 0v-3"
                />
              </svg>
            </button>
            <button className="p-1.5 rounded-full text-zinc-400 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
        </div>
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
