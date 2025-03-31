import './index.css';
import { useState, useEffect } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Sidebar from './components/common/Sidebar';
import AppContent from './components/layout/AppContent';

// QueryClient 생성
const queryClient = new QueryClient();

function App() {
  const [isExpanded, setIsExpanded] = useState(false);

  // isExpanded 변경 시 추가적인 작업 수행
  useEffect(() => {
    if (isExpanded) {
      console.log('Sidebar is expanded');
      // 예시로 사이드바 확장 시 추가 작업
    } else {
      console.log('Sidebar is collapsed');
      // 예시로 사이드바 축소 시 추가 작업
    }
  }, [isExpanded]); // isExpanded 상태가 변경될 때마다 실행

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen">
        <Sidebar
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          onToggle={() => setIsExpanded(!isExpanded)}
        />
        <AppContent isExpanded={isExpanded} />
      </div>
    </QueryClientProvider>
  );
}

export default App;
