import React from 'react';
import { motion } from 'framer-motion';

import { mockTopSongs } from '../../data/mockData';
import { Song } from '../../types';

interface TopSongSectionProps {
  onPlaySong: (song: Song) => void;
}

const TopSongSection: React.FC<TopSongSectionProps> = ({ onPlaySong }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="h-[680px]"
    >
      <div className="mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
          추천 영상
        </h2>
        <p className="text-zinc-400 text-sm mt-2">ThingThing이 엄선한 추천 영상을 만나보세요</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 h-[570px]">
        {mockTopSongs.slice(0, 6).map((song, index) => (
          <motion.div
            key={song.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            className="group cursor-pointer h-[180px]"
            onClick={() => onPlaySong(song)}
          >
            <div className="h-[200px] rounded-lg overflow-hidden relative mb-1">
              <img
                src={song.cover}
                alt={song.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
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
        ))}
      </div>
    </motion.div>
  );
};

export default TopSongSection;
