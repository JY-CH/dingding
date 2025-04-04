const WS_URL = 'https://j12d105.p.ssafy.io/ws/';

class WebSocketService {
  private ws: WebSocket | null = null;
  private messageHandler: ((event: MessageEvent) => void) | null = null;
  private onOpenHandler: (() => void) | null = null;
  private onCloseHandler: (() => void) | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 3000;
  private currentRoomId: string | null = null;

  connect(roomId: string) {
    console.log('Connecting to WebSocket with roomId:', roomId);
    this.currentRoomId = roomId;

    // sessionStorage에서 토큰을 가져옵니다
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      console.error('No authentication token available in session storage');
      return;
    }

    const url = `${WS_URL}?room_id=${roomId}&token=${token}`;
    console.log('WebSocket URL:', url);

    try {
      this.ws = new WebSocket(url);
      this.setupEventListeners();
      this.reconnectAttempts = 0;
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.handleReconnect();
    }
  }

  private setupEventListeners() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('WebSocket connected successfully');
      if (this.onOpenHandler) {
        this.onOpenHandler();
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket connection closed');
      if (this.onCloseHandler) {
        this.onCloseHandler();
      }
      this.handleReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onmessage = (event) => {
      if (this.messageHandler) {
        this.messageHandler(event);
      }
    };
  }

  private handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    if (!this.currentRoomId) {
      console.error('No room ID available for reconnection');
      return;
    }

    this.reconnectAttempts++;
    console.log(
      `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`,
    );

    setTimeout(() => {
      this.connect(this.currentRoomId!);
    }, this.reconnectTimeout);
  }

  sendMessage(message: any) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.log('메시지 전송 시도:', message);
      console.log('웹소켓 상태:', this.ws?.readyState);
      console.error(`웹소켓이 연결되지 않음. 현재 상태: ${this.ws?.readyState}`);

      // 웹소켓 상태 설명 추가
      const states = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'];
      console.log('웹소켓 상태 설명:', states[this.ws?.readyState ?? 3]);

      // 재연결 시도
      if (this.currentRoomId) {
        console.log('웹소켓 재연결 시도...');
        this.connect(this.currentRoomId);
      }
      return;
    }

    try {
      const messageStr = JSON.stringify(message);
      console.log('웹소켓으로 메시지 전송 시도:', {
        type: message.type,
        dataLength: message.data?.length,
        chord: message.chord,
        room_id: message.room_id,
        timestamp: new Date().toISOString(),
      });

      // 메시지 전송
      this.ws.send(messageStr);

      console.log('웹소켓 메시지 전송 성공:', {
        type: message.type,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('메시지 전송 중 오류 발생:', error);
    }
  }

  setMessageHandler(handler: (event: MessageEvent) => void) {
    this.messageHandler = handler;
  }

  setOnOpenHandler(handler: () => void) {
    this.onOpenHandler = handler;
  }

  setOnCloseHandler(handler: () => void) {
    this.onCloseHandler = handler;
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.currentRoomId = null;
      this.reconnectAttempts = 0;
    }
  }

  close() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.currentRoomId = null;
      this.reconnectAttempts = 0;
    }
  }
}

export const websocketService = new WebSocketService();
