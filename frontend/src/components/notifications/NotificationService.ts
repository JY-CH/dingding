import { NotificationType, useNotificationStore } from '../../store/useNotificationStore';

/**
 * 알림 생성 및 관리 서비스
 * 이 서비스는 특정 이벤트나 조건에 따라 알림을 자동으로 생성합니다.
 */
class NotificationService {
  private timers: Record<string, NodeJS.Timeout> = {};

  /**
   * 알림 생성
   */
  public createNotification(
    title: string,
    message: string,
    type: NotificationType = 'info',
    link?: string
  ) {
    const { addNotification } = useNotificationStore.getState();
    
    addNotification({
      title,
      message,
      type,
      link,
    });
  }

  /**
   * 특정 시간 후에 알림 생성
   */
  public scheduleNotification(
    title: string,
    message: string,
    delayMs: number,
    type: NotificationType = 'info',
    link?: string
  ): string {
    const id = crypto.randomUUID();
    
    this.timers[id] = setTimeout(() => {
      this.createNotification(title, message, type, link);
      delete this.timers[id];
    }, delayMs);
    
    return id;
  }

  /**
   * 예약된 알림 취소
   */
  public cancelScheduledNotification(id: string): boolean {
    if (this.timers[id]) {
      clearTimeout(this.timers[id]);
      delete this.timers[id];
      return true;
    }
    return false;
  }

  /**
   * 모든 예약된 알림 취소
   */
  public cancelAllScheduledNotifications() {
    Object.keys(this.timers).forEach((id) => {
      clearTimeout(this.timers[id]);
      delete this.timers[id];
    });
  }

  /**
   * 새로운 연습곡 추가 알림
   */
  public notifyNewSong(songTitle: string, artist: string) {
    this.createNotification(
      '새로운 연습곡이 추가되었습니다',
      `'${songTitle}' - ${artist} 곡이 연습곡 목록에 추가되었습니다.`,
      'info',
      '/performance'
    );
  }

  /**
   * 연습 리마인더 알림
   */
  public scheduleReminderNotification(delayMs: number = 24 * 60 * 60 * 1000) {
    return this.scheduleNotification(
      '연습 리마인더',
      '오늘도 기타 연습을 잊지 마세요! 꾸준한 연습이 실력 향상의 비결입니다.',
      delayMs,
      'info',
      '/play'
    );
  }

  /**
   * 업적 달성 알림
   */
  public notifyAchievement(achievementName: string, description: string) {
    this.createNotification(
      '새로운 업적 달성!',
      `${achievementName}: ${description}`,
      'success',
      '/dashboard'
    );
  }

  /**
   * 주간 연습 리포트 알림
   */
  public notifyWeeklyReport() {
    this.createNotification(
      '주간 연습 리포트',
      '이번 주 연습 리포트가 준비되었습니다. 지난 주보다 20% 향상되었네요!',
      'info',
      '/dashboard'
    );
  }

  /**
   * 시스템 알림
   */
  public notifySystem(message: string, type: NotificationType = 'info') {
    this.createNotification('시스템 알림', message, type);
  }

  /**
   * 오류 알림
   */
  public notifyError(error: Error | string) {
    const message = typeof error === 'string' ? error : error.message;
    this.createNotification('오류 발생', message, 'error');
  }
}

// 싱글톤 인스턴스
const notificationService = new NotificationService();
export default notificationService; 