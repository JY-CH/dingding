import notificationService from '../components/notifications/NotificationService';

/**
 * 데모용 알림을 생성하는 함수
 * 개발 중 테스트와 데모를 위해 사용됩니다.
 */
export const createDemoNotifications = () => {
  // 예제 연습곡 알림
  notificationService.notifyNewSong('Sweet Child O\' Mine', 'Guns N\' Roses');
  
  // 5초 후 업적 달성 알림
  setTimeout(() => {
    notificationService.notifyAchievement(
      '연습왕',
      '연속 7일 동안 매일 30분 이상 연습했습니다'
    );
  }, 5000);
  
  // 10초 후 주간 리포트 알림
  setTimeout(() => {
    notificationService.notifyWeeklyReport();
  }, 10000);
  
  // 15초 후 시스템 알림
  setTimeout(() => {
    notificationService.notifySystem(
      '앱이 성공적으로 업데이트되었습니다. 새로운 기능을 사용해보세요!',
      'info'
    );
  }, 15000);
};

/**
 * 실시간 활동 시뮬레이션
 * 일정 시간마다 랜덤 알림을 생성합니다.
 */
export const startRandomNotifications = (intervalMinutes: number = 5) => {
  const intervalMs = intervalMinutes * 60 * 1000;
  
  const randomMessages: { title: string; message: string; type: 'info' | 'success' | 'warning' }[] = [
    {
      title: '새로운 기록!',
      message: '기타 연주 정확도가 90%를 넘었습니다. 계속 연습하세요!',
      type: 'success',
    },
    {
      title: '콘텐츠 업데이트',
      message: '이번 주 추천 곡 목록이 업데이트되었습니다.',
      type: 'info',
    },
    {
      title: '연습 알림',
      message: '오늘 연습을 시작하지 않았네요. 지금 시작해보세요!',
      type: 'warning',
    },
    {
      title: '친구 소식',
      message: 'JamesDoe님이 당신의 연습곡을 좋아합니다.',
      type: 'info',
    },
    {
      title: '이벤트 알림',
      message: '주말 특별 코드 챌린지가 내일 시작됩니다. 참여해보세요!',
      type: 'info',
    },
  ];
  
  // 처음 알림 즉시 생성
  const randomItem = randomMessages[Math.floor(Math.random() * randomMessages.length)];
  notificationService.createNotification(
    randomItem.title,
    randomItem.message,
    randomItem.type
  );
  
  // 이후 일정 간격으로 알림 생성
  const intervalId = setInterval(() => {
    const randomItem = randomMessages[Math.floor(Math.random() * randomMessages.length)];
    notificationService.createNotification(
      randomItem.title,
      randomItem.message,
      randomItem.type
    );
  }, intervalMs);
  
  // 인터벌 ID 반환 (정지용)
  return intervalId;
};

/**
 * 알림 정지
 */
export const stopRandomNotifications = (intervalId: NodeJS.Timeout) => {
  clearInterval(intervalId);
}; 