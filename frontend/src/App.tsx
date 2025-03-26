import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';
import EditPage from './pages/EditPage';
import NotFoundPage from './pages/NotFoundPage';
import DashboardPage from './pages/DashboardPage';
import MainPage from './pages/MainPage';
import Sidebar from './components/common/Sidebar';
import AppContent from './components/layout/AppContent';
import './index.css';

function App() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex h-screen">
      <Sidebar 
        isExpanded={isExpanded} 
        onToggle={() => setIsExpanded(!isExpanded)} 
      />
      <AppContent isExpanded={isExpanded} />
    </div>
  );
}

export default App;
