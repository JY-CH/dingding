from fastapi import FastAPI, WebSocket, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from websocket import WebSocketManager, WebSocketHandler
import jwt
from jwt.exceptions import InvalidTokenError
import os
import torch
import base64
from PIL import Image
import io
import json
import time
import uuid
from ai_handler import AIHandler
import logging
from dotenv import load_dotenv
import uvicorn
import numpy as np
import librosa
import joblib
from scipy import signal
from scipy.spatial.distance import cosine


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
logging.basicConfig(level=logging.DEBUG)
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

                if time_diff >= 2:  # 200ms 간격으로 수정
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


def generate_room_id() -> str:
    """고유한 room ID를 생성합니다."""
    return f"room_{uuid.uuid4()}"


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, room_id: str = None, token: str = None):
    try:
        # room_id가 제공되지 않으면 자동 생성
        if not room_id:
            room_id = generate_room_id()
            logger.info(f"자동 생성된 room ID: {room_id}")

        # 토큰 검증
        if token:
            payload = verify_token(token)
            logger.info(
                f"WebSocket connection attempt from user: {payload.get('username')}")
        else:
            logger.info("Anonymous WebSocket connection attempt")

        await handler.handle_connection(websocket, room_id)
    except HTTPException as e:
        logger.error(f"WebSocket connection rejected: {e.detail}")
        await websocket.close(code=4001, reason="Authentication failed")
    except Exception as e:
        logger.error(f"WebSocket connection error: {str(e)}")
        await websocket.close(code=4000, reason="Internal server error")


# 오디오 로드 및 전처리 함수
def load_and_preprocess_audio(audio_data, sr=22050, duration=1.0):
    print(f"오디오 데이터 처리 중, 목표 길이: {duration}초")

    # wav 파일 로드 (원래 길이)
    y = audio_data
    print(f"로드된 오디오 길이: {len(y)/sr:.2f}초, 샘플 수: {len(y)}")

    # 묵음 제거
    y_trimmed, trim_indices = librosa.effects.trim(y, top_db=25)
    print(f"묵음 제거 후 길이: {len(y_trimmed)/sr:.2f}초, 샘플 수: {len(y_trimmed)}")

    # 가장 에너지가 큰 세그먼트 찾기
    if len(y_trimmed) > duration * sr:
        # 윈도우 크기 설정
        frame_length = int(0.05 * sr)  # 50ms 프레임
        hop_length = int(0.025 * sr)   # 25ms 홉

        # 프레임별 에너지 계산
        energy = librosa.feature.rms(
            y=y_trimmed, frame_length=frame_length, hop_length=hop_length)[0]
        max_energy_idx = np.argmax(energy)
        start_idx = max_energy_idx * hop_length

        # 시작점에서 duration 길이의 세그먼트 추출
        end_idx = min(start_idx + int(duration * sr), len(y_trimmed))
        y_segment = y_trimmed[start_idx:end_idx]
        print(f"에너지 최대 부분 추출 - 시작: {start_idx/sr:.2f}초, 종료: {end_idx/sr:.2f}초")
    else:
        y_segment = y_trimmed
        print("오디오가 목표 길이보다 짧아 전체 사용")

    # 목표 길이로 맞추기
    target_length = int(duration * sr)
    if len(y_segment) < target_length:
        y_final = np.pad(y_segment, (0, target_length -
                         len(y_segment)), 'constant')
        print(f"패딩 추가: {(target_length - len(y_segment))/sr:.2f}초")
    else:
        y_final = y_segment[:target_length]
        print(f"목표 길이로 잘라냄: {duration}초")

    print(f"최종 오디오 길이: {len(y_final)/sr:.2f}초, 샘플 수: {len(y_final)}")

    return y_final, sr

# 템플릿 매칭용 특성 추출 (고정된 파라미터 사용)


def extract_template_features(y, sr):
    # 특정 크기로 고정된 멜 스펙트로그램
    n_fft = 1024
    hop_length = 512
    n_mels = 128

    # 멜 스펙트로그램
    mel_spec = librosa.feature.melspectrogram(
        y=y, sr=sr, n_mels=n_mels, n_fft=n_fft, hop_length=hop_length
    )
    mel_spec_db = librosa.power_to_db(mel_spec, ref=np.max)

    # 크로마
    chroma = librosa.feature.chroma_stft(
        y=y, sr=sr, n_chroma=12, n_fft=n_fft, hop_length=hop_length
    )

    return mel_spec_db, chroma

# ML 모델용 특성 추출 (새로운 버전)


def extract_combined_features(y, sr, template_mels=None, template_chromas=None, template_labels=None):
    # 기본 특성 추출
    mel_spec, chroma = extract_template_features(y, sr)

    # 크로마 특성 (핵심 화음 정보)
    chroma_mean = np.mean(chroma, axis=1)
    chroma_std = np.std(chroma, axis=1)
    chroma_max = np.max(chroma, axis=1)

    # MFCC (음색 특성)
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=20)
    mfcc_mean = np.mean(mfcc, axis=1)
    mfcc_std = np.std(mfcc, axis=1)

    # 스펙트럴 특성
    spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=sr)
    spec_cent_mean = np.mean(spectral_centroid)

    spectral_bandwidth = librosa.feature.spectral_bandwidth(y=y, sr=sr)
    spec_bw_mean = np.mean(spectral_bandwidth)

    spectral_rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)
    rolloff_mean = np.mean(spectral_rolloff)

    # 하모닉/퍼커시브 분리
    y_harmonic, y_percussive = librosa.effects.hpss(y)
    harmonic_mean = np.mean(y_harmonic)
    harmonic_std = np.std(y_harmonic)

    # 기본 특성 결합
    features = np.concatenate([
        chroma_mean, chroma_std, chroma_max,
        mfcc_mean, mfcc_std,
        [spec_cent_mean, spec_bw_mean, rolloff_mean,
         harmonic_mean, harmonic_std]
    ])

    # 템플릿 매칭 특성 추가 (템플릿이 제공된 경우)
    template_similarity = []

    if template_mels is not None and template_chromas is not None and template_labels is not None:
        # 각 템플릿과의 유사도 계산
        similarity_scores = {}

        for i, (template_mel, template_chroma, label) in enumerate(zip(template_mels, template_chromas, template_labels)):
            try:
                # 크기 맞추기
                if template_mel.shape[1] != mel_spec.shape[1]:
                    # 리샘플링을 통한 크기 맞추기
                    if template_mel.shape[1] > mel_spec.shape[1]:
                        # 템플릿을 테스트 크기로 리샘플링
                        resampled_template = np.zeros(
                            (template_mel.shape[0], mel_spec.shape[1]))
                        for row in range(template_mel.shape[0]):
                            resampled_template[row] = signal.resample(
                                template_mel[row], mel_spec.shape[1]
                            )
                        t_mel = resampled_template
                        m_spec = mel_spec
                    else:
                        # 테스트를 템플릿 크기로 리샘플링
                        resampled_test = np.zeros(
                            (mel_spec.shape[0], template_mel.shape[1]))
                        for row in range(mel_spec.shape[0]):
                            resampled_test[row] = signal.resample(
                                mel_spec[row], template_mel.shape[1]
                            )
                        t_mel = template_mel
                        m_spec = resampled_test
                else:
                    t_mel = template_mel
                    m_spec = mel_spec

                # 크로마도 같은 방식으로 처리
                if template_chroma.shape[1] != chroma.shape[1]:
                    if template_chroma.shape[1] > chroma.shape[1]:
                        resampled_chroma = np.zeros(
                            (template_chroma.shape[0], chroma.shape[1]))
                        for row in range(template_chroma.shape[0]):
                            resampled_chroma[row] = signal.resample(
                                template_chroma[row], chroma.shape[1]
                            )
                        t_chroma = resampled_chroma
                        c_spec = chroma
                    else:
                        resampled_test_chroma = np.zeros(
                            (chroma.shape[0], template_chroma.shape[1]))
                        for row in range(chroma.shape[0]):
                            resampled_test_chroma[row] = signal.resample(
                                chroma[row], template_chroma.shape[1]
                            )
                        t_chroma = template_chroma
                        c_spec = resampled_test_chroma
                else:
                    t_chroma = template_chroma
                    c_spec = chroma

                # 멜 스펙트로그램 유사도
                mel_corr = np.corrcoef(t_mel.flatten(), m_spec.flatten())[0, 1]
                mel_cos = 1 - cosine(t_mel.flatten(), m_spec.flatten())

                # 크로마 유사도
                chroma_corr = np.corrcoef(
                    t_chroma.flatten(), c_spec.flatten())[0, 1]
                chroma_cos = 1 - cosine(t_chroma.flatten(), c_spec.flatten())

                # 종합 점수
                similarity = 0.3 * mel_corr + 0.3 * chroma_corr + 0.2 * mel_cos + 0.2 * chroma_cos

                # 각 템플릿 레이블별 최고 점수 저장
                if label not in similarity_scores or similarity > similarity_scores[label]:
                    similarity_scores[label] = similarity

            except Exception as e:
                print(f"유사도 계산 오류 (무시됨): {str(e)}")
                continue

        # 템플릿 유사도 점수를 특성으로 추가
        for label in np.unique(template_labels):
            score = similarity_scores.get(label, 0.0)
            template_similarity.append(score)

    # 템플릿 유사도가 있으면 결합
    if template_similarity:
        features = np.concatenate([features, template_similarity])

    return features, mel_spec, chroma

# 템플릿 매칭 함수 (크기 불일치 문제 해결)


def template_matching(template_mels, template_chromas, labels, test_mel, test_chroma):
    best_score = -float('inf')
    predicted_label = None
    similarity_scores = {}

    # 특성 차원 고정
    feature_dim = 128  # 멜 스펙트로그램 주파수 차원
    chroma_dim = 12    # 크로마 차원

    # 테스트 특성 리사이즈 (필요한 경우)
    if test_mel.shape[0] != feature_dim:
        test_mel = signal.resample(test_mel, feature_dim, axis=0)

    # 각 템플릿과 비교
    for i, (template_mel, template_chroma, label) in enumerate(zip(template_mels, template_chromas, labels)):
        try:
            # 특성을 동일한 길이로 리샘플링
            if template_mel.shape[1] != test_mel.shape[1]:
                # 더 짧은 쪽으로 리샘플링
                if template_mel.shape[1] > test_mel.shape[1]:
                    # 템플릿을 테스트 크기로 리샘플링
                    resampled_template = np.zeros(
                        (template_mel.shape[0], test_mel.shape[1]))
                    for row in range(template_mel.shape[0]):
                        resampled_template[row] = signal.resample(
                            template_mel[row], test_mel.shape[1]
                        )
                    template_mel_matched = resampled_template
                    test_mel_matched = test_mel
                else:
                    # 테스트를 템플릿 크기로 리샘플링
                    resampled_test = np.zeros(
                        (test_mel.shape[0], template_mel.shape[1]))
                    for row in range(test_mel.shape[0]):
                        resampled_test[row] = signal.resample(
                            test_mel[row], template_mel.shape[1]
                        )
                    template_mel_matched = template_mel
                    test_mel_matched = resampled_test
            else:
                template_mel_matched = template_mel
                test_mel_matched = test_mel

            # 크로마 특성도 동일하게 처리
            if template_chroma.shape[1] != test_chroma.shape[1]:
                if template_chroma.shape[1] > test_chroma.shape[1]:
                    resampled_chroma = np.zeros(
                        (template_chroma.shape[0], test_chroma.shape[1]))
                    for row in range(template_chroma.shape[0]):
                        resampled_chroma[row] = signal.resample(
                            template_chroma[row], test_chroma.shape[1]
                        )
                    template_chroma_matched = resampled_chroma
                    test_chroma_matched = test_chroma
                else:
                    resampled_test_chroma = np.zeros(
                        (test_chroma.shape[0], template_chroma.shape[1]))
                    for row in range(test_chroma.shape[0]):
                        resampled_test_chroma[row] = signal.resample(
                            test_chroma[row], template_chroma.shape[1]
                        )
                    template_chroma_matched = template_chroma
                    test_chroma_matched = resampled_test_chroma
            else:
                template_chroma_matched = template_chroma
                test_chroma_matched = test_chroma

            # 유사도 계산
            mel_corr = np.corrcoef(
                template_mel_matched.flatten(), test_mel_matched.flatten())[0, 1]
            chroma_corr = np.corrcoef(
                template_chroma_matched.flatten(), test_chroma_matched.flatten())[0, 1]

            mel_cos_sim = 1 - \
                cosine(template_mel_matched.flatten(),
                       test_mel_matched.flatten())
            chroma_cos_sim = 1 - \
                cosine(template_chroma_matched.flatten(),
                       test_chroma_matched.flatten())

            # 종합 점수 계산
            score = 0.3 * mel_corr + 0.3 * chroma_corr + \
                0.2 * mel_cos_sim + 0.2 * chroma_cos_sim

            # 레이블별 최고 점수 저장
            label_idx = label
            if label_idx not in similarity_scores or score > similarity_scores[label_idx]:
                similarity_scores[label_idx] = score

            # 전체 최고 점수 갱신
            if score > best_score:
                best_score = score
                predicted_label = label_idx

        except Exception as e:
            print(f"템플릿 매칭 오류 (무시됨): {str(e)}")
            continue

    # 매칭에 실패한 경우
    if predicted_label is None:
        # 기본값 설정 (첫 번째 레이블 사용)
        predicted_label = labels[0] if labels else 0
        best_score = 0.0
        similarity_scores = {predicted_label: best_score}
        print("템플릿 매칭 실패, 기본값 사용")

    return predicted_label, best_score, similarity_scores

# 앙상블 투표 함수 (템플릿 매칭 중심)


def ensemble_vote(predictions, confidence_scores, weights):
    # 템플릿 매칭 신뢰도 확인
    template_pred = predictions.get("Template Matching")
    template_conf = confidence_scores.get("Template Matching", 0)

    # 템플릿 매칭 신뢰도가 매우 높은 경우 (임계값: 0.8)
    if template_conf > 0.8:
        print(
            f"템플릿 매칭 신뢰도가 높음 ({template_conf:.4f}). 템플릿 예측 사용: {template_pred}")
        return template_pred, template_conf, {template_pred: 1.0}

    # 그렇지 않으면 가중 투표 진행
    vote_counts = {}

    for name, pred_label in predictions.items():
        if pred_label not in vote_counts:
            vote_counts[pred_label] = 0

        # 신뢰도와 가중치를 반영한 투표
        vote_counts[pred_label] += confidence_scores[name] * weights[name]

    # 최종 예측
    final_prediction = max(vote_counts, key=vote_counts.get)
    total_votes = sum(vote_counts.values())

    # 투표 비율 계산
    vote_ratios = {}
    for label, votes in vote_counts.items():
        vote_ratios[label] = votes / total_votes if total_votes > 0 else 0

    final_confidence = vote_ratios[final_prediction]

    return final_prediction, final_confidence, vote_ratios


# 모델 및 데이터 로드
MODEL_DIR = "guitar_chord_models"

# 모델 로드 (앱 시작시 한 번만 로드)
print("모델 및 템플릿 데이터 로드 중...")
ml_models, template_mels, template_chromas, labels, label_encoder, scaler, duration = None, None, None, None, None, None, None

try:
    # 모델 파일 경로
    ml_models_path = os.path.join(MODEL_DIR, "guitar_chord_ml_models.pkl")
    label_encoder_path = os.path.join(
        MODEL_DIR, "guitar_chord_label_encoder.pkl")
    template_data_path = os.path.join(MODEL_DIR, "guitar_chord_templates.pkl")
    scaler_path = os.path.join(MODEL_DIR, "guitar_chord_scaler.pkl")

    # 필수 파일 존재 여부 확인
    for path in [ml_models_path, label_encoder_path, template_data_path]:
        if not os.path.exists(path):
            raise FileNotFoundError(f"모델 파일을 찾을 수 없습니다: {path}")

    # 모델 및 데이터 로드
    ml_models = joblib.load(ml_models_path)
    label_encoder = joblib.load(label_encoder_path)
    template_data = joblib.load(template_data_path)

    # 스케일러 로드 (있는 경우)
    if os.path.exists(scaler_path):
        scaler = joblib.load(scaler_path)

    # 템플릿 데이터 추출
    template_mels = template_data["template_mels"]
    template_chromas = template_data["template_chromas"]
    labels = template_data["labels"]

    # 세그먼트 길이 (duration) 정보 추출
    duration = template_data.get("duration", 1.0)

    print("모델 로드 완료!")
except Exception as e:
    print(f"모델 로드 오류: {str(e)}")
    print("서버는 계속 실행되지만 모델이 로드되지 않았습니다.")

# 프론트엔드용 템플릿 데이터 준비


@app.get("/audio/template-data")
async def get_template_data():
    if ml_models is None or label_encoder is None or template_mels is None:
        raise HTTPException(status_code=500, detail="모델이 로드되지 않았습니다.")

    # 경량화된 템플릿 데이터 생성
    # (스펙트로그램을 직접 전송하면 데이터가 너무 크므로 평균값만 전송)
    lite_templates = []
    unique_labels = sorted(list(set(labels)))

    for label_idx, label in enumerate(unique_labels):
        # 해당 라벨의 모든 템플릿 찾기
        matching_indices = [i for i, l in enumerate(labels) if l == label_idx]

        if matching_indices:
            # 각 특성 유형별 평균 계산
            avg_mel = np.mean([template_mels[i]
                              for i in matching_indices], axis=0)
            avg_chroma = np.mean([template_chromas[i]
                                 for i in matching_indices], axis=0)

            # 차원 축소 (크기 줄이기 위해)
            reduced_mel = np.mean(avg_mel, axis=0).tolist()
            reduced_chroma = avg_chroma.tolist()

            lite_templates.append({
                "label": label_encoder.inverse_transform([label_idx])[0],
                "mel_profile": reduced_mel,
                "chroma_profile": reduced_chroma
            })

    return {"templates": lite_templates, "duration": duration}

# 오디오 예측 엔드포인트


@app.post("/audio/predict-chord")
async def predict_chord_endpoint(file: UploadFile = File(...)):
    if ml_models is None or label_encoder is None or template_mels is None:
        raise HTTPException(status_code=500, detail="모델이 로드되지 않았습니다.")

    try:
        # 오디오 파일 읽기
        contents = await file.read()
        print(f"=== 오디오 데이터 정보 ===")
        print(f"수신된 오디오 데이터 크기: {len(contents)} bytes")
        print(f"첫 20바이트: {contents[:20]}")
        print(f"파일 형식: {file.content_type}")
        print("=========================")

        audio, sr = librosa.load(io.BytesIO(contents), sr=22050)

        # 오디오 전처리
        y, sr = load_and_preprocess_audio(audio, sr=sr, duration=duration)

        # 템플릿 매칭용 특성 추출
        test_mel, test_chroma = extract_template_features(y, sr)

        # ML 모델용 특성 추출 (템플릿 매칭 결과 포함)
        features, _, _ = extract_combined_features(
            y, sr, template_mels, template_chromas, labels
        )

        # 특성 정규화 (스케일러가 있는 경우)
        if scaler is not None:
            features = scaler.transform([features])[0]
        else:
            features = features.reshape(1, -1)  # 배치 차원 추가

        # 각 모델의 예측 수집
        predictions = {}
        confidence_scores = {}

        # 1. 머신러닝 모델 예측
        for name, model in ml_models.items():
            print(f"\n{name} 모델 예측:")

            # 예측 및 확률 계산
            pred_proba = model.predict_proba(features.reshape(1, -1))[0]
            pred_class = model.predict(features.reshape(1, -1))[0]
            confidence = pred_proba[pred_class]

            # 디코딩
            pred_label = label_encoder.inverse_transform([pred_class])[0]
            predictions[name] = pred_label
            confidence_scores[name] = confidence

            print(f"  예측: {pred_label}, 신뢰도: {confidence:.4f}")

        # 2. 템플릿 매칭 예측
        print("\n템플릿 매칭 예측:")
        template_pred, template_score, similarity_scores = template_matching(
            template_mels, template_chromas, labels, test_mel, test_chroma)

        template_label = label_encoder.inverse_transform([template_pred])[0]
        predictions["Template Matching"] = template_label
        confidence_scores["Template Matching"] = template_score

        print(f"  예측: {template_label}, 유사도 점수: {template_score:.4f}")

        # 3. 앙상블 투표 (템플릿 매칭 가중치 증가)
        print("\n앙상블 투표 결과:")
        weights = {
            "Random Forest": 0.5,
            "SVM": 0.5,
            "KNN": 0.3,
            "Template Matching": 3.0  # 템플릿 매칭 가중치 크게 증가
        }

        final_prediction, final_confidence, vote_ratios = ensemble_vote(
            predictions, confidence_scores, weights
        )

        print(f"최종 예측: {final_prediction}, 신뢰도: {final_confidence:.4f}")

        # 결과 반환
        ml_results = {}
        for name, pred in predictions.items():
            if name != "Template Matching":
                ml_results[name] = {
                    "label": pred,
                    "confidence": float(confidence_scores[name]),
                    "all_probs": {
                        label_encoder.inverse_transform([i])[0]: float(prob)
                        for i, prob in enumerate(ml_models[name].predict_proba(features.reshape(1, -1))[0])
                    }
                }

        template_result = {
            "label": template_label,
            "confidence": float(template_score),
            "all_similarities": {
                label_encoder.inverse_transform([label_idx])[0]: float(score)
                for label_idx, score in similarity_scores.items()
            }
        }

        result = {
            "chord": final_prediction,
            "confidence": float(final_confidence),
            "template_matching": template_result,
            "ml_models": ml_results
        }

        return result

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"예측 오류: {str(e)}")


print("angs~ 서버 시작됨!")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
