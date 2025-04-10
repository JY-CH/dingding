import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Song } from '../../types/performance';

interface ExploreSectionProps {
  onUpdatePlaylist: (songs: Song[]) => void;
}

const ExploreSection: React.FC<ExploreSectionProps> = ({ onUpdatePlaylist }) => {
  const navigate = useNavigate();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const categories = [
    {
      name: 'Pop',
      korName: '팝',
      icon: '🎵',
      gradient: 'from-amber-400/40 via-orange-500/40 to-rose-600/40',
      glowColor: 'amber-500',
      count: 230,
      description: '현대적인 팝 기타 스타일',
      popularTags: ['코드진행', '스트러밍', '리듬'],
      activeUsers: 1420,
    },
    {
      name: 'Acoustic',
      korName: '어쿠스틱',
      icon: '🪕',
      gradient: 'from-violet-400/40 via-purple-500/40 to-indigo-600/40',
      glowColor: 'violet-500',
      count: 185,
      description: '감성적인 어쿠스틱 기타 연주',
      popularTags: ['핑거스타일', '스트러밍', '발라드'],
      activeUsers: 890,
    },
    {
      name: 'Folk',
      korName: '포크',
      icon: '🌿',
      gradient: 'from-sky-400/40 via-blue-500/40 to-cyan-600/40',
      glowColor: 'sky-500',
      count: 142,
      description: '따뜻한 포크 기타 사운드',
      popularTags: ['포크송', '핑거피킹', '하모니'],
      activeUsers: 650,
    },
    {
      name: 'Country',
      korName: '컨트리',
      icon: '🤠',
      gradient: 'from-emerald-400/40 via-teal-500/40 to-green-600/40',
      glowColor: 'emerald-500',
      count: 167,
      description: '정통 컨트리 기타 스타일',
      popularTags: ['컨트리', '피킹', '블루스'],
      activeUsers: 980,
    },
  ];

  const handleCategoryClick = (category: string) => {
    // TODO: API 연동 시 실제 카테고리별 곡 목록을 가져오는 로직으로 변경
    const mockSongs: Song[] = [
      {
        id: 1,
        songId: 1,
        title: `${category} Song 1`,
        artist: "Artist 1",
        difficulty: "easy",
        duration: "3:00",
        thumbnail: "/path/to/cover1.jpg",
        notes: [],
        bpm: 120,
        songTitle: `${category} Song 1`,
        songImage: "/path/to/cover1.jpg",
        songWriter: "Artist 1",
        songSinger: "Artist 1",
        songVoiceFileUrl: "",
        releaseDate: "2023-01-01",
        category: category,
        songDuration: "3:00"
      },
      {
        id: 2,
        songId: 2,
        title: `${category} Song 2`,
        artist: "Artist 2",
        difficulty: "medium",
        duration: "3:30",
        thumbnail: "/path/to/cover2.jpg",
        notes: [],
        bpm: 130,
        songTitle: `${category} Song 2`,
        songImage: "/path/to/cover2.jpg",
        songWriter: "Artist 2",
        songSinger: "Artist 2",
        songVoiceFileUrl: "",
        releaseDate: "2023-01-02",
        category: category,
        songDuration: "3:30"
      }
    ];

    onUpdatePlaylist(mockSongs);
    navigate('/performance');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-8"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
          Guitar Styles
        </h2>
        <p className="text-zinc-400 text-sm mt-2">나만의 기타 스타일을 찾아보세요</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="relative group"
            onMouseEnter={() => setHoveredCategory(category.name)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <div
              className={`
              relative overflow-hidden rounded-2xl transition-all duration-500
              backdrop-blur-sm bg-white/5
              ${hoveredCategory === category.name ? 'scale-[1.02] shadow-2xl shadow-${category.glowColor}/20' : 'shadow-lg'}
            `}
            >
              {/* 배경 그라디언트 */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${category.gradient} backdrop-blur-md`}
              />

              {/* 호버 시 나타나는 물결 효과 */}
              <div
                className={`
                absolute inset-0 bg-gradient-to-br ${category.gradient}
                transition-transform duration-1500 ease-in-out
                ${hoveredCategory === category.name ? 'scale-150 opacity-40' : 'scale-100 opacity-0'}
              `}
              />

              {/* 반투명 보더 효과 */}
              <div className="absolute inset-0 rounded-2xl border border-white/10" />

              {/* 메인 콘텐츠 */}
              <div className="relative p-6 h-full">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-4xl filter drop-shadow-lg">{category.icon}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-md">
                      {category.korName}
                    </h3>
                    <p className="text-white/80 text-sm leading-relaxed">{category.description}</p>
                  </div>
                </div>

                {/* 태그 영역 */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {category.popularTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white/90 text-xs transition-colors duration-300 hover:bg-white/10"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* 하단 통계 */}
                <div className="mt-6">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-white/70">
                      {category.activeUsers.toLocaleString()}명이 연주중
                    </span>
                    <span className="text-white/70">{category.count}+ 곡</span>
                  </div>
                </div>

                {/* 호버 시 나타나는 시작 버튼 */}
                <div
                  className={`
                  absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                  transition-all duration-300
                  ${hoveredCategory === category.name ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
                `}
                >
                  <button 
                    onClick={() => handleCategoryClick(category.name)}
                    className="px-6 py-3 rounded-full bg-white/90 backdrop-blur-sm text-gray-900 font-bold shadow-xl hover:bg-white transition-colors"
                  >
                    시작하기
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ExploreSection;
