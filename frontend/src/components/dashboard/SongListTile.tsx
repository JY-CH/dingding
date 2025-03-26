import React from 'react';

import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Song {
  title: string;
  artist: string;
  duration: string;
  score: number;
  thumbnail: string;
}

interface SongListTileProps {
  title: string;
  songs: Song[];
}

const SongListTile: React.FC<SongListTileProps> = ({ title, songs }) => {
  return (
    <div className="bg-zinc-800 rounded-lg p-6 shadow-md flex flex-col">
      {/* 헤더 부분 */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <Link
          to="/allsongs"
          state={{ songs }} // songs 데이터를 state로 함께 전달
          className="text-amber-500 text-sm font-medium hover:text-orange-600 transition-colors"
        >
          모두 보기 &gt;
        </Link>
      </div>

      {/* 컬럼 헤더 */}
      <div className="grid grid-cols-5 text-xs text-gray-400 pb-2 border-b border-zinc-700 mb-2">
        <div className="col-span-2 font-medium">노래 제목</div>
        <div className="font-medium text-right pr-4">재생 시간</div>
        <div className="font-medium text-right pr-3">점수</div>
        <div className="font-medium text-right pr-4">영상</div>
      </div>

      {/* 스크롤 가능한 노래 목록 */}
      <div className="overflow-y-auto flex-grow pr-1">
        {songs.map((song, index) => (
          <div
            key={index}
            className="grid grid-cols-5 items-center py-2 border-b border-zinc-700 last:border-b-0 hover:bg-zinc-700 transition-colors"
          >
            <div className="col-span-2 flex items-center gap-2">
              <div className="relative w-10 h-10 rounded overflow-hidden group">
                <img src={song.thumbnail} alt="앨범 커버" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-opacity">
                  <Play size={16} className="text-white" />
                </div>
              </div>
              <div>
                <div className="font-medium text-sm text-white truncate">{song.title}</div>
                <div className="text-xs text-gray-400 truncate">{song.artist}</div>
              </div>
            </div>
            <div className="text-sm text-gray-400 text-right">{song.duration}</div>
            <div className="text-amber-500 font-medium text-right">{song.score}</div>
            <div className="text-right">
              <button className="bg-zinc-700 hover:bg-amber-500 p-2 rounded-full text-gray-400 hover:text-white transition-colors">
                <Play size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SongListTile;
