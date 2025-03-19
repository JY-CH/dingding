// src/pages/Dashboard.tsx
import React from 'react';
import ProfileTile from '../components/dashboard/ProfileTile';

const profileData = {
    name: '임재열',
    email: 'dingding@gmail.com',
    rank: '9999 등',
    imageUrl: 'src/assets/띵까띵까.png'
}

const DashboardPage: React.FC = () => {
//   // 상태 관리
//   const [profileData, setProfileData] = useState(null);
//   const [statsData, setStatsData] = useState([]);
//   const [barChartData, setBarChartData] = useState([]);
//   const [lineChartData, setLineChartData] = useState([]);
//   const [songList, setSongList] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // 데이터 불러오기
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         // 병렬로 여러 API 호출
//         const [profile, stats, barData, lineData, songs] = await Promise.all([
//           fetchProfileData(),
//           fetchStats(),
//           fetchChartData('bar'),
//           fetchChartData('line'),
//           fetchSongs()
//         ]);
        
//         // 상태 업데이트
//         setProfileData(profile);
//         setStatsData(stats);
//         setBarChartData(barData);
//         setLineChartData(lineData);
//         setSongList(songs);
//       } catch (error) {
//         console.error('데이터를 불러오는 중 오류 발생:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, []);

  return (
    <div className="bg-amber-50 p-6 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 프로필 카드 */}
        <ProfileTile 
          name={profileData.name}
          email={profileData.email}
          rank={profileData.rank}
          imageUrl={profileData.imageUrl}
        />
      </div>
    </div>
  );
};

export default DashboardPage;