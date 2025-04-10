import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Notification, useNotificationStore } from '../../store/useNotificationStore';
import NotificationItem from './NotificationItem';

interface NotificationModalProps {
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ onClose }) => {
  const { notifications, clearAll } = useNotificationStore();
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'read'>('all');
  
  // 탭에 따라 표시할 알림 필터링
  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.isRead;
    if (activeTab === 'read') return notification.isRead;
    return true;
  });
  
  // 이 달, 이전 달로 그룹화
  const groupedNotifications = filteredNotifications.reduce<Record<string, Notification[]>>(
    (groups, notification) => {
      const date = new Date(notification.date);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      
      if (!groups[key]) {
        groups[key] = [];
      }
      
      groups[key].push(notification);
      return groups;
    },
    {}
  );
  
  // 그룹 이름 생성 (예: '2023년 5월')
  const getGroupName = (key: string) => {
    const [year, month] = key.split('-').map(Number);
    return `${year}년 ${month + 1}월`;
  };
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative bg-zinc-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 헤더 */}
          <div className="p-4 border-b border-white/10 flex justify-between items-center sticky top-0 bg-zinc-800 z-10">
            <h2 className="text-xl font-bold text-white">알림</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            >
              <svg
                className="w-5 h-5 text-zinc-400"
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
          
          {/* 필터 탭 */}
          <div className="px-4 py-2 border-b border-white/10 flex gap-4 bg-zinc-800 sticky top-[60px] z-10">
            {[
              { id: 'all', label: '전체' },
              { id: 'unread', label: '읽지 않음' },
              { id: 'read', label: '읽음' },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
                onClick={() => setActiveTab(tab.id as 'all' | 'unread' | 'read')}
              >
                {tab.label}
              </button>
            ))}
            
            <div className="flex-1" />
            
            <button
              onClick={clearAll}
              className="text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              모두 삭제
            </button>
          </div>
          
          {/* 알림 목록 */}
          <div className="overflow-y-auto max-h-[calc(80vh-120px)] custom-scrollbar">
            {Object.keys(groupedNotifications).length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto bg-zinc-700/50 rounded-full flex items-center justify-center mb-3">
                  <svg
                    className="w-8 h-8 text-zinc-500"
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
                <p className="text-zinc-400 text-base">알림이 없습니다</p>
              </div>
            ) : (
              Object.keys(groupedNotifications)
                .sort((a, b) => b.localeCompare(a)) // 최신 달이 먼저 오도록 정렬
                .map((key) => (
                  <div key={key} className="p-3 border-b border-white/5">
                    <p className="text-xs text-zinc-400 mb-2 px-1">{getGroupName(key)}</p>
                    <div className="space-y-1">
                      {groupedNotifications[key].map((notification) => (
                        <NotificationItem
                          key={notification.id}
                          notification={notification}
                        />
                      ))}
                    </div>
                  </div>
                ))
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationModal; 