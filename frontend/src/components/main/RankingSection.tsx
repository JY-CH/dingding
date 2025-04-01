import React, { useState, useRef, useEffect } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import { fetchRankings } from '@/services/api';

import { Song } from '../../types';

interface RankUser {
  username: string;
  playTime: number;
  totalTry: number;
  avgScore?: number;
}

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
  const [hoveredUser, setHoveredUser] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [rankings, setRankings] = useState<RankUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  // 유저 랭킹 데이터 로드
  useEffect(() => {
    const loadRankings = async () => {
      if (rankingType !== 'user') return;

      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchRankings();

        // 선택된 탭에 따라 데이터 설정
        switch (userTab) {
          case 'playtime':
            setRankings(data.playTimeTop10);
            break;
          case 'totaltry':
            setRankings(data.totalTryTop10);
            break;
          case 'avgscore':
            setRankings(data.scoreTop10);
            break;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '랭킹을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadRankings();
  }, [rankingType, userTab]);

  // 유저 랭킹 렌더링
  const renderUserRankings = () => {
    if (isLoading) {
      return <div className="text-center py-4 text-zinc-400">로딩 중...</div>;
    }

    if (error) {
      return <div className="text-center py-4 text-red-400">{error}</div>;
    }

    return (
      <div className="space-y-2">
        {rankings.map((user, index) => (
          <motion.div
            key={`${user.username}-${index}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.4,
              delay: 0.1 + index * 0.1,
              ease: 'easeOut',
            }}
            className="relative group"
            onMouseEnter={() => setHoveredUser(index)}
            onMouseLeave={() => setHoveredUser(null)}
          >
            <div
              className={`
                flex items-center gap-3 p-3 rounded-lg transition-all duration-300
                ${hoveredUser === index ? 'bg-white/10 transform scale-[1.02]' : 'hover:bg-white/5'}
              `}
            >
              <div className="w-6 text-center">
                <span
                  className={`
                  text-sm font-bold transition-colors duration-300
                  ${hoveredUser === index ? 'text-amber-500' : 'text-zinc-600'}
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
                  ${hoveredUser === index ? 'opacity-100' : 'opacity-0'}
                `}
                />
                <div className="w-full h-full bg-white/5 flex items-center justify-center">
                  <span className="text-white/60 text-sm">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-white text-sm truncate">{user.username}</h4>
                <p className="text-xs text-amber-400/80 truncate">
                  {userTab === 'playtime' &&
                    `${Math.floor(user.playTime / 60)}시간 ${user.playTime % 60}분`}
                  {userTab === 'totaltry' && `${user.totalTry}회 도전`}
                  {userTab === 'avgscore' &&
                    typeof user.avgScore === 'number' &&
                    `평균 ${user.avgScore.toFixed(1)}점`}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-zinc-400">
                  {userTab === 'playtime' && `${user.totalTry}회`}
                  {userTab === 'totaltry' && `${Math.floor(user.playTime / 60)}시간`}
                  {userTab === 'avgscore' && `${user.totalTry}회`}
                </span>
                <div
                  className={`
                    p-2 rounded-full transition-all duration-300
                    ${hoveredUser === index ? 'bg-amber-500' : 'bg-white/5'}
                  `}
                >
                  <svg
                    className={`w-4 h-4 ${hoveredUser === index ? 'text-white' : 'text-zinc-400'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>

              <div
                className={`
                absolute inset-0 bg-gradient-to-r from-amber-500/5 to-purple-500/5 rounded-lg
                transition-opacity duration-300 pointer-events-none
                ${hoveredUser === index ? 'opacity-100' : 'opacity-0'}
              `}
              />
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

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
            인기 순위
          </h2>
          <p className="text-zinc-400 text-xs mt-1">실시간 인기 순위를 확인하세요</p>
        </div>
        <div className="flex items-center gap-2 bg-white/5 rounded-full p-1">
          <button
            onClick={() => setRankingType('music')}
            className={`
              px-4 py-1.5 rounded-full text-sm font-medium transition-all
              ${
                rankingType === 'music'
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
              ${
                rankingType === 'user'
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
            left:
              rankingType === 'music'
                ? activeTab === 'daily'
                  ? '0%'
                  : activeTab === 'weekly'
                    ? '33.33%'
                    : '66.66%'
                : userTab === 'playtime'
                  ? '0%'
                  : userTab === 'avgscore'
                    ? '33.33%'
                    : '66.66%',
            width: '33.33%',
          }}
        />

        {rankingType === 'music'
          ? [
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
          : [
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
            ))}
      </div>

      <div
        ref={scrollContainerRef}
        className="space-y-2 max-h-[320px] overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar relative"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${rankingType}-${activeTab}-${userTab}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {rankingType === 'music' ? (
              <div className="space-y-2">
                {getTracks().map((track, index) => (
                  <motion.div
                    key={`${activeTab}-${track.id}-${index}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.1 + index * 0.1,
                      ease: 'easeOut',
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
                        <span className="text-xs text-zinc-400">
                          {Math.floor(track.plays / 1000)}k
                        </span>
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
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
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
                ))}
              </div>
            ) : (
              renderUserRankings()
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default RankingSection;
