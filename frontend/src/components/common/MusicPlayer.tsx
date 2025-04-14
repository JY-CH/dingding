import React, { useState, useEffect, useRef } from 'react';

import { Song } from '../../types/performance';

interface MusicPlayerProps {
  songs: Song[];
  initialSongIndex?: number;
  isExpanded: boolean;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ songs,  isExpanded }) => {
  const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [currentTime, setCurrentTime] = useState(0);
  const [showVolume, setShowVolume] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const previousSongsRef = useRef<Song[]>(songs);

  // songs 배열이 비어있는 경우를 처리
  const currentSong = songs.length > 0 && currentSongIndex !== null ? songs[currentSongIndex] : null;

  // songs 배열이 변경되었는지 확인
  useEffect(() => {
    if (JSON.stringify(previousSongsRef.current) !== JSON.stringify(songs)) {
      previousSongsRef.current = songs;
      // 새로운 곡이 선택되었을 때
      if (songs.length === 1) {
        setCurrentSongIndex(0);
        setIsPlaying(true); // 자동 재생
        setCurrentTime(0);
        setProgress(0);
        if (audioRef.current) {
          audioRef.current.load();
          audioRef.current.play().catch((err) => {
            console.log('Playback failed:', err);
            setIsPlaying(false);
          });
        }
      } else if (songs.length === 0) {
        setCurrentSongIndex(null);
        setIsPlaying(false);
      }
    }
  }, [songs]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (audio) {
        const progress = (audio.currentTime / audio.duration) * 100;
        setProgress(progress);
        setCurrentTime(audio.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      if (audio) {
        setCurrentTime(0);
        setProgress(0);
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleCanPlay = () => {
      if (isPlaying) {
        audio.play().catch((err) => {
          console.log('Playback failed:', err);
          setIsPlaying(false);
        });
      }
    };

    const handleEnded = () => {
      handleNext();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      setIsPlaying(true); // 곡이 변경될 때 자동 재생
      setCurrentTime(0);
      setProgress(0);
      audioRef.current.play().catch((err) => {
        console.log('Playback failed:', err);
        setIsPlaying(false);
      });
    }
  }, [currentSongIndex]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((err) => {
          console.log('Playback failed:', err);
          setIsPlaying(false);
        });
      }
    }
  };

  const handlePrevious = () => {
    if (currentSongIndex !== null && songs.length > 0) {
      setCurrentSongIndex(currentSongIndex === 0 ? songs.length - 1 : currentSongIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentSongIndex !== null && songs.length > 0) {
      setCurrentSongIndex(currentSongIndex === songs.length - 1 ? 0 : currentSongIndex + 1);
    }
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
      fixed bottom-0 left-0 right-0
      bg-gradient-to-r from-zinc-900/80 to-zinc-800/80 
      backdrop-blur-md
      h-20 px-4 
      flex items-center gap-4 z-40 
      border-t border-white/5
      transition-all duration-300 ease-in-out
      ${isExpanded ? 'pl-[288px]' : 'pl-[88px]'}
    `}>
      {/* Album Cover & Song Info */}
      <div className={`
        flex items-center gap-4
        transition-all duration-300 ease-in-out
        ${isExpanded ? 'min-w-[240px] w-60' : 'min-w-[200px] w-52'}
      `}>
        {currentSong ? (
          <>
            <div className="relative w-14 h-14 flex-shrink-0 group">
              <img
                src={currentSong.songImage || currentSong.thumbnail}
                alt={currentSong.title}
                className="w-full h-full object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
                style={{
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  filter: 'drop-shadow(0 4px 3px rgba(0, 0, 0, 0.2))'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={handlePlayPause}
                  className="w-8 h-8 flex items-center justify-center bg-amber-500 rounded-full text-white hover:bg-amber-600 transition-colors"
                >
                  {isPlaying ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 9v6m4-6v6M9 9h1m4 0h1"
                      />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div className="overflow-hidden">
              <h3 className="text-white font-medium text-sm truncate">{currentSong.title}</h3>
              <p className="text-zinc-400 text-xs truncate">{currentSong.artist}</p>
            </div>
          </>
        ) : (
          <div className="flex items-center text-zinc-500 text-sm">
            재생할 곡을 선택해주세요
          </div>
        )}
      </div>

      {/* Player Controls & Progress */}
      <div className={`
        flex-1 flex flex-col justify-center
        transition-all duration-300 ease-in-out
        ${isExpanded ? 'min-w-[400px]' : 'min-w-[300px]'}
      `}>
        {currentSong ? (
          <>
            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mb-2">
              <button
                onClick={handlePrevious}
                className="p-2 text-zinc-400 hover:text-white transition-colors"
                disabled={!currentSong}
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
                disabled={!currentSong}
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
                disabled={!currentSong}
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
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-3 px-4">
              <span className="text-xs text-zinc-400 w-10 text-right">
                {formatTime(currentTime)}
              </span>
              <div className="flex-1 h-1 bg-zinc-600/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-zinc-400 w-10">
                {audioRef.current?.duration ? formatTime(audioRef.current.duration) : '0:00'}
              </span>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center">
            <div className="w-10 h-10 flex items-center justify-center bg-zinc-800/50 rounded-full">
              <svg className="w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Volume Control */}
      <div className={`
        flex items-center justify-end gap-2
        transition-all duration-300 ease-in-out
        ${isExpanded ? 'w-48 pr-4' : 'w-32 pr-2'}
      `}>
        {currentSong && (
          <>
            <button
              className="p-2 text-zinc-400 hover:text-white transition-colors relative"
              onClick={() => setShowVolume(!showVolume)}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M12 18.012l-7-4.5v-3l7-4.5v12z"
                />
              </svg>
              {showVolume && (
                <div className="absolute bottom-full right-0 mb-2 p-2 bg-zinc-800 rounded-lg shadow-lg transition-all duration-300 ease-in-out">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-24 accent-amber-500"
                  />
                </div>
              )}
            </button>
            <audio ref={audioRef} src={currentSong.songVoiceFileUrl} />
          </>
        )}
      </div>
    </div>
  );
};

export default MusicPlayer;
