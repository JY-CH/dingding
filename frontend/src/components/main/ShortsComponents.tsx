import { motion } from 'framer-motion';

interface ShortsComponentsProps {
  short: {
    username: string;
    title: string;
    fileUrl: string;
  };
  onClose: () => void; // 모달 닫기 핸들러
}

const ShortsComponents = ({ short, onClose }: ShortsComponentsProps) => {
  return (
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
        className="relative bg-gradient-to-br from-zinc-800 via-zinc-700 to-zinc-900 rounded-2xl shadow-2xl p-8 w-full max-w-2xl"
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
        >
          ✕
        </button>

        {/* 비디오 및 정보 */}
        <div className="flex flex-col">
          <video src={short.fileUrl} controls className="w-full rounded-lg mb-4" />
          <h2 className="text-xl font-bold text-white">{short.title}</h2>
          <p className="text-sm text-zinc-400 mt-2">작성자 : {short.username}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ShortsComponents;
