import React, { useState } from 'react';

import { Clock, Star, Repeat } from 'lucide-react';

import ProfileEditModal from './ProfileEditModal';

interface ProfileTileProps {
  name: string;
  email: string;
  playtimerank: string;
  avgscorerank: string;
  totaltryrank: string;
  profileImageUrl: string;
  backgroundImageUrl: string;
}

const ProfileTile: React.FC<ProfileTileProps> = ({
  name,
  email,
  playtimerank,
  avgscorerank,
  totaltryrank,
  profileImageUrl,
  backgroundImageUrl,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-zinc-800 rounded-lg shadow-md overflow-hidden">
      {/* 배경 이미지와 내용을 함께 포함하는 컨테이너 */}
      <div className="relative">
        {/* 배경 이미지 */}
        <div className="absolute top-0 right-0 h-full">
          <img
            src={backgroundImageUrl}
            alt="배경"
            className="h-full w-full object-cover opacity-20 pr-10"
          />
        </div>

        {/* 내용 영역 */}
        <div className="relative z-10 p-6">
          {/* 내 프로필 타이틀 */}
          <h2 className="text-white text-lg font-bold mb-4">내 프로필</h2>

          <div className="flex flex-col md:flex-row md:items-center">
            {/* 프로필 이미지 */}
            <img
              src={profileImageUrl}
              alt="프로필"
              className="w-24 h-24 rounded-full object-cover border-4 border-zinc-900 shadow-md"
            />
            {/* 유저 정보 */}
            <div className="mt-4 md:mt-0 md:ml-6">
              <h3 className="text-xl font-bold text-white">{name}</h3>
              <p className="text-sm text-gray-400 mt-1">{email}</p>
              {/* 랭킹 정보 */}
              <div className="mt-4 flex space-x-4">
                {/* 플레이 시간 랭킹 */}
                <div className="flex items-center">
                  <div className="flex items-center gap-1 group relative">
                    <Clock size={16} className="text-amber-500" />
                    <span className="text-sm text-white font-semibold bg-zinc-700 px-2 py-1 rounded-md">
                      {playtimerank}
                    </span>
                    <div className="absolute hidden group-hover:block top-6 left-1/2 -translate-x-1/2 bg-zinc-700 text-white text-xs p-2 rounded-md whitespace-nowrap">
                      플레이 시간 랭킹
                    </div>
                  </div>
                </div>
                {/* 평균 점수 랭킹 */}
                <div className="flex items-center">
                  <div className="flex items-center gap-1 group relative">
                    <Star size={16} className="text-amber-500" />
                    <span className="text-sm text-white font-semibold bg-zinc-700 px-2 py-1 rounded-md">
                      {avgscorerank}
                    </span>
                    <div className="absolute hidden group-hover:block top-6 left-1/2 -translate-x-1/2 bg-zinc-700 text-white text-xs p-2 rounded-md whitespace-nowrap">
                      평균 점수 랭킹
                    </div>
                  </div>
                </div>
                {/* 총 시도 횟수 랭킹 */}
                <div className="flex items-center">
                  <div className="flex items-center gap-1 group relative">
                    <Repeat size={16} className="text-amber-500" />
                    <span className="text-sm text-white font-semibold bg-zinc-700 px-2 py-1 rounded-md">
                      {totaltryrank}
                    </span>
                    <div className="absolute hidden group-hover:block top-6 left-1/2 -translate-x-1/2 bg-zinc-700 text-white text-xs p-2 rounded-md whitespace-nowrap">
                      총 시도 횟수 랭킹
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 내 정보 수정 버튼 */}
          <div className="flex justify-end mt-4">
            <button
              className="px-4 py-2 bg-amber-500 text-white text-sm font-bold rounded-md shadow hover:bg-amber-600 transition-colors"
              onClick={() => setIsModalOpen(true)}
            >
              내 정보 수정
            </button>
          </div>
        </div>
      </div>

      {/* 모달 추가 */}
      <ProfileEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        name={name}
        email={email}
        profileImageUrl={profileImageUrl}
      />
    </div>
  );
};

export default ProfileTile;
