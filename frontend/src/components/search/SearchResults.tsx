import React from 'react';

import { motion } from 'framer-motion';
import { Music, Filter } from 'lucide-react';

import RelatedPosts from './RelatedPosts';
import RelatedSongs from './RelatedSongs';
import { SearchSong, SearchCommunityPost } from '../../types';

interface SearchResultsProps {
  activeTab: string;
  searchCommunity: SearchCommunityPost[];
  searchSongs: SearchSong[];
  isGenreSearch?: boolean;
  genreName?: string;
}

// 더미 데이터 예시 (실제 API 또는 상위 컴포넌트에서 받아오도록 변경 가능)

// 애니메이션 설정
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
    },
  },
};

const SearchResults: React.FC<SearchResultsProps> = ({
  activeTab,
  searchCommunity,
  searchSongs,
  isGenreSearch = false,
  genreName = '',
}) => {
  console.log(searchCommunity, 'asdasdsad');
  console.log(searchSongs);

  // 장르별 색상 매핑
  const getGenreColor = (genre: string): string => {
    const genreColors: Record<string, string> = {
      '어쿠스틱': 'from-purple-500 to-indigo-500',
      '일렉트릭': 'from-pink-500 to-purple-600',
      '클래식': 'from-green-500 to-teal-500',
      '핑거스타일': 'from-orange-500 to-amber-500',
    };
    return genreColors[genre] || 'from-amber-500 to-amber-600';
  };

  // 장르 검색 시 결과 헤더 표시
  const GenreResultsHeader = () => {
    if (!isGenreSearch || !genreName) return null;
    
    return (
      <motion.div 
        variants={itemVariants}
        className={`bg-gradient-to-r ${getGenreColor(genreName)} p-4 rounded-lg mb-6`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-full">
            <Music className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{genreName} 장르 검색 결과</h3>
            <p className="text-white/80 text-sm">이 장르의 인기 곡들을 확인해보세요</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full flex items-center gap-1">
            <Filter className="w-3 h-3" /> 추천순
          </span>
          <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">최신순</span>
          <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">
            {genreName === '어쿠스틱' && '스트러밍'}
            {genreName === '일렉트릭' && '리프'}
            {genreName === '클래식' && '아르페지오'}
            {genreName === '핑거스타일' && '핑거피킹'}
          </span>
        </div>
      </motion.div>
    );
  };

  // activeTab에 따라 표시할 콘텐츠를 전환합니다.
  if (activeTab === 'all') {
    return (
      <motion.div
        className="p-6 space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {isGenreSearch && <GenreResultsHeader />}
        <motion.div variants={itemVariants}>
          <RelatedSongs songs={searchSongs} />
        </motion.div>
        {!isGenreSearch && (
          <motion.div variants={itemVariants}>
            <RelatedPosts posts={searchCommunity} />
          </motion.div>
        )}
      </motion.div>
    );
  } else if (activeTab === 'albums') {
    return (
      <motion.div className="p-6" variants={containerVariants} initial="hidden" animate="visible">
        {isGenreSearch && <GenreResultsHeader />}
        <motion.div variants={itemVariants}>
          <RelatedSongs songs={searchSongs} />
        </motion.div>
      </motion.div>
    );
  } else if (activeTab === 'community') {
    return (
      <motion.div className="p-6" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants}>
          <RelatedPosts posts={searchCommunity} />
        </motion.div>
      </motion.div>
    );
  } else if (activeTab === 'artists') {
    return (
      <motion.div
        className="p-6 flex items-center justify-center h-64"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="p-6 bg-zinc-800/50 rounded-xl backdrop-blur-sm border border-white/5"
        >
          <p className="text-zinc-300 text-center">관련 데이터가 없습니다.</p>
        </motion.div>
      </motion.div>
    );
  }

  return null;
};

export default SearchResults;
