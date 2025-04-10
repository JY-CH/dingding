import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlinePlay, HiOutlinePause, HiMusicalNote } from 'react-icons/hi2';
import { HiOutlineCollection, HiOutlineHeart, HiOutlineHeart as HiOutlineClock } from 'react-icons/hi';
import { HiChevronRight, HiOutlineSearch, HiX } from 'react-icons/hi';
import { Song } from '../../types/performance';

interface PlaylistProps {
  onSongSelect: (song: Song) => void;
  initialSongs: Song[];
}

const Playlist: React.FC<PlaylistProps> = ({ onSongSelect, initialSongs = [] }) => {
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'recent'>('all');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // 검색 토글 함수
  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      // 검색창이 열리면 자동으로 포커스
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      // 검색창이 닫힐 때 검색어 초기화
      setSearchQuery('');
    }
  };
  
  const filteredSongs = initialSongs.filter(song => {
    // 검색어가 있으면 검색어로 필터링
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        song.title.toLowerCase().includes(query) || 
        song.artist.toLowerCase().includes(query)
      );
    }
    
    // 검색어가 없으면 탭에 따라 필터링
    if (activeTab === 'all') return true;
    // 여기에 favorites나 recent 필터링 로직을 추가할 수 있음
    return false;
  });

  const handleSongSelect = (song: Song) => {
    setSelectedSong(song);
    onSongSelect(song);
  };

  return (
    <div className="h-full flex">
      {/* 플레이리스트 */}
      <div className="w-full h-full flex flex-col border-r border-white/10">
        {/* 탭 메뉴와 검색 영역 */}
        <div className="border-b border-white/10 bg-black/20 relative">
          {/* 탭 메뉴 */}
          <div className="flex items-center justify-between p-1">
            <div className="flex items-center">
              <button 
                className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-medium transition-colors ${
                  activeTab === 'all' 
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' 
                    : 'text-white/60 hover:text-white/80 hover:bg-white/5'
                }`}
                onClick={() => setActiveTab('all')}
              >
                <HiOutlineCollection className="w-2.5 h-2.5" />
                전체 곡
              </button>
              <button 
                className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-medium ml-1 transition-colors ${
                  activeTab === 'favorites' 
                    ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30' 
                    : 'text-white/60 hover:text-white/80 hover:bg-white/5'
                }`}
                onClick={() => setActiveTab('favorites')}
              >
                <HiOutlineHeart className="w-2.5 h-2.5" />
                즐겨찾기
              </button>
              <button 
                className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-medium ml-1 transition-colors ${
                  activeTab === 'recent' 
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                    : 'text-white/60 hover:text-white/80 hover:bg-white/5'
                }`}
                onClick={() => setActiveTab('recent')}
              >
                <HiOutlineClock className="w-2.5 h-2.5" />
                최근 연주
              </button>
            </div>
            
            {/* 검색 버튼 */}
            <button 
              className={`p-1 rounded-md transition-colors ${
                showSearch 
                  ? 'bg-indigo-500/20 text-indigo-300' 
                  : 'text-white/60 hover:text-white/80 hover:bg-white/5'
              }`}
              onClick={toggleSearch}
            >
              {showSearch ? (
                <HiX className="w-3 h-3" />
              ) : (
                <HiOutlineSearch className="w-3 h-3" />
              )}
            </button>
          </div>
          
          {/* 검색 입력창 */}
          <AnimatePresence>
            {showSearch && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 z-10 bg-black/80 backdrop-blur-sm p-1 flex items-center"
              >
                <div className="relative w-full">
                  <HiOutlineSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-white/40 w-3 h-3" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="곡 또는 아티스트 검색"
                    className="w-full bg-black/50 text-white text-[10px] rounded-md py-1 pl-7 pr-2 outline-none border border-white/10 focus:border-indigo-500/50"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 세로 스크롤 곡 목록 */}
        <div 
          ref={scrollContainerRef}
          className="flex-grow overflow-y-auto custom-scrollbar"
        >
          <div className="grid gap-1 p-1">
            {filteredSongs.length > 0 ? (
              filteredSongs.map((song) => (
                <motion.div
                  key={song.id}
                  className={`rounded-md cursor-pointer border ${
                    selectedSong?.id === song.id 
                      ? 'bg-indigo-500/10 border-indigo-500/40' 
                      : 'bg-black/20 border-white/5 hover:bg-black/30'
                  }`}
                  onClick={() => handleSongSelect(song)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="p-1.5 relative">
                    <div className="flex items-center gap-1.5">
                      {/* 썸네일 */}
                      <div className={`relative w-6 h-6 rounded-md overflow-hidden flex-shrink-0 ${
                        selectedSong?.id === song.id ? 'ring-1 ring-indigo-500/60' : ''
                      }`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-700/80 to-gray-900/80"/>
                        <div className="absolute inset-0 flex items-center justify-center">
                          {selectedSong?.id === song.id && isPlaying ? (
                            <HiOutlinePause className="w-3 h-3 text-white" />
                          ) : (
                            <HiOutlinePlay className="w-3 h-3 text-white" />
                          )}
                        </div>
                      </div>
                      
                      {/* 곡 정보 */}
                      <div className="flex-grow min-w-0">
                        <h3 className="text-white text-[11px] font-medium truncate">{song.title}</h3>
                        <div className="flex justify-between items-center">
                          <p className="text-white/60 text-[9px] truncate">{song.artist}</p>
                          <div className="flex gap-1 text-white/40 text-[8px]">
                            <span>{song.duration}</span>
                          </div>
                        </div>
                      </div>

                      {selectedSong?.id === song.id && (
                        <HiChevronRight className="w-3 h-3 text-indigo-400" />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center p-4 text-center text-white/40 h-32">
                <HiOutlineSearch className="w-5 h-5 mb-1" />
                <p className="text-[11px]">
                  {searchQuery ? `"${searchQuery}"에 대한 검색 결과가 없습니다` : "표시할 곡이 없습니다"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playlist; 