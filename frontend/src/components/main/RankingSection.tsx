import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';

import { fetchRankings } from '@/services/api';
import { fetchMonthlyRanking, fetchWeeklyRanking, fetchDailyRanking } from '../../services/api';

import { Song } from '../../types/performance';

interface RankUser {
  username: string;
  playTime: string | number;
  totalTry: number;
  avgScore?: number;
  score?: number;
  rank?: number;
}

interface RankingSectionProps {
  dailyTracks: any[];
  weeklyTracks: any[];
  monthlyTracks: any[];
  onPlayTrack: (track: Song) => void;
  onPlaySong: (song: any) => void;
}

type TabType = 'month' | 'week' | 'day';
type UserTabType = 'playtime' | 'avgscore' | 'totaltry';

const RankingSection: React.FC<RankingSectionProps> = ({
  dailyTracks,
  weeklyTracks,
  monthlyTracks,
  onPlayTrack,
  onPlaySong,
}) => {
  const [rankingType, setRankingType] = useState<'music' | 'user'>('music');
  const [activeTab, setActiveTab] = useState<TabType>('month');
  const [userTab, setUserTab] = useState<UserTabType>('playtime');
  const [hoveredTrack, setHoveredTrack] = useState<number | null>(null);
  const [hoveredUser, setHoveredUser] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [rankings, setRankings] = useState<RankUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API 데이터가 없을 때 fallback으로 사용할 값들
  const fallbackData = {
    month: monthlyTracks,
    week: weeklyTracks,
    day: dailyTracks
  };

  const { data: monthlyRanking = [] } = useQuery({
    queryKey: ['monthlyRanking'],
    queryFn: fetchMonthlyRanking,
  });

  const { data: weeklyRanking = [] } = useQuery({
    queryKey: ['weeklyRanking'],
    queryFn: fetchWeeklyRanking,
  });

  const { data: dailyRanking = [] } = useQuery({
    queryKey: ['dailyRanking'],
    queryFn: fetchDailyRanking,
  });

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
        
        // 데이터 검증 및 형식 변환
        let processedData: RankUser[] = [];

        // 선택된 탭에 따라 데이터 설정
        switch (userTab) {
          case 'playtime':
            processedData = data.playTimeTop10.map((user: any) => ({
              ...user,
              playTime: user.playTime || "00:00:00",
              totalTry: typeof user.totalTry === 'number' ? user.totalTry : 0,
              avgScore: user.score || 0
            }));
            break;
          case 'totaltry':
            processedData = data.totalTryTop10.map((user: any) => ({
              ...user,
              playTime: user.playTime || "00:00:00",
              totalTry: typeof user.totalTry === 'number' ? user.totalTry : 0,
              avgScore: user.score || 0
            }));
            break;
          case 'avgscore':
            processedData = data.scoreTop10.map((user: any) => ({
              ...user,
              playTime: user.playTime || "00:00:00",
              totalTry: typeof user.totalTry === 'number' ? user.totalTry : 0,
              avgScore: user.score || 0
            }));
            break;
        }
        
        setRankings(processedData);
      } catch (err) {
        console.error('랭킹 조회 오류:', err);
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

    if (!rankings || rankings.length === 0) {
      return (
        <div className="text-center py-8">
          <svg 
            className="w-12 h-12 mx-auto text-zinc-600 mb-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
            />
          </svg>
          <p className="text-zinc-400 text-sm">랭킹 정보가 없습니다.</p>
          <p className="text-zinc-500 text-xs mt-1">첫 연주를 시작해보세요!</p>
        </div>
      );
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
              </div>

              <div className="flex items-center gap-3">
                <p className="text-xs text-amber-400/80 truncate">
                  {userTab === 'playtime' && (
                    formatPlayTime(user.playTime)
                  )}
                  {userTab === 'totaltry' && (
                    `${user.totalTry || 0}회`
                  )}
                  {userTab === 'avgscore' && (
                    `${(user.avgScore || 0).toFixed(1)}점`
                  )}
                </p>
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

  // 카테고리별 다른 데이터 포맷 함수 추가
  const formatPlayTime = (minutes: string | number) => {
    if (typeof minutes === 'string') {
      // "00:05:00" 형식 처리
      const parts = minutes.split(':');
      if (parts.length === 3) {
        const hours = parseInt(parts[0]);
        const mins = parseInt(parts[1]);
        return `${hours}시간 ${mins}분`;
      }
      return '0시간 0분';
    } else if (typeof minutes === 'number') {
      // 분 단위로 된 숫자 처리 (기존 로직)
      if (isNaN(minutes)) return '0시간 0분';
      const hours = Math.floor(minutes / 60);
      const mins = Math.floor(minutes % 60);
      return `${hours}시간 ${mins}분`;
    }
    return '0시간 0분';
  };

  const getCurrentRanking = () => {
    // 먼저 API 데이터 사용 시도
    const apiData = {
      month: monthlyRanking,
      week: weeklyRanking,
      day: dailyRanking
    };

    // API 데이터가 없으면 props로 받은 데이터 사용
    const result = apiData[activeTab].length > 0 
      ? apiData[activeTab] 
      : fallbackData[activeTab];
    
    return result;
  };

  const handlePlayMusic = (song: any) => {
    // 필요에 따라 onPlayTrack 또는 onPlaySong 사용 
    if (onPlaySong) {
      onPlaySong(song);
    } else if (onPlayTrack) {
      onPlayTrack(song);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white/5 backdrop-blur-md rounded-xl p-6 shadow-lg"
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
                ? activeTab === 'day'
                  ? '0%'
                  : activeTab === 'week'
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
              { id: 'day', label: 'Today' },
              { id: 'week', label: 'This Week' },
              { id: 'month', label: 'This Month' },
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
                {getCurrentRanking().map((song, index) => (
                  <motion.div
                    key={`${song.songId}-${index}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.1 + index * 0.1,
                      ease: 'easeOut',
                    }}
                    className="relative group"
                    onMouseEnter={() => setHoveredTrack(index)}
                    onMouseLeave={() => setHoveredTrack(null)}
                  >
                    <div
                      className={`
                        flex items-center gap-3 p-3 rounded-lg transition-all duration-300
                        ${hoveredTrack === index ? 'bg-white/10 transform scale-[1.02]' : 'hover:bg-white/5'}
                      `}
                      onClick={() => handlePlayMusic(song)}
                    >
                      <div className="w-6 text-center">
                        <span
                          className={`
                            text-sm font-bold transition-colors duration-300
                            ${hoveredTrack === index ? 'text-amber-500' : 'text-zinc-600'}
                          `}
                        >
                          {(index + 1).toString().padStart(2, '0')}
                        </span>
                      </div>

                      <div className="relative w-10 h-10 rounded-md overflow-hidden">
                        <img
                          src={song.songImage}
                          alt={song.songTitle}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/default-song-image.png';
                          }}
                        />
                        <div
                          className={`
                            absolute inset-0 bg-gradient-to-br from-amber-500/20 to-purple-500/20
                            transition-opacity duration-300
                            ${hoveredTrack === index ? 'opacity-100' : 'opacity-0'}
                          `}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white text-sm truncate">{song.songTitle}</h4>
                        <p className="text-xs text-amber-400/80 truncate">{song.songSinger}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div
                          className={`
                            p-2 rounded-full transition-all duration-300
                            ${hoveredTrack === index ? 'bg-amber-500' : 'bg-white/5'}
                          `}
                        >
                          <svg
                            className={`w-4 h-4 ${hoveredTrack === index ? 'text-white' : 'text-zinc-400'}`}
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
                        </div>
                      </div>

                      <div
                        className={`
                          absolute inset-0 bg-gradient-to-r from-amber-500/5 to-purple-500/5 rounded-lg
                          transition-opacity duration-300 pointer-events-none
                          ${hoveredTrack === index ? 'opacity-100' : 'opacity-0'}
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
