import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fetchWeekSongRanking } from '../../services/api';

interface WeekSongUserInfo {
  username: string;
  score: number;
}

interface WeekSongData {
  song: {
    songId: number;
    songTitle: string;
    songImage: string;
    songSinger: string;
  };
  userInfo: WeekSongUserInfo[];
}

interface FeaturedItem {
  id: number;
  title: string;
  artist: string;
  description: string;
  imageUrl: string;
  albumCover: string;
  gradient: string;
  type: 'ALBUM' | 'PLAYLIST' | 'ARTIST';
  stats: {
    likes: number;
    plays: number;
  };
}

interface FeaturedCarouselProps {
  onPlaySong?: (song: any) => void;
}

const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ onPlaySong }) => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [weekSongData, setWeekSongData] = useState<WeekSongData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 주간 랭킹 데이터 가져오기
  useEffect(() => {
    const loadWeekSongRanking = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // 인증 토큰 확인
        const token = sessionStorage.getItem('accessToken');
        if (!token) {
          console.log('인증 토큰이 없습니다.');
          setError('인증이 필요합니다.');
          setIsLoading(false);
          return;
        }
        
        const data = await fetchWeekSongRanking();
        console.log('랭킹 데이터 로드 성공:', data);
        setWeekSongData(data);
        setIsLoading(false);
      } catch (err) {
        console.error('이주의 곡 랭킹 로드 오류:', err);
        // 오류가 발생해도 화면은 계속 표시
        setError('랭킹 데이터를 불러오는데 실패했습니다.');
        setIsLoading(false);
      }
    };

    loadWeekSongRanking();
  }, []);

  const featuredItems: FeaturedItem[] = [
    {
      id: 1,
      title: 'Story Time',
      artist: 'Luddy Dave',
      description: "L'heure du Conte - 새로운 앨범 발매",
      imageUrl: '/images/featured/story-time-banner.jpg',
      albumCover: '/images/featured/story-time-cover.jpg',
      gradient: 'from-blue-600 via-blue-800 to-blue-900',
      type: 'ALBUM',
      stats: {
        likes: 24680,
        plays: 158900,
      },
    },
    {
      id: 2,
      title: 'Midnight Melodies',
      artist: 'Sarah Moon',
      description: '깊어가는 밤, 감성을 담은 어쿠스틱 기타',
      imageUrl: '/images/featured/story-time-banner.jpg',
      albumCover: '/images/featured/story-time-cover.jpg',
      gradient: 'from-purple-600 via-purple-800 to-purple-900',
      type: 'PLAYLIST',
      stats: {
        likes: 18920,
        plays: 142500,
      },
    },
    {
      id: 3,
      title: 'Guitar Dreams',
      artist: 'Alex Rivers',
      description: '지친 하루를 위로하는 따뜻한 선율',
      imageUrl: '/images/featured/story-time-banner.jpg',
      albumCover: '/images/featured/story-time-cover.jpg',
      gradient: 'from-emerald-600 via-emerald-800 to-emerald-900',
      type: 'ALBUM',
      stats: {
        likes: 31240,
        plays: 203400,
      },
    },
  ];

  // 현재 보여줄 데이터가 있는지 확인 
  const hasRankingData = weekSongData !== null && 
                        weekSongData.song && 
                        weekSongData.song.songId !== 0 && 
                        weekSongData.userInfo && 
                        weekSongData.userInfo.length > 0;
  
  // 곡 정보는 있지만 사용자 랭킹 데이터가 없는 경우
  const hasSongDataOnly = weekSongData !== null && 
                         weekSongData.song && 
                         weekSongData.song.songId !== 0 && 
                         (!weekSongData.userInfo || weekSongData.userInfo.length === 0);
  
  // 에러 상태 (서버 오류, 권한 없음 등)
  const hasErrorState = weekSongData !== null && 
                       weekSongData.song && 
                       weekSongData.song.songId === 0;
  
  // 슬라이드 자동 변경을 위한 타이머
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + featuredItems.length) % featuredItems.length);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % featuredItems.length);
  };

  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/80 z-50">
          <div className="text-white">랭킹 데이터를 불러오는 중...</div>
        </div>
      )}
      
      {!isLoading && error && (
        <div className="absolute top-2 right-2 p-2 bg-red-600/80 text-white rounded-md z-50 text-sm">
          {error}
        </div>
      )}
      
      {!isLoading && !error && hasErrorState && (
        <div className="absolute top-2 right-2 p-2 bg-orange-600/80 text-white rounded-md z-50 text-sm">
          {weekSongData?.song?.songTitle} - {weekSongData?.song?.songSinger}
        </div>
      )}
      
      {!isLoading && !error && !hasRankingData && !hasSongDataOnly && !hasErrorState && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/80 z-50">
          <div className="text-white p-4 bg-zinc-800 rounded-lg shadow-lg">
            현재 이주의 곡 랭킹 데이터가 없습니다.
          </div>
        </div>
      )}
      
      {!isLoading && !error && hasSongDataOnly && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/80 z-50">
          <div className="text-white p-4 bg-zinc-800 rounded-lg shadow-lg">
            이주의 곡은 있지만 아직 랭킹 데이터가 없습니다.
          </div>
        </div>
      )}
      
      {featuredItems.map((item, index) => (
        <div
          key={item.id}
          className={`
            absolute inset-0 w-full h-full
            ${currentSlide === index ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `}
          style={{ transition: 'none' }}
          onTransitionEnd={() => setIsTransitioning(false)}
        >
          <div className="absolute inset-0 flex" style={{ transition: 'none' }}>
            {/* 왼쪽 콘텐츠 영역 */}
            <div className="w-[62%] p-8 pl-12 flex flex-col justify-center relative z-10"
              style={{ 
                backgroundImage: weekSongData && weekSongData.song ? `url(${weekSongData.song.songImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundBlendMode: 'overlay',
                backgroundColor: 'rgba(0, 0, 0, 0.7)'
              }}
            >
              <span
                className={`
                text-sm font-medium text-amber-400 mb-4
                transition-all duration-700 delay-100
                ${currentSlide === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
              `}
              >
                {item.type === 'ALBUM'
                  ? '새로운 앨범'
                  : item.type === 'PLAYLIST'
                    ? '추천 플레이리스트'
                    : '아티스트 특집'}
              </span>
              <h2
                className={`
                text-4xl font-bold text-white mb-5
                transition-all duration-700 delay-200
                ${currentSlide === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
              `}
              >
                {weekSongData && weekSongData.song ? weekSongData.song.songTitle : item.title}
              </h2>
              <p
                className={`
                text-xl text-white/80 mb-4
                transition-all duration-700 delay-300
                ${currentSlide === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
              `}
              >
                {weekSongData && weekSongData.song ? weekSongData.song.songSinger : item.artist}
              </p>
              <p
                className={`
                text-base text-white/60 mb-8 max-w-lg
                transition-all duration-700 delay-400
                ${currentSlide === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
              `}
              >
                {item.description}
              </p>

              <div
                className={`
                flex items-center gap-8
                transition-all duration-700 delay-500
                ${currentSlide === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
              `}
              >
                <button 
                  className="px-8 py-3.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold transition-colors"
                  onClick={() => {
                    if (onPlaySong) {
                      // 벚꽃엔딩 재생
                      onPlaySong({
                        id: 101,
                        title: "벚꽃엔딩",
                        artist: "버스커버스커",
                        duration: "4:15",
                        thumbnail: "https://i.imgur.com/example.jpg",
                        songTitle: "벚꽃엔딩",
                        songSinger: "버스커버스커",
                        songImage: "https://i.imgur.com/example.jpg"
                      });
                    }
                  }}
                >
                  지금 듣기
                </button>
                <button 
                  className="px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold transition-colors flex items-center gap-2"
                  onClick={() => navigate('/performance')}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                  연주하기
                </button>
                <div className="flex items-center gap-6 text-sm text-white/60">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                    </svg>
                    {item.stats.likes.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                    </svg>
                    {item.stats.plays.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* RankingSection */}
            <div className="w-[38%]">
              <div className="h-full relative overflow-hidden bg-black/30 backdrop-blur-sm p-4">
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/80 to-transparent" />
                
                <div className="relative z-10 h-full flex flex-col">
                  {/* 헤더 영역 */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">실시간 TOP 5</h3>
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    </div>
                    <div className="text-xs text-zinc-400">
                      {new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  
                  {/* 랭킹 그리드 */}
                  <div className="flex-1 flex flex-col gap-3">
                    {/* 1-3위 가로 배치 */}
                    <div className="grid grid-cols-3 gap-2">
                      {hasRankingData && weekSongData && weekSongData.userInfo
                        ? weekSongData.userInfo.slice(0, Math.min(3, weekSongData.userInfo.length)).map((user, rankIndex) => (
                        <motion.div
                          key={`${currentSlide}-${rankIndex}`}
                          initial={{ opacity: 0, y: 30, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ 
                            duration: 0.6,
                            delay: 0.2 + rankIndex * 0.15,
                            ease: [0.23, 1, 0.32, 1]
                          }}
                          whileHover={{ 
                            scale: 1.05,
                            transition: { duration: 0.2 }
                          }}
                          className={`
                            rounded-lg p-4 h-[140px] cursor-pointer overflow-hidden relative group
                            ${rankIndex === 0 
                              ? 'bg-gradient-to-br from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/20' 
                              : rankIndex === 1
                                ? 'bg-gradient-to-br from-zinc-300/20 via-zinc-300/10 to-transparent border border-zinc-300/20'
                                : 'bg-gradient-to-br from-orange-800/20 via-orange-800/10 to-transparent border border-orange-800/20'
                            }
                          `}
                        >
                          {/* 순위 뱃지 */}
                          <div className="absolute -right-8 -top-8 w-16 h-16 rotate-45">
                            <div className={`
                              w-full h-full
                              ${rankIndex === 0 
                                ? 'bg-amber-500/30' 
                                : rankIndex === 1
                                  ? 'bg-zinc-300/30'
                                  : 'bg-orange-800/30'
                              }
                            `}/>
                          </div>

                          <div className="flex flex-col justify-between h-full relative">
                            <div>
                              <div className="flex items-center justify-between">
                                <motion.div 
                                  initial={{ scale: 0.5, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{
                                    duration: 0.4,
                                    delay: 0.3 + rankIndex * 0.15,
                                    ease: "backOut"
                                  }}
                                  className={`
                                    text-3xl font-black
                                    ${rankIndex === 0 
                                      ? 'text-amber-500' 
                                      : rankIndex === 1
                                        ? 'text-zinc-300'
                                        : 'text-orange-800'
                                    }
                                  `}
                                >
                                  {rankIndex + 1}
                                </motion.div>

                                <motion.button
                                  initial={{ opacity: 0, scale: 0.5 }}
                                  whileHover={{ scale: 1.1 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className={`
                                    p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity
                                    ${rankIndex === 0 
                                      ? 'bg-amber-500/80 hover:bg-amber-500' 
                                      : rankIndex === 1
                                        ? 'bg-zinc-300/80 hover:bg-zinc-300'
                                        : 'bg-orange-800/80 hover:bg-orange-800'
                                    }
                                  `}
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                  </svg>
                                </motion.button>
                              </div>

                              <div className="flex-1 min-w-0 mt-3">
                                <motion.div
                                  initial={{ x: -20, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  transition={{
                                    duration: 0.4,
                                    delay: 0.4 + rankIndex * 0.15,
                                    ease: "easeOut"
                                  }}
                                >
                                  <div className={`
                                    text-sm font-bold truncate transition-colors
                                    ${rankIndex === 0 
                                      ? 'text-white group-hover:text-amber-400' 
                                      : rankIndex === 1
                                        ? 'text-white group-hover:text-zinc-300'
                                        : 'text-white group-hover:text-orange-800'
                                    }
                                  `}>
                                    {user.username}
                                  </div>
                                  <div className="text-xs text-zinc-400 truncate group-hover:text-zinc-300 transition-colors">
                                    
                                  </div>
                                </motion.div>
                              </div>
                            </div>

                            {/* 우측 하단 요소 */}
                            <div className="flex justify-end">
                              <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{
                                  duration: 0.3,
                                  delay: 0.5 + rankIndex * 0.15
                                }}
                                className={`
                                  flex items-center gap-1 px-2 py-1 rounded-full text-xs
                                  ${rankIndex === 0 
                                    ? 'bg-amber-500/10 text-amber-500' 
                                    : rankIndex === 1
                                      ? 'bg-zinc-300/10 text-zinc-300'
                                      : 'bg-orange-800/10 text-orange-800'
                                  }
                                `}
                              >
                                <span>{user.score}점</span>
                              </motion.div>
                            </div>
                          </div>
                        </motion.div>
                      ))
                      : (
                        <div className="col-span-3 flex items-center justify-center h-[140px] bg-zinc-800/50 rounded-lg">
                          <p className="text-zinc-400 text-sm">랭킹 데이터가 없습니다.</p>
                        </div>
                      )}
                    </div>

                    {/* 4-5위 세로 배치 */}
                    <div className="space-y-2">
                      {hasRankingData && weekSongData && weekSongData.userInfo && weekSongData.userInfo.length > 3 
                        ? weekSongData.userInfo.slice(3, Math.min(5, weekSongData.userInfo.length)).map((user, index) => (
                        <motion.div
                          key={`${currentSlide}-${index + 3}`}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ 
                            duration: 0.5,
                            delay: 0.2 + (index + 3) * 0.15,
                            ease: "easeOut"
                          }}
                          className="bg-white/5 rounded-lg p-2.5 hover:bg-white/10 transition-colors"
                        >
                          <div className="flex items-center gap-3 h-[46px]">
                            <div className="text-xl font-bold text-white/80">{index + 4}</div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-white truncate">
                                {user.username}
                              </div>
                              <div className="text-xs text-zinc-400 truncate mt-1">
                                
                              </div>
                            </div>
                            <div className="text-xs text-amber-500">
                              {user.score}점
                            </div>
                          </div>
                        </motion.div>
                      ))
                      : hasRankingData && weekSongData && weekSongData.userInfo && weekSongData.userInfo.length <= 3 && (
                        <div className="h-[46px] flex items-center justify-center bg-zinc-800/50 rounded-lg">
                          <p className="text-zinc-400 text-xs">추가 랭킹 데이터가 없습니다.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 하단 정보 */}
                  <div className="mt-4 pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400">업데이트: 1분 전</span>
                      <button className="text-amber-500 hover:text-amber-400">
                        전체보기
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* 네비게이션 버튼 */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white/80 hover:bg-black/50 transition-colors z-20"
        disabled={isTransitioning}
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white/80 hover:bg-black/50 transition-colors z-20"
        disabled={isTransitioning}
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default FeaturedCarousel;
