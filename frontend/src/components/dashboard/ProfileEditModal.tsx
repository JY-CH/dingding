import { useState } from 'react';

import { Dialog } from '@headlessui/react';
import { useQueryClient } from '@tanstack/react-query';
import { X, Camera } from 'lucide-react';

import apiClient from '../../services/dashboardapi';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  email: string;
  profileImageUrl: string;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  name: initialName,
  email,
  profileImageUrl: initialProfileImage,
}) => {
  const queryClient = useQueryClient();
  const [name, setName] = useState(initialName);
  const [profileImage, setProfileImage] = useState(initialProfileImage);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setProfileImage(URL.createObjectURL(file));
    }
  };

  // 회원 정보 수정 API 호출 (multipart/form-data 형식)
  const handleProfileUpdate = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('username', name);
      if (selectedFile) {
        formData.append('profileImg', selectedFile);
      }
      await apiClient.put('/auth/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          // Authorization 헤더 추가: 예) 'Authorization': `Bearer ${access_token}`,
        },
      });
      alert('회원 정보가 수정되었습니다.');

      // 프로필 데이터 갱신: React Query 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
      onClose();
    } catch (error) {
      alert('회원 정보 수정에 실패했습니다.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 회원 탈퇴 API 호출 (생략된 부분은 동일)
  const handleDeleteAccount = async () => {
    if (!window.confirm('정말로 탈퇴하시겠습니까?')) return;
    setLoading(true);
    try {
      await apiClient.delete('/auth/delete', {
        headers: {
          // Authorization 헤더 추가 가능
        },
      });
      alert('회원 탈퇴가 완료되었습니다.');
      localStorage.removeItem('auth-storage');
      sessionStorage.removeItem('accessToken');
      onClose();
      window.location.href = '/';
    } catch (error) {
      alert('회원 탈퇴에 실패했습니다.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
    >
      <Dialog.Panel className="bg-zinc-800 rounded-2xl shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
        >
          <X size={20} />
        </button>
        <Dialog.Title className="text-xl font-bold text-white mb-6">내 정보 수정</Dialog.Title>
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-24 h-24">
            <img
              src={profileImage}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-zinc-700"
            />
            <label className="absolute bottom-0 right-0 p-1 bg-zinc-600 rounded-full cursor-pointer hover:bg-amber-500 transition-colors">
              <Camera size={20} className="text-white" />
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>
        </div>
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
        <div className="mt-8 flex flex-col gap-4">
          <button
            className="w-full py-3 bg-amber-500 text-white rounded-md font-bold shadow-lg hover:bg-amber-600 transition-colors"
            onClick={handleProfileUpdate}
            disabled={loading}
          >
            수정하기
          </button>
          <button
            className="w-full py-3 bg-red-500 text-white rounded-md font-bold hover:bg-red-600 transition-colors"
            onClick={handleDeleteAccount}
            disabled={loading}
          >
            탈퇴하기
          </button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};

export default ProfileModal;
