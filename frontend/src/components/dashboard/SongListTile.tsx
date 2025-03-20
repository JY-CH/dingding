import React from 'react';
import { Play } from 'lucide-react';

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
    <div className="bg-white rounded-lg p-6 shadow-sm flex flex-col">
      {/* 헤더 부분 - 고정 높이 */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-bold text-gray-800">{title}</h3>
        <a
          href="#"
          className="text-amber-500 text-xs font-medium hover:text-amber-600 transition-colors"
        >
          모두 보기 &gt;
        </a>
      </div>

      {/* 컬럼 헤더 - 고정 높이 */}
      <div className="grid grid-cols-5 text-xs text-gray-500 pb-2 border-b mb-1">
        <div className="col-span-2 font-medium">노래 제목</div>
        <div className="font-medium">날짜</div>
        <div className="font-medium">점수</div>
        <div></div>
      </div>

      {/* 스크롤 가능한 노래 목록 영역 */}
      <div
        className="overflow-y-auto flex-grow pr-1 custom-scrollbar"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#FBBF24 transparent',
          maxHeight: songs.length > 3 ? '15rem' : 'auto',
        }}
      >
        {songs.map((song, index) => (
          <div
            key={index}
            className="grid grid-cols-5 items-center py-2 border-b last:border-b-0 hover:bg-amber-50 transition-colors"
          >
            <div className="col-span-2 flex items-center gap-2">
              <div className="relative w-8 h-8 rounded overflow-hidden group">
                <img src={song.thumbnail} alt="앨범 커버" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100">
                  <Play size={14} className="text-white" />
                </div>
              </div>
              <div>
                <div className="font-medium text-sm truncate">{song.title}</div>
                <div className="text-xs text-gray-500 truncate">{song.artist}</div>
              </div>
            </div>
            <div className="text-sm text-gray-600">{song.duration}</div>
            <div className="text-amber-500 font-medium">{song.score}</div>
            <div className="text-right">
              <button className="bg-gray-100 hover:bg-amber-100 p-1 rounded-full text-gray-500 hover:text-amber-500 transition-colors">
                <Play size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SongListTile;
