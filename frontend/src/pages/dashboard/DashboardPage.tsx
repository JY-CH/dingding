import React from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';

import BarChartTile from '@/components/dashboard/BarChartTile';
import LineChartTile from '@/components/dashboard/LineChartTile';
import ProfileTile from '@/components/dashboard/ProfileTile';
import SongListTile from '@/components/dashboard/SongListTile';
import StatsTile from '@/components/dashboard/StatsTile';

const statsData = [
  { label: '평균 정확도도', value: '075%', change: '+10.01%', positive: true },
  { label: '누적시간', value: '2,318시간', change: '', positive: null },
  { label: '누적 연습량', value: '671회', change: '-0.03%', positive: false },
];

const barChartData = [
  { name: 'A', value: 60 },
  { name: 'B', value: 98 },
  { name: 'C', value: 70 },
  { name: 'D', value: 100 },
  { name: 'E', value: 35 },
  { name: 'F', value: 85 },
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

const songList = [
  {
    title: 'Basics of Mobile UX',
    artist: 'Bruno Scott',
    duration: '03:13',
    score: 75,
    thumbnail: 'src/assets/노래.jpg',
  },
  {
    title: 'Basics of Mobile UX',
    artist: 'Bruno Scott',
    duration: '03:13',
    score: 75,
    thumbnail: 'src/assets/노래.jpg',
  },
  {
    title: 'Basics of Mobile UX',
    artist: 'Bruno Scott',
    duration: '03:13',
    score: 75,
    thumbnail: 'src/assets/노래.jpg',
  },
  {
    title: 'Basics of Mobile UX',
    artist: 'Bruno Scott',
    duration: '03:13',
    score: 75,
    thumbnail: 'src/assets/노래.jpg',
  },
  {
    title: 'Basics of Mobile UX',
    artist: 'Bruno Scott',
    duration: '03:13',
    score: 75,
    thumbnail: 'src/assets/노래.jpg',
  },
];

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();

  const profileData = {
    name: user?.username || '게스트',
    email: user?.email || 'guest@example.com',
    playtimerank: '9999 등',
    avgscorerank: '123 등',
    totaltryrank: '999 등',
    profileImageUrl: user?.profileImage || '/profile-placeholder.png',
    backgroundImageUrl: '/dashboard-bg.png',
  };

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
            {statsData.map((stat, index) => (
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

          {/* 라인 차트 */}
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
          {/* 바 차트 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <BarChartTile title="코드 별 정확도" data={barChartData} />
          </motion.div>

          {/* 노래 목록 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <SongListTile title="최근 연주한 노래" songs={songList} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
