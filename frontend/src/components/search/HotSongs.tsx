import React from 'react';

interface Song {
  id: number;
  title: string;
  artist: string;
  thumbnail: string;
}

interface HotSongsProps {
  songs: Song[];
}

const HotSongs: React.FC<HotSongsProps> = ({ songs }) => {
  return (
    <div>
      <h2 className="text-white text-xl font-bold mb-4">🔥 핫한 곡</h2>
      <ul className="space-y-4">
        {songs.map((song) => (
          <li key={song.id} className="flex items-center space-x-4">
            <img src={song.thumbnail} alt={song.title} className="w-16 h-16 rounded-lg" />
            <div>
              <p className="text-white font-semibold">{song.title}</p>
              <p className="text-gray-400 text-sm">{song.artist}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HotSongs;
