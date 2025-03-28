import { useLocation } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

import { mockSongs } from '../../data/mockData';
import AllSongsPage from '../../pages/dashboard/AllSongPage';
import DashboardPage from '../../pages/dashboard/DashboardPage';
import VideoStreamingPage from '../../pages/dashboard/VideoStramingPage';
import DetailPage from '../../pages/DetailPage';
import EditPage from '../../pages/EditPage';
import HomePage from '../../pages/HomePage';
import LoginPage from '../../pages/LoginPage';
import MainPage from '../../pages/MainPage';
import NotFoundPage from '../../pages/NotFoundPage';
import SearchPage from '../../pages/SearchPage';
import MusicPlayer from '../common/MusicPlayer';
import PlayPage from '../../pages/PlayPage';
import PerformancePage from '../../pages/PerformancePage';

interface AppContentProps {
  isExpanded: boolean;
}

const AppContent: React.FC<AppContentProps> = ({ isExpanded }) => {
  const location = useLocation();
  const isPlayPage = location.pathname === '/play';
  const isSearchPage = location.pathname === '/search';
  const isDashboardPage = location.pathname === '/dashboard';
  const isCommunityPage = location.pathname === '/community';
  const isMainPage = location.pathname === '/';
  
  // 패딩이 필요없는 페이지들
  const noPaddingPages = isPlayPage || isSearchPage || isDashboardPage || isCommunityPage || isMainPage;
  
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return (
    <main 
      className={`
        flex-1 flex flex-col 
        transition-all duration-300 ease-in-out
        ${isExpanded ? 'ml-64' : 'ml-20'}
      `}
    >
      <div className="flex-1 relative">
        <div className={`absolute inset-0 overflow-y-auto custom-scrollbar ${!noPaddingPages ? 'mb-20' : ''}`}>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/search" element={<SearchPage />} />
            
            {/* 보호된 라우트들 */}
            <Route path="/dashboard" element={
              isAuthenticated ? <DashboardPage /> : <LoginPage />
            } />
            <Route path="/play" element={
              isAuthenticated ? <PlayPage /> : <LoginPage />
            } />
            <Route path="/detail/:id" element={
              isAuthenticated ? <DetailPage /> : <LoginPage />
            } />
            <Route path="/edit/:id" element={
              isAuthenticated ? <EditPage /> : <LoginPage />
            } />
            <Route path="/allsongs" element={
              isAuthenticated ? <AllSongsPage /> : <LoginPage />
            } />
            <Route path="/stream" element={
              isAuthenticated ? <VideoStreamingPage /> : <LoginPage />
            } />
            <Route path="/performance" element={
              isAuthenticated ? <PerformancePage /> : <LoginPage />
            } />
            
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </div>

      {!isPlayPage && (
        <div className="fixed bottom-0 left-0 right-0 bg-transparent" style={{ marginLeft: isExpanded ? '16rem' : '5rem' }}>
          <MusicPlayer songs={mockSongs} isExpanded={isExpanded} />
        </div>
      )}
    </main>
  );
};

export default AppContent;