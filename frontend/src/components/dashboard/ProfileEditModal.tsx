import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { X, Camera } from "lucide-react";

const ProfileModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState("임재열");
  const [email, setEmail] = useState("ding@ding.com");
  const [profileImage, setProfileImage] = useState("src/assets/띵까띵까.png");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
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
      <Dialog.Panel className="bg-[#FFFBF2] rounded-2xl shadow-lg w-full max-w-md p-6 relative">
        {/* 닫기 버튼 */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          <X size={20} />
        </button>

        {/* 타이틀 */}
        <Dialog.Title className="text-xl font-bold text-center mb-6">내 정보 수정</Dialog.Title>

        {/* 프로필 이미지 */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-24 h-24">
            <img
              src={profileImage}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
            />
            <label className="absolute bottom-0 right-0 bg-orange-950 text-white p-1 rounded-full cursor-pointer">
              <Camera size={30} fill="#6A4E23"/>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>
        </div>

        {/* 입력 필드 */}
        <div className="space-y-6">
          <div>
            <label className="text-gray-600 text-sm">이메일 주소</label>
            <input
              type="text"
              value={email}
              disabled
              className="w-full px-3 py-2 bg-transparent focus:outline-none border-b border-[#905D00]"
            />
          </div>
          <div>
            <label className="text-gray-600 text-sm">닉네임</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-transparent focus:outline-none border-b border-[#905D00]"
            />
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="mt-8 flex flex-col gap-4">
          {/* 수정하기 버튼 - 상단 */}
          <button
            className="w-full py-3 bg-[#F5F1E8] text-gray-800 rounded-md font-bold shadow-lg hover:bg-[#EDE2D6]"
            onClick={() => {
              // 수정하기 처리 로직
            }}
          >
            수정하기
          </button>

          {/* 탈퇴하기 버튼 - 하단 */}
          <button
            className="w-full py-3 bg-[#FD6060] text-white rounded-md font-bold hover:bg-[#e54b4b]"
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
