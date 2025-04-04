from fastapi import WebSocket
from typing import Dict, List
import logging

logger = logging.getLogger(__name__)


class WebSocketManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, room_id: str):
        await websocket.accept()
        if room_id not in self.active_connections:
            self.active_connections[room_id] = []
        self.active_connections[room_id].append(websocket)
        logger.info(
            f"웹소켓 연결 추가 - 방 ID: {room_id}, 현재 연결 수: {len(self.active_connections[room_id])}")

    def disconnect(self, websocket: WebSocket, room_id: str):
        if room_id in self.active_connections:
            if websocket in self.active_connections[room_id]:
                self.active_connections[room_id].remove(websocket)
                logger.info(
                    f"웹소켓 연결 제거 - 방 ID: {room_id}, 현재 연결 수: {len(self.active_connections[room_id])}")
            if not self.active_connections[room_id]:
                del self.active_connections[room_id]
                logger.info(f"방 제거 - 방 ID: {room_id}")

    async def broadcast_to_room(self, room_id: str, message: str):
        if room_id in self.active_connections:
            for connection in self.active_connections[room_id]:
                try:
                    await connection.send_text(message)
                except Exception as e:
                    logger.error(f"메시지 전송 중 오류 발생: {str(e)}")
                    self.disconnect(connection, room_id)

    async def send_personal_message(self, websocket: WebSocket, message: str):
        try:
            await websocket.send_text(message)
        except Exception as e:
            logger.error(f"개인 메시지 전송 중 오류 발생: {str(e)}")
