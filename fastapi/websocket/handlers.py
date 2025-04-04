from fastapi import WebSocket
from .connection import WebSocketManager
from ai_handler import AIHandler
import json
import logging

logger = logging.getLogger(__name__)


class WebSocketHandler:
    def __init__(self, manager: WebSocketManager):
        self.manager = manager
        self.ai_handler = AIHandler()

    async def handle_connection(self, websocket: WebSocket, room_id: str):
        try:
            await self.manager.connect(websocket, room_id)
            logger.info(f"웹소켓 연결 성공 - 방 ID: {room_id}")

            while True:
                try:
                    data = await websocket.receive_text()
                    await self.handle_message(websocket, room_id, data)
                except Exception as e:
                    logger.error(f"메시지 처리 중 오류 발생: {str(e)}")
                    break

        except Exception as e:
            logger.error(f"웹소켓 연결 처리 중 오류 발생: {str(e)}")
        finally:
            self.manager.disconnect(websocket, room_id)
            logger.info(f"웹소켓 연결 종료 - 방 ID: {room_id}")

    async def handle_message(self, websocket: WebSocket, room_id: str, message: str):
        try:
            data = json.loads(message)
            message_type = data.get("type")
            message_content = data.get("message", "")
            image_data = data.get("image")
            audio_data = data.get("audio")

            if message_type == "ai_message":
                # AI 응답 처리
                ai_response = await self.ai_handler.process_message(
                    room_id,
                    message_content,
                    image_data,
                    audio_data
                )
                await self.manager.broadcast_to_room(room_id, json.dumps(ai_response))
            elif message_type == "broadcast":
                await self.manager.broadcast_to_room(room_id, message)
            elif message_type == "personal":
                await self.manager.send_personal_message(websocket, message)
            else:
                # 기본적으로 방에 브로드캐스트
                await self.manager.broadcast_to_room(room_id, message)

        except json.JSONDecodeError:
            # JSON 파싱 실패시 일반 텍스트로 처리
            await self.manager.broadcast_to_room(room_id, message)
        except Exception as e:
            logger.error(f"메시지 처리 중 오류 발생: {str(e)}")
            await websocket.send_json({
                "type": "error",
                "message": str(e)
            })
