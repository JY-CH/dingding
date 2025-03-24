import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';
import EditPage from './pages/EditPage';
import NotFoundPage from './pages/NotFoundPage';
import DashboardPage from './pages/DashboardPage';
import MainPage from './pages/MainPage';
import Sidebar from './components/common/Sidebar';
import MusicPlayer from './components/common/MusicPlayer';
import { mockSongs } from './data/mockData';
import './index.css';

function App() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <BrowserRouter>
      <div className="flex h-screen">
        <Sidebar 
          isExpanded={isExpanded} 
          onToggle={() => setIsExpanded(!isExpanded)} 
        />
        <div className={`
          flex-1 flex flex-col
          transition-[margin] duration-300 ease-in-out
          ${isExpanded ? 'ml-64' : 'ml-20'}
        `}>
          <div className="flex-1 overflow-auto pb-20">
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/detail/:id" element={<DetailPage />} />
              <Route path="/edit/:id" element={<EditPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
          <MusicPlayer songs={mockSongs} isExpanded={isExpanded} />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
