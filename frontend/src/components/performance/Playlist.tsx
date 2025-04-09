import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlinePlay, HiOutlinePause, HiMusicalNote, HiStar } from 'react-icons/hi2';
import { HiOutlineCollection, HiOutlineHeart, HiOutlineClock as HiOutlineHistory } from 'react-icons/hi';
import { HiChevronRight, HiVolumeUp, HiOutlineRefresh, HiOutlineSearch, HiX } from 'react-icons/hi';
import { Song } from '../../types/performance';
import { songs as defaultSongs } from '../../data/songs';

interface PlaylistProps {
  onSongSelect: (song: Song) => void;
  initialSongs?: Song[];
}

const Playlist: React.FC<PlaylistProps> = ({ onSongSelect, initialSongs = [] }) => {
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'recent'>('all');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // 사용할 곡 목록 결정
  const songs = initialSongs.length > 0 ? initialSongs : defaultSongs;
  
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
  
  const filteredSongs = songs.filter(song => {
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

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseInt(e.target.value));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case '초급':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case '중급':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case '고급':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="h-full flex">
      {/* 좌측: 플레이리스트 */}
      <div className="w-[55%] h-full flex flex-col border-r border-white/10">
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
                <HiOutlineHistory className="w-2.5 h-2.5" />
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
          
          {/* 검색 입력창 - 이제 탭 메뉴 위에 겹쳐서 표시됨 */}
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
                        <div className="flex items-center justify-between">
                          <h3 className="text-white text-[11px] font-medium truncate">{song.title}</h3>
                          <span className={`text-[8px] ml-1 px-1 py-px rounded-full border ${getDifficultyColor(song.difficulty)}`}>
                            {song.difficulty}
                          </span>
                        </div>
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

      {/* 우측: 재생 컴포넌트 */}
      <div className="w-[45%] h-full relative overflow-hidden">
        {selectedSong ? (
          <>
            {/* 배경 효과 (앨범 이미지 대체) */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-gray-900/50 backdrop-blur-sm z-0" />
              <div className="absolute inset-0 bg-black/50" />
              
              {/* 중앙 음표 백그라운드 요소 */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 opacity-10">
                <HiMusicalNote className="w-full h-full text-indigo-300" />
              </div>
              
              {/* 장식용 원 요소들 */}
              <div className="absolute top-[-20%] right-[-10%] w-32 h-32 rounded-full bg-indigo-600/10 blur-2xl"></div>
              <div className="absolute bottom-[-10%] left-[-10%] w-24 h-24 rounded-full bg-purple-600/10 blur-2xl"></div>
            </div>
            
            {/* 콘텐츠 영역 */}
            <div className="relative h-full flex flex-col justify-between p-2 z-10">
              {/* 상단: 곡 정보 */}
              <div className="mb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-white">{selectedSong.title}</h2>
                    <p className="text-white/70 text-xs">{selectedSong.artist}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full border ${getDifficultyColor(selectedSong.difficulty)}`}>
                      {selectedSong.difficulty}
                    </span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <HiStar 
                          key={i} 
                          className={`w-2.5 h-2.5 ${i < 3 ? 'text-yellow-400' : 'text-yellow-400/30'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 중앙: 곡 정보 카드 */}
              <div className="flex justify-between items-center bg-black/30 backdrop-blur-sm rounded-lg border border-white/10 p-2 mb-2">
                <div className="flex gap-2 text-center">
                  <div className="flex flex-col items-center">
                    <p className="text-white/40 text-[9px] mb-0.5">BPM</p>
                    <p className="text-white text-xs font-medium">{selectedSong.bpm}</p>
                  </div>
                  <div className="w-px h-8 bg-white/10 mx-0.5"></div>
                  <div className="flex flex-col items-center">
                    <p className="text-white/40 text-[9px] mb-0.5">노트</p>
                    <p className="text-white text-xs font-medium">{selectedSong.notes.length}개</p>
                  </div>
                  <div className="w-px h-8 bg-white/10 mx-0.5"></div>
                  <div className="flex flex-col items-center">
                    <p className="text-white/40 text-[9px] mb-0.5">시간</p>
                    <p className="text-white text-xs font-medium">{selectedSong.duration}</p>
                  </div>
                </div>
                
                {/* 재생 버튼 */}
                <div>
                  <button 
                    className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/50 text-white hover:bg-indigo-500/30 transition-colors"
                    onClick={togglePlay}
                  >
                    {isPlaying ? (
                      <HiOutlinePause className="w-4 h-4" />
                    ) : (
                      <HiOutlinePlay className="w-4 h-4 ml-0.5" />
                    )}
                  </button>
                </div>
              </div>
              
              {/* 하단: 컨트롤 영역 */}
              <div className="mt-auto">
                {/* 재생 바 */}
                <div className="w-full h-1 bg-white/10 rounded-full my-2">
                  <div 
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: isPlaying ? '35%' : '0%', transition: 'width 0.5s linear' }}
                  />
                </div>
                
                {/* 볼륨 및 재생 컨트롤 */}
                <div className="flex justify-between items-center mb-2">
                  <button className="text-white/60 hover:text-white/80 transition-colors">
                    <HiOutlineRefresh className="w-4 h-4" />
                  </button>
                  
                  <div className="flex items-center gap-1">
                    <HiVolumeUp className="w-3 h-3 text-white/60" />
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={volume} 
                      onChange={handleVolumeChange} 
                      className="w-16 accent-indigo-500"
                    />
                  </div>
                </div>
                
                {/* 연주 시작 버튼 */}
                <button 
                  className="w-full py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors flex items-center justify-center"
                  onClick={() => {
                    setIsPlaying(true);
                    // 여기에 연주 시작 로직 추가
                  }}
                >
                  <HiOutlinePlay className="w-3.5 h-3.5 mr-1" />
                  연주 시작하기
                </button>
              </div>
            </div>
          </>
        ) : (
          // 선택된 곡이 없을 때 표시할 내용
          <div className="h-full flex flex-col items-center justify-center p-3 text-center bg-black/20 backdrop-blur-sm">
            <HiMusicalNote className="w-8 h-8 text-white/20 mb-2" />
            <h3 className="text-white text-sm font-medium mb-1">곡을 선택해주세요</h3>
            <p className="text-white/50 text-xs">왼쪽 플레이리스트에서 연주하고 싶은 곡을 선택하세요</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Playlist; 