import React, { useState } from 'react';

import { Song } from '../../types';

interface RankingSectionProps {
  dailyTracks: Song[];
  weeklyTracks: Song[];
  monthlyTracks: Song[];
  onPlayTrack: (track: Song) => void;
}

const RankingSection: React.FC<RankingSectionProps> = ({
  dailyTracks,
  weeklyTracks,
  monthlyTracks,
  onPlayTrack,
}) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);

  const getTracks = () => {
    switch (activeTab) {
      case 'daily':
        return dailyTracks;
      case 'weekly':
        return weeklyTracks;
      case 'monthly':
        return monthlyTracks;
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 shadow-lg">
      <div className="mb-6">
        <h2 className="text-xl font-bold bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
          인기 차트
        </h2>
        <p className="text-zinc-400 text-xs mt-1">실시간 인기 곡을 확인하세요</p>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex gap-4 mb-6 border-b border-white/10 relative">
        <div
          className="absolute bottom-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-300 ease-out rounded-full"
          style={{
            left: activeTab === 'daily' ? '0%' : activeTab === 'weekly' ? '33.33%' : '66.66%',
            width: '33.33%',
          }}
        />

        {[
          { id: 'daily', label: 'Today' },
          { id: 'weekly', label: 'This Week' },
          { id: 'monthly', label: 'This Month' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'daily' | 'weekly' | 'monthly')}
            className={`
              pb-3 px-4 text-sm font-medium transition-all duration-300 flex-1
              ${activeTab === tab.id ? 'text-amber-500' : 'text-zinc-400 hover:text-white'}
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 트랙 리스트 */}
      <div className="space-y-2 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
        {getTracks().map((track, index) => (
          <div
            key={track.id}
            className="relative group"
            onMouseEnter={() => setHoveredTrack(track.id)}
            onMouseLeave={() => setHoveredTrack(null)}
          >
            <div
              className={`
              flex items-center gap-3 p-3 rounded-lg transition-all duration-300
              ${
                hoveredTrack === track.id
                  ? 'bg-white/10 transform scale-[1.02]'
                  : 'hover:bg-white/5'
              }
            `}
            >
              {/* 순위 */}
              <div className="w-6 text-center">
                <span
                  className={`
                  text-sm font-bold transition-colors duration-300
                  ${hoveredTrack === track.id ? 'text-amber-500' : 'text-zinc-600'}
                `}
                >
                  {(index + 1).toString().padStart(2, '0')}
                </span>
              </div>

              {/* 앨범 커버 */}
              <div className="relative w-10 h-10 rounded-md overflow-hidden">
                <div
                  className={`
                  absolute inset-0 bg-gradient-to-br from-amber-500/20 to-purple-500/20
                  transition-opacity duration-300
                  ${hoveredTrack === track.id ? 'opacity-100' : 'opacity-0'}
                `}
                />
                <img
                  src={track.cover}
                  alt={track.title}
                  className={`
                    w-full h-full object-cover transition-transform duration-500
                    ${hoveredTrack === track.id ? 'scale-110' : 'scale-100'}
                  `}
                />
              </div>

              {/* 곡 정보 */}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-white text-sm truncate">{track.title}</h4>
                <p className="text-xs text-amber-400/80 truncate">{track.artist}</p>
              </div>

              {/* 재생 수 & 재생 버튼 */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-zinc-400">{Math.floor(track.plays / 1000)}k</span>
                <button
                  onClick={() => onPlayTrack(track)}
                  className={`
                    p-2 rounded-full transition-all duration-300
                    ${
                      hoveredTrack === track.id
                        ? 'bg-amber-500 text-white'
                        : 'bg-white/5 text-zinc-400'
                    }
                  `}
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

              {/* 배경 효과 */}
              <div
                className={`
                absolute inset-0 bg-gradient-to-r from-amber-500/5 to-purple-500/5 rounded-lg
                transition-opacity duration-300 pointer-events-none
                ${hoveredTrack === track.id ? 'opacity-100' : 'opacity-0'}
              `}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RankingSection;
