import { useState } from 'react';

import { useMutation, useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

// import { mockShorts } from '../../data/mockData';
import { _axiosAuth } from '../../services/JYapi';

interface Short {
  username: string;
  title: string;
  fileUrl: string;
}

type ShortsResponse = Short[];
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

const ShortsSection = () => {
  const [hoveredShort, setHoveredShort] = useState<string | null>(null);
  const [isModal, setIsModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>('');

  const { data: shorts } = useQuery({
    queryKey: ['shorts'],
    queryFn: async () => {
      const { data } = await _axiosAuth.get<ShortsResponse>('/files');
      return data;
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      // 파일 크기 확인
      if (file.size > MAX_FILE_SIZE) {
        alert('100MB 이하의 파일만 업로드할 수 있습니다.');
        return;
      }

      setSelectedFile(file);
    }
  };

  const uploadVide = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      if (!selectedFile) {
        throw new Error('파일이 선택되지 않았습니다.');
      }
      if (!title) {
        throw new Error('제목이 입력되지 않았습니다.');
      }
      console.log('업로드할 파일:', selectedFile);
      console.log('업로드할 제목:', title);
      formData.append('videoFile', selectedFile);
      formData.append('title', title);

      try {
        const { data } = await _axiosAuth.post('/files/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('업로드 성공:', data);
        return data;
      } catch (error) {
        console.error('업로드 실패:', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log('업로드 성공:');
      setIsModal(false);
      setSelectedFile(null);
      setTitle('');
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    uploadVide.mutate();
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
            <form onSubmit={handleSubmit}>
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
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
          {shorts ? (
            shorts.map((short) => (
              <motion.div
                key={short.fileUrl}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative group"
                onMouseEnter={() => setHoveredShort(short.fileUrl)}
                onMouseLeave={() => setHoveredShort(null)}
              >
                <div
                  className={`aspect-[9/16] rounded-xl overflow-hidden relative transition-transform duration-300 ease-out transform ${
                    hoveredShort === short.fileUrl ? 'scale-[1.02]' : ''
                  }`}
                >
                  <video
                    src={short.fileUrl}
                    controls
                    className="w-full h-full object-cover transition-transform duration-700"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${
                      hoveredShort === short.fileUrl ? 'opacity-100' : 'opacity-90'
                    }`}
                  />
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-3 md:col-span-5 flex items-center justify-center h-48 bg-zinc-800 rounded-xl">
              <p className="text-zinc-400">쇼츠가 없습니다</p>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default ShortsSection;
