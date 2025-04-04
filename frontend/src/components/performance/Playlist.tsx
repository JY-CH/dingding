import React from 'react';
import { Song } from '../../types/performance';
import { songs } from '../../data/songs';

interface PlaylistProps {
  onSongSelect: (song: Song) => void;
}

const Playlist: React.FC<PlaylistProps> = ({ onSongSelect }) => {
  // 디버깅을 위한 로그
  console.log('Playlist 렌더링:', songs);

  return (
    <div className="w-full h-full bg-gray-800 rounded-lg p-4 shadow-lg overflow-hidden flex flex-col">
      <h2 className="text-xl font-bold text-white mb-4">플레이리스트</h2>
      <div className="space-y-2 overflow-y-auto flex-1">
        {songs && songs.length > 0 ? (
          songs.map(song => (
            <div
              key={song.id}
              className="bg-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-600 transition-colors"
              onClick={() => onSongSelect(song)}
            >
              <h3 className="text-white font-medium">{song.title}</h3>
              <p className="text-gray-400 text-sm">{song.artist}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-400 text-sm">{song.duration}</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  song.difficulty === 'easy' ? 'bg-green-500' :
                  song.difficulty === 'medium' ? 'bg-yellow-500' :
                  'bg-red-500'
                } text-white`}>
                  {song.difficulty}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-white text-center p-4">
            곡이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default Playlist; 