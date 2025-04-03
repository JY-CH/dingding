import React from 'react';

import { HiOutlineVideoCamera, HiOutlineVideoCameraSlash } from 'react-icons/hi2';
import Webcam from 'react-webcam';

interface WebcamViewProps {
  isWebcamOn: boolean;
  setIsWebcamOn: (isOn: boolean) => void;
}

const WebcamView: React.FC<WebcamViewProps> = ({ isWebcamOn, setIsWebcamOn }) => {
  return (
    <div className="h-full bg-zinc-800 rounded-xl overflow-hidden">
      <div className="h-full relative">
        {isWebcamOn ? (
          <>
            <Webcam 
              audio={false} 
              className="w-full h-full object-cover" 
              mirrored={true}
              videoConstraints={{
                width: { min: 480, ideal: 640, max: 800 },
                height: { min: 360, ideal: 480, max: 600 },
                aspectRatio: 4/3,
              }}
            />
            <button
              onClick={() => setIsWebcamOn(false)}
              className="absolute top-4 right-4 p-2 bg-red-500/80 hover:bg-red-500 rounded-lg z-10"
            >
              <HiOutlineVideoCameraSlash className="w-5 h-5 text-white" />
            </button>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
            <HiOutlineVideoCamera className="w-12 h-12 text-zinc-400 mb-4" />
            <button
              onClick={() => setIsWebcamOn(true)}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg"
            >
              웹캠 켜기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebcamView;
