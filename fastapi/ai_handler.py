from typing import Dict, Any
import base64
import cv2
import numpy as np
from PIL import Image
import io
import wave
import speech_recognition as sr
from pydub import AudioSegment
import json
import torch
from ultralytics import YOLO
import os
import re


class AIHandler:
    def __init__(self):
        self.conversation_history = {}
        self.recognizer = sr.Recognizer()

        # 클래스 이름 매핑
        self.class_names = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

        # 모델 로드
        model_path = os.path.join(os.path.dirname(__file__), 'best11m.pt')
        print(f"모델 파일 경로: {model_path}")

        # YOLO 모델 초기화
        self.model = YOLO(model_path)
        print("모델 로드 완료")

    async def process_message(self, room_id: str, message: str, image_data: str = None, audio_data: str = None) -> Dict[str, Any]:
        print("\n=== AI 처리 시작 ===")
        print(f"방 ID: {room_id}")
        print(f"메시지: {message}")

        # 대화 기록 초기화
        if room_id not in self.conversation_history:
            self.conversation_history[room_id] = []

        # 사용자 메시지 저장
        self.conversation_history[room_id].append(
            {"role": "user", "content": message})

        # 이미지와 오디오 처리
        score = 0
        feedback = ""

        if image_data:
            print("\n--- 이미지 처리 시작 ---")
            image_score, image_feedback = self.process_image(image_data)
            score = image_score  # score를 직접 대입 (누적하지 않음)
            feedback += f"이미지 분석: {image_feedback}\n"
            print(f"이미지 점수: {image_score}")
            print(f"이미지 피드백: {image_feedback}")

        if audio_data:
            print("\n--- 오디오 처리 시작 ---")
            audio_score, audio_feedback = self.process_audio(audio_data)
            score = audio_score  # score를 직접 대입 (누적하지 않음)
            feedback += f"음성 분석: {audio_feedback}\n"
            print(f"오디오 점수: {audio_score}")
            print(f"오디오 피드백: {audio_feedback}")

        # AI 응답 생성
        ai_message = self.generate_ai_response(
            message, self.conversation_history[room_id], score, feedback)
        print(f"AI 응답 생성: {ai_message}")

        # AI 응답 저장
        self.conversation_history[room_id].append(
            {"role": "assistant", "content": ai_message})

        print("\n=== 최종 결과 ===")
        print(f"총 점수: {score}")
        print(f"피드백: {feedback}")
        print("=== AI 처리 완료 ===\n")

        return {
            "type": "ai_response",
            "message": ai_message,
            "score": score,
            "feedback": feedback
        }

    def process_image(self, image_data: str) -> tuple[float, str]:
        try:
            print("\n이미지 처리 중...")
            # base64 디코딩
            image_bytes = base64.b64decode(image_data.split(',')[1])
            nparr = np.frombuffer(image_bytes, np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            print(f"이미지 크기: {image.shape}")

            # 이미지 전처리
            image = cv2.resize(image, (640, 480))  # 원래 코드와 동일한 크기로 조정
            print("이미지 리사이즈 완료")

            # 모델 예측
            print("모델 예측 시작...")
            # verbose=True로 설정하여 상세 출력
            results = self.model(image, verbose=True)
            print("모델 예측 완료")

            # 결과 처리
            if len(results) > 0:
                result = results[0]
                print(f"감지된 박스 수: {len(result.boxes)}")

                # 감지된 객체들의 클래스와 신뢰도 추출
                detections = []
                max_confidence = 0.0  # 최대 신뢰도 저장
                for i, box in enumerate(result.boxes):
                    class_id = int(box.cls.item())
                    confidence = box.conf.item()
                    chord_name = self.class_names[class_id]
                    detections.append(f"{chord_name}({confidence:.2%})")
                    print(f"감지 {i+1}: {chord_name} (신뢰도: {confidence:.2%})")
                    max_confidence = max(max_confidence, confidence)

                if detections:
                    # 최대 신뢰도를 점수로 변환 (소수점 반올림)
                    score = round(max_confidence * 100)
                    return score, f"감지된 코드: {', '.join(detections)}"
                else:
                    print("감지된 코드 없음")
                    return 0.0, "기타 코드를 감지하지 못했습니다."

            print("결과 없음")
            return 0.0, "기타 코드를 감지하지 못했습니다."

        except Exception as e:
            print(f"이미지 처리 중 오류 발생: {str(e)}")
            return 0.0, f"이미지 처리 실패: {str(e)}"

    def process_audio(self, audio_data: str) -> tuple[float, str]:
        try:
            # Base64 오디오 데이터 디코딩
            audio_data = audio_data.split(',')[1]
            audio_bytes = base64.b64decode(audio_data)

            # WAV 파일로 변환
            with wave.open(io.BytesIO(audio_bytes), 'rb') as wav_file:
                # 음성 인식
                with sr.AudioFile(wav_file) as source:
                    audio = self.recognizer.record(source)
                    try:
                        text = self.recognizer.recognize_google(
                            audio, language='ko-KR')
                        return 50.0, f"인식된 텍스트: {text}"
                    except sr.UnknownValueError:
                        return 0.0, "음성을 인식할 수 없습니다"
                    except sr.RequestError:
                        return 0.0, "음성 인식 서비스 오류"
        except Exception as e:
            print(f"오디오 처리 오류: {e}")
            return 0.0, "오디오 처리 실패"

    def generate_ai_response(self, message: str, history: list, score: float, feedback: str) -> str:
        return f"점수: {score:.1f}점\n{feedback}"
