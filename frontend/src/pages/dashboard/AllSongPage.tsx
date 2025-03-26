import React from 'react';

import { useNavigate, useLocation } from 'react-router-dom';

interface Song {
  title: string;
  artist: string;
  duration: string;
  score: number;
  thumbnail: string;
}

const AllSongsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const songs: Song[] = location.state?.songs || [];

  return (
    <div className="bg-zinc-900 min-h-screen p-6">
      <button onClick={() => navigate(-1)} className="text-orange-500 hover:text-orange-600 mb-4">
        뒤로가기
      </button>
      <h2 className="text-xl font-bold text-white mb-4">모든 노래</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {songs.map((song, index) => (
          <div
            key={index}
            onClick={() => navigate('/stream', { state: { song } })}
            className="bg-zinc-800 p-4 rounded-lg shadow hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            <img
              src={song.thumbnail}
              alt="앨범 커버"
              className="w-full h-40 object-cover rounded mb-4"
            />
            <div className="text-white font-bold">{song.title}</div>
            <div className="text-gray-400 text-sm">{song.artist}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllSongsPage;
