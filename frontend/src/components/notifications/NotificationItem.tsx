import React from 'react';
import { Link } from 'react-router-dom';
import { Notification, useNotificationStore } from '../../store/useNotificationStore';
import NotificationIcon from './NotificationIcon';

interface NotificationItemProps {
  notification: Notification;
  onClick?: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClick }) => {
  const { markAsRead, removeNotification } = useNotificationStore();
  
  // 날짜 포맷팅
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return '방금 전';
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;
    
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const handleClick = () => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    
    if (onClick) {
      onClick();
    }
  };
  
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeNotification(notification.id);
  };
  
  const content = (
    <div
      className={`
        flex items-start gap-4 p-4 rounded-xl
        transition-all duration-200 relative group cursor-pointer
        ${notification.isRead ? 'bg-transparent' : 'bg-white/5'}
        hover:bg-white/5 hover:shadow-lg hover:shadow-white/5
      `}
      onClick={handleClick}
    >
      <div className={`w-8 h-8 rounded-full ${getBackgroundColor(notification.type)} flex items-center justify-center flex-shrink-0`}>
        <NotificationIcon type={notification.type} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium text-white">{notification.title}</h4>
          {!notification.isRead && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-xs font-medium">
              New
            </span>
          )}
        </div>
        <p className="text-sm text-zinc-400 mt-1">{notification.message}</p>
        <span className="text-xs text-zinc-500 mt-2 block">
          {formatDate(notification.date)}
        </span>
      </div>
      
      <button
        className="absolute right-4 top-4 p-1.5 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white/10"
        onClick={handleRemove}
      >
        <svg
          className="w-4 h-4 text-zinc-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
  
  // 링크가 있으면 Link 컴포넌트로 감싸기
  if (notification.link) {
    return (
      <Link to={notification.link} className="block">
        {content}
      </Link>
    );
  }
  
  return content;
};

// 알림 타입에 따른 배경색 지정
const getBackgroundColor = (type: Notification['type']) => {
  switch (type) {
    case 'info':
      return 'bg-blue-500/20';
    case 'success':
      return 'bg-green-500/20';
    case 'warning':
      return 'bg-amber-500/20';
    case 'error':
      return 'bg-red-500/20';
    default:
      return 'bg-zinc-500/20';
  }
};

export default NotificationItem; 