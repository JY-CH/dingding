import { useState } from "react";

import { Dialog } from "@headlessui/react";
import { X, Camera } from "lucide-react";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  email: string;
  profileImageUrl: string;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, name: initialName, email, profileImageUrl: initialProfileImage }) => {
  const [name, setName] = useState(initialName);
  const [profileImage, setProfileImage] = useState(initialProfileImage);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
    >
      <Dialog.Panel className="bg-zinc-800 rounded-2xl shadow-lg w-full max-w-md p-6 relative">
        {/* 닫기 버튼 */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-200">
          <X size={20} />
        </button>

        {/* 타이틀 */}
        <Dialog.Title className="text-xl font-bold text-white mb-6">내 정보 수정</Dialog.Title>

        {/* 프로필 이미지 */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-24 h-24">
            <img
              src={profileImage}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-zinc-700"
            />
            <label className="absolute bottom-0 right-0 p-1 bg-amber-500 rounded-full cursor-pointer hover:bg-amber-600 transition-colors">
              <Camera size={20} className="text-white" />
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>
        </div>

        {/* 입력 필드 */}
        <div className="space-y-6">
          <div>
            <label className="text-gray-400 text-sm font-bold">이메일 주소</label>
            <input
              type="text"
              value={email}
              disabled
              className="text-gray-400 font-semibold w-full px-3 py-2 bg-transparent focus:outline-none border-b border-zinc-600"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm font-bold">닉네임</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full font-bold px-3 py-2 bg-transparent focus:outline-none border-b border-amber-500 text-white"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm font-bold">가입일</label>
            <input
              type="text"
              value="2025.03.14"
              disabled
              className="text-gray-400 font-bold w-full px-3 py-2 bg-transparent focus:outline-none border-b border-zinc-600"
            />
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="mt-8 flex flex-col gap-4">
          {/* 수정하기 버튼 - 상단 */}
          <button
            className="w-full py-3 bg-amber-500 text-white rounded-md font-bold shadow-lg hover:bg-amber-600 transition-colors"
            onClick={() => {
              // 수정하기 처리 로직
            }}
          >
            수정하기
          </button>

          {/* 탈퇴하기 버튼 - 하단 */}
          <button
            className="w-full py-3 bg-red-500 text-white rounded-md font-bold hover:bg-red-600 transition-colors"
            onClick={() => {
              // 탈퇴하기 처리 로직
              onClose();
            }}
          >
            탈퇴하기
          </button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};

export default ProfileModal;