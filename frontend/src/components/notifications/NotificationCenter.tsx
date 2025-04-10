import React, { useState, useRef, useEffect } from 'react';
import { useNotificationStore } from '../../store/useNotificationStore';
import NotificationItem from './NotificationItem';
import NotificationModal from './NotificationModal';

const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { notifications, unreadCount, markAllAsRead } = useNotificationStore();
  
  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // 오늘 알림과 이전 알림으로 분류
  const todayNotifications = notifications.filter(
    (notification) => 
      new Date(notification.date).toDateString() === new Date().toDateString()
  );
  
  const previousNotifications = notifications.filter(
    (notification) => 
      new Date(notification.date).toDateString() !== new Date().toDateString()
  );
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 
          flex items-center justify-center hover:bg-white/10 
          transition-all duration-300 group"
      >
        <svg
          className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 
            rounded-full text-xs font-medium text-white 
            flex items-center justify-center
            animate-pulse shadow-lg shadow-amber-500/20"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-xl bg-zinc-800/90 backdrop-blur-sm border border-white/10 shadow-xl z-50">
          <div className="p-3 border-b border-white/10 flex justify-between items-center">
            <h3 className="text-sm font-medium text-white">알림</h3>
            {unreadCount > 0 && (
              <button 
                className="text-xs text-amber-500 hover:text-amber-400 transition-colors"
                onClick={markAllAsRead}
              >
                모두 읽음 표시
              </button>
            )}
          </div>
          
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-6 text-center">
                <div className="w-12 h-12 mx-auto bg-zinc-700/50 rounded-full flex items-center justify-center mb-2">
                  <svg 
                    className="w-6 h-6 text-zinc-500" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                    />
                  </svg>
                </div>
                <p className="text-zinc-400 text-sm">알림이 없습니다</p>
              </div>
            ) : (
              <>
                {todayNotifications.length > 0 && (
                  <div className="p-3 border-b border-white/5">
                    <p className="text-xs text-zinc-400 mb-2">오늘</p>
                    <div className="space-y-1">
                      {todayNotifications.map((notification) => (
                        <NotificationItem 
                          key={notification.id} 
                          notification={notification} 
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {previousNotifications.length > 0 && (
                  <div className="p-3">
                    <p className="text-xs text-zinc-400 mb-2">이전</p>
                    <div className="space-y-1">
                      {previousNotifications.slice(0, 3).map((notification) => (
                        <NotificationItem 
                          key={notification.id} 
                          notification={notification} 
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="p-3 border-t border-white/10">
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setIsOpen(false);
                }}
                className="w-full text-center text-sm text-amber-500 hover:text-amber-400 transition-colors"
              >
                모든 알림 보기
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* 모든 알림 모달 */}
      {isModalOpen && (
        <NotificationModal
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationCenter; 