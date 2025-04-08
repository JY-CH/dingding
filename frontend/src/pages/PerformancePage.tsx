import React, { useState, useEffect } from 'react';

import GameModeNavbar from '../components/common/GameModeNavbar';
import ChordTimeline from '../components/performance/ChordTimeline';
import Playlist from '../components/performance/Playlist';
import RealtimeFeedback from '../components/performance/RealtimeFeedback';
import WebcamView from '../components/performance/WebcamView';
import { Song } from '../types/performance';

// 피드백 메시지 목록
const feedbackMessages = [
  {
    message:
      '좋아요! 코드 전환이 자연스러워지고 있어요. 다음 코드로 넘어갈 때 손가락을 미리 준비해보세요.',
    isPositive: true,
  },
  {
    message: '스트로킹 리듬이 안정적이에요. 이번에는 업스트럼에 좀 더 힘을 실어서 해볼까요?',
    isPositive: true,
  },
  {
    message: '템포가 조금 빨라졌네요. 메트로놈 소리에 집중해서 일정한 속도를 유지해보세요.',
    isPositive: false,
  },
  {
    message: '바레 코드를 잡을 때 검지 손가락에 좀 더 힘을 주세요. 모든 줄이 깔끔하게 울리도록요!',
    isPositive: false,
  },
  {
    message: '멋져요! 코드와 스트로킹이 조화롭게 어우러지고 있어요. 이 느낌을 유지해보세요.',
    isPositive: true,
  },
  {
    message: '코드 모양이 조금 흐트러졌어요. 손가락 끝으로 프렛을 정확하게 눌러주세요.',
    isPositive: false,
  },
  {
    message: '리듬감이 좋아요! 이제 스트로킹할 때 손목을 좀 더 부드럽게 움직여볼까요?',
    isPositive: true,
  },
  {
    message:
      '코드 전환 시 브리지 음이 끊기지 않도록 해보세요. 손가락을 프렛에서 완전히 떼지 말고 슬라이드하듯이 움직여보세요.',
    isPositive: false,
  },
];

const PerformancePage: React.FC = () => {
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isWebcamOn, setIsWebcamOn] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState(feedbackMessages[0]);

  // 피드백 메시지 업데이트 함수
  const updateFeedback = () => {
    const newFeedback = feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)];
    setCurrentFeedback(newFeedback);
  };

  // 3초마다 피드백 업데이트 (테스트용)
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(updateFeedback, 3000);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const handleSongSelect = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(false);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      {/* 네비바 - 4rem 고정 */}
      <div className="h-16">
        <GameModeNavbar
          showStats={showStats}
          setShowStats={setShowStats}
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          currentMode="performance"
        />
      </div>

      {/* 플레이리스트와 웹캠 영역 - 남은 공간의 절반 */}
      <div className="h-[calc(40vh-4rem)] flex gap-4 p-4 justify-between">
        {/* 왼쪽: 플레이리스트 */}
        <div className="w-1/4 h-full">
          <Playlist onSongSelect={handleSongSelect} />
        </div>
        {/* 가운데: 실시간 피드백 */}
        <div className="w-1/3 h-full">
          <RealtimeFeedback
            feedback={currentFeedback.message}
            isPositive={currentFeedback.isPositive}
          />
        </div>
        {/* 오른쪽: 웹캠 */}
        <div className="w-1/4 h-full">
          <WebcamView isWebcamOn={isWebcamOn} setIsWebcamOn={setIsWebcamOn} />
        </div>
      </div>

      {/* 코드 타임라인 영역 */}
      <div className="h-[85vh] mb-2 p-4">
        <div className="h-full bg-gray-800/50 rounded-lg overflow-hidden">
          <ChordTimeline
            isPlaying={isPlaying}
            currentSong={currentSong}
            notes={currentSong?.notes || []}
            currentChord={null}
          />
        </div>
      </div>
    </div>
  );
};

export default PerformancePage;
