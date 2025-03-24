import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MusicPlayer from '../components/main/MusicPlayer';
import TopSongSection from '../components/main/TopSongSection';
import TopArtistSection from '../components/main/TopArtistSection';
import ShortsSection from '../components/main/ShortsSection';
import RankingSection from '../components/main/RankingSection';
import ExploreSection from '../components/main/ExploreSection';
import FeaturedCarousel from '../components/main/FeaturedCarousel';
import { Song } from '../types';
import { mockSongs, mockDailyTracks, mockWeeklyTracks, mockMonthlyTracks } from '../data/mockData';

const MainPage = () => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);

  const handlePlaySong = (song: Song) => {
    setCurrentSong(song);
  };

  return (
    <div className="flex h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-white">
      {/* 메인 콘텐츠 */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <header className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold">Discover</h1>
              <p className="text-zinc-400">Listen to the best music for your mood</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search for songs, artists..."
                  className="py-2 px-4 pl-10 bg-white/5 border border-white/10 rounded-full text-sm focus:outline-none focus:border-amber-500 w-64 transition-all"
                />
                <svg className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-amber-500">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div className="h-10 w-10 rounded-full overflow-hidden">
                <img 
                  src="https://i.pravatar.cc/100?img=5" 
                  alt="User profile" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </header>

          {/* Featured Carousel */}
          <FeaturedCarousel />
          
          {/* Explore Section */}
          <ExploreSection />
          
          {/* Main Content Sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="col-span-2">
              <TopSongSection onPlaySong={handlePlaySong} />
              <ShortsSection />
            </div>
            <div>
              <RankingSection
                dailyTracks={mockDailyTracks}
                weeklyTracks={mockWeeklyTracks}
                monthlyTracks={mockMonthlyTracks}
                onPlayTrack={handlePlaySong}
              />
              <TopArtistSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;