import React, { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { Clock, Star, Repeat, ChevronRight } from 'lucide-react';

import BarChartTile from '@/components/dashboard/BarChartTile';
import LineChartTile from '@/components/dashboard/LineChartTile';
import ProfileTile from '@/components/dashboard/ProfileTile';
import SongListTile from '@/components/dashboard/SongListTile';
// import StatsTile from '@/components/dashboard/StatsTile';

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
  songTitle: string;
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

const formatDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
};

const DashboardPage: React.FC = () => {
  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ['dashboardData'],
    queryFn: fetchDashboardData,
  });

  // 라인차트 데이터 메모이제이션
  const lineChartData = useMemo(() => {
    if (!data?.replays?.length) return [];

    // 최근 7일간 날짜 배열 생성 (오늘 포함)
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i)); // 과거 6일 ~ 오늘
      return {
        day: date.toLocaleDateString('ko-KR', { weekday: 'short' }),
        dateKey: formatDateKey(date),
        practiceScores: [] as number[],
        performanceScores: [] as number[],
      };
    });

    // replays 배열에서 각 날짜별 모드 점수 할당
    data.replays.forEach((replay) => {
      const replayDate = new Date(replay.practiceDate);
      const replayKey = formatDateKey(replayDate);
      const dayEntry = days.find((d) => d.dateKey === replayKey);
      if (dayEntry) {
        if (replay.mode === 'PRACTICE') {
          dayEntry.practiceScores.push(replay.score);
        } else {
          dayEntry.performanceScores.push(replay.score);
        }
      }
    });

    // 각 날짜별 평균 계산
    const result = days.map((d) => ({
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
    return result;
  }, [data?.replays]);

  // 바차트 데이터 메모이제이션
  const transformedBarChartData = useMemo(() => {
    return (
      data?.chordScoreDtos?.map((chord) => ({
        name: chord.chordType,
        value: parseInt(chord.score, 10),
      })) || []
    );
  }, [data?.chordScoreDtos]);

  console.log(data?.replays);
  // 노래 목록 데이터 메모이제이션
  const transformedSongList = useMemo(() => {
    return (
      data?.replays?.map((replay) => ({
        title: replay.songTitle,
        artist: replay.mode,
        duration: formatDate(replay.practiceDate),
        score: replay.score,
        thumbnail: 'src/assets/노래.jpg',
        videoPath: replay.videoPath,
        replayId: replay.replayId,
      })) || []
    );
  }, [data?.replays]);

  // 평균 점수 계산 메모이제이션
  const averageScore = useMemo(() => {
    if (!data?.chordScoreDtos || data.chordScoreDtos.length === 0) return '0%';
    const sum = data.chordScoreDtos.reduce((acc, chord) => acc + parseInt(chord.score, 10), 0);
    return `${Math.round(sum / data.chordScoreDtos.length)}%`;
  }, [data?.chordScoreDtos]);

  // 통계 데이터 메모이제이션
  const updatedStatsData = useMemo(
    () => [
      {
        label: '누적시간',
        value:
          data?.playtime
            ?.split(':')
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
        value: averageScore,
        change: '+10.01%',
        positive: false,
        icon: <Star className="w-5 h-5 text-amber-500" />,
      },
      {
        label: '누적 연습량',
        value: `${data?.totalTry || 0}회`,
        change: '-0.03%',
        positive: true,
        icon: <Repeat className="w-5 h-5 text-amber-500" />,
      },
    ],
    [data?.playtime, data?.totalTry, averageScore],
  );

  // 프로필 데이터 메모이제이션
  const profileData = useMemo(
    () => ({
      name: data?.username || '로그인이 필요합니다',
      email: data?.loginId || '로그인이 필요합니다',
      playtimerank: `${data?.playtimeRank || '?'} 등`,
      avgscorerank: `${data?.scoreRank || '?'} 등`,
      totaltryrank: `${data?.totalTryRank || '?'} 등`,
      profileImageUrl: data?.profileImage || 'ding.svg',
      backgroundImageUrl: 'ding.svg',
      createAt: data?.createAt || '?',
    }),
    [
      data?.username,
      data?.loginId,
      data?.playtimeRank,
      data?.scoreRank,
      data?.totalTryRank,
      data?.profileImage,
      data?.createAt,
    ],
  );

  function formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
    } catch (e) {
      console.error('Date parsing error:', e);
      return dateString;
    }
  }

  // 애니메이션 성능 최적화를 위해 LazyMotion 사용
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
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
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-white overflow-y-auto custom-scrollbar pb-20 p-8">
      <div className="max-w-7xl mx-auto">
        <LazyMotion features={domAnimation}>
          <m.div initial="hidden" animate="visible" variants={containerVariants} className="mb-8">
            <m.div variants={itemVariants}>
              <h1 className="text-3xl font-bold mb-1">대시보드</h1>
              <p className="text-zinc-400">나의 연습 데이터를 확인하고 성장을 추적하세요</p>
            </m.div>
          </m.div>

          <m.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col lg:flex-row gap-6"
          >
            {/* 왼쪽 컬럼: 프로필, 스탯, 라인차트 */}
            <m.div variants={itemVariants} className="flex flex-col lg:w-1/2 space-y-6">
              {/* 프로필 타일 */}
              <div className="bg-zinc-800/70 backdrop-blur-sm rounded-xl border border-white/5 shadow-xl overflow-hidden hover:border-amber-500/30 transition-all duration-300">
                <ProfileTile {...profileData} />
              </div>

              {/* 스탯 타일들 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {updatedStatsData.map((stat, index) => (
                  <div
                    key={index}
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
                  </div>
                ))}
              </div>

              {/* 라인 차트 */}
              <div className="bg-zinc-800/70 backdrop-blur-sm rounded-xl border border-white/5 shadow-xl overflow-hidden hover:border-amber-500/30 transition-all duration-300">
                <LineChartTile title="이번주 나의 점수" data={lineChartData} />
              </div>
            </m.div>

            {/* 오른쪽 컬럼: 바차트, 노래 목록 */}
            <m.div variants={itemVariants} className="flex flex-col lg:w-1/2 space-y-6">
              {/* 바 차트 */}
              <div className="bg-zinc-800/70 backdrop-blur-sm rounded-xl border border-white/5 shadow-xl overflow-hidden hover:border-amber-500/30 transition-all duration-300">
                <BarChartTile title="코드 별 정확도" data={transformedBarChartData} />
              </div>

              {/* 노래 목록 */}
              <div className="bg-zinc-800/70 backdrop-blur-sm rounded-xl border border-white/5 shadow-xl overflow-hidden hover:border-amber-500/30 transition-all duration-300">
                <SongListTile title="최근 연주한 노래" songs={transformedSongList} />
              </div>
            </m.div>
          </m.div>

          {/* Footer */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-10 text-center"
          >
            <a
              href="/community"
              className="inline-flex items-center text-amber-500 hover:text-amber-400 transition-colors"
            >
              <span>커뮤니티에서 다른 기타리스트와 경험을 공유해보세요</span>
              <ChevronRight className="ml-1 w-4 h-4" />
            </a>
          </m.div>
        </LazyMotion>
      </div>
    </div>
  );
};

export default React.memo(DashboardPage);
