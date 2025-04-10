import tensorflow as tf
import tensorflowjs as tfjs
import joblib
import numpy as np
import json
import os

def convert_model():
    # 모델 파일 로드
    model = joblib.load('guitar_chord_ml_models.pkl')
    scaler = joblib.load('guitar_chord_scaler.pkl')
    label_encoder = joblib.load('guitar_chord_label_encoder.pkl')
    templates = joblib.load('guitar_chord_templates.pkl')

    # 모델 구조 확인
    print("모델 구조:", model)
    
    # 모델을 TensorFlow 모델로 변환
    tf_model = tf.keras.Sequential([
        tf.keras.layers.Dense(128, activation='relu', input_shape=(13,)),
        tf.keras.layers.Dense(64, activation='relu'),
        tf.keras.layers.Dense(7, activation='softmax')  # 7개의 코드 클래스
    ])

    # 모델 컴파일
    tf_model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

    # 출력 디렉토리 생성
    os.makedirs('public/models', exist_ok=True)

    # TensorFlow.js 모델로 변환
    tfjs.converters.save_keras_model(tf_model, 'public/models')

    # 스케일러와 라벨 인코더를 JSON으로 저장
    scaler_data = {
        'scale_': scaler.scale_.tolist() if hasattr(scaler, 'scale_') else [],
        'mean_': scaler.mean_.tolist() if hasattr(scaler, 'mean_') else [],
        'var_': scaler.var_.tolist() if hasattr(scaler, 'var_') else []
    }
    
    with open('public/models/scaler.json', 'w') as f:
        json.dump(scaler_data, f)

    label_encoder_data = {
        'classes_': label_encoder.classes_.tolist() if hasattr(label_encoder, 'classes_') else []
    }
    
    with open('public/models/label_encoder.json', 'w') as f:
        json.dump(label_encoder_data, f)

    # 템플릿 저장
    with open('public/models/templates.json', 'w') as f:
        json.dump(templates, f)

    print("모델 변환 완료!")

if __name__ == '__main__':
    convert_model() 