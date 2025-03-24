import React from 'react';

import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface Song {
  title: string;
  artist: string;
  duration: string;
  score: number;
  thumbnail: string;
}

const AllSongsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const songs: Song[] = location.state?.songs || [];

  // 각 노래에 대응하는 임시 동영상 URL (실제 동영상 주소가 있다면 각 노래마다 다르게 지정)
  const defaultVideoUrl = 'src/assets/sample-video.mp4';

  return (
    <div className="bg-amber-50 px-6 pl-20 min-h-screen flex">
      {/* 사이드바 공간 */}
      <div className="w-40" />
      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1">
        <div className="bg-stone-100 p-6 rounded-2xl shadow-md">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-amber-500 hover:text-amber-600 mb-4"
          >
            <ArrowLeft size={16} className="mr-1" /> 뒤로가기
          </button>
          <h2 className="text-xl font-bold mb-4">모든 노래</h2>
          <div className="grid grid-cols-1 gap-4">
            {songs.map((song, index) => (
              <div
                key={index}
                onClick={() => navigate('/stream', { state: { song, videoUrl: defaultVideoUrl } })}
                className="bg-white p-4 rounded shadow hover:bg-amber-50 transition-colors flex items-center cursor-pointer"
              >
                <img
                  src={song.thumbnail}
                  alt="앨범 커버"
                  className="w-12 h-12 object-cover rounded mr-4"
                />
                <div>
                  <div className="font-bold">{song.title}</div>
                  <div className="text-sm text-gray-500">{song.artist}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllSongsPage;
