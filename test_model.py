from ultralytics import YOLO
import torch
import os
import time
from ultralytics.nn.tasks import DetectionModel
from torch.nn import Sequential, ModuleList, Conv2d, BatchNorm2d, SiLU, Module
from ultralytics.nn.modules.conv import Conv

# 안전한 전역 변수 추가
torch.serialization.add_safe_globals([
    DetectionModel,
    Sequential,
    ModuleList,
    Conv2d,
    BatchNorm2d,
    SiLU,
    Module,
    Conv
])


def test_model():
    try:
        # PyTorch 정보 확인
        print(f"PyTorch 버전: {torch.__version__}")
        print(f"CUDA 사용 가능: {torch.cuda.is_available()}")
        if torch.cuda.is_available():
            print(f"CUDA 버전: {torch.version.cuda}")

        # 모델 파일 존재 확인
        model_path = os.path.join('fastapi', 'best.pt')
        print(f"\n모델 파일 경로: {model_path}")
        print(f"모델 파일 존재: {os.path.exists(model_path)}")

        if os.path.exists(model_path):
            # 모델 파일 크기 확인
            file_size = os.path.getsize(model_path) / (1024 * 1024)  # MB로 변환
            print(f"모델 파일 크기: {file_size:.2f} MB")

            # 모델 로드 시도
            print("\n모델 로드 시도 중...")
            try:
                # weights_only=False 옵션 추가
                model = torch.load(
                    model_path, map_location='cpu', weights_only=False)
                print("torch.load로 모델 로드 성공!")
            except Exception as e:
                print(f"torch.load 실패: {str(e)}")
                print("YOLO 클래스로 다시 시도...")
                model = YOLO(model_path)
                print("YOLO 클래스로 모델 로드 성공!")

            # 모델 정보 출력
            print("\n모델 정보:")
            print(f"모델 타입: {type(model).__name__}")
            if hasattr(model, 'parameters'):
                print(
                    f"모델 파라미터 수: {sum(p.numel() for p in model.parameters())}")

            # 테스트 추론 시도
            print("\n테스트 추론 시도 중...")
            # 임시 이미지로 테스트 (실제 이미지로 교체 필요)
            start_time = time.time()
            results = model.predict(source="test.jpg", verbose=False)
            end_time = time.time()

            print(f"추론 성공!")
            print(f"처리 시간: {(end_time - start_time)*1000:.2f}ms")

            # 결과 확인
            if results:
                print("\n추론 결과:")
                for r in results:
                    print(f"감지된 객체 수: {len(r.boxes)}")
                    for box in r.boxes:
                        print(
                            f"클래스: {box.cls.item()}, 신뢰도: {box.conf.item():.2f}")

        else:
            print("모델 파일을 찾을 수 없습니다!")

    except Exception as e:
        print(f"\n오류 발생: {str(e)}")
        import traceback
        print(f"상세 오류: {traceback.format_exc()}")


if __name__ == "__main__":
    test_model()
