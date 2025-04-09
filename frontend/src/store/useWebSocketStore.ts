import { create } from 'zustand';

import { websocketService } from '../services/websocket';

interface WebSocketState {
  isConnected: boolean;
  score: number;
  messages: Array<{
    type: string;
    message: string;
    role?: 'user' | 'assistant';
    score?: number;
    image?: string;
    chord?: string;
    confidence?: number;
    isCorrect?: boolean;
  }>;
  connect: (roomId: string) => void;
  disconnect: () => void;
  sendMessage: (message: any) => void;
  setScore: (score: number) => void;
  addMessage: (message: any) => void;
}

export const useWebSocketStore = create<WebSocketState>((set, get) => ({
  isConnected: false,
  score: 0,
  messages: [],

  connect: (roomId: string) => {
    // sessionStorage에서 토큰 가져오기
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      console.error('인증 토큰이 없습니다.');
      return;
    }

    console.log('Connecting to WebSocket with roomId:', roomId);
    const wsUrl = `wss://j12d105.p.ssafy.io/ws?room_id=${roomId}&token=${token}`;
    console.log('WebSocket URL:', wsUrl);

    // roomId만 전달
    websocketService.connect(roomId);

    websocketService.setOnErrorHandler((error) => {
      console.error('🟡 [WebSocket 에러 발생]');
      console.error('➡️ 에러 정보:', error);
      set({ isConnected: false });
      window.dispatchEvent(new Event('websocketStateChange'));
    });

    websocketService.setOnOpenHandler(() => {
      console.log('🟢 [WebSocket 연결됨]');
      console.log('➡️ 현재 시간:', new Date().toISOString());
      set({ isConnected: true });
      window.dispatchEvent(new Event('websocketStateChange'));
    });

    websocketService.setOnCloseHandler((event) => {
      console.log('🔴 [WebSocket 연결 끊김]');
      console.log('➡️ 연결 해제 시간:', new Date().toISOString());
      if (event) {
        console.log('🔍 Close Event:', {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
        });
      }
      set({ isConnected: false });
      window.dispatchEvent(new Event('websocketStateChange'));
    });

    websocketService.setMessageHandler((event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('웹소켓으로 받은 메시지:', data);

        switch (data.type) {
          case 'score':
            if (typeof data.score === 'number') {
              console.log('점수 업데이트:', data.score);
              get().setScore(data.score);
            }
            break;
          case 'ai_response':
            console.log('AI 응답 받음:', data.message);
            if (typeof data.score === 'number') {
              console.log('점수 업데이트:', data.score);
              get().setScore(data.score);
            }
            get().addMessage({
              type: 'AI',
              message: data.message,
              role: 'assistant',
            });
            break;
          case 'error':
            console.error('서버 에러:', data.message);
            get().addMessage({
              type: 'Error',
              message: data.message,
              role: 'assistant',
            });
            break;
          default:
            console.log('기타 메시지:', data);
            get().addMessage(data);
        }
      } catch (error) {
        console.error('메시지 처리 중 오류:', error);
      }
    });
  },

  disconnect: () => {
    // 웹소켓 연결만 종료하고 쿠키는 유지
    websocketService.disconnect();
    set({ isConnected: false });
  },

  sendMessage: (message: any) => {
    websocketService.sendMessage(message);
  },

  setScore: (score: number) => {
    console.log('Setting score:', score);
    set({ score });
  },

  addMessage: (message: any) => {
    console.log('메시지 추가:', message);
    set((state) => ({
      messages: [...state.messages.slice(-50), message],
    }));
  },
}));
