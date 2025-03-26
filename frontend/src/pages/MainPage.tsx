import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [isAllNotificationsModalOpen, setIsAllNotificationsModalOpen] = useState(false);

  // 프로필 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
              <div className="relative" ref={notificationRef}>
                <button 
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 
                    flex items-center justify-center hover:bg-white/10 
                    transition-all duration-300 group"
                >
                  <svg 
                    className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                    />
                  </svg>
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 
                    rounded-full text-xs font-medium text-white 
                    flex items-center justify-center
                    animate-bounce shadow-lg shadow-amber-500/20">
                    3
                  </span>
                </button>
                {isNotificationOpen && (
                  <div className="absolute right-0 mt-2 w-80 rounded-xl bg-zinc-800/90 backdrop-blur-sm border border-white/10 shadow-xl z-50">
                    <div className="p-3 border-b border-white/10 flex justify-between items-center">
                      <h3 className="text-sm font-medium text-white">알림</h3>
                      <button className="text-xs text-amber-500 hover:text-amber-400 transition-colors">
                        모두 읽음 표시
                      </button>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                      <div className="p-3 border-b border-white/5">
                        <p className="text-xs text-zinc-400 mb-2">오늘</p>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors">
                            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                              <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-white">새로운 연습 곡이 추가되었습니다</p>
                              <p className="text-xs text-zinc-400 mt-0.5">2시간 전</p>
                            </div>
                            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                          </div>
                          <div className="flex items-start gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors">
                            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                              <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-white">새로운 개인 기록을 달성했습니다!</p>
                              <p className="text-xs text-zinc-400 mt-0.5">5시간 전</p>
                            </div>
                            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-zinc-400 mb-2">이전</p>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors opacity-60">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                              <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-white">주간 연습 리포트가 준비되었습니다</p>
                              <p className="text-xs text-zinc-400 mt-0.5">어제</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 border-t border-white/10">
                      <button 
                        onClick={() => {
                          setIsAllNotificationsModalOpen(true);
                          setIsNotificationOpen(false);
                        }}
                        className="w-full text-center text-sm text-amber-500 hover:text-amber-400 transition-colors"
                      >
                        모든 알림 보기
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="relative" ref={profileRef}>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="h-10 w-10 rounded-full overflow-hidden ring-2 ring-white/10 hover:ring-amber-500 transition-all"
                >
                  <img 
                    src="https://i.pravatar.cc/100?img=5" 
                    alt="User profile" 
                    className="w-full h-full object-cover"
                  />
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-zinc-800/90 backdrop-blur-sm border border-white/10 shadow-xl z-50">
                    <div className="p-3 border-b border-white/10">
                      <p className="text-sm font-medium text-white">사용자님</p>
                      <p className="text-xs text-zinc-400">user@example.com</p>
                    </div>
                    
                    <div className="p-1">
                      <button 
                        onClick={() => {
                          navigate('/dashboard');
                          setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        대시보드
                      </button>
                      
                      <button 
                        onClick={() => {
                          navigate('/settings');
                          setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        설정
                      </button>
                    </div>

                    <div className="p-1 border-t border-white/10">
                      <button 
                        onClick={() => {
                          // 로그아웃 처리
                          setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        로그아웃
                      </button>
                    </div>
                  </div>
                )}
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

      {/* 알림 모달 */}
      {isAllNotificationsModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-zinc-800/95 to-zinc-900/95 border border-white/10 rounded-2xl 
            w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl animate-modalShow">
            {/* 모달 헤더 */}
            <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between 
              bg-gradient-to-r from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-white">알림</h2>
                <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-medium">
                  3개의 새로운 알림
                </span>
              </div>
              <button 
                onClick={() => setIsAllNotificationsModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 모달 내용 */}
            <div className="overflow-y-auto max-h-[calc(85vh-8rem)] custom-scrollbar">
              {/* 오늘 */}
              <div className="p-6 border-b border-white/5">
                <h3 className="text-sm font-medium text-zinc-400 mb-4 flex items-center gap-2">
                  오늘
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                </h3>
                <div className="space-y-4">
                  <NotificationItem
                    icon={
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 
                        flex items-center justify-center ring-1 ring-amber-500/20">
                        <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                      </div>
                    }
                    title="새로운 연습 곡이 추가되었습니다"
                    description="'Summer Memories' 외 3곡이 추가되었습니다."
                    time="2시간 전"
                    isNew={true}
                  />
                  <NotificationItem
                    icon={
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 
                        flex items-center justify-center ring-1 ring-green-500/20">
                        <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    }
                    title="새로운 개인 기록을 달성했습니다!"
                    description="연속 7일 연습 달성! 계속 이어가보세요."
                    time="5시간 전"
                    isNew={true}
                  />
                </div>
              </div>

              {/* 이번 주 */}
              <div className="p-6 border-b border-white/5">
                <h3 className="text-sm font-medium text-zinc-400 mb-4">이번 주</h3>
                <div className="space-y-4">
                  <NotificationItem
                    icon={
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 
                        flex items-center justify-center ring-1 ring-blue-500/20">
                        <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                            d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                        </svg>
                      </div>
                    }
                    title="주간 연습 리포트가 준비되었습니다"
                    description="이번 주 총 연습시간: 8시간 23분"
                    time="2일 전"
                    isNew={false}
                  />
                </div>
              </div>
            </div>

            {/* 모달 푸터 */}
            <div className="p-6 border-t border-white/10 bg-gradient-to-b from-zinc-900/50 to-zinc-900/80 
              backdrop-blur-sm sticky bottom-0">
              <div className="flex items-center justify-between">
                <button className="px-4 py-2 text-zinc-400 hover:text-white transition-colors text-sm">
                  모든 알림 삭제
                </button>
                <button className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 
                  hover:from-amber-600 hover:to-amber-700 text-white font-medium rounded-lg 
                  transition-all duration-200 shadow-lg shadow-amber-500/20">
                  모든 알림 읽음
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// NotificationItem 컴포넌트
interface NotificationItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
  isNew?: boolean;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  icon,
  title,
  description,
  time,
  isNew = false
}) => {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 
      transition-all duration-200 relative group cursor-pointer
      hover:shadow-lg hover:shadow-white/5">
      {icon}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium text-white">{title}</h4>
          {isNew && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 
              text-xs font-medium">New</span>
          )}
        </div>
        <p className="text-sm text-zinc-400 mt-1">{description}</p>
        <span className="text-xs text-zinc-500 mt-2 block">{time}</span>
      </div>
      <button className="absolute right-4 top-4 p-1.5 rounded-lg bg-white/5 opacity-0 
        group-hover:opacity-100 transition-all duration-200 hover:bg-white/10">
        <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
            d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default MainPage;