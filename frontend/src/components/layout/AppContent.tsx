import { useLocation } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';

import { CommunityPage } from '@/pages/CommunityPage';

import { mockSongs } from '../../data/mockData';
import DashboardPage from '../../pages/dashboard/DashboardPage';
import DetailPage from '../../pages/DetailPage';
import EditPage from '../../pages/EditPage';
import HomePage from '../../pages/HomePage';
import LoginPage from '../../pages/LoginPage';
import MainPage from '../../pages/MainPage';
import NotFoundPage from '../../pages/NotFoundPage';
import MusicPlayer from '../common/MusicPlayer';

interface AppContentProps {
  isExpanded: boolean;
}

const AppContent: React.FC<AppContentProps> = ({ isExpanded }) => {
  const location = useLocation();
  const hidePlayerPaths = ['/login', '/signup'];

  return (
    <div
      className={`
      flex-1 flex flex-col
      transition-[margin] duration-300 ease-in-out
      ${isExpanded ? 'ml-64' : 'ml-20'}
    `}
    >
      <div className="flex-1 overflow-auto pb-20">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/detail/:id" element={<DetailPage />} />
          <Route path="/edit/:id" element={<EditPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/community" element={<CommunityPage />} />
        </Routes>
      </div>
      {!hidePlayerPaths.includes(location.pathname) && (
        <MusicPlayer songs={mockSongs} isExpanded={isExpanded} />
      )}
    </div>
  );
};

export default AppContent;
