import React from 'react';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Clock, Star, Repeat, ChevronRight } from 'lucide-react';

import BarChartTile from '@/components/dashboard/BarChartTile';
import LineChartTile from '@/components/dashboard/LineChartTile';
import ProfileTile from '@/components/dashboard/ProfileTile';
import SongListTile from '@/components/dashboard/SongListTile';
import StatsTile from '@/components/dashboard/StatsTile';

import apiClient from '../../services/dashboardapi';

interface DashboardData {
  userId: number;
  username: string;
  playtime: string;
  playtimeRank: number;
  scoreRank: number;
  profileImage: string;
  createAt: string;
  loginId: string;
  totalTry: number;
  totalTryRank: number;
  chordScoreDtos: ChordScoreDtos[];
  replays: Replays[];
}

interface ChordScoreDtos {
  chordType: string;
  score: string;
}

interface Replays {
  replayId: number;
  SongTitle: string;
  score: number;
  mode: string;
  videoPath: string;
  practiceDate: string;
}

// API 요청 함수
const fetchDashboardData = async (): Promise<DashboardData> => {
  const { data } = await apiClient.get('/mypage/dashboard');
  return data;
};

const DashboardPage: React.FC = () => {
  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ['dashboardData'], // queryKey를 명시적으로 객체로 전달
    queryFn: fetchDashboardData, // queryFn을 명시적으로 전달
  });

  // 일주일간의 라인차트 데이터를 생성하는 함수
  const getLineChartData = (): { day: string; current: number; average: number }[] => {
    // 최근 7일간 날짜 배열 생성 (오늘 포함)
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i)); // 과거 6일 ~ 오늘
      return {
        // 'ko-KR'의 short weekday는 '월', '화' 등으로 나옴
        day: date.toLocaleDateString('ko-KR', { weekday: 'short' }),
        // 날짜 비교를 위한 기준 문자열 (시간정보 없이)
        dateStr: date.toDateString(),
        practiceScores: [] as number[],
        performanceScores: [] as number[],
      };
    });

    // replays 배열에서 각 날짜별 모드 점수 할당
    data?.replays.forEach((replay) => {
      const replayDate = new Date(replay.practiceDate);
      const replayDateStr = replayDate.toDateString();
      const dayEntry = days.find((d) => d.dateStr === replayDateStr);
      if (dayEntry) {
        // 모드명이 "연습 모드" 또는 "연주 모드"라고 가정
        if (replay.mode === '연습 모드') {
          dayEntry.practiceScores.push(replay.score);
        } else if (replay.mode === '연주 모드') {
          dayEntry.performanceScores.push(replay.score);
        }
      }
    });

    // 각 날짜별 평균 계산
    return days.map((d) => ({
      day: d.day,
      current:
        d.practiceScores.length > 0
          ? Math.round(d.practiceScores.reduce((sum, s) => sum + s, 0) / d.practiceScores.length)
          : 0,
      average:
        d.performanceScores.length > 0
          ? Math.round(
              d.performanceScores.reduce((sum, s) => sum + s, 0) / d.performanceScores.length,
            )
          : 0,
    }));
  };

  // 기존의 정적 라인차트 데이터 대신 최근 일주일 데이터를 사용
  const lineChartData = data ? getLineChartData() : [];

  const transformedBarChartData = data?.chordScoreDtos.map((chord) => ({
    name: chord.chordType,
    value: parseInt(chord.score, 10),
  }));

  const transformedSongList = data?.replays.map((replay) => ({
    title: replay.SongTitle,
    artist: replay.mode, // Using mode as artist since actual artist isn't in the data
    duration: formatDate(replay.practiceDate), // Using practice date instead of duration
    score: replay.score,
    thumbnail: 'src/assets/노래.jpg', // Use default thumbnail
    videoPath: replay.videoPath,
    replayId: replay.replayId,
  }));

  const calculateAverageScore = (): string => {
    if (!data?.chordScoreDtos || data.chordScoreDtos.length === 0) return '0%';

    const sum = data.chordScoreDtos.reduce((acc, chord) => acc + parseInt(chord.score, 10), 0);
    return `${Math.round(sum / data.chordScoreDtos.length)}%`;
  };

  const updatedStatsData = [
    {
      label: '누적시간',
      value:
        data?.playtime
          .split(':')
          .slice(0, 2)
          .map((v, i) => (v !== '00' ? `${+v}${i ? '분' : '시간'}` : ''))
          .filter(Boolean)
          .join(' ') || '0분',
      change: '',
      positive: null,
      icon: <Clock className="w-5 h-5 text-amber-500" />,
    },
    {
      label: '평균 정확도',
      value: calculateAverageScore(),
      change: '+10.01%',
      positive: false,
      icon: <Star className="w-5 h-5 text-amber-500" />,
    },
    {
      label: '누적 연습량',
      value: `${data?.totalTry}회`,
      change: '-0.03%',
      positive: true,
      icon: <Repeat className="w-5 h-5 text-amber-500" />,
    },
  ];

  const profileData = {
    name: data?.username || '로그인이 필요합니다',
    email: data?.loginId || '로그인이 필요합니다',
    playtimerank: `${data?.playtimeRank} 등`,
    avgscorerank: `${data?.scoreRank} 등`, // Not explicitly in API, keeping original
    totaltryrank: `${data?.totalTryRank} 등`,
    profileImageUrl: data?.profileImage || 'ding.svg',
    backgroundImageUrl: 'ding.svg',
    createAt: data?.createAt || '?',
  };

  function formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
    } catch (e) {
      console.error('Date parsing error:', e);
      return dateString;
    }
  }

  // 애니메이션 변형 설정
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-white">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg text-amber-500 font-medium">데이터를 불러오는 중...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-white">
        <div className="p-8 bg-zinc-800/70 backdrop-blur-sm rounded-xl border border-white/10 shadow-xl text-center">
          <svg
            className="w-16 h-16 text-amber-500 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="text-xl font-bold mb-2">데이터를 불러오는 중 오류가 발생했습니다</h2>
          <p className="text-zinc-400">잠시 후 다시 시도해주세요.</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-white overflow-y-auto custom-scrollbar pb-20">
      <div className="max-w-7xl mx-auto px-8 py-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mb-8"
        >
          <motion.div variants={itemVariants}>
            <h1 className="text-3xl font-bold mb-1">대시보드</h1>
            <p className="text-zinc-400">나의 연습 데이터를 확인하고 성장을 추적하세요</p>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-col lg:flex-row gap-6"
        >
          {/* 왼쪽 컬럼: 프로필, 스탯, 라인차트 */}
          <motion.div variants={itemVariants} className="flex flex-col lg:w-1/2 space-y-6">
            {/* 프로필 타일 */}
            <div className="bg-zinc-800/70 backdrop-blur-sm rounded-xl border border-white/5 shadow-xl overflow-hidden hover:border-amber-500/30 transition-all duration-300">
              <ProfileTile
                name={profileData.name}
                email={profileData.email}
                playtimerank={profileData.playtimerank}
                avgscorerank={profileData.avgscorerank}
                totaltryrank={profileData.totaltryrank}
                profileImageUrl={profileData.profileImageUrl}
                backgroundImageUrl={profileData.backgroundImageUrl}
                createAt={profileData.createAt}
              />
            </div>

            {/* 스탯 타일들 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {updatedStatsData.map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="bg-zinc-800/70 backdrop-blur-sm rounded-xl border border-white/5 shadow-xl overflow-hidden hover:border-amber-500/30 transition-all duration-300"
                >
                  <div className="p-5">
                    <div className="flex items-center gap-2">
                      {stat.icon}
                      <p className="text-zinc-400 text-sm">{stat.label}</p>
                    </div>
                    <div className="flex items-end mt-3">
                      <span className="text-white text-2xl font-bold">{stat.value}</span>
                      {stat.change && (
                        <span
                          className={`ml-2 text-sm ${stat.positive ? 'text-green-500' : 'text-red-500'}`}
                        >
                          {stat.change} {stat.positive ? '↗' : '↘'}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* 라인 차트 - 최근 일주일간 리플레이 데이터를 이용 */}
            <motion.div
              variants={itemVariants}
              className="bg-zinc-800/70 backdrop-blur-sm rounded-xl border border-white/5 shadow-xl overflow-hidden hover:border-amber-500/30 transition-all duration-300"
            >
              <LineChartTile title="이번주 나의 점수" data={lineChartData} />
            </motion.div>
          </motion.div>

          {/* 오른쪽 컬럼: 바차트, 노래 목록 */}
          <motion.div variants={itemVariants} className="flex flex-col lg:w-1/2 space-y-6">
            {/* 바 차트 - API 데이터 사용 */}
            <motion.div className="bg-zinc-800/70 backdrop-blur-sm rounded-xl border border-white/5 shadow-xl overflow-hidden hover:border-amber-500/30 transition-all duration-300">
              <BarChartTile title="코드 별 정확도" data={transformedBarChartData || []} />
            </motion.div>

            {/* 노래 목록 - API 데이터 사용 */}
            <motion.div className="bg-zinc-800/70 backdrop-blur-sm rounded-xl border border-white/5 shadow-xl overflow-hidden hover:border-amber-500/30 transition-all duration-300">
              <SongListTile title="최근 연주한 노래" songs={transformedSongList || []} />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-10 text-center"
        >
          <a
            href="/community"
            className="inline-flex items-center text-amber-500 hover:text-amber-400 transition-colors"
          >
            <span>커뮤니티에서 다른 기타리스트와 경험을 공유해보세요</span>
            <ChevronRight className="ml-1 w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
