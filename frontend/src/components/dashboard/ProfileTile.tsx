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
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
      {/* 배경 이미지와 내용을 함께 포함하는 컨테이너 */}
      <div className="relative">
        {/* 배경 이미지를 오른쪽에 배치 */}
        <div className="absolute top-0 right-0 h-full">
          <img
            src={backgroundImageUrl}
            alt="배경"
            className="h-full w-auto object-contain object-right opacity-30"
          />
        </div>

        {/* 내용 영역 */}
        <div className="relative z-10 p-6">
          {/* 내 프로필 타이틀 */}
          <h2 className="text-black text-l font-extrabold mb-4">내 프로필</h2>

          <div className="flex flex-col md:flex-row md:items-center">
            {/* 프로필 이미지 */}
            <img
              src={profileImageUrl}
              alt="프로필"
              className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
            />
            {/* 유저 정보 */}
            <div className="mt-4 md:mt-0 md:ml-6">
              <h3 className="text-2xl font-bold tracking-wider">{name}</h3>
              <p className="text-sm text-gray-500 mt-1">{email}</p>
              <span className="w-6 h-6 rounded-full flex items-center justify-center mt-1">
                🎸
              </span>
              <div className="flex items-center gap-2 mt-2 sm:mt-0">
              <div className="w-6 h-6 rounded-full flex items-center justify-center">
                🏆
              </div>
              <span className="text-xl font-semibold">{rank}</span>
            </div>
            </div>
          </div>

          {/* 내 정보 수정 버튼 */}
          <div className="flex justify-end mt-4">
            <button
              className="w-28 h-8 bg-[#F5F1E8] text-gray-700 text-sm font-bold rounded-md shadow hover:bg-gray-200"
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
