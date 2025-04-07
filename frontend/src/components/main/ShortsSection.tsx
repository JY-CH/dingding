import { useState } from 'react';

import { motion } from 'framer-motion';

import { mockShorts } from '../../data/mockData';

const ShortsSection = () => {
  const [hoveredShort, setHoveredShort] = useState<string | null>(null);
  const [isModal, setIsModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  return (
    <>
      {/* 모달 창 */}
      {isModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-gradient-to-br from-zinc-800 via-zinc-700 to-zinc-900 rounded-2xl shadow-2xl p-8 w-full max-w-lg"
          >
            {/* 닫기 버튼 */}
            <button
              onClick={() => setIsModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
            >
              ✕
            </button>

            {/* 모달 헤더 */}
            <h2 className="text-2xl font-bold text-white mb-6">비디오 업로드</h2>

            {/* 업로드 폼 */}
            <form>
              <div className="mb-6">
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  비디오 파일 선택
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <button
                    type="button"
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-medium hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-500/20"
                  >
                    {selectedFile ? selectedFile.name : '파일 선택'}
                  </button>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-zinc-300 mb-2">제목</label>
                <input
                  type="text"
                  className="block w-full text-sm text-zinc-300 bg-zinc-800 border border-zinc-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="비디오 제목을 입력하세요"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-medium hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-500/20"
              >
                업로드
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* 쇼츠 섹션 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-8"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="flex flex-row items-center gap-3">
              <h2 className="text-xl font-bold bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
                쇼츠
              </h2>
              <div className="bg-white/5 rounded-full px-3 py-1 text-xs font-medium text-white/60 flex items-center gap-2">
                <button
                  onClick={() => setIsModal(true)}
                  className="text-xl font-bold bg-amber-400 from-amber-700 to-amber-700 bg-clip-text text-transparent"
                >
                  업로드
                </button>
              </div>
            </div>
            <p className="text-zinc-400 text-xs mt-1">기타리스트들의 연주 영상을 만나보세요</p>
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
                className={`aspect-[9/16] rounded-xl overflow-hidden relative transition-transform duration-300 ease-out transform ${
                  hoveredShort === short.id ? 'scale-[1.02]' : ''
                }`}
              >
                <img
                  src={short.thumbnail}
                  alt={short.title}
                  className="w-full h-full object-cover transition-transform duration-700"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${
                    hoveredShort === short.id ? 'opacity-100' : 'opacity-90'
                  }`}
                />
                <div
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                    hoveredShort === short.id ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
                  }`}
                >
                  <button className="w-12 h-12 flex items-center justify-center bg-amber-500 rounded-full text-white shadow-lg transform transition-transform hover:scale-110">
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
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
};

export default ShortsSection;
