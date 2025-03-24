import React from 'react';

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
      <h4 className="text-lg font-bold text-gray-800 mb-4">연관 노래</h4>
      <div className="grid grid-cols-2 gap-4">
        {songs.map((song) => (
          <div
            key={song.id}
            className="bg-white p-4 rounded shadow hover:bg-amber-50 transition-colors cursor-pointer"
          >
            <img
              src={song.thumbnail}
              alt={song.title}
              className="w-full h-32 object-cover rounded mb-2"
            />
            <div className="text-sm font-medium">{song.title}</div>
            <div className="text-xs text-gray-500">{song.artist}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedSongs;
