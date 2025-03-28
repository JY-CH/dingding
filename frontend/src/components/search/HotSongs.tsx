import React from 'react';
import { motion } from 'framer-motion';
import { Headphones, Clock, TrendingUp } from 'lucide-react';

interface Song {
  id: number;
  title: string;
  artist: string;
  thumbnail: string;
  plays?: string;
  duration?: string;
}

interface HotSongsProps {
  songs: Song[];
}

const HotSongs: React.FC<HotSongsProps> = ({ songs }) => {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-2 mb-4"
      >
        <TrendingUp className="w-5 h-5 text-amber-500" />
        <h3 className="text-lg font-bold text-white">트렌딩 노래</h3>
      </motion.div>
      <div className="bg-zinc-800 rounded-xl overflow-hidden">
        {songs.map((song, index) => (
          <motion.div
            key={song.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="flex items-center p-4 hover:bg-zinc-700 transition-colors cursor-pointer border-b border-zinc-700 last:border-b-0"
          >
            <div className="w-6 text-center text-gray-400 mr-3">{index + 1}</div>
            <img
              src={song.thumbnail}
              alt={song.title}
              className="w-12 h-12 object-cover rounded-md"
            />
            <div className="ml-4 flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">{song.title}</div>
              <div className="text-xs text-gray-400 mt-1">{song.artist}</div>
            </div>
            <div className="flex items-center gap-3 ml-auto text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <Headphones className="w-3 h-3" />
                <span>{song.plays}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{song.duration}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HotSongs;
