import React, { useEffect, useState, Dispatch, SetStateAction } from 'react';

import { useNavigate, useLocation } from 'react-router-dom';

import { logout } from '@/services/api';
import { useAuthStore } from '@/store/useAuthStore';

// interface User {
//   isLoggedIn: boolean;
//   profileImage?: string;
// }

interface SidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
  setIsExpanded: Dispatch<SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ isExpanded, onToggle, setIsExpanded }) => {
  const [activeItem, setActiveItem] = useState<number | null>(null);
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [trueUser, setTrueUser] = useState<string | null>(sessionStorage.getItem('accessToken'));

  console.log(trueUser);
  const isPlayPage = location.pathname === '/play';
  const menuItems = [
    {
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      label: '메인',
      path: '/',
    },
    {
      icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
      label: '검색',
      path: '/search',
    },
    {
      icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3',
      label: '기타 연주',
      path: '/play',
    },
    {
      icon: 'M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z',
      label: '커뮤니티',
      path: '/community',
    },
    {
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      label: '마이페이지',
      path: '/dashboard',
    },
  ];
  useEffect(() => {
    setTrueUser(sessionStorage.getItem('accessToken'));
  }, [sessionStorage.getItem('accessToken')]);
  const handleItemClick = (index: number, path: string) => {
    if (path === '/community' && !isAuthenticated) {
      navigate('/login'); // 로그인 페이지로 이동
      return;
    }
    setActiveItem(index);
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      await logout(); // 로그아웃 요청이 완료될 때까지 대기
      useAuthStore.getState().clearAuth(); // 상태 초기화
      setIsExpanded(false); // 사이드바 축소
      setTimeout(() => {
        localStorage.removeItem('auth-storage'); // 토큰 삭제
        navigate('/'); // 로그아웃 후 홈으로 이동
      }, 300); // 사이드바 애니메이션이 끝날 때까지 대기
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen bg-[#1E1E1E]
        transition-all duration-500 ease-in-out
        ${isPlayPage ? '-translate-x-full' : 'translate-x-0'}
        ${isExpanded ? 'w-64' : 'w-20'}
        z-50
      `}
    >
      <div className="flex flex-col h-full">
        {/* 로그인/프로필 영역 */}
        <div className="p-4 border-b border-gray-800">
          {isAuthenticated ? (
            <div className="flex items-center h-10">
              <div className="w-10 h-10 flex-shrink-0">
                <img
                  src={user?.userProfile}
                  alt={user?.username}
                  className="w-full h-full rounded-full object-cover bg-gradient-to-br from-amber-500/10 to-amber-600/10"
                />
              </div>
              <div
                className={`
                overflow-hidden transition-all duration-300
                ${isExpanded ? 'w-40 ml-3 opacity-100' : 'w-0 opacity-0'}
              `}
              >
                <span className="text-white text-sm font-medium whitespace-nowrap">
                  {user?.username}님
                </span>
              </div>
            </div>
          ) : (
            <div className="h-10 flex items-center justify-center">
              <button
                onClick={() => navigate('/login')}
                className={`
                  w-full h-8 rounded flex items-center justify-center
                  bg-amber-500 hover:bg-amber-600
                  text-white font-medium transition-colors
                  ${isExpanded ? 'text-sm' : 'text-[10px]'}
                `}
              >
                로그인
              </button>
            </div>
          )}
        </div>

        {/* 메뉴 아이템 */}
        <div className="flex-1 py-4">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleItemClick(index, item.path)}
              className={`
                w-full h-12 flex items-center
                ${
                  activeItem === index
                    ? 'bg-amber-500/20 text-amber-500'
                    : 'text-gray-400 hover:bg-gray-800/40 hover:text-white'
                }
              `}
            >
              <div className="w-20 flex items-center justify-center flex-shrink-0">
                <div className="w-6 h-6">
                  <svg
                    className="w-full h-full"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={item.icon}
                    />
                  </svg>
                </div>
              </div>
              <div
                className={`
                overflow-hidden transition-all duration-300
                ${isExpanded ? 'w-40 opacity-100' : 'w-0 opacity-0'}
              `}
              >
                <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
              </div>
            </button>
          ))}
        </div>

        {/* 하단 버튼 영역 */}
        <div className="p-4 space-y-2">
          {trueUser && (
            <button
              onClick={handleLogout}
              className="w-full h-10 flex items-center justify-center rounded
                text-gray-400 hover:text-white hover:bg-red-500/20
                transition-colors"
            >
              <div className="w-6 h-6 flex-shrink-0">
                <svg
                  className="w-full h-full"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </div>

              <div className="overflow-hidden transition-all duration-300 w-40 ml-2 opacity-100">
                <span className="text-sm font-medium whitespace-nowrap">로그아웃</span>
              </div>
            </button>
          )}

          {/* 토글 버튼 */}
          <button
            onClick={onToggle}
            className="w-full h-10 flex items-center justify-center rounded
              bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white
              transition-colors"
          >
            <div className="w-6 h-6 flex-shrink-0">
              <svg
                className={`w-full h-full transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
