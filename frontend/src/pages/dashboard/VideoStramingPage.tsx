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

  const videoUrl = state?.videoUrl || 'src/assets/sample-video.mp4';

  return (
    <div className="bg-zinc-900 min-h-screen flex flex-col px-8 py-6">
      {/* 뒤로가기 버튼 */}
      <button
        onClick={() => navigate(-1)}
        className="text-amber-500 hover:text-amber-600 mb-4 self-start"
      >
        뒤로가기
      </button>

      {/* 메인 레이아웃 */}
      <div className="flex flex-grow gap-6">
        {/* 왼쪽: 영상 */}
        <div className="flex-1 bg-black rounded-lg overflow-hidden shadow-lg">
          <video src={videoUrl} controls autoPlay className="w-full h-full object-cover">
            동영상을 지원하지 않는 브라우저입니다.
          </video>
        </div>

        {/* 오른쪽: 현재 코드 */}
        <div className="flex-1 bg-zinc-800 rounded-lg p-4 shadow-md">
          <h3 className="text-lg font-bold text-white mb-4">현재 코드</h3>
          <div className="bg-zinc-700 rounded-lg p-4 text-sm text-gray-300 overflow-y-auto h-[60%]">
            {/* 여기에 기타 코드 또는 악보 데이터를 렌더링 */}
            <p>코드 데이터가 여기에 표시됩니다.</p>
          </div>
        </div>
      </div>

      {/* 아래쪽: 악보 */}
      <div className="mt-4 flex-grow bg-zinc-800 rounded-lg p-4 shadow-md">
        <h3 className="text-lg font-bold text-white mb-4">현재 악보</h3>
        <div className="bg-zinc-700 rounded-lg p-4 text-sm text-gray-300 overflow-x-auto h-full">
          {/* 여기에 악보 데이터를 렌더링 */}
          <p>악보 데이터가 여기에 표시됩니다.</p>
        </div>
      </div>
    </div>
  );
};

export default VideoStreamingPage;
