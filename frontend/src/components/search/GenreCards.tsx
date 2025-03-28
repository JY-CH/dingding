import React from 'react';
import { motion } from 'framer-motion';
import { BookHeadphones } from 'lucide-react';

interface GenreCard {
  id: number;
  name: string;
  description: string; // 장르 설명 추가
  tags: string[]; // 태그 추가
  color: string; // 배경 색상
  icon?: React.ReactNode; // 아이콘 추가
  songs: string; // 곡 수
}

interface GenreCardsProps {
  genres: GenreCard[];
}

const GenreCards: React.FC<GenreCardsProps> = ({ genres }) => {
  return (
    <div className="px-6 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between mb-4"
      >
        <div className="flex items-center gap-2">
          <BookHeadphones className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-bold text-white">장르 탐색</h3>
        </div>
        <button className="text-sm text-amber-500 hover:underline">모두 보기</button>
      </motion.div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {genres.map((genre, index) => (
          <motion.div
            key={genre.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className={`relative rounded-xl p-5 flex flex-col justify-between cursor-pointer transform transition hover:scale-105 shadow-lg bg-gradient-to-br ${genre.color}`}
          >
            {/* 아이콘 */}
            {genre.icon && <div className="text-4xl text-white mb-4">{genre.icon}</div>}
            {/* 장르 이름 */}
            <div className="text-xl font-bold text-white mb-2">{genre.name}</div>
            {/* 장르 설명 */}
            <div className="text-sm text-gray-300 mb-4">{genre.description}</div>
            {/* 태그 */}
            <div className="flex flex-wrap gap-2">
              {genre.tags.map((tag, index) => (
                <span key={index} className="text-xs bg-white/10 text-white px-2 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
            {/* 곡 수 */}
            <div className="text-sm text-white mt-4">{genre.songs} 곡</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GenreCards;
