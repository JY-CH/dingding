import React, { useState, memo } from 'react';

import { Clock, Star, Repeat, Edit } from 'lucide-react';

import ProfileEditModal from './ProfileEditModal';

interface ProfileTileProps {
  name: string;
  email: string;
  playtimerank: string;
  avgscorerank: string;
  totaltryrank: string;
  profileImageUrl: string;
  backgroundImageUrl: string;
  createAt: string;
}

const ProfileTile: React.FC<ProfileTileProps> = ({
  name,
  email,
  playtimerank,
  avgscorerank,
  totaltryrank,
  profileImageUrl,
  backgroundImageUrl,
  createAt,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const formattedDate = new Date(createAt).toLocaleDateString('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="backdrop-blur-lg group">
      {/* 배경 이미지와 내용을 함께 포함하는 컨테이너 */}
      <div className="relative overflow-hidden">
        {/* 배경 이미지 */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-zinc-900/60 z-0"></div>
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-amber-600/10 blur-2xl"></div>
        <div className="absolute top-0 right-0 h-full p-4">
          <img
            src={backgroundImageUrl}
            alt="배경"
            className="h-full w-full object-cover opacity-20 pr-10"
            loading="lazy"
          />
        </div>

        {/* 내용 영역 */}
        <div className="relative z-10 p-6">
          {/* 내 프로필 타이틀 */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white text-lg font-bold bg-zinc-800/40 px-2 rounded-full backdrop-blur-sm">
              내 프로필
            </h2>
            <span className="text-xs text-zinc-400">가입일: {formattedDate}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center">
            {/* 프로필 이미지 */}
            <div className="relative group/image">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-zinc-700/80 to-zinc-900/80 p-0.5 ring-2 ring-white/10 group-hover:ring-amber-500/50 transition-all duration-300">
                <img
                  src={profileImageUrl}
                  alt="프로필"
                  className="w-full h-full rounded-full object-cover"
                  loading="lazy"
                />
              </div>
              <div
                className="absolute inset-0 rounded-full opacity-0 group-hover/image:opacity-100 bg-black/40 flex items-center justify-center transition-opacity cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              >
                <Edit size={20} className="text-white" />
              </div>
            </div>

            {/* 유저 정보 */}
            <div className="mt-6 md:mt-0 md:ml-6">
              <h3 className="text-2xl font-bold text-white group-hover:text-amber-500 transition-colors">
                {name}
              </h3>
              <p className="text-sm text-zinc-400 mt-1">{email}</p>

              {/* 랭킹 정보 */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {/* 플레이 시간 랭킹 */}
                <div className="group/rank relative">
                  <div className="flex items-center gap-2 bg-zinc-800/60 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/5 hover:border-amber-500/30 transition-all">
                    <Clock size={18} className="text-amber-500" />
                    <span className="text-sm text-white font-medium">{playtimerank}</span>
                  </div>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-800/90 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg hidden group-hover/rank:block transition-all whitespace-nowrap border border-white/10 backdrop-blur-sm">
                    플레이 시간 랭킹
                  </div>
                </div>

                {/* 평균 점수 랭킹 */}
                <div className="group/rank relative">
                  <div className="flex items-center gap-2 bg-zinc-800/60 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/5 hover:border-amber-500/30 transition-all">
                    <Star size={18} className="text-amber-500" />
                    <span className="text-sm text-white font-medium">{avgscorerank}</span>
                  </div>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-800/90 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg hidden group-hover/rank:block transition-all whitespace-nowrap border border-white/10 backdrop-blur-sm">
                    평균 점수 랭킹
                  </div>
                </div>

                {/* 총 시도 횟수 랭킹 */}
                <div className="group/rank relative">
                  <div className="flex items-center gap-2 bg-zinc-800/60 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/5 hover:border-amber-500/30 transition-all">
                    <Repeat size={18} className="text-amber-500" />
                    <span className="text-sm text-white font-medium">{totaltryrank}</span>
                  </div>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-800/90 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg hidden group-hover/rank:block transition-all whitespace-nowrap border border-white/10 backdrop-blur-sm">
                    총 시도 횟수 랭킹
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 내 정보 수정 버튼 */}
          <div className="flex justify-end mt-6">
            <button
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-medium rounded-md shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:from-amber-600 hover:to-amber-700 transition-all"
              onClick={() => setIsModalOpen(true)}
            >
              내 정보 수정
            </button>
          </div>
        </div>
      </div>

      {/* 필요할 때만 모달 렌더링 */}
      {isModalOpen && (
        <ProfileEditModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          name={name}
          email={email}
          profileImageUrl={profileImageUrl}
          createAt={createAt}
        />
      )}
    </div>
  );
};

export default memo(ProfileTile);
