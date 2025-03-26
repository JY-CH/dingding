import React, { useState, useEffect } from 'react';

interface HeroSlide {
  id: number;
  title: string;
  artist: string;
  description: string;
  image: string;
  likes: number;
  plays: number;
}

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    title: 'Story Time',
    artist: 'Luddy Dave',
    description: "L'heure du Conte - 새로운 앨범 발매",
    image: '/images/featured/story-time-banner.jpg',
    likes: 24680,
    plays: 158900,
  },
  // 추가 슬라이드 데이터...
];

const HeroCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [currentSlide]);

  const nextSlide = () => {
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="relative h-[500px] overflow-hidden">
      <div
        className="absolute inset-0 flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        onTransitionEnd={() => setIsTransitioning(false)}
      >
        {heroSlides.map((slide) => (
          <div key={slide.id} className="relative w-full flex-shrink-0">
            <div className="absolute inset-0 flex">
              <div className="w-2/3 p-10 flex flex-col justify-center relative z-10">
                <span className="text-sm font-medium text-amber-400 mb-2">새로운 앨범</span>
                <h2 className="text-4xl font-bold text-white mb-3">{slide.title}</h2>
                <p className="text-xl text-white/80 mb-2">{slide.artist}</p>
                <p className="text-base text-white/60 mb-6 max-w-lg">{slide.description}</p>
                <div className="flex items-center gap-6">
                  <button className="px-8 py-3 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold transition-colors">
                    지금 듣기
                  </button>
                  <div className="flex items-center gap-4 text-sm text-white/60">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                      </svg>
                      {slide.likes.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                      </svg>
                      {slide.plays.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-1/3 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/80 to-transparent z-10" />
                <img
                  alt={slide.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  src={slide.image}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 이전/다음 버튼 */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white/80 hover:bg-black/50 transition-colors z-20"
        onClick={prevSlide}
        disabled={isTransitioning}
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white/80 hover:bg-black/50 transition-colors z-20"
        onClick={nextSlide}
        disabled={isTransitioning}
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default HeroCarousel;
