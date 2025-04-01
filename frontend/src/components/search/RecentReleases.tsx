import React from 'react';

import { motion } from 'framer-motion';

interface Song {
  id: number;
  title: string;
  artist: string;
  thumbnail: string;
}

interface RecentReleasesProps {
  releases: Song[];
}

const RecentReleases: React.FC<RecentReleasesProps> = ({ releases }) => {
  return (
    <div>
      <div className="bg-zinc-800 rounded-xl overflow-hidden">
        {releases.map((song) => (
          <motion.div
            key={song.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center p-4 hover:bg-zinc-700 transition-colors cursor-pointer border-b border-zinc-700 last:border-b-0"
          >
            <img
              src={song.thumbnail}
              alt={song.title}
              className="w-12 h-12 object-cover rounded-md"
            />
            <div className="ml-4 flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">{song.title}</div>
              <div className="text-xs text-gray-400 mt-1">{song.artist}</div>
            </div>
            <div className="bg-orange-500/20 text-xs font-medium text-amber-500 px-2 py-1 rounded-full ml-2">
              NEW
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecentReleases;
