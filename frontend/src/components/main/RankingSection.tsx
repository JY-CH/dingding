import React, { useState, useRef, useEffect } from 'react';

import { motion } from 'framer-motion';

import { Song } from '../../types';

interface RankingSectionProps {
  dailyTracks: Song[];
  weeklyTracks: Song[];
  monthlyTracks: Song[];
  onPlayTrack: (track: Song) => void;
}

type TabType = 'daily' | 'weekly' | 'monthly';
type UserTabType = 'playtime' | 'avgscore' | 'totaltry';

const RankingSection: React.FC<RankingSectionProps> = ({
  dailyTracks,
  weeklyTracks,
  monthlyTracks,
  onPlayTrack,
}) => {
  const [rankingType, setRankingType] = useState<'music' | 'user'>('music');
  const [activeTab, setActiveTab] = useState<TabType>('daily');
  const [userTab, setUserTab] = useState<UserTabType>('playtime');
  const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [activeTab, userTab, rankingType]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 }}
      className="bg-white/5 backdrop-blur-md rounded-xl p-6 shadow-lg"
      style={{ transition: 'none' }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
            인기 차트
          </h2>
          <p className="text-zinc-400 text-xs mt-1">실시간 인기 콘텐츠를 확인하세요</p>
        </div>
        <div className="flex items-center gap-2 bg-white/5 rounded-full p-1">
          <button
            onClick={() => setRankingType('music')}
            className={`
              px-4 py-1.5 rounded-full text-sm font-medium transition-all
              ${rankingType === 'music' 
                ? 'bg-amber-500 text-white shadow-lg' 
                : 'text-zinc-400 hover:text-white'
              }
            `}
          >
            음악
          </button>
          <button
            onClick={() => setRankingType('user')}
            className={`
              px-4 py-1.5 rounded-full text-sm font-medium transition-all
              ${rankingType === 'user' 
                ? 'bg-amber-500 text-white shadow-lg' 
                : 'text-zinc-400 hover:text-white'
              }
            `}
          >
            유저
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-6 border-b border-white/10 relative">
        <div
          className="absolute bottom-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-300 ease-out rounded-full"
          style={{
            left: rankingType === 'music' 
              ? (activeTab === 'daily' ? '0%' : activeTab === 'weekly' ? '33.33%' : '66.66%')
              : (userTab === 'playtime' ? '0%' : userTab === 'avgscore' ? '33.33%' : '66.66%'),
            width: '33.33%',
          }}
        />

        {rankingType === 'music' ? (
          [
            { id: 'daily', label: 'Today' },
            { id: 'weekly', label: 'This Week' },
            { id: 'monthly', label: 'This Month' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`
                pb-3 px-4 text-sm font-medium transition-all duration-300 flex-1
                ${activeTab === tab.id ? 'text-amber-500' : 'text-zinc-400 hover:text-white'}
              `}
            >
              {tab.label}
            </button>
          ))
        ) : (
          [
            { id: 'playtime', label: '플레이타임', icon: '⏱️' },
            { id: 'avgscore', label: '평균 점수', icon: '📊' },
            { id: 'totaltry', label: '도전 횟수', icon: '🎯' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setUserTab(tab.id as UserTabType)}
              className={`
                pb-3 px-2 text-sm font-medium transition-all duration-300 flex-1
                ${userTab === tab.id ? 'text-amber-500' : 'text-zinc-400 hover:text-white'}
              `}
            >
              <div className="flex items-center justify-center gap-1.5 whitespace-nowrap">
                <span className="text-xs">{tab.icon}</span>
                <span className="text-xs">{tab.label}</span>
              </div>
            </button>
          ))
        )}
      </div>

      <div 
        ref={scrollContainerRef}
        className="space-y-2 max-h-[320px] overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar"
      >
        {rankingType === 'music' ? (
          getTracks().map((track, index) => (
            <motion.div
              key={`${activeTab}-${track.id}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5,
                delay: 0.2 + index * 0.15,
                ease: "easeOut"
              }}
              className="relative group"
              onMouseEnter={() => setHoveredTrack(track.id)}
              onMouseLeave={() => setHoveredTrack(null)}
            >
              <div
                className={`
                  flex items-center gap-3 p-3 rounded-lg transition-all duration-300
                  ${hoveredTrack === track.id ? 'bg-white/10 transform scale-[1.02]' : 'hover:bg-white/5'}
                `}
              >
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

                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-white text-sm truncate">{track.title}</h4>
                  <p className="text-xs text-amber-400/80 truncate">{track.artist}</p>
                </div>

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

                <div
                  className={`
                  absolute inset-0 bg-gradient-to-r from-amber-500/5 to-purple-500/5 rounded-lg
                  transition-opacity duration-300 pointer-events-none
                  ${hoveredTrack === track.id ? 'opacity-100' : 'opacity-0'}
                `}
                />
              </div>
            </motion.div>
          ))
        ) : (
          Array.from({ length: 5 }).map((_, index) => (
            <motion.div
              key={`user-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5,
                delay: 0.2 + index * 0.15,
                ease: "easeOut"
              }}
              className={`
                bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all cursor-pointer
                ${index === 0 ? 'bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent' : ''}
              `}
            >
              <div className="flex items-center gap-4">
                <div className={`
                  text-2xl font-black
                  ${index === 0 ? 'text-amber-500' : 'text-white/80'}
                `}>
                  #{index + 1}
                </div>
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500/20 to-purple-500/20 p-0.5">
                    <div className="w-full h-full rounded-full bg-zinc-700 overflow-hidden">
                      {/* 프로필 이미지가 있다면 여기에 추가 */}
                    </div>
                  </div>
                  {index === 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                      <span className="text-[10px]">👑</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">User Name {index + 1}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500">
                      Lv.{50 - index}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-zinc-400">Score: {(1000 - index * 50).toLocaleString()}</span>
                    <span className="text-xs text-green-500">+{(100 - index * 10).toString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 rounded-full bg-white/5 text-xs text-zinc-400">
                    {(1000 - index * 100).toString()} 곡
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default RankingSection;
