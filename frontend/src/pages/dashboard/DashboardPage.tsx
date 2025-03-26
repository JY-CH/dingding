// src/pages/Dashboard.tsx
import React from 'react';

import BarChartTile from '@/components/dashboard/BarChartTile';
import LineChartTile from '@/components/dashboard/LineChartTile';
import ProfileTile from '@/components/dashboard/ProfileTile';
import SongListTile from '@/components/dashboard/SongListTile';
import StatsTile from '@/components/dashboard/StatsTile';

const profileData = {
  name: '임재열',
  email: 'dingding@gmail.com',
  rank: '9999 등',
  profileImageUrl: 'src/assets/띵까띵까.png',
  backgroundImageUrl: 'src/assets/띵까띵까.png',
};

const statsData = [
  { label: '이번 주 최고 점수', value: '075점', change: '+10.01%', positive: true },
  { label: '누적시간', value: '2,318시간', change: '', positive: null },
  { label: '이번 주 연습량', value: '671회', change: '-0.03%', positive: false },
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
  return (
    <div className="bg-zinc-900 min-h-screen px-16 py-8">
      <div className="flex gap-6 h-full">
        {/* 왼쪽 컬럼: 프로필, 스탯, 라인차트 */}
        <div className="flex flex-col w-1/2 space-y-4">
          <ProfileTile
            name={profileData.name}
            email={profileData.email}
            rank={profileData.rank}
            profileImageUrl={profileData.profileImageUrl}
            backgroundImageUrl={profileData.backgroundImageUrl}
          />
          <div className="grid grid-cols-3 gap-4">
            {statsData.map((stat, index) => (
              <StatsTile
                key={index}
                label={stat.label}
                value={stat.value}
                change={stat.change}
                positive={stat.positive}
              />
            ))}
          </div>
          <LineChartTile title="이번주 나의 점수" data={lineChartData} />
        </div>

        {/* 오른쪽 컬럼: 바차트, 노래 목록 */}
        <div className="flex flex-col w-1/2 space-y-4">
          <BarChartTile title="코드 별 정확도" data={barChartData} />
          <SongListTile title="최근 연주한 노래" songs={songList} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
