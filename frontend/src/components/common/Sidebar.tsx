import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  isLoggedIn: boolean;
  profileImage?: string;
}

const Sidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeItem, setActiveItem] = useState<number | null>(null);
  // 임시 유저 상태 (실제로는 전역 상태 관리나 context를 사용해야 함)
  const [user, setUser] = useState<User>({ 
    isLoggedIn: false,
    profileImage: 'https://via.placeholder.com/40'
  });
  const navigate = useNavigate();

  const menuItems = [
    { 
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", 
      label: "메인", 
      path: "/" 
    },
    { 
      icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
      label: "검색", 
      path: "/search" 
    },
    { 
      icon: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3", 
      label: "기타 연주", 
      path: "/play" 
    },
    { 
      icon: "M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z", 
      label: "커뮤니티", 
      path: "/community" 
    },
    { 
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", 
      label: "마이페이지", 
      path: "/dashboard" 
    }
  ];

  const handleItemClick = (index: number, path: string) => {
    setActiveItem(index);
    navigate(path);
  };

  const handleLogin = () => {
    // 실제 로그인 로직으로 대체 필요
    setUser({ isLoggedIn: true, profileImage: 'https://via.placeholder.com/40' });
  };

  const handleLogout = () => {
    setUser({ isLoggedIn: false });
    navigate('/');
  };

  return (
    <aside className={`
      fixed top-0 left-0 h-screen bg-[#1E1E1E]
      transition-all duration-300 ease-in-out
      ${isExpanded ? 'w-64' : 'w-20'}
    `}>
      <div className="flex flex-col h-full">
        {/* 로그인/프로필 영역 */}
        <div className="p-4 border-b border-gray-800">
          {user.isLoggedIn ? (
            <div className={`
              flex items-center
              ${isExpanded ? 'justify-start' : 'justify-center'}
            `}>
              <img 
                src={user.profileImage} 
                alt="Profile" 
                className="w-10 h-10 rounded-full"
              />
              {isExpanded && (
                <span className="ml-3 text-white text-sm font-medium">
                  사용자님
                </span>
              )}
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className={`
                w-full p-2 rounded
                bg-amber-500 hover:bg-amber-600
                text-white font-medium transition-colors
                ${isExpanded ? 'text-sm' : 'text-[10px]'}
              `}
            >
              {isExpanded ? '로그인' : '로그인'}
            </button>
          )}
        </div>

        {/* 메뉴 아이템 */}
        <div className="flex-1 py-4">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleItemClick(index, item.path)}
              className={`
                w-full flex items-center px-5 py-3
                ${isExpanded ? 'justify-start' : 'justify-center'}
                ${activeItem === index 
                  ? 'bg-amber-500/20 text-amber-500' 
                  : 'text-gray-400 hover:bg-gray-800/40 hover:text-white'
                }
              `}
            >
              <svg 
                className="w-6 h-6 transition-transform duration-200"
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
              {isExpanded && (
                <span className="ml-4 text-sm font-medium overflow-hidden whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* 하단 버튼 영역 */}
        <div className="p-4 space-y-2">
          {/* 로그아웃 버튼 (로그인 시에만 표시) */}
          {user.isLoggedIn && (
            <button
              onClick={handleLogout}
              className="w-full p-2 flex justify-center items-center rounded
                text-gray-400 hover:text-white hover:bg-red-500/20
                transition-colors duration-200"
            >
              <svg 
                className="w-6 h-6"
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
              {isExpanded && (
                <span className="ml-2 text-sm font-medium">로그아웃</span>
              )}
            </button>
          )}

          {/* 토글 버튼 */}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full p-2 flex justify-center items-center rounded
              bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white
              transition-colors duration-200"
          >
            <svg 
              className={`w-6 h-6 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
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
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;