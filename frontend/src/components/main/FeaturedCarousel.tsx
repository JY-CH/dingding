import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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
  rankings: {
    position: number;
    title: string;
    artist: string;
    change: number;
    trend: 'up' | 'down' | 'same';
    weeklyListeners: number;
  }[];
}

const FeaturedCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

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
      rankings: [
        {
          position: 1,
          title: "Story Time",
          artist: "Luddy Dave",
          change: 2,
          trend: "up",
          weeklyListeners: 1234567
        },
        {
          position: 2,
          title: "Midnight Melodies",
          artist: "Sarah Moon",
          change: 1,
          trend: "down",
          weeklyListeners: 987654
        },
        {
          position: 3,
          title: "Guitar Dreams",
          artist: "Alex Rivers",
          change: 0,
          trend: "same",
          weeklyListeners: 876543
        },
        {
          position: 4,
          title: "Summer Nights",
          artist: "The Waves",
          change: 2,
          trend: "up",
          weeklyListeners: 765432
        },
        {
          position: 5,
          title: "Acoustic Journey",
          artist: "Emma Stone",
          change: 1,
          trend: "down",
          weeklyListeners: 654321
        }
      ],
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
      rankings: [
        {
          position: 1,
          title: "Story Time",
          artist: "Luddy Dave",
          change: 2,
          trend: "up",
          weeklyListeners: 1234567
        },
        {
          position: 2,
          title: "Midnight Melodies",
          artist: "Sarah Moon",
          change: 1,
          trend: "down",
          weeklyListeners: 987654
        },
        {
          position: 3,
          title: "Guitar Dreams",
          artist: "Alex Rivers",
          change: 0,
          trend: "same",
          weeklyListeners: 876543
        },
        {
          position: 4,
          title: "Summer Nights",
          artist: "The Waves",
          change: 2,
          trend: "up",
          weeklyListeners: 765432
        },
        {
          position: 5,
          title: "Acoustic Journey",
          artist: "Emma Stone",
          change: 1,
          trend: "down",
          weeklyListeners: 654321
        }
      ],
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
      rankings: [
        {
          position: 1,
          title: "Story Time",
          artist: "Luddy Dave",
          change: 2,
          trend: "up",
          weeklyListeners: 1234567
        },
        {
          position: 2,
          title: "Midnight Melodies",
          artist: "Sarah Moon",
          change: 1,
          trend: "down",
          weeklyListeners: 987654
        },
        {
          position: 3,
          title: "Guitar Dreams",
          artist: "Alex Rivers",
          change: 0,
          trend: "same",
          weeklyListeners: 876543
        },
        {
          position: 4,
          title: "Summer Nights",
          artist: "The Waves",
          change: 2,
          trend: "up",
          weeklyListeners: 765432
        },
        {
          position: 5,
          title: "Acoustic Journey",
          artist: "Emma Stone",
          change: 1,
          trend: "down",
          weeklyListeners: 654321
        }
      ],
    },
  ];

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
            <div className="w-[62%] p-8 pl-12 flex flex-col justify-center relative z-10">
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
                {item.title}
              </h2>
              <p
                className={`
                text-xl text-white/80 mb-4
                transition-all duration-700 delay-300
                ${currentSlide === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
              `}
              >
                {item.artist}
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
                <button className="px-8 py-3.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold transition-colors">
                  지금 듣기
                </button>
                <button className="px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold transition-colors flex items-center gap-2">
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
                      {item.rankings.slice(0, 3).map((rank, index) => (
                        <motion.div
                          key={`${currentSlide}-${index}`}
                          initial={{ opacity: 0, y: 30, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ 
                            duration: 0.6,
                            delay: 0.2 + index * 0.15,
                            ease: [0.23, 1, 0.32, 1]
                          }}
                          whileHover={{ 
                            scale: 1.05,
                            transition: { duration: 0.2 }
                          }}
                          className={`
                            rounded-lg p-4 h-[140px] cursor-pointer overflow-hidden relative group
                            ${index === 0 
                              ? 'bg-gradient-to-br from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/20' 
                              : index === 1
                                ? 'bg-gradient-to-br from-zinc-300/20 via-zinc-300/10 to-transparent border border-zinc-300/20'
                                : 'bg-gradient-to-br from-orange-800/20 via-orange-800/10 to-transparent border border-orange-800/20'
                            }
                          `}
                        >
                          {/* 순위 뱃지 */}
                          <div className="absolute -right-8 -top-8 w-16 h-16 rotate-45">
                            <div className={`
                              w-full h-full
                              ${index === 0 
                                ? 'bg-amber-500/30' 
                                : index === 1
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
                                    delay: 0.3 + index * 0.15,
                                    ease: "backOut"
                                  }}
                                  className={`
                                    text-3xl font-black
                                    ${index === 0 
                                      ? 'text-amber-500' 
                                      : index === 1
                                        ? 'text-zinc-300'
                                        : 'text-orange-800'
                                    }
                                  `}
                                >
                                  {rank.position}
                                </motion.div>

                                <motion.button
                                  initial={{ opacity: 0, scale: 0.5 }}
                                  whileHover={{ scale: 1.1 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className={`
                                    p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity
                                    ${index === 0 
                                      ? 'bg-amber-500/80 hover:bg-amber-500' 
                                      : index === 1
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
                                    delay: 0.4 + index * 0.15,
                                    ease: "easeOut"
                                  }}
                                >
                                  <div className={`
                                    text-sm font-bold truncate transition-colors
                                    ${index === 0 
                                      ? 'text-white group-hover:text-amber-400' 
                                      : index === 1
                                        ? 'text-white group-hover:text-zinc-300'
                                        : 'text-white group-hover:text-orange-800'
                                    }
                                  `}>
                                    {rank.title}
                                  </div>
                                  <div className="text-xs text-zinc-400 truncate group-hover:text-zinc-300 transition-colors">
                                    {rank.artist}
                                  </div>
                                </motion.div>
                              </div>
                            </div>

                            {/* 순위 변동 요소를 우측 하단으로 확실하게 이동 */}
                            <div className="flex justify-end">
                              <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{
                                  duration: 0.3,
                                  delay: 0.5 + index * 0.15
                                }}
                                className={`
                                  flex items-center gap-1 px-2 py-1 rounded-full text-xs
                                  ${index === 0 
                                    ? 'bg-amber-500/10 text-amber-500' 
                                    : index === 1
                                      ? 'bg-zinc-300/10 text-zinc-300'
                                      : 'bg-orange-800/10 text-orange-800'
                                  }
                                `}
                              >
                                {rank.trend !== 'same' && (
                                  <>
                                    {rank.trend === 'up' ? '↑' : '↓'}
                                    <span>{rank.change}</span>
                                  </>
                                )}
                              </motion.div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* 4-5위 세로 배치 */}
                    <div className="space-y-2">
                      {item.rankings.slice(3).map((rank, index) => (
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
                            <div className="text-xl font-bold text-white/80">{rank.position}</div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-white truncate">
                                {rank.title}
                              </div>
                              <div className="text-xs text-zinc-400 truncate mt-1">
                                {rank.artist}
                              </div>
                            </div>
                            {rank.trend !== 'same' && (
                              <div className={`text-xs ${
                                rank.trend === 'up' ? 'text-green-500' : 'text-red-500'
                              }`}>
                                {rank.trend === 'up' ? '↑' : '↓'}
                                {rank.change}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* 하단 정보 */}
                  <div className="mt-4 pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400">업데이트: 5분 전</span>
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
