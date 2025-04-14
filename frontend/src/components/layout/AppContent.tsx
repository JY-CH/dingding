import { useLocation } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

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
import GuitarRhythmGame from '../audio/GuitarRhythmGame';
import MusicPlayer from '../common/MusicPlayer';

interface AppContentProps {
  isExpanded: boolean;
}

const AppContent: React.FC<AppContentProps> = ({ isExpanded }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const isFullscreenPage = ['/login', '/signup', '/play', '/performance'].includes(location.pathname);
  // const shouldShowMusicPlayer = !isFullscreenPage;
  const [currentSong, setCurrentSong] = useState<any>(null);

  // 샘플 악보 데이터
  const sampleNotes = [
    { chord: 'A', timing: 2000, duration: 2000 },
    { chord: 'D', timing: 5000, duration: 2000 },
    { chord: 'E', timing: 8000, duration: 2000 },
    { chord: 'G', timing: 11000, duration: 2000 },
    { chord: 'C', timing: 14000, duration: 2000 },
    { chord: 'F', timing: 17000, duration: 2000 },
    { chord: 'B', timing: 20000, duration: 2000 },
  ];

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
            <Route path="/" element={<MainPage onPlaySong={setCurrentSong} />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route
              path="/test"
              element={
                <GuitarRhythmGame
                  notes={sampleNotes}
                  onScoreUpdate={(score) => console.log('현재 점수:', score)}
                />
              }
            />

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

      <AnimatePresence mode="wait">
        {!isFullscreenPage && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="fixed bottom-0 left-0 right-0"
            style={{
              marginLeft: isExpanded ? '16rem' : '5rem',
            }}
          >
            <div className="min-w-[976px] w-full">
              <MusicPlayer 
                songs={currentSong ? [currentSong] : mockSongs} 
                isExpanded={isExpanded} 
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default AppContent;
