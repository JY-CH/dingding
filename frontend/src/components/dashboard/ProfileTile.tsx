import React, { useState } from 'react';

import ProfileEditModal from './ProfileEditModal';

interface ProfileTileProps {
  name: string;
  email: string;
  rank: string;
  profileImageUrl: string;
  backgroundImageUrl: string;
}

const ProfileTile: React.FC<ProfileTileProps> = ({
  name,
  email,
  rank,
  profileImageUrl,
  backgroundImageUrl,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-zinc-800 rounded-lg shadow-md overflow-hidden">
      {/* 배경 이미지와 내용을 함께 포함하는 컨테이너 */}
      <div className="relative">
        {/* 배경 이미지를 오른쪽에 배치 */}
        <div className="absolute top-0 right-0 h-full">
          <img
            src={backgroundImageUrl}
            alt="배경"
            className="h-full w-full object-cover opacity-20"
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
              <div className="flex items-center gap-2 mt-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center bg-amber-500 text-white">
                  🎸
                </div>
                <div className="w-6 h-6 rounded-full flex items-center justify-center bg-amber-500 text-white">
                  🏆
                </div>
                <span className="text-lg font-semibold text-white">{rank}</span>
              </div>
            </div>
          </div>

          {/* 내 정보 수정 버튼 */}
          <div className="flex justify-end mt-4">
            <button
              className="px-4 py-2 bg-amber-500 text-white text-sm font-bold rounded-md shadow hover:bg-orange-600 transition-colors"
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
