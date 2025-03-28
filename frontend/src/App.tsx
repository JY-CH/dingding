import './index.css';
import { useState } from 'react';

import Sidebar from './components/common/Sidebar';
import AppContent from './components/layout/AppContent';

function App() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex h-screen">
      <Sidebar isExpanded={isExpanded} onToggle={() => setIsExpanded(!isExpanded)} />
      <AppContent isExpanded={isExpanded} />
    </div>
  );
}

export default App;
