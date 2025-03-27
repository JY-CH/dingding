import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Visualization } from '../../types/guitar';
import { motion } from 'framer-motion';

interface AudioVisualizer3DProps {
  visualization: Visualization;
}

const AudioVisualizer3D: React.FC<AudioVisualizer3DProps> = ({ visualization }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const barsRef = useRef<THREE.Mesh[]>([]);

  // 시각화 설정
  const [settings, setSettings] = useState({
    style: 'bars', // 'bars' | 'wave' | 'circle'
    smoothing: 0.3, // 0.1 ~ 0.9
    sensitivity: 5, // 1 ~ 10
    color: '#f59e0b'
  });

  useEffect(() => {
    if (!containerRef.current) return;

    // Three.js 초기화
    sceneRef.current = new THREE.Scene();
    cameraRef.current = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    rendererRef.current = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });

    const renderer = rendererRef.current;
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    // 카메라 위치 설정
    cameraRef.current.position.z = 5;

    // 바 생성
    const geometry = new THREE.BoxGeometry(0.1, 1, 0.1);
    const material = new THREE.MeshPhongMaterial({
      color: 0xf59e0b,
      specular: 0xffffff,
      shininess: 100,
      transparent: true,
      opacity: 0.8
    });

    // 조명 추가
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 1, 1);
    sceneRef.current.add(light);

    const ambient = new THREE.AmbientLight(0x404040);
    sceneRef.current.add(ambient);

    // 바 메쉬 생성
    const bars: THREE.Mesh[] = [];
    for (let i = 0; i < 64; i++) {
      const bar = new THREE.Mesh(geometry, material);
      bar.position.x = (i - 32) * 0.15;
      sceneRef.current.add(bar);
      bars.push(bar);
    }
    barsRef.current = bars;

    // 애니메이션 루프
    const animate = () => {
      requestAnimationFrame(animate);
      
      // 바 높이 업데이트
      bars.forEach((bar, i) => {
        const targetScale = visualization.data[i] || 0;
        bar.scale.y = THREE.MathUtils.lerp(bar.scale.y, targetScale * 5, 0.3);
        bar.position.y = bar.scale.y / 2 - 0.5;
      });

      renderer.render(sceneRef.current!, cameraRef.current!);
    };
    animate();

    // 클린업
    return () => {
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  // visualization 데이터가 변경될 때마다 바 업데이트
  useEffect(() => {
    if (!barsRef.current) return;

    barsRef.current.forEach((bar, i) => {
      const targetScale = visualization.data[i] || 0;
      // smoothing 값을 적용하여 더 부드러운 움직임
      bar.scale.y = THREE.MathUtils.lerp(
        bar.scale.y, 
        targetScale * settings.sensitivity, 
        settings.smoothing
      );
      bar.position.y = bar.scale.y / 2 - 0.5;
    });
  }, [visualization, settings]);

  // 색상 변경 핸들러
  const handleColorChange = (color: string) => {
    setSettings(prev => ({ ...prev, color }));
    if (barsRef.current) {
      barsRef.current.forEach(bar => {
        (bar.material as THREE.MeshPhongMaterial).color.set(color);
      });
    }
  };

  return (
    <div className="space-y-4">
      <div ref={containerRef} className="w-full h-64 rounded-lg overflow-hidden bg-black/20" />
      
      {/* 컨트롤 패널 */}
      <div className="bg-white/5 rounded-lg p-4 space-y-3">
        {/* 스타일 선택 */}
        <div className="flex gap-2">
          {['bars', 'wave', 'circle'].map((style) => (
            <button
              key={style}
              onClick={() => setSettings(prev => ({ ...prev, style: style as any }))}
              className={`px-3 py-1 rounded-full text-sm ${
                settings.style === style
                  ? 'bg-amber-500 text-white'
                  : 'bg-white/10 text-zinc-400 hover:bg-white/20'
              }`}
            >
              {style === 'bars' ? '막대' : style === 'wave' ? '웨이브' : '서클'}
            </button>
          ))}
        </div>

        {/* 부드러움 조절 */}
        <div className="space-y-1">
          <div className="text-sm text-zinc-400">부드러움</div>
          <input
            type="range"
            min="0.1"
            max="0.9"
            step="0.1"
            value={settings.smoothing}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              smoothing: parseFloat(e.target.value)
            }))}
            className="w-full accent-amber-500"
          />
        </div>

        {/* 민감도 조절 */}
        <div className="space-y-1">
          <div className="text-sm text-zinc-400">민감도</div>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={settings.sensitivity}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              sensitivity: parseInt(e.target.value)
            }))}
            className="w-full accent-amber-500"
          />
        </div>

        {/* 색상 선택 */}
        <div className="flex gap-2">
          {['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6'].map((color) => (
            <button
              key={color}
              onClick={() => handleColorChange(color)}
              className={`w-6 h-6 rounded-full transition-transform ${
                settings.color === color ? 'scale-125 ring-2 ring-white' : ''
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AudioVisualizer3D; 