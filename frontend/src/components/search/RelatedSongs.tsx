import React from 'react';
import { Play, Clock, Music } from 'lucide-react';

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
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Music className="w-5 h-5 text-amber-500" />
        <h2 className="text-xl font-bold text-white">관련 노래</h2>
      </div>
      <div className="grid gap-3">
        {songs.map((song) => (
          <div
            key={song.id}
            className="bg-zinc-800/50 backdrop-blur-sm hover:bg-zinc-800/80 border border-white/5 hover:border-amber-500/30 rounded-xl p-3 flex items-center gap-4 group transition-all"
          >
            <div className="relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden shadow-md group-hover:shadow-amber-500/20 transition-all">
              <img src={song.thumbnail} alt={song.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Play className="text-amber-500" fill="currentColor" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold truncate group-hover:text-amber-500 transition-colors">
                {song.title}
              </h3>
              <p className="text-zinc-400 text-sm truncate">{song.artist}</p>
            </div>
            <div className="flex items-center gap-2 text-zinc-500 text-sm">
              <Clock className="w-4 h-4" />
              <span>3:45</span>
            </div>
          </div>
        ))}
      </div>
      {songs.length === 0 && (
        <div className="bg-zinc-800/50 backdrop-blur-sm border border-white/5 rounded-lg p-6 text-center">
          <p className="text-zinc-400">관련 노래가 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default RelatedSongs;
