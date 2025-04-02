import React, { useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Play, Music, Filter, ChevronDown } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import apiClient from '../../services/dashboardapi';

interface Replay {
  replayId: number;
  songTitle: string;
  score: number;
  mode: string;
  videoPath: string;
  practiceDate: string;
}

interface Song {
  title: string;
  artist: string;
  duration: string;
  score: number;
  thumbnail: string;
  videoPath?: string;
  replayId?: number;
}

interface ApiResponse {
  replaysList: Replay[];
}

const AllSongsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 검색 및 필터링 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');

  // URL을 통해 전달받은 songs 배열이 있으면 사용하고, 없으면 API로 가져온 데이터 사용
  const preloadedSongs: Song[] = location.state?.songs || [];
  const shouldFetchData = preloadedSongs.length === 0;

  // API에서 모든 리플레이 데이터 가져오기
  const {
    data: apiData,
    isLoading,
    error,
  } = useQuery<ApiResponse>({
    queryKey: ['replays'],
    queryFn: async () => {
      const { data } = await apiClient.get('/replay');
      return data;
    },
    enabled: shouldFetchData, // preloadedSongs가 없을 때만 API 호출
  });

  // API 데이터를 Song 형식으로 변환
  const transformApiData = (data: ApiResponse): Song[] => {
    return data.replaysList.map((replay) => ({
      title: replay.songTitle || '제목 없음',
      artist: replay.mode === 'PRACTICE' ? '연습 모드' : '연주 모드',
      duration: formatDate(replay.practiceDate),
      score: replay.score,
      thumbnail: 'src/assets/노래.jpg', // 기본값, 필요시 변경
      videoPath: replay.videoPath,
      replayId: replay.replayId,
    }));
  };

  // 사용할 노래 데이터 결정
  const songs = shouldFetchData && apiData ? transformApiData(apiData) : preloadedSongs;

  // 날짜 포맷팅 함수
  function formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      console.error('Date parsing error:', e);
      return dateString;
    }
  }

  // 노래 필터링
  const filteredSongs = songs.filter((song) => {
    const title = song.title || '';
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMode =
      selectedMode === 'all' ||
      (selectedMode === 'practice' && song.artist === 'PRACTICE') ||
      (selectedMode === 'performance' && song.artist !== 'PRACTICE');
    return matchesSearch && matchesMode;
  });

  // 정렬
  const sortedSongs = [...filteredSongs].sort((a, b) => {
    if (sortBy === 'score') {
      return b.score - a.score;
    } else {
      // 날짜 기준 정렬 (최신순)
      return new Date(b.duration).getTime() - new Date(a.duration).getTime();
    }
  });

  // 애니메이션 변형 설정
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-white">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg text-amber-500 font-medium">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-white">
        <div className="p-8 bg-zinc-800/70 backdrop-blur-sm rounded-xl border border-white/10 shadow-xl text-center">
          <svg
            className="w-16 h-16 text-amber-500 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="text-xl font-bold mb-2">데이터를 불러오는 중 오류가 발생했습니다</h2>
          <p className="text-zinc-400">잠시 후 다시 시도해주세요.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b p-8 from-zinc-900 via-zinc-900 to-black text-white overflow-y-auto custom-scrollbar pb-20">
      <div className="max-w-7xl mx-auto">
        {/* 뒤로가기 버튼 및 헤더 */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 bg-zinc-800/50 rounded-full hover:bg-zinc-700 transition-colors"
          >
            <ArrowLeft size={20} className="text-amber-500" />
          </button>
          <div>
            <h1 className="text-3xl font-bold">모든 연주 기록</h1>
            <p className="text-zinc-400 mt-1">내가 연습하고 연주한 모든 노래들</p>
          </div>
        </div>

        {/* 검색 및 필터 영역 */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search size={18} className="text-zinc-400" />
            </div>
            <input
              type="text"
              placeholder="노래 제목 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-zinc-800/50 border border-white/5 rounded-xl focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all"
            />
          </div>

          <div className="flex gap-4">
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-3 bg-zinc-800/50 border border-white/5 rounded-xl hover:bg-zinc-700/70 transition-colors"
              >
                <Filter size={18} className="text-amber-500" />
                <span>
                  {selectedMode === 'all'
                    ? '모든 모드'
                    : selectedMode === 'practice'
                      ? '연습 모드'
                      : '연주 모드'}
                </span>
                <ChevronDown
                  size={18}
                  className={`text-zinc-400 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isFilterOpen && (
                <div className="absolute z-10 mt-2 w-48 bg-zinc-800 border border-white/10 rounded-xl shadow-xl overflow-hidden">
                  <div className="p-1">
                    <button
                      onClick={() => {
                        setSelectedMode('all');
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 rounded-lg ${selectedMode === 'all' ? 'bg-amber-500/20 text-amber-500' : 'hover:bg-zinc-700'}`}
                    >
                      모든 모드
                    </button>
                    <button
                      onClick={() => {
                        setSelectedMode('practice');
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 rounded-lg ${selectedMode === 'practice' ? 'bg-amber-500/20 text-amber-500' : 'hover:bg-zinc-700'}`}
                    >
                      연습 모드
                    </button>
                    <button
                      onClick={() => {
                        setSelectedMode('performance');
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 rounded-lg ${selectedMode === 'performance' ? 'bg-amber-500/20 text-amber-500' : 'hover:bg-zinc-700'}`}
                    >
                      연주 모드
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex rounded-xl overflow-hidden border border-white/5">
              <button
                onClick={() => setSortBy('date')}
                className={`px-4 py-3 transition-colors ${sortBy === 'date' ? 'bg-amber-500 text-white' : 'bg-zinc-800/50 hover:bg-zinc-700/70'}`}
              >
                최신순
              </button>
              <button
                onClick={() => setSortBy('score')}
                className={`px-4 py-3 transition-colors ${sortBy === 'score' ? 'bg-amber-500 text-white' : 'bg-zinc-800/50 hover:bg-zinc-700/70'}`}
              >
                점수순
              </button>
            </div>
          </div>
        </div>

        {/* 결과 표시 */}
        <p className="text-zinc-400 mb-6">
          총 <span className="text-amber-500 font-medium">{sortedSongs.length}</span>개의 연주 기록
        </p>

        {/* 노래 카드 그리드 */}
        {sortedSongs.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {sortedSongs.map((song, index) => (
              <motion.div
                key={`${song.title}-${index}`}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-zinc-800/70 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden hover:border-amber-500/30 transition-all duration-300 shadow-xl group"
              >
                <div
                  onClick={() =>
                    navigate(`/video-stream/${song.replayId || index}`, {
                      state: { song, videoUrl: song.videoPath },
                    })
                  }
                  className="cursor-pointer"
                >
                  {/* 앨범 커버 */}
                  <div className="relative w-full h-44 overflow-hidden">
                    <img
                      src={song.thumbnail}
                      alt="앨범 커버"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            song.artist === '연습 모드'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-blue-500/20 text-blue-400'
                          }`}
                        >
                          {song.artist}
                        </span>
                        <span className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-xs font-medium">
                          {song.score}점
                        </span>
                      </div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                      <div className="p-3 bg-amber-500 rounded-full">
                        <Play fill="white" size={20} className="text-white ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* 노래 정보 */}
                  <div className="p-4">
                    <h3 className="text-white font-bold text-lg group-hover:text-amber-500 transition-colors line-clamp-1">
                      {song.title}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-zinc-400 text-sm flex items-center gap-1">
                        <Music size={14} />
                        {song.duration}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
            <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
            <p className="text-xl mb-2">연주 기록이 없습니다</p>
            <p className="text-sm text-zinc-600 mb-6">
              연습 모드나 연주 모드에서 기록을 만들어보세요
            </p>
            <Link
              to="/dashboard"
              className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
            >
              대시보드로 돌아가기
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllSongsPage;
