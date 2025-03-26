import { useState, useEffect } from 'react';

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
            transition-all duration-700 ease-in-out
            ${currentSlide === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
          `}
          onTransitionEnd={() => setIsTransitioning(false)}
        >
          <div className="absolute inset-0 flex">
            {/* 왼쪽 콘텐츠 영역 */}
            <div className="w-2/3 p-12 pl-16 flex flex-col justify-center relative z-10">
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

            {/* 오른쪽 이미지 영역 */}
            <div className="w-1/3 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/80 to-transparent z-10" />
              <img
                src={item.imageUrl}
                alt={item.title}
                className={`
                  absolute inset-0 w-full h-full object-cover
                  transition-all duration-1000
                  ${currentSlide === index ? 'scale-100 opacity-100' : 'scale-110 opacity-0'}
                `}
              />
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
