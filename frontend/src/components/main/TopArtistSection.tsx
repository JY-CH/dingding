import { useState } from 'react';

import { motion } from 'framer-motion';

import { mockArtists } from '../../data/mockData';

const TopArtistSection = () => {
  const [hoveredArtist, setHoveredArtist] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.1 }}
      className="bg-white/5 backdrop-blur-md rounded-xl p-6 mt-6 shadow-lg"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
            인기 아티스트
          </h2>
          <p className="text-zinc-400 text-xs mt-1">이번 주 가장 인기있는 아티스트</p>
        </div>
      </div>

      <div className="space-y-4">
        {mockArtists.slice(0, 5).map((artist, index) => (
          <motion.div
            key={artist.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 + index * 0.1 }}
            className="relative group"
            onMouseEnter={() => setHoveredArtist(artist.id)}
            onMouseLeave={() => setHoveredArtist(null)}
          >
            <div
              className={`
              flex items-center gap-4 p-3 rounded-xl transition-all duration-300
              ${
                hoveredArtist === artist.id
                  ? 'bg-white/10 transform scale-[1.02]'
                  : 'hover:bg-white/5'
              }
            `}
            >
              {/* 순위 표시 */}
              <div className="w-6 text-center">
                <span
                  className={`
                  text-sm font-bold transition-colors duration-300
                  ${hoveredArtist === artist.id ? 'text-amber-500' : 'text-zinc-600'}
                `}
                >
                  {(index + 1).toString().padStart(2, '0')}
                </span>
              </div>

              {/* 프로필 이미지 */}
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <div
                  className={`
                  absolute inset-0 bg-gradient-to-br from-amber-500/20 to-purple-500/20
                  transition-opacity duration-300
                  ${hoveredArtist === artist.id ? 'opacity-100' : 'opacity-0'}
                `}
                />
                <img
                  src={artist.image}
                  alt={artist.name}
                  className={`
                    w-full h-full object-cover transition-transform duration-500
                    ${hoveredArtist === artist.id ? 'scale-110' : 'scale-100'}
                  `}
                />
              </div>

              {/* 아티스트 정보 */}
              <div className="flex-1">
                <h3 className="font-medium text-white text-sm">{artist.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-zinc-400">
                    {artist.followers.toLocaleString()} 팔로워
                  </span>
                  <span className="w-1 h-1 bg-zinc-700 rounded-full" />
                  <span className="text-xs text-zinc-400">{artist.genres[0]}</span>
                </div>
              </div>

              {/* 팔로우 버튼 */}
              <button
                className={`
                px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300
                ${
                  hoveredArtist === artist.id
                    ? 'bg-amber-500 text-white'
                    : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                }
              `}
              >
                팔로우
              </button>

              {/* 배경 효과 */}
              <div
                className={`
                absolute inset-0 bg-gradient-to-r from-amber-500/5 to-purple-500/5 rounded-xl
                transition-opacity duration-300 pointer-events-none
                ${hoveredArtist === artist.id ? 'opacity-100' : 'opacity-0'}
              `}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default TopArtistSection;
