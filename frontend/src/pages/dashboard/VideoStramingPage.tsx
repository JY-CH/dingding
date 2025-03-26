import React from 'react';

import { useNavigate, useLocation } from 'react-router-dom';

interface Song {
  title: string;
  artist: string;
  thumbnail: string;
}

interface LocationState {
  song: Song;
  videoUrl: string;
}

const VideoStreamingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const song = state?.song || {
    title: 'Unknown Song',
    artist: 'Unknown Artist',
    thumbnail: 'src/assets/노래.jpg',
  };
  const videoUrl = state?.videoUrl || 'src/assets/sample-video.mp4';

  return (
    <div className="bg-zinc-900 min-h-screen flex flex-col">
      <button onClick={() => navigate(-1)} className="text-orange-500 hover:text-orange-600 p-4">
        뒤로가기
      </button>
      <div className="flex-grow flex justify-center items-center">
        <div className="w-full max-w-4xl bg-black rounded-lg overflow-hidden shadow-lg">
          <video src={videoUrl} controls autoPlay className="w-full h-auto object-cover">
            동영상을 지원하지 않는 브라우저입니다.
          </video>
        </div>
      </div>
      <div className="p-6 bg-zinc-800">
        <div className="text-xl font-bold text-white">{song.title}</div>
        <div className="text-sm text-gray-400">{song.artist}</div>
      </div>
    </div>
  );
};

export default VideoStreamingPage;
