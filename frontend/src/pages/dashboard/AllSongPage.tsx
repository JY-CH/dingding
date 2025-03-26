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
    <div className="bg-zinc-900 min-h-screen px-8 py-6">
      {/* 뒤로가기 버튼 */}
      <button
        onClick={() => navigate(-1)}
        className="text-amber-500 hover:text-amber-600 mb-6 font-medium"
      >
        뒤로가기
      </button>

      {/* 페이지 타이틀 */}
      <h2 className="text-2xl font-bold text-white mb-6">모든 노래</h2>

      {/* 노래 카드 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {songs.map((song, index) => (
          <div
            key={index}
            onClick={() => navigate('/stream', { state: { song } })}
            className="bg-zinc-800 p-4 rounded-lg shadow-lg hover:bg-zinc-700 transition-colors cursor-pointer group"
          >
            {/* 앨범 커버 */}
            <div className="relative w-full h-40 rounded overflow-hidden mb-4">
              <img
                src={song.thumbnail}
                alt="앨범 커버"
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  재생하기
                </span>
              </div>
            </div>

            {/* 노래 정보 */}
            <div className="text-white font-bold text-lg truncate">{song.title}</div>
            <div className="text-gray-400 text-sm truncate">{song.artist}</div>
            <div className="text-gray-500 text-xs mt-2">재생 시간: {song.duration}</div>
            <div className="text-amber-500 text-xs font-medium mt-1">점수: {song.score}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllSongsPage;
