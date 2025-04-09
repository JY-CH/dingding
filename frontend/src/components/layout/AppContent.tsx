import { useLocation } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';

import { CommunityPage } from '@/pages/CommunityPage';
import { useAuthStore } from '@/store/useAuthStore';

import { mockSongs } from '../../data/mockData';
import AllSongsPage from '../../pages/dashboard/AllSongPage';
import DashboardPage from '../../pages/dashboard/DashboardPage';
import VideoStreamingPage from '../../pages/dashboard/VideoStramingPage';
import DetailPage from '../../pages/DetailPage';
import EditPage from '../../pages/EditPage';
import LoginPage from '../../pages/LoginPage';
import MainPage from '../../pages/MainPage';
import NotFoundPage from '../../pages/NotFoundPage';
import PerformancePage from '../../pages/PerformancePage';
import PlayPage from '../../pages/PlayPage';
import SearchPage from '../../pages/SearchPage';
import MusicPlayer from '../common/MusicPlayer';

interface AppContentProps {
  isExpanded: boolean;
}

const AppContent: React.FC<AppContentProps> = ({ isExpanded }) => {
  const location = useLocation();
  const isFullscreenPage = location.pathname === '/play' || location.pathname === '/performance';
  const isLoginPage = location.pathname === '/login';
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // 뮤직 플레이어를 표시할지 여부를 결정
  const shouldShowMusicPlayer = !isLoginPage && isAuthenticated;

  return (
    <main
      className={`
        flex-1 flex flex-col 
        transition-all duration-500 ease-in-out
        ${!isFullscreenPage && (isExpanded ? 'ml-64' : 'ml-20')}
      `}
    >
      <div className="flex-1 relative">
        <div className="absolute inset-0 overflow-y-auto custom-scrollbar">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/search" element={<SearchPage />} />

            {/* 보호된 라우트들 */}
            <Route
              path="/dashboard"
              element={isAuthenticated ? <DashboardPage /> : <LoginPage />}
            />
            <Route path="/play" element={isAuthenticated ? <PlayPage /> : <LoginPage />} />
            <Route path="/detail/:id" element={isAuthenticated ? <DetailPage /> : <LoginPage />} />
            <Route path="/edit/:id" element={isAuthenticated ? <EditPage /> : <LoginPage />} />
            <Route path="/allsongs" element={isAuthenticated ? <AllSongsPage /> : <LoginPage />} />
            <Route
              path="/video-stream/:videoId"
              element={isAuthenticated ? <VideoStreamingPage /> : <LoginPage />}
            />
            <Route
              path="/performance"
              element={isAuthenticated ? <PerformancePage /> : <LoginPage />}
            />

            <Route path="*" element={<NotFoundPage />} />
            <Route path="/community" element={<CommunityPage />} />
          </Routes>
        </div>
      </div>

      <div
        className={`
          fixed bottom-0 left-0 right-0
          transition-all duration-500 ease-in-out
          transform
          ${isFullscreenPage ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'}
          ${!shouldShowMusicPlayer && 'hidden'}
        `}
        style={{
          marginLeft: isExpanded ? '16rem' : '5rem',
        }}
      >
        <div className="min-w-[976px] w-full">
          <MusicPlayer songs={mockSongs} isExpanded={isExpanded} />
        </div>
      </div>
    </main>
  );
};

export default AppContent;
