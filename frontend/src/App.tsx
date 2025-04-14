import './index.css';
import { useState, useEffect } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

import Sidebar from './components/common/Sidebar';
import AppContent from './components/layout/AppContent';
import { createDemoNotifications, startRandomNotifications, stopRandomNotifications } from './utils/demoNotifications';

// QueryClient 생성
const queryClient = new QueryClient();

// 개발 환경인지 확인
const isDevelopment = import.meta.env.DEV;

function App() {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const isFullscreenPage = location.pathname === '/play' || location.pathname === '/performance';

  // 세션스토리지에 아무 데이터도 없으면 로컬스토리지 모두 삭제
  useEffect(() => {
    if (sessionStorage.length === 0) {
      localStorage.clear();
    }
  }, []);

  // isExpanded 변경 시 추가적인 작업 수행
  useEffect(() => {
    if (isFullscreenPage) {
      setIsExpanded(false);
    }
  }, [isFullscreenPage]);

  // 개발 환경에서 데모 알림 초기화
  useEffect(() => {
    if (isDevelopment) {
      // 초기 데모 알림 생성
      createDemoNotifications();
      
      // 5분마다 랜덤 알림 생성 (개발 중 테스트를 위해 30초로 설정)
      const intervalSeconds = 30;
      const intervalId = startRandomNotifications(intervalSeconds / 60);
      
      // 컴포넌트 언마운트 시 정리
      return () => {
        stopRandomNotifications(intervalId);
      };
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen bg-zinc-900">
        <AnimatePresence mode="wait">
          {!isFullscreenPage && (
            <motion.div
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              <Sidebar
                isExpanded={isExpanded}
                setIsExpanded={setIsExpanded}
                onToggle={() => setIsExpanded(!isExpanded)}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <AppContent isExpanded={isExpanded} />
      </div>
    </QueryClientProvider>
  );
}

export default App;
