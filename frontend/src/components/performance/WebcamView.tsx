import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineVideoCamera } from 'react-icons/hi';
import { HiOutlineVideoCameraSlash } from 'react-icons/hi2';

interface WebcamViewProps {
  isWebcamOn: boolean;
  setIsWebcamOn: (isOn: boolean) => void;
}

const WebcamView: React.FC<WebcamViewProps> = ({ isWebcamOn, setIsWebcamOn }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isWebcamOn) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.error('웹캠 접근 실패:', err);
          setIsWebcamOn(false);
        });
    } else {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  }, [isWebcamOn, setIsWebcamOn]);

  return (
    <div className="relative h-full flex flex-col">
      {/* 웹캠 화면 또는 대기 화면 */}
      <div className="relative flex-grow rounded-xl overflow-hidden bg-black/40">
        <AnimatePresence mode="wait">
          {isWebcamOn ? (
            <motion.video
              key="webcam"
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            />
          ) : (
            <motion.div
              key="placeholder"
              className="w-full h-full flex flex-col items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-rose-500/20 to-orange-500/20 rounded-full blur-xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
                <HiOutlineVideoCameraSlash className="relative w-16 h-16 text-white/60" />
              </div>
              <p className="mt-4 text-white/60 font-medium">웹캠이 꺼져있습니다</p>
              <p className="mt-2 text-sm text-white/40">
                버튼을 클릭하여 웹캠을 켜주세요
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 웹캠 상태 표시 및 토글 버튼 */}
        <motion.button
          onClick={() => setIsWebcamOn(!isWebcamOn)}
          className={`absolute bottom-4 right-4 p-3 rounded-xl backdrop-blur-md 
            ${isWebcamOn 
              ? 'bg-white/10 hover:bg-white/20' 
              : 'bg-rose-500/20 hover:bg-rose-500/30'} 
            border border-white/10 shadow-lg transition-colors`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isWebcamOn ? (
            <HiOutlineVideoCamera className="w-6 h-6 text-white" />
          ) : (
            <HiOutlineVideoCameraSlash className="w-6 h-6 text-white" />
          )}
        </motion.button>

        {/* 웹캠 활성화 상태 표시 */}
        {isWebcamOn && (
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-rose-500"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.7, 1]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            <span className="text-xs font-medium text-white/60">
              녹화 중
            </span>
          </div>
        )}

        {/* 프레임 효과 */}
        <div className="absolute inset-0 pointer-events-none">
          {/* 모서리 장식 */}
          <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-white/20" />
          <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-white/20" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-white/20" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-white/20" />
        </div>
      </div>
    </div>
  );
};

export default WebcamView;
