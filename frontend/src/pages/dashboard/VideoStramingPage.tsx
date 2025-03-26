import React from 'react';

import { ArrowLeft } from 'lucide-react';
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

  // song과 videoUrl 정보가 없으면 기본값 처리
  const song = state?.song || {
    title: 'Unknown Song',
    artist: 'Unknown Artist',
    thumbnail: 'src/assets/노래.jpg',
  };
  const videoUrl = state?.videoUrl || 'src/assets/sample-video.mp4';

  return (
    <div className="bg-amber-50 min-h-screen flex flex-col">
      {/* 상단 네비게이션 바 */}
      <div className="px-6 pt-4 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-amber-500 hover:text-amber-600"
        >
          <ArrowLeft size={16} className="mr-1" /> 뒤로가기
        </button>
      </div>

      {/* 영상 재생 영역 */}
      <div className="flex-grow flex justify-center items-center px-6">
        <div className="w-full max-w-4xl bg-black rounded-lg overflow-hidden shadow-lg">
          <video src={videoUrl} controls autoPlay className="w-full h-auto object-cover">
            동영상을 지원하지 않는 브라우저입니다.
          </video>
        </div>
      </div>

      {/* 노래 정보 하단 영역 */}
      <div className="px-6 py-4 bg-stone-100">
        <div className="text-xl font-bold">{song.title}</div>
        <div className="text-sm text-gray-500">{song.artist}</div>
      </div>
    </div>
  );
};

export default VideoStreamingPage;
