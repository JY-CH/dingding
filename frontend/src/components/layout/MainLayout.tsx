import React from 'react';

import { useLocation } from 'react-router-dom';

import Navigation from './Navigation';
import { mockSongs } from '../../data/mockData';
import MusicPlayer from '../common/MusicPlayer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const hidePlayerPaths = ['/login', '/signup', '/play', '/performance'];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col overflow-hidden">
      <Navigation />
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Ding Ding</h1>
        </div>
      </header>
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
      <footer className="bg-white shadow mt-auto py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500">© 2025 Ding Ding App</p>
        </div>
      </footer>
      {!hidePlayerPaths.includes(location.pathname) && (
        <MusicPlayer songs={mockSongs} isExpanded={false} />
      )}
    </div>
  );
};

export default MainLayout;
