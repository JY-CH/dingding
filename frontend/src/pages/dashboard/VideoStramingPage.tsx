import React, { useState, useRef, useEffect } from 'react';

import { motion } from 'framer-motion';
import { ArrowLeft, Volume2, VolumeX, Download, Trash2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

import apiClient from '@/services/dashboardapi'; // 올바른 apiClient 경로

interface Song {
  title: string;
  artist: string;
  thumbnail: string;
  score?: number;
  replayId: number;
}

interface LocationState {
  song: Song;
  videoUrl: string;
  replayId: number;
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
  const [isDeleting, setIsDeleting] = useState(false);

  const song = state?.song || {
    title: '비디오 제목',
    artist: '연습 모드',
    thumbnail: '/src/assets/노래.jpg',
    score: 85,
  };
  // 비디오 URL이 없는 경우 기본값 설정
  const videoUrl = state?.videoUrl || '/src/assets/sample-video.mp4';
  const replayId = state?.song.replayId || 0;

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

  // 다운로드 핸들러
  const handleDownload = async () => {
    if (!videoUrl) return;

    try {
      // 비디오 URL에서 파일 다운로드
      const response = await fetch(videoUrl);
      const blob = await response.blob();

      // 다운로드 링크 생성
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);

      // 파일명 설정 (비디오 URL에서 파일명 추출 또는 노래 제목 사용)
      const fileName = song.title ? `${song.title}.mp4` : 'video.mp4';
      downloadLink.download = fileName;

      // 링크 클릭하여 다운로드 시작
      document.body.appendChild(downloadLink);
      downloadLink.click();

      // 링크 제거
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error('비디오 다운로드 중 오류가 발생했습니다:', error);
      alert('다운로드 중 오류가 발생했습니다.');
    }
  };

  // 다시보기 삭제 핸들러
  const handleDeleteReplay = async () => {
    try {
      setIsDeleting(true);

      // apiClient를 사용하여 DELETE 요청 보내기
      await apiClient.delete(`/replay/${replayId}`);

      // 삭제 완료 후 이전 페이지로 이동
      navigate(-1);
    } catch (error) {
      console.error('Error deleting replay:', error);
      alert('다시보기 삭제 중 오류가 발생했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  // 삭제 확인 모달
  const DeleteConfirmModal = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className="bg-zinc-800 rounded-lg p-6 max-w-md w-full mx-4 border border-white/10">
        <h3 className="text-xl font-bold mb-4">다시보기 삭제</h3>
        <p className="text-zinc-300 mb-6">
          이 다시보기를 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setIsDeleting(false)}
            className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleDeleteReplay}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2"
          >
            <Trash2 size={16} />
            삭제
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-white overflow-y-auto custom-scrollbar pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 및 뒤로가기 버튼 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
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
          <button
            onClick={() => setIsDeleting(true)}
            className="flex items-center gap-2 px-3 py-2 bg-red-600/80 hover:bg-red-600 rounded-lg transition-colors"
            aria-label="다시보기 삭제"
          >
            <Trash2 size={16} />
            <span className="hidden sm:inline">삭제</span>
          </button>
        </div>

        {/* 메인 컨텐츠 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
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
                    onClick={handleDownload}
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
      </div>

      {/* 삭제 확인 모달 */}
      {isDeleting && <DeleteConfirmModal />}
    </div>
  );
};

export default VideoStreamingPage;
