import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineVideoCamera, HiOutlineVideoCameraSlash } from 'react-icons/hi2';
import Webcam from 'react-webcam';

interface WebcamViewProps {
  isWebcamOn: boolean;
  setIsWebcamOn: (isOn: boolean) => void;
}

const WebcamView: React.FC<WebcamViewProps> = ({ isWebcamOn, setIsWebcamOn }) => {
  return (
    <div className="h-full bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 shadow-xl overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="flex items-center p-3">
          <div className={`w-2 h-2 rounded-full ${isWebcamOn ? 'bg-rose-500 animate-pulse' : 'bg-gray-500'} mr-2`}></div>
          <h3 className="text-sm font-semibold text-white/80">웹캠</h3>
        </div>
        
        <div className="flex-grow relative">
          <AnimatePresence mode="wait">
            {isWebcamOn ? (
              <motion.div
                key="webcam"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                <Webcam 
                  audio={false} 
                  className="w-full h-full object-cover rounded-b-lg" 
                  mirrored={true}
                  videoConstraints={{
                    width: { min: 480, ideal: 640, max: 800 },
                    height: { min: 360, ideal: 480, max: 600 },
                    aspectRatio: 4/3,
                  }}
                />
                <motion.button
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => setIsWebcamOn(false)}
                  className="absolute top-4 right-4 p-2 bg-red-500/80 hover:bg-red-500 rounded-lg z-10 shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <HiOutlineVideoCameraSlash className="w-5 h-5 text-white" />
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-black/20 to-black/40 rounded-b-lg"
              >
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col items-center"
                >
                  <div className="relative">
                    <HiOutlineVideoCamera className="w-16 h-16 text-white/30" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                      <div className="w-20 h-20 rounded-full bg-blue-500/30 animate-ping"></div>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => setIsWebcamOn(true)}
                    className="mt-5 px-6 py-2.5 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-lg shadow-lg"
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    웹캠 켜기
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default WebcamView;
