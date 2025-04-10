import React from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  date: Date;
  icon?: string;
  link?: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  // 액션
  addNotification: (notification: Omit<Notification, 'id' | 'date' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],
      unreadCount: 0,

      // 새 알림 추가
      addNotification: (notification) => 
        set((state) => {
          const newNotification: Notification = {
            id: crypto.randomUUID(),
            date: new Date(),
            isRead: false,
            ...notification,
          };
          
          const updatedNotifications = [
            newNotification,
            ...state.notifications,
          ].slice(0, 50); // 최대 50개까지만 저장
          
          return {
            notifications: updatedNotifications,
            unreadCount: state.unreadCount + 1,
          };
        }),

      // 알림을 읽음 표시
      markAsRead: (id) =>
        set((state) => {
          const updatedNotifications = state.notifications.map((notification) =>
            notification.id === id
              ? { ...notification, isRead: true }
              : notification
          );
          
          const unreadCount = updatedNotifications.filter(
            (notification) => !notification.isRead
          ).length;
          
          return {
            notifications: updatedNotifications,
            unreadCount,
          };
        }),

      // 모든 알림을 읽음 표시
      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((notification) => ({
            ...notification,
            isRead: true,
          })),
          unreadCount: 0,
        })),

      // 알림 삭제
      removeNotification: (id) =>
        set((state) => {
          const updatedNotifications = state.notifications.filter(
            (notification) => notification.id !== id
          );
          
          const unreadCount = updatedNotifications.filter(
            (notification) => !notification.isRead
          ).length;
          
          return {
            notifications: updatedNotifications,
            unreadCount,
          };
        }),

      // 모든 알림 삭제
      clearAll: () => set({ notifications: [], unreadCount: 0 }),
    }),
    {
      name: 'notification-storage', // localStorage에 저장될 키 이름
    }
  )
);

// 아이콘 식별자
export const notificationIconTypes = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'error',
};

// 미리 정의된 배경색 클래스
export const notificationBackgrounds = {
  info: 'bg-blue-500/20',
  success: 'bg-green-500/20',
  warning: 'bg-amber-500/20', 
  error: 'bg-red-500/20',
}; 