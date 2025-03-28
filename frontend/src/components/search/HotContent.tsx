import React from 'react';

import { motion } from 'framer-motion';
import { BookHeadphones } from 'lucide-react';

import GenreCards from './GenreCards';
import HotSongs from './HotSongs';
import PopularPosts from './PopularPosts';
import RecentReleases from './RecentReleases';

interface Song {
  id: number;
  title: string;
  artist: string;
  thumbnail: string;
  plays?: string;
  duration?: string;
}

interface Post {
  id: number;
  title: string;
  excerpt: string;
  thumbnail: string;
  author?: string;
  date?: string;
  likes?: number;
}

interface HotContentsProps {
  activeTab: string;
}

const HotContent: React.FC<HotContentsProps> = ({ activeTab }) => {
  const trendingSongs: Song[] = [
    {
      id: 1,
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      thumbnail: 'src/assets/노래.jpg',
      plays: '254만',
      duration: '3:22',
    },
    {
      id: 2,
      title: 'Hype Boy',
      artist: 'NewJeans',
      thumbnail: 'src/assets/노래.jpg',
      plays: '198만',
      duration: '2:59',
    },
    {
      id: 3,
      title: 'Seven (feat. Latto)',
      artist: 'Jung Kook',
      thumbnail: 'src/assets/노래.jpg',
      plays: '325만',
      duration: '3:04',
    },
    {
      id: 4,
      title: 'Cupid',
      artist: 'FIFTY FIFTY',
      thumbnail: 'src/assets/노래.jpg',
      plays: '165만',
      duration: '2:54',
    },
    {
      id: 5,
      title: 'Smoke',
      artist: 'Dynamic Duo',
      thumbnail: 'src/assets/노래.jpg',
      plays: '78만',
      duration: '3:47',
    },
  ];

  const recentReleases: Song[] = [
    {
      id: 1,
      title: '새로운 시작',
      artist: '인기 아티스트',
      thumbnail: 'src/assets/노래.jpg',
      plays: '89만',
      duration: '3:15',
    },
    {
      id: 2,
      title: '봄날의 꿈',
      artist: '라이징 스타',
      thumbnail: 'src/assets/노래.jpg',
      plays: '42만',
      duration: '4:01',
    },
    {
      id: 3,
      title: '별이 빛나는 밤',
      artist: '인디 밴드',
      thumbnail: 'src/assets/노래.jpg',
      plays: '21만',
      duration: '3:33',
    },
  ];

  const popularPosts: Post[] = [
    {
      id: 1,
      title: '요즘 뜨는 노래 추천',
      excerpt:
        '최근에 힘든 일이 있어서 위로가 되는 노래를 찾고 있어요. 여러분의 추천 부탁드립니다.',
      thumbnail: 'src/assets/노래.jpg',
      author: '음악덕후',
      date: '오늘',
      likes: 324,
    },
    {
      id: 2,
      title: '이 가수 알고 계신가요?',
      excerpt: '요즘 인디신에서 떠오르는 신예 가수를 소개합니다. 정말 목소리가 매력적이에요!',
      thumbnail: 'src/assets/노래.jpg',
      author: '인디마니아',
      date: '어제',
      likes: 156,
    },
    {
      id: 3,
      title: '음악 추천 부탁드립니다',
      excerpt:
        '편안한 분위기의 재즈 음악을 찾고 있어요. 공부할 때 집중하기 좋은 음악 추천해주세요.',
      thumbnail: 'src/assets/노래.jpg',
      author: '재즈러버',
      date: '3일 전',
      likes: 98,
    },
  ];

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

  return (
    <div className="bg-zinc-900 min-h-screen pb-20">
      {activeTab === 'all' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GenreCards genres={genreCards} />
        </motion.div>
      )}

      {(activeTab === 'all' || activeTab === 'albums') && (
        <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 트렌딩 노래 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <HotSongs songs={trendingSongs} />
          </motion.div>

          {/* 최신 발매 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <RecentReleases releases={recentReleases} />
          </motion.div>
        </div>
      )}

      {(activeTab === 'all' || activeTab === 'community') && (
        <motion.div
          className="px-6 py-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <PopularPosts posts={popularPosts} />
        </motion.div>
      )}
    </div>
  );
};

export default HotContent;
