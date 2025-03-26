import React from 'react';

import { Music } from 'lucide-react';

interface Song {
  id: number;
  title: string;
  artist: string;
  thumbnail: string;
}

interface RelatedSongsProps {
  songs: Song[];
}

const RelatedSongs: React.FC<RelatedSongsProps> = ({ songs }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Music className="w-5 h-5 text-orange-500" />
          <h4 className="text-lg font-bold text-white">연관 노래</h4>
        </div>
        <button className="text-sm text-orange-500">모두 보기</button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {songs.map((song) => (
          <div
            key={song.id}
            className="bg-zinc-800 p-4 rounded-xl shadow hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            <img
              src={song.thumbnail}
              alt={song.title}
              className="w-full h-32 object-cover rounded mb-2"
            />
            <div className="text-sm font-medium text-white truncate">{song.title}</div>
            <div className="text-xs text-gray-400">{song.artist}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedSongs;
