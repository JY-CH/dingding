import './index.css';
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import Sidebar from './components/common/Sidebar';
import AppContent from './components/layout/AppContent';
import LoginPage from './pages/LoginPage';

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
