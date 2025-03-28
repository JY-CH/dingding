import './index.css';
import { useState } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Sidebar from './components/common/Sidebar';
import AppContent from './components/layout/AppContent';

// QueryClient 생성
const queryClient = new QueryClient();

function App() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen">
        <Sidebar isExpanded={isExpanded} onToggle={() => setIsExpanded(!isExpanded)} />
        <AppContent isExpanded={isExpanded} />
      </div>
    </QueryClientProvider>
  );
}

export default App;
