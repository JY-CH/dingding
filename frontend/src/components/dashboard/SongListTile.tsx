import React from 'react';

import { Play, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Song {
  title: string;
  artist: string;
  duration: string;
  score: number;
  thumbnail: string;
  videoPath?: string;
  replayId?: number;
}

interface SongListTileProps {
  title: string;
  songs: Song[];
}

const SongListTile: React.FC<SongListTileProps> = ({ title, songs }) => {
  return (
    <div className="p-6 backdrop-blur-lg">
      {/* 헤더 부분 */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-white flex items-center">
          <span className="bg-gradient-to-r from-amber-500 to-amber-600 h-5 w-1 rounded-full mr-3"></span>
          {title}
        </h3>
        <Link
          to="/allsongs"
          state={{ songs }} // songs 데이터를 state로 함께 전달
          className="text-amber-500 text-sm font-medium hover:text-orange-600 transition-colors flex items-center gap-1 bg-zinc-800/50 px-3 py-1.5 rounded-full hover:bg-zinc-800 transition-all"
        >
          모두 보기
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 컬럼 헤더 */}
      <div className="grid grid-cols-5 text-xs text-zinc-400 pb-3 border-b border-zinc-700/50 mb-3 px-2">
        <div className="col-span-2 font-medium">노래 제목</div>
        <div className="font-medium text-right">녹화일</div>
        <div className="font-medium text-right">점수</div>
        <div className="font-medium text-right pr-2">영상</div>
      </div>

      {/* 스크롤 가능한 노래 목록 */}
      <div className="overflow-y-auto custom-scrollbar h-[280px] pr-1">
        {songs.length > 0 ? (
          songs.map((song, index) => (
            <div
              key={index}
              className="grid grid-cols-5 items-center py-3 border-b border-zinc-700/30 last:border-b-0 hover:bg-zinc-800/40 rounded-lg transition-all px-2 group"
            >
              <div className="col-span-2 flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden group-hover:shadow-lg group-hover:shadow-amber-500/10 transition-all">
                  <img
                    src={song.thumbnail}
                    alt="앨범 커버"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all duration-300">
                    <Play
                      size={18}
                      className="text-white opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <div className="font-medium text-sm text-white truncate group-hover:text-amber-500 transition-colors">
                    {song.title}
                  </div>
                  <div className="text-xs text-zinc-400 truncate group-hover:text-zinc-300 transition-colors">
                    {song.artist}
                  </div>
                </div>
              </div>
              <div className="text-sm text-zinc-400 text-right">{song.duration}</div>
              <div className="text-right">
                <span className="text-amber-500 font-medium bg-amber-500/10 px-3 py-1 rounded-full text-sm">
                  {song.score}
                </span>
              </div>
              <div className="text-right pr-2">
                {song.videoPath ? (
                  <a
                    href={song.videoPath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-zinc-800 hover:bg-amber-500 p-2 rounded-full text-zinc-400 hover:text-white transition-all group-hover:shadow-lg group-hover:shadow-amber-500/20"
                  >
                    <ExternalLink size={16} />
                  </a>
                ) : (
                  <button className="bg-zinc-800 hover:bg-amber-500 p-2 rounded-full text-zinc-400 hover:text-white transition-all group-hover:shadow-lg group-hover:shadow-amber-500/20">
                    <Play size={16} />
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-zinc-500 py-10">
            <svg className="w-12 h-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
            <p className="text-sm">최근 연주한 노래가 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ChevronRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

export default SongListTile;
