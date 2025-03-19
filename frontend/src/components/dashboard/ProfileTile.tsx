import React from 'react';

interface ProfileTileProps {
  name: string;
  email: string;
  rank: string;
  imageUrl: string;
}

const ProfileTile: React.FC<ProfileTileProps> = ({ name, email, rank, imageUrl }) => {
  return (
    <div className="bg-amber-50 rounded-lg p-6 shadow-md relative overflow-hidden">
      {/* 배경 이미지 */}
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 opacity-30 max-h-full">
        {imageUrl ? (
          <img src={imageUrl} alt="배경" className="h-full object-contain mix-blend-multiply" />
        ) : (
          <div className="w-full h-full bg-amber-100 flex items-center justify-center">
            <span className="text-8xl text-amber-300">♪</span>
          </div>
        )}
      </div>

      {/* 내 프로필 텍스트 */}
      <div className="absolute left-6 top-4 text-gray-700 text-sm font-medium">내 프로필</div>

      {/* 프로필 내용 */}
      <div className="flex items-center gap-4 z-10 relative mt-4">
        <img
          src={imageUrl}
          alt="프로필"
          className="w-16 h-16 rounded-full border-2 border-gray-200 object-cover"
        />
        <div>
          <h2 className="text-lg font-bold">{name}</h2>
          <p className="text-gray-500 text-sm">{email}</p>
          <div className="flex items-center mt-2">
            <span className="text-amber-500 mr-2">♪</span>
            <span className="text-amber-500 font-medium">{rank}</span>
          </div>
        </div>
      </div>

      {/* 수정 버튼 */}
      <div className="absolute right-4 bottom-4 bg-white text-gray-600 px-3 py-1 rounded-full text-xs cursor-pointer hover:bg-gray-100 shadow-sm">
        내 정보 수정
      </div>
    </div>
  );
};

export default ProfileTile;
