import React from 'react';
import Webcam from 'react-webcam';
import { HiOutlineVideoCamera, HiOutlineVideoCameraSlash } from 'react-icons/hi2';

interface WebcamViewProps {
  isWebcamOn: boolean;
  setIsWebcamOn: (isOn: boolean) => void;
}

const WebcamView: React.FC<WebcamViewProps> = ({ isWebcamOn, setIsWebcamOn }) => {
  return (
    <div className="bg-zinc-800 rounded-xl overflow-hidden">
      <div className="aspect-video relative">
        {isWebcamOn ? (
          <>
            <Webcam
              audio={false}
              className="w-full h-full object-cover"
              mirrored={true}
            />
            <button
              onClick={() => setIsWebcamOn(false)}
              className="absolute top-4 right-4 p-2 bg-red-500/80 hover:bg-red-500 rounded-lg"
            >
              <HiOutlineVideoCameraSlash className="w-5 h-5" />
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