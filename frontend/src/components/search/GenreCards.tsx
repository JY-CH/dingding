import React from 'react';

import { BookHeadphones } from 'lucide-react';

const genreCards = [
  { id: 1, name: 'Pop', color: 'from-purple-400 to-pink-500', songs: 30 },
  { id: 2, name: 'Rock', color: 'from-blue-400 to-indigo-500', songs: 25 },
  // 다른 장르 카드들
];

const GenreCards: React.FC = () => {
  return (
    <div className="px-6 py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookHeadphones className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-bold text-white">장르 탐색</h3>
        </div>
        <button className="text-sm text-orange-500">모두 보기</button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {genreCards.map((genre) => (
          <div
            key={genre.id}
            className={`bg-gradient-to-br ${genre.color} rounded-xl p-5 aspect-square flex flex-col justify-between cursor-pointer transform transition hover:scale-105`}
          >
            <div className="text-lg font-bold text-white">{genre.name}</div>
            <div className="text-sm text-white/80">곡 {genre.songs}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GenreCards;
