import React from 'react';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { BookHeadphones, Disc, TrendingUp } from 'lucide-react';

import { _axiosAuth } from '@/services/JYapi';
import { SearchSong, CommunityPost } from '@/types/index';

import GenreCards from './GenreCards';
import HotSongs from './HotSongs';
import PopularPosts from './PopularPosts';
import RecentReleases from './RecentReleases';

interface HotContentsProps {
  activeTab: string;
}

// 애니메이션 설정
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
  },
};
const genreCards = [
  {
    id: 1,
    name: '어쿠스틱',
    description: '감성적인 어쿠스틱 기타 연주',
    tags: ['핑거스타일', '스트링', '발라드'],
    color: 'from-purple-500 to-indigo-500',
    icon: <BookHeadphones />,
    songs: '230+',
  },
  {
    id: 2,
    name: '일렉트릭',
    description: '파워풀한 일렉트릭 기타 사운드',
    tags: ['리프', '솔로', '디스토션'],
    color: 'from-pink-500 to-purple-600',
    icon: <BookHeadphones />,
    songs: '185+',
  },
  {
    id: 3,
    name: '클래식',
    description: '우아한 클래식 기타의 세계',
    tags: ['아르페지오', '클래식', '바로크'],
    color: 'from-green-500 to-teal-500',
    icon: <BookHeadphones />,
    songs: '142+',
  },
  {
    id: 4,
    name: '핑거스타일',
    description: '섬세한 핑거스타일 테크닉',
    tags: ['핑거피킹', '하모닉스', '어쿠스틱'],
    color: 'from-orange-500 to-amber-500',
    icon: <BookHeadphones />,
    songs: '167+',
  },
];

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const HotContent: React.FC<HotContentsProps> = ({ activeTab }) => {
  // 일단 해당페이지 오면 조회
  const { data: songsList = [] } = useQuery<SearchSong[], Error>({
    queryKey: ['songs'],
    queryFn: async () => {
      const { data } = await _axiosAuth.get<SearchSong[]>('/song');
      return data; // ✅ 배열 반환 보장
    },
    staleTime: 1000 * 60,
  });

  //  인기 게시물 쿼리
  const { data: popularPosts = [] } = useQuery<CommunityPost[]>({
    queryKey: ['popularPostsArticles'],
    queryFn: async () => {
      const { data } = await _axiosAuth.get<CommunityPost[]>('/article');
      console.log(data);
      return data; // ✅ 배열 반환 보장
    },
    staleTime: 1000 * 60,
  });

  return (
    <motion.div
      className="bg-zinc-900 min-h-screen pb-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {activeTab === 'all' && (
        <motion.div variants={itemVariants}>
          <GenreCards genres={genreCards} />
        </motion.div>
      )}

      {(activeTab === 'all' || activeTab === 'albums') && (
        <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 트렌딩 노래 */}
          <motion.div
            variants={itemVariants}
            className="bg-zinc-800/30 backdrop-blur-sm rounded-xl border border-white/5 p-5 hover:shadow-lg hover:shadow-amber-500/5 transition-all"
          >
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              <h3 className="text-xl font-bold text-white">인기 노래</h3>
            </div>
            <HotSongs songs={songsList} />
          </motion.div>

          {/* 최신 발매 */}
          <motion.div
            variants={itemVariants}
            className="bg-zinc-800/30 backdrop-blur-sm rounded-xl border border-white/5 p-5 hover:shadow-lg hover:shadow-amber-500/5 transition-all"
          >
            <div className="flex items-center gap-2 mb-5">
              <Disc className="w-5 h-5 text-amber-500" />
              <h3 className="text-xl font-bold text-white">최신 발매</h3>
            </div>
            <RecentReleases releases={songsList} />
          </motion.div>
        </div>
      )}

      {(activeTab === 'all' || activeTab === 'community') && (
        <motion.div variants={itemVariants} className="px-6 py-6">
          <div className="bg-zinc-800/30 backdrop-blur-sm rounded-xl border border-white/5 p-5 hover:shadow-lg hover:shadow-amber-500/5 transition-all">
            <PopularPosts posts={popularPosts} />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default HotContent;
