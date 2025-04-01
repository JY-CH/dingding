import { useState } from 'react';
import { Fragment } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { useQueryClient } from '@tanstack/react-query';
import { X, Camera, UserCircle, Calendar, Mail, LogOut } from 'lucide-react';

import apiClient from '../../services/dashboardapi';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  email: string;
  profileImageUrl: string;
  createAt: string;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  name: initialName,
  email,
  profileImageUrl: initialProfileImage,
  createAt: createAt,
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
    if (!name.trim()) {
      alert('닉네임을 입력해주세요.');
      return;
    }

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
        },
      });

      // 프로필 데이터 갱신: React Query 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
      onClose();

      // 성공 메시지 표시
      const successToast = document.createElement('div');
      successToast.className =
        'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out';
      successToast.textContent = '회원 정보가 수정되었습니다.';
      document.body.appendChild(successToast);
      setTimeout(() => {
        document.body.removeChild(successToast);
      }, 3000);
    } catch (error) {
      alert('회원 정보 수정에 실패했습니다.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 회원 탈퇴 API 호출
  const handleDeleteAccount = async () => {
    if (!window.confirm('정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;
    setLoading(true);
    try {
      await apiClient.delete('/auth/delete');

      // 로컬 스토리지 및 세션 스토리지 클리어
      localStorage.removeItem('auth-storage');
      sessionStorage.removeItem('accessToken');
      onClose();

      // 홈페이지로 리다이렉트
      window.location.href = '/';

      // 성공 메시지 표시
      alert('회원 탈퇴가 완료되었습니다.');
    } catch (error) {
      alert('회원 탈퇴에 실패했습니다.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formattedDate = new Date(createAt).toLocaleDateString('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gradient-to-b from-zinc-800/95 to-zinc-900/95 border border-white/10 p-6 text-left align-middle shadow-xl transition-all">
                <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-r from-amber-500/20 to-zinc-800/10 rounded-t-2xl"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-amber-500/10 blur-3xl rounded-full"></div>
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-zinc-600/20 blur-3xl rounded-full"></div>

                <div className="relative z-10">
                  <Dialog.Title className="text-xl font-bold text-white">내 정보 수정</Dialog.Title>
                  <button
                    onClick={onClose}
                    className="absolute top-0 right-0 bg-zinc-700/50 hover:bg-zinc-700 p-1.5 rounded-full text-zinc-400 hover:text-white transition-all duration-200"
                  >
                    <X size={18} />
                  </button>

                  <div className="mt-8 flex flex-col items-center">
                    <div className="relative group">
                      <div className="w-28 h-28 rounded-full overflow-hidden bg-gradient-to-br from-zinc-700 to-zinc-800 p-1 ring-2 ring-white/10 group-hover:ring-amber-500/50 transition-all duration-300 shadow-xl shadow-black/20">
                        {profileImage ? (
                          <img
                            src={profileImage}
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full rounded-full flex items-center justify-center bg-zinc-800">
                            <UserCircle size={50} className="text-zinc-600" />
                          </div>
                        )}
                      </div>
                      <label className="absolute bottom-0 right-0 p-2 bg-amber-500 hover:bg-amber-600 rounded-full cursor-pointer shadow-lg transition-all duration-200 group-hover:scale-110">
                        <Camera size={16} className="text-white" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="mt-8 space-y-6">
                    <div className="relative">
                      <div className="flex items-center gap-2 text-zinc-400 text-sm font-medium mb-2">
                        <Mail size={16} />
                        <span>아이디 (이메일)</span>
                      </div>
                      <input
                        type="text"
                        value={email}
                        disabled
                        className="w-full px-4 py-3 bg-zinc-700/30 rounded-lg border border-white/5 text-zinc-400 focus:outline-none"
                      />
                    </div>

                    <div className="relative">
                      <div className="flex items-center gap-2 text-zinc-400 text-sm font-medium mb-2">
                        <UserCircle size={16} />
                        <span>닉네임</span>
                      </div>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="닉네임을 입력해주세요"
                        className="w-full px-4 py-3 bg-zinc-700/30 rounded-lg border border-white/5 text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
                      />
                    </div>

                    <div className="relative">
                      <div className="flex items-center gap-2 text-zinc-400 text-sm font-medium mb-2">
                        <Calendar size={16} />
                        <span>가입일</span>
                      </div>
                      <input
                        type="text"
                        value={formattedDate}
                        disabled
                        className="w-full px-4 py-3 bg-zinc-700/30 rounded-lg border border-white/5 text-zinc-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="mt-10 flex flex-col gap-3">
                    <button
                      className={`w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-amber-800/10 ${
                        loading ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                      onClick={handleProfileUpdate}
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          저장 중...
                        </div>
                      ) : (
                        '저장하기'
                      )}
                    </button>

                    <button
                      className="w-full py-3 px-4 flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-red-500 rounded-lg font-medium transition-all border border-white/5"
                      onClick={handleDeleteAccount}
                      disabled={loading}
                    >
                      <LogOut size={16} className="text-red-500" />
                      회원 탈퇴
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ProfileModal;
