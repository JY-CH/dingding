import './index.css';
import { useState, useEffect } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

import Sidebar from './components/common/Sidebar';
import AppContent from './components/layout/AppContent';

// QueryClient 생성
const queryClient = new QueryClient();

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
