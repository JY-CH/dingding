import { useLocation } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';

import { mockSongs } from '../../data/mockData';
import DashboardPage from '../../pages/dashboard/DashboardPage';
import DetailPage from '../../pages/DetailPage';
import EditPage from '../../pages/EditPage';
import HomePage from '../../pages/HomePage';
import LoginPage from '../../pages/LoginPage';
import MainPage from '../../pages/MainPage';
import NotFoundPage from '../../pages/NotFoundPage';
import MusicPlayer from '../common/MusicPlayer';
import PlayPage from '../../pages/PlayPage';

interface AppContentProps {
  isExpanded: boolean;
}

const AppContent: React.FC<AppContentProps> = ({ isExpanded }) => {
  const location = useLocation();
  const isPlayPage = location.pathname === '/play';

  return (
    <main className={`flex-1 flex flex-col ${isPlayPage ? 'h-full' : 'pb-20'}`}>
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/detail/:id" element={<DetailPage />} />
          <Route path="/edit/:id" element={<EditPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/play" element={<PlayPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      {!isPlayPage && <MusicPlayer songs={mockSongs} isExpanded={isExpanded} />}
    </main>
  );
};

export default AppContent;