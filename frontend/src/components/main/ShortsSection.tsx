import { useState } from 'react';

import { motion } from 'framer-motion';

import { mockShorts } from '../../data/mockData';

const ShortsSection = () => {
  const [hoveredShort, setHoveredShort] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="mt-8"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
            쇼츠
          </h2>
          <p className="text-zinc-400 text-xs mt-1">기타리스트들의 연주 영상을 만나보세요</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors group">
            <svg
              className="w-5 h-5 text-white/60 group-hover:text-white transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors group">
            <svg
              className="w-5 h-5 text-white/60 group-hover:text-white transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
        {mockShorts.map((short, index) => (
          <motion.div
            key={short.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            className="relative group"
            onMouseEnter={() => setHoveredShort(short.id)}
            onMouseLeave={() => setHoveredShort(null)}
          >
            <div
              className={`
              aspect-[9/16] rounded-xl overflow-hidden relative
              transition-transform duration-300 ease-out transform
              ${hoveredShort === short.id ? 'scale-[1.02]' : ''}
            `}
            >
              {/* 썸네일 이미지 */}
              <img
                src={short.thumbnail}
                alt={short.title}
                className="w-full h-full object-cover transition-transform duration-700"
              />

              {/* 오버레이 그라디언트 */}
              <div
                className={`
                absolute inset-0 bg-gradient-to-t 
                from-black/80 via-black/40 to-transparent
                transition-opacity duration-300
                ${hoveredShort === short.id ? 'opacity-100' : 'opacity-90'}
              `}
              />

              {/* 재생 버튼 */}
              <div
                className={`
                absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                transition-all duration-300
                ${hoveredShort === short.id ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}
              `}
              >
                <button
                  className="w-12 h-12 flex items-center justify-center bg-amber-500 rounded-full text-white
                  shadow-lg transform transition-transform hover:scale-110"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                  </svg>
                </button>
              </div>

              {/* 정보 영역 */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div
                  className={`
                  transform transition-all duration-300
                  ${hoveredShort === short.id ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-90'}
                `}
                >
                  <p className="text-white text-sm font-medium line-clamp-2 mb-1.5">
                    {short.title}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-amber-400 text-xs">{short.artist}</p>
                    <span className="w-1 h-1 bg-white/30 rounded-full" />
                    {/* <p className="text-white/60 text-xs">{short.views}k 조회</p> */}
                  </div>
                </div>
              </div>

              {/* 재생 시간 */}
              <div
                className={`
                absolute top-2 right-2 px-2 py-1 
                rounded-full text-xs font-medium
                transition-all duration-300
                ${
                  hoveredShort === short.id
                    ? 'bg-amber-500 text-white'
                    : 'bg-black/60 text-white/90'
                }
              `}
              >
                {short.duration}
              </div>

              {/* 좋아요 버튼 */}
              <button
                className={`
                absolute top-2 left-2 p-2 rounded-full
                transition-all duration-300
                ${
                  hoveredShort === short.id
                    ? 'opacity-100 bg-white/10 hover:bg-white/20'
                    : 'opacity-0'
                }
              `}
              >
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ShortsSection;
