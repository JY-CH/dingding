from fastapi import FastAPI, WebSocket, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from websocket import WebSocketManager, WebSocketHandler
import jwt
from jwt.exceptions import InvalidTokenError
import os
from dotenv import load_dotenv
import torch
import base64
from PIL import Image
import io
import json
import time
from ai_handler import AIHandler
import logging

# .env 파일 로드
load_dotenv()

app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 실제 운영 환경에서는 구체적인 origin을 지정해야 합니다
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# AI 핸들러 초기화
ai_handler = AIHandler()

manager = WebSocketManager()

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)


class AIWebSocketHandler(WebSocketHandler):
    def __init__(self, manager: WebSocketManager):
        super().__init__(manager)
        self.last_analysis_time = {}  # room_id별 마지막 분석 시간 저장

    async def handle_message(self, websocket: WebSocket, room_id: str, message):
        try:
            logger.info(f"=== 웹소켓 메시지 수신 ===")
            logger.info(f"방 ID: {room_id}")

            if isinstance(message, str):
                data = json.loads(message)
            else:
                data = message

            # 메시지에서 room_id 가져오기
            message_room_id = data.get('room_id', room_id)
            logger.info(f"메시지 room_id: {message_room_id}")
            logger.info(f"웹소켓 room_id: {room_id}")

            logger.info(f"받은 메시지 타입: {data.get('type')}")
            logger.info(f"메시지 데이터 키: {data.keys()}")

            if data.get('type') == 'image':
                current_time = time.time()
                last_time = self.last_analysis_time.get(message_room_id, 0)
                time_diff = current_time - last_time

                logger.info(f"시간 간격: {time_diff:.2f}초")
                logger.info(
                    f"이미지 데이터 길이: {len(data['data']) if 'data' in data else 'No image'}")
                logger.info(f"현재 코드: {data.get('chord')}")

                if time_diff >= 0.2:  # 200ms 간격으로 수정
                    try:
                        logger.info("=== AI 처리 시작 ===")
                        # AI 핸들러를 통해 이미지 처리
                        ai_response = await ai_handler.process_message(
                            message_room_id,
                            "이미지 분석",
                            data['data']
                        )
                        logger.info("AI 처리 완료")

                        # 점수 전송
                        logger.info("=== 응답 전송 시작 ===")
                        await websocket.send_json(ai_response)
                        logger.info(f"응답 전송 완료: {ai_response}")

                        # 분석 시간 업데이트
                        self.last_analysis_time[message_room_id] = current_time
                    except Exception as e:
                        logger.error(f"=== 이미지 처리 중 오류 발생 ===")
                        logger.error(f"오류 메시지: {str(e)}")
                        logger.error(f"오류 타입: {type(e)}")
                        import traceback
                        logger.error(f"스택 트레이스: {traceback.format_exc()}")
                        await websocket.send_json({
                            "type": "error",
                            "message": f"이미지 처리 중 오류 발생: {str(e)}"
                        })
            else:
                logger.info("=== 기타 메시지 처리 ===")
                await super().handle_message(websocket, message_room_id, message)
        except Exception as e:
            logger.error(f"=== 메시지 처리 중 오류 발생 ===")
            logger.error(f"오류 메시지: {str(e)}")
            logger.error(f"오류 타입: {type(e)}")
            import traceback
            logger.error(f"스택 트레이스: {traceback.format_exc()}")
            await websocket.send_json({
                "type": "error",
                "message": str(e)
            })


def calculate_pose_score(keypoints, current_chord):
    # 기타 자세에 따른 점수 계산 로직
    # 현재는 임시로 0~100 사이의 점수 반환
    return min(100, max(0, float(keypoints.mean()) * 100))


handler = AIWebSocketHandler(manager)


def verify_token(token: str):
    try:
        # 환경변수에서 JWT_SECRET을 가져옵니다
        jwt_secret = os.getenv("JWT_SECRET")
        if not jwt_secret:
            raise HTTPException(
                status_code=500, detail="JWT secret not configured")

        payload = jwt.decode(token, jwt_secret, algorithms=["HS256"])
        return payload
    except InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


@app.websocket("/api/ws")
async def websocket_endpoint(websocket: WebSocket, room_id: str, token: str):
    try:
        payload = verify_token(token)
        print(
            f"WebSocket connection attempt from user: {payload.get('username')}")
        await handler.handle_connection(websocket, room_id)
    except HTTPException as e:
        print(f"WebSocket connection rejected: {e.detail}")
        await websocket.close(code=4001, reason="Authentication failed")
    except Exception as e:
        print(f"WebSocket connection error: {str(e)}")
        await websocket.close(code=4000, reason="Internal server error")

print("angs~ 서버 시작됨!")
