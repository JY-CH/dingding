import React, { useState } from 'react';
import { Song } from '../../types';
import { mockTopSongs } from '../../data/mockData';

interface TopSongSectionProps {
  onPlaySong: (song: Song) => void;
}

const TopSongSection: React.FC<TopSongSectionProps> = ({ onPlaySong }) => {
  const [hoveredSong, setHoveredSong] = useState<string | null>(null);

  return (
    <div className="relative">
      {/* 헤더 영역 */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-white">추천 음악</h2>
          <p className="text-zinc-400 text-sm mt-1">취향에 맞는 음악을 발견해보세요</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* 곡 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {mockTopSongs.slice(0, 6).map((song) => (
          <div 
            key={song.id} 
            className="group cursor-pointer"
            onMouseEnter={() => setHoveredSong(song.id)}
            onMouseLeave={() => setHoveredSong(null)}
          >
            <div className={`
              relative rounded-lg overflow-hidden aspect-[4/3]
              transition-transform duration-300
              ${hoveredSong === song.id ? 'transform scale-[1.02]' : ''}
            `}>
              {/* 앨범 커버 */}
              <img 
                src={song.cover} 
                alt={song.title} 
                className="w-full h-full object-cover"
              />
              
              {/* 오버레이 */}
              <div className={`
                absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent
                transition-opacity duration-300
                ${hoveredSong === song.id ? 'opacity-100' : 'opacity-0'}
              `} />

              {/* 재생 버튼 */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onPlaySong(song);
                }}
                className={`
                  absolute bottom-3 right-3 p-2.5 rounded-full
                  bg-amber-500 text-white shadow-lg
                  transition-all duration-300 transform
                  ${hoveredSong === song.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
                `}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" 
                  />
                </svg>
              </button>

              {/* 더보기 화살표 */}
              <div className={`
                absolute top-1/2 right-3 -translate-y-1/2
                transition-all duration-300
                ${hoveredSong === song.id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}
              `}>
                <svg className="w-6 h-6 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* 곡 정보 */}
            <div className="mt-3">
              <h3 className="font-medium text-white text-sm truncate">{song.title}</h3>
              <p className="text-amber-400/80 text-xs truncate mt-0.5">{song.artist}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopSongSection; 