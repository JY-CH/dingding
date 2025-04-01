import React, { useState, useEffect, Suspense, lazy } from 'react';

import { motion, LazyMotion, domAnimation } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';

import SearchBar from '@/components/search/SearchBar';
import SearchTabs from '@/components/search/SearchTabs';

// Lazy load 적용
const HotContent = lazy(() => import('@/components/search/HotContent'));
const SearchResults = lazy(() => import('@/components/search/SearchResults'));

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState<string>(searchParams.get('q') || '');
  const [activeTab, setActiveTab] = useState<string>('all');

  useEffect(() => {
    const searchQuery = searchParams.get('q');
    if (searchQuery) {
      setQuery(searchQuery);
    }
  }, [searchParams]);

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900/95 to-black overflow-y-auto custom-scrollbar p-8 ">
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
          <Suspense fallback={<div className="text-white text-center py-10">로딩 중...</div>}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.3 }}
              className="bg-zinc-800/30 backdrop-blur-sm rounded-xl border border-white/5 shadow-xl overflow-hidden"
            >
              {query ? (
                <SearchResults activeTab={activeTab} />
              ) : (
                <HotContent activeTab={activeTab} />
              )}
            </motion.div>
          </Suspense>
        </div>
      </div>
    </LazyMotion>
  );
};

export default SearchPage;
