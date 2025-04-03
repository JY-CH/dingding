import React from 'react';

import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Song {
  title: string;
  artist: string;
  duration: string;
  date: string;
  score: number;
  thumbnail: string;
  videoPath?: string;
  replayId?: number;
  mode?: string; // PRACTICE or PLAY
}

interface SongListTileProps {
  title: string;
  songs: Song[];
}

const SongListTile: React.FC<SongListTileProps> = ({ title, songs }) => {
  function parseDuration(duration: string): string {
    // Expecting format "hh:mm:ss"
    const parts = duration.split(':');
    if (parts.length !== 3) return duration;
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parseInt(parts[2], 10);
    let result = '';
    if (hours > 0) result += `${hours}시간 `;
    if (minutes > 0) result += `${minutes}분 `;
    // Optionally show seconds only if hours is 0
    if (hours === 0 && seconds > 0) result += `${seconds}초`;
    return result.trim();
  }
  return (
    <div className="p-6 backdrop-blur-lg rounded-xl">
      {/* 헤더 부분 */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-white flex items-center">
          <span className="bg-gradient-to-r from-amber-500 to-amber-600 h-5 w-1 rounded-full mr-3"></span>
          {title}
        </h3>
        <Link
          to="/allsongs"
          className="text-amber-500 text-sm font-medium hover:text-orange-600 transition-colors flex items-center gap-1 bg-zinc-800/50 px-3 py-1.5 rounded-full hover:bg-zinc-800 transition-all"
        >
          모두 보기
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 컬럼 헤더 */}
      <div className="grid grid-cols-12 text-xs text-zinc-400 pb-3 border-b border-zinc-700/50 mb-3 px-3">
        <div className="col-span-5 font-medium">노래</div>
        <div className="col-span-2 font-medium text-center  pr-2">모드</div>
        <div className="col-span-2 font-medium text-center pr-2">녹화일</div>
        <div className="col-span-2 font-medium text-center pr-4">점수</div>
        <div className="col-span-1 font-medium text-right pr-3">영상</div>
      </div>

      {/* 스크롤 가능한 노래 목록 */}
      <div className="overflow-y-auto custom-scrollbar h-[360px] pr-1">
        {songs.length > 0 ? (
          songs.map((song, index) => (
            <div
              key={index}
              className="grid grid-cols-12 items-center py-3 border-b border-zinc-700/30 last:border-b-0 hover:bg-zinc-800/40 rounded-lg transition-all px-3 group"
            >
              {/* 노래 정보 (앨범 커버 + 제목 + 가수) */}
              <div className="col-span-5 flex items-center gap-3">
                {/* 앨범 커버 (클릭 시 영상 페이지로 이동) */}
                {song.videoPath && song.replayId ? (
                  <Link
                    to={`/video-stream/${song.replayId}`}
                    state={{ song, videoUrl: song.videoPath }}
                    className="relative w-12 h-12 rounded-lg overflow-hidden group-hover:shadow-lg group-hover:shadow-amber-500/10 transition-all flex-shrink-0"
                  >
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
                  </Link>
                ) : (
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={song.thumbnail}
                      alt="앨범 커버"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* 노래 제목 및 가수 */}
                <div className="min-w-0">
                  <div className="font-medium text-sm text-white leading-tight truncate">
                    {song.title}
                  </div>
                  <div className="text-xs text-zinc-400 truncate">
                    {song.artist ? song.artist : '가수 미정'}
                  </div>
                </div>
              </div>

              {/* 모드 (원래 song.artist에 모드 정보가 들어옴; PRACTICE면 연습 모드, 아니면 연주 모드) */}
              <div className="col-span-2 text-center">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    song.mode === 'PRACTICE'
                      ? 'bg-indigo-500/10 text-indigo-500'
                      : 'bg-amber-500/10 text-amber-500'
                  }`}
                >
                  {song.mode === 'PRACTICE' ? '연습 모드' : '연주 모드'}
                </span>
              </div>

              {/* 녹화일 */}
              <div className="col-span-2 text-center text-xs text-zinc-400">
                {song.date}
                <div className="text-xs text-zinc-400 truncate">
                  ({parseDuration(song.duration)})
                </div>
              </div>

              {/* 점수 */}
              <div className="col-span-2 text-center">
                <span className="text-amber-500 font-medium bg-amber-500/10 px-3 py-1 rounded-full text-xs">
                  {song.score}
                </span>
              </div>

              {/* 영상 재생 버튼 */}
              <div className="col-span-1 flex justify-end">
                {song.videoPath && song.replayId ? (
                  <Link
                    to={`/video-stream/${song.replayId}`}
                    state={{ song, videoUrl: song.videoPath }}
                    className="inline-flex items-center justify-center bg-zinc-800 hover:bg-amber-500 p-2 rounded-full text-zinc-400 hover:text-white transition-all group-hover:shadow-lg group-hover:shadow-amber-500/20"
                  >
                    <Play size={16} />
                  </Link>
                ) : (
                  <button
                    disabled
                    className="bg-zinc-800/50 p-2 rounded-full text-zinc-600 cursor-not-allowed"
                  >
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
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
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
