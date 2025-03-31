import React from 'react';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

import BarChartTile from '@/components/dashboard/BarChartTile';
import LineChartTile from '@/components/dashboard/LineChartTile';
import ProfileTile from '@/components/dashboard/ProfileTile';
import SongListTile from '@/components/dashboard/SongListTile';
import StatsTile from '@/components/dashboard/StatsTile';

import apiClient from '../../services/dashboardapi';

// Define types based on the provided JSON structure
interface DashboardData {
  userId: number;
  username: string;
  playtime: string;
  playtimeRank: number;
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

  const statsData = [
    { label: '평균 정확도', value: '075%', change: '+10.01%', positive: true },
    { label: '누적시간', value: '2,318시간', change: '', positive: null },
    { label: '누적 연습량', value: '671회', change: '-0.03%', positive: false },
  ];

  const lineChartData = [
    { day: '월', current: 20, average: 50 },
    { day: '화', current: 30, average: 40 },
    { day: '수', current: 50, average: 70 },
    { day: '목', current: 70, average: 30 },
    { day: '금', current: 60, average: 50 },
    { day: '토', current: 80, average: 60 },
    { day: '일', current: 0, average: 0 },
  ];

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

  const updatedStatsData =
     [
        {
          label: '평균 정확도',
          value: calculateAverageScore(),
          change: '+10.01%', // Keeping original change since it's not in the API
          positive: false,
        },
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
        },
        {
          label: '누적 연습량',
          value: `${data?.totalTry}회`,
          change: '-0.03%', // Keeping original change
          positive: true,
        },
      ];

  // Profile data with actual values if available
  const profileData = {
    name: data?.username,
    email: 'guest@example.com', // Not in API, keeping original
    playtimerank: data ? `${data.playtimeRank} 등` : '9999 등',
    avgscorerank: '123 등', // Not explicitly in API, keeping original
    totaltryrank: data ? `${data.totalTryRank} 등` : '999 등',
    profileImageUrl: 'profile-placeholder.png',
    backgroundImageUrl: '/dashboard-bg.png',
  };

  // Helper function to format date
  function formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
    } catch (e) {
      return dateString;
    }
  }

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-white">
        로딩 중...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-white">
        데이터를 불러오는 중 오류가 발생했습니다
      </div>
    );

  return (
    <div className="bg-zinc-900 min-h-screen px-16 py-8">
      <div className="flex gap-6 h-full">
        {/* 왼쪽 컬럼: 프로필, 스탯, 라인차트 */}
        <div className="flex flex-col w-1/2 space-y-4">
          {/* 프로필 타일 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <ProfileTile
              name={profileData.name}
              email={profileData.email}
              playtimerank={profileData.playtimerank}
              avgscorerank={profileData.avgscorerank}
              totaltryrank={profileData.totaltryrank}
              profileImageUrl={profileData.profileImageUrl}
              backgroundImageUrl={profileData.backgroundImageUrl}
            />
          </motion.div>

          {/* 스탯 타일들 */}
          <div className="grid grid-cols-3 gap-4">
            {updatedStatsData.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <StatsTile
                  label={stat.label}
                  value={stat.value}
                  change={stat.change}
                  positive={stat.positive}
                />
              </motion.div>
            ))}
          </div>

          {/* 라인 차트 - 원래 데이터 유지 (API에서 제공하지 않음) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <LineChartTile title="이번주 나의 점수" data={lineChartData} />
          </motion.div>
        </div>

        {/* 오른쪽 컬럼: 바차트, 노래 목록 */}
        <div className="flex flex-col w-1/2 space-y-4">
          {/* 바 차트 - API 데이터 사용 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <BarChartTile title="코드 별 정확도" data={transformedBarChartData} />
          </motion.div>

          {/* 노래 목록 - API 데이터 사용 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <SongListTile title="최근 연주한 노래" songs={transformedSongList} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
