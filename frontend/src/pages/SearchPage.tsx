import React, { useState, useEffect } from 'react';

import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';

import HotContent from '@/components/search/HotContent';
import SearchBar from '@/components/search/SearchBar';
import SearchResults from '@/components/search/SearchResults';
import SearchTabs from '@/components/search/SearchTabs';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState<string>(searchParams.get('q') || '');
  const [activeTab, setActiveTab] = useState<string>('all');

  // URL의 query 파라미터가 변경될 때만 검색어 상태 업데이트
  useEffect(() => {
    const searchQuery = searchParams.get('q');
    if (searchQuery) {
      setQuery(searchQuery);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900/95 to-black overflow-y-auto custom-scrollbar">
      {/* 배경 효과 */}
      <div className="fixed -top-40 -right-40 w-96 h-96 bg-amber-500/10 blur-3xl rounded-full pointer-events-none z-0"></div>
      <div className="fixed -bottom-20 -left-20 w-80 h-80 bg-zinc-600/10 blur-3xl rounded-full pointer-events-none z-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto p-8">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            {query ? `"${query}" 검색 결과` : '탐색하기'}
          </h1>
          <p className="text-zinc-400">
            {query
              ? '마음에 드는 노래, 아티스트, 또는 커뮤니티 게시글을 찾아보세요'
              : '새로운 음악을 발견하고 다른 기타리스트들과 연결하세요'}
          </p>
        </motion.div>

        {/* 검색바 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-6"
        >
          <SearchBar query={query} setQuery={setQuery} className="max-w-3xl mx-auto" />
        </motion.div>

        {/* 탭 메뉴 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-zinc-800/50 backdrop-blur-md rounded-xl border border-white/5 shadow-lg mb-6 sticky top-2 z-20"
        >
          <SearchTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </motion.div>

        {/* 검색 결과 또는 인기 콘텐츠 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-zinc-800/30 backdrop-blur-sm rounded-xl border border-white/5 shadow-xl overflow-hidden"
        >
          {searchParams.get('q') ? ( // URL의 query 파라미터 기준으로 검색 결과 표시
            <SearchResults activeTab={activeTab} />
          ) : (
            <HotContent activeTab={activeTab} />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SearchPage;
