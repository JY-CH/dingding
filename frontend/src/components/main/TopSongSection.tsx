import React, { useState, useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

import { fetchRecommendSongs } from '../../services/api';
import { RecommendSong } from '../../types/performance';

interface TopSongSectionProps {
  onPlaySong: (song: any) => void;
}

const TopSongSection: React.FC<TopSongSectionProps> = ({ onPlaySong }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 2;

  const { data: recommendSongs = [] } = useQuery({
    queryKey: ['recommendSongs'],
    queryFn: fetchRecommendSongs,
  });

  const pageContent = [
    {
      title: "주목할 최신곡",
      description: "지금 가장 주목받는 신곡을 만나보세요",
      songs: recommendSongs
        .filter(song => song.category === 'NEW SONG')
        .map(song => ({
          id: song.song.songId,
          title: song.song.songTitle,
          artist: song.song.songSinger,
          thumbnail: song.song.songImage,
          duration: song.song.songDuration,
          difficulty: 'medium' as 'medium',
          notes: [],
          bpm: 120,
          songVoiceFileUrl: song.song.songVoiceFileUrl
        }))
    },
    {
      title: "봄 노래 추천",
      description: "따스한 봄날에 어울리는 음악을 들려드립니다",
      songs: recommendSongs
        .filter(song => song.category === 'SPRING')
        .map(song => ({
          id: song.song.songId,
          title: song.song.songTitle,
          artist: song.song.songSinger,
          thumbnail: song.song.songImage,
          duration: song.song.songDuration,
          difficulty: 'medium' as 'medium',
          notes: [],
          bpm: 120,
          songVoiceFileUrl: song.song.songVoiceFileUrl
        }))
    }
  ];

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  const getCurrentPageItems = () => {
    return pageContent[currentPage]?.songs || [];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="h-[680px]"
    >
      <div className="mb-6 flex justify-between items-center">
        <div>
          <motion.h2
            key={`title-${currentPage}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-3xl font-bold bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent"
          >
            {pageContent[currentPage]?.title}
          </motion.h2>
          <motion.p
            key={`desc-${currentPage}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-zinc-400 text-sm mt-2"
          >
            {pageContent[currentPage]?.description}
          </motion.p>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={handlePrevPage}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors group"
          >
            <svg
              className="w-5 h-5 text-white/60 group-hover:text-white transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button 
            onClick={handleNextPage}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors group"
          >
            <svg
              className="w-5 h-5 text-white/60 group-hover:text-white transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 5l7 7-7 7" 
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 h-[570px]">
        {getCurrentPageItems().length > 0 ? (
          getCurrentPageItems().map((song, index) => (
            <motion.div
              key={`${song.id}-${currentPage}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="group cursor-pointer h-[180px]"
              onClick={() => onPlaySong(song)}
            >
              <div className="h-[200px] rounded-lg overflow-hidden relative mb-1">
                <img
                  src={song.thumbnail}
                  alt={song.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/default-song-image.png';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                  <button className="w-8 h-8 flex items-center justify-center bg-amber-500 rounded-full text-white">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <h3 className="font-medium text-white text-sm truncate">{song.title}</h3>
              <p className="text-amber-400 text-xs truncate">{song.artist}</p>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full flex items-center justify-center h-full">
            <p className="text-zinc-400">데이터가 없습니다.</p>
          </div>
        )}
      </div>

      {/* 페이지 인디케이터 */}
      <div className="flex justify-center gap-2 mt-4">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              currentPage === index 
                ? 'bg-amber-500 w-4' 
                : 'bg-white/20 hover:bg-white/40'
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default TopSongSection;
