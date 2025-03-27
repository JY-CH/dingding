import './index.css';
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import Sidebar from './components/common/Sidebar';
import AppContent from './components/layout/AppContent';

function App() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex h-screen">
      <Sidebar isExpanded={isExpanded} onToggle={() => setIsExpanded(!isExpanded)} />
      <Routes>
        <Route path="/*" element={<AppContent isExpanded={isExpanded} />} />
      </Routes>
    </div>
  );
}

export default App;
