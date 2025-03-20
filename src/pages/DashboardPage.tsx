// src/pages/Dashboard.tsx
import React from 'react';
import ProfileTile from '../components/dashboard/ProfileTile';
import StatsTile from '../components/dashboard/StatsTile';
import BarChartTile from '../components/dashboard/BarChartTile';
import LineChartTile from '../components/dashboard/LineChartTile';
import SongListTile from '../components/dashboard/SongListTile';

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
  { day: '일', current: 90, average: 70 },
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
    <div className="bg-amber-50 px-6 pl-20 min-h-screen flex">
      {/* 사이드바 공간 */}
      <div className="w-40" />
      {/* 메인 대시보드 영역 */}
      <div className="flex-1">
        {/* 큰 박스 */}
        <div className="bg-stone-100 p-4 rounded-2xl shadow-md">
          <div className="flex space-x-4">
            {/* 왼쪽 컬럼: 프로필, 스탯, 라인차트 */}
            <div className="flex flex-col w-3/5 space-y-4">
              <ProfileTile
                name={profileData.name}
                email={profileData.email}
                rank={profileData.rank}
                profileImageUrl={profileData.profileImageUrl}
                backgroundImageUrl={profileData.backgroundImageUrl}
              />
              {/* 스탯 타일 그룹: 각 타일이 균등하게 공간을 채우도록 flex-1 추가 */}
              <div className="flex space-x-4">
                {statsData.map((stat, index) => (
                  <div key={index} className="flex-1">
                    <StatsTile
                      label={stat.label}
                      value={stat.value}
                      change={stat.change}
                      positive={stat.positive}
                    />
                  </div>
                ))}
              </div>
              <LineChartTile title="이번주 나의 점수" data={lineChartData} />
            </div>
            {/* 오른쪽 컬럼: 바차트, 노래 목록 */}
            <div className="flex flex-col w-2/5 space-y-4">
              <BarChartTile title="코드 별 정확도" data={barChartData} />
              <SongListTile title="최근 연주한 노래" songs={songList} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
