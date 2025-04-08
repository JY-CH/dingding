import React, { useState, useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';

import HotContent from '@/components/search/HotContent';
import SearchBar from '@/components/search/SearchBar';
import SearchResults from '@/components/search/SearchResults';
import SearchTabs from '@/components/search/SearchTabs';
import { SearchSong, SearchCommunityPost } from '@/types/index';

import { _axiosAuth } from '../services/JYapi';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState<string>(searchParams.get('q') || '');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [key, setKey] = useState<number>(0); // 컴포넌트 강제 리렌더링을 위한 키

  // URL에서 직접 검색어를 사용 (중간 상태 변수 제거)
  const searchQuery = searchParams.get('q') || '';

  // 디버깅용
  console.log('현재 검색어:', searchQuery);

  // useEffect 단순화: 값이 다를 때만 업데이트
  useEffect(() => {
    if (searchQuery !== query) {
      setQuery(searchQuery);
    }
  }, [searchQuery, query]);

  // 게시물 검색 쿼리
  const { data: searchCommunity = [] } = useQuery<SearchCommunityPost[], Error>({
    queryKey: ['articles', searchQuery],
    queryFn: async () => {
      const { data } = await _axiosAuth.get<SearchCommunityPost[]>('/article/search', {
        params: { keyword: searchQuery },
      });
      return data; // ✅ 배열 반환 보장
    },
    staleTime: 1000 * 60,
    enabled: !!searchQuery || !!query,
  });

  // 노래 검색 쿼리
  const { data: searchSongs = [] } = useQuery<SearchSong[], Error>({
    queryKey: ['songs', searchQuery],
    queryFn: async () => {
      const { data } = await _axiosAuth.get<SearchSong[]>('/song/search', {
        params: { keyword: searchQuery },
      });
      return data; // ✅ 배열 반환 보장
    },
    staleTime: 1000 * 60,
    enabled: !!searchQuery || !!query,
  });

  // 검색 초기화 함수
  const resetSearch = () => {
    setQuery(''); // 검색어 초기화
    setSearchParams({}); // URL 파라미터 초기화
    setActiveTab('all'); // 탭 초기화
    setKey((prevKey) => prevKey + 1); // 컴포넌트 강제 리렌더링
  };

  return (
    <div
      key={key}
      className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900/95 to-black overflow-y-auto custom-scrollbar p-8"
    >
      {/* 배경 효과 */}
      <div className="fixed -top-40 -right-40 w-96 h-96 bg-amber-500/10 blur-3xl rounded-full pointer-events-none z-0"></div>
      <div className="fixed -bottom-20 -left-20 w-80 h-80 bg-zinc-600/10 blur-3xl rounded-full pointer-events-none z-0"></div>
      <div className="relative z-5 max-w-7xl mx-auto space-y-8">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex flex-row justify-between gap-10 items-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              {searchQuery ? `"${searchQuery}" 검색 결과` : '탐색하기'}
            </h1>
            {searchQuery && (
              <button
                onClick={resetSearch}
                className="text-white bg-amber-500 hover:bg-amber-500/30 rounded-full px-4 py-2 text-sm font-medium transition-colors"
              >
                검색창으로
              </button>
            )}
          </div>
          <p className="text-zinc-400">
            {searchQuery
              ? '마음에 드는 노래, 코드 또는 커뮤니티 게시글을 찾아보세요'
              : '새로운 음악을 발견하고 다른 기타리스트들과 연결하세요'}
          </p>
        </motion.div>

        {/* 검색바 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <SearchBar query={query} setQuery={setQuery} className="max-w-3xl mx-auto" />
        </motion.div>

        {/* 탭 메뉴 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-zinc-800/50 backdrop-blur-md rounded-xl border border-white/5 shadow-lg mb-6 sticky top-2 z-20"
        >
          <SearchTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </motion.div>

        {/* 검색 결과 또는 인기 콘텐츠 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-zinc-800/30 backdrop-blur-sm rounded-xl border border-white/5 shadow-xl overflow-hidden"
        >
          {searchQuery ? (
            <SearchResults
              activeTab={activeTab}
              searchCommunity={searchCommunity}
              searchSongs={searchSongs}
            />
          ) : (
            <HotContent activeTab={activeTab} />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SearchPage;
