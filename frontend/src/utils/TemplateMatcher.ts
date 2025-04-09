// src/utils/TemplateMatcher.ts
import Meyda from 'meyda';

import { TemplateData } from '../types/guitar-chord';

class TemplateMatcher {
  private templates: TemplateData[] = [];
  private sampleRate: number = 22050;
  // private duration: number = 1.0;
  private confidenceThreshold: number = 0.7;
  private fftSize: number = 2048;
  private hopSize: number = 1024;

  constructor(
    templates: TemplateData[],
    // duration: number = 1.0,
    confidenceThreshold: number = 0.7,
    sampleRate: number = 22050,
  ) {
    this.templates = templates;
    // this.duration = duration;
    this.confidenceThreshold = confidenceThreshold;
    this.sampleRate = sampleRate;
  }

  // Web Audio API에서 오디오 처리
  async processAudio(audioBuffer: AudioBuffer): Promise<{ chord: string; confidence: number }> {
    // 모노로 변환
    const audioData = this.convertToMono(audioBuffer);

    // 크로마 특성 추출
    const chromaFrames = await this.extractChromaFeatures(audioData);

    // 템플릿과 매칭
    return this.matchTemplates(chromaFrames);
  }

  // 모노 채널로 변환
  private convertToMono(audioBuffer: AudioBuffer): Float32Array {
    const numChannels = audioBuffer.numberOfChannels;
    const length = audioBuffer.length;
    const output = new Float32Array(length);

    // 모든 채널의 평균 계산
    for (let i = 0; i < length; i++) {
      let sum = 0;
      for (let channel = 0; channel < numChannels; channel++) {
        sum += audioBuffer.getChannelData(channel)[i];
      }
      output[i] = sum / numChannels;
    }

    return output;
  }

  // 크로마 특성 추출 (Meyda 사용)
  private async extractChromaFeatures(audioData: Float32Array): Promise<Float32Array[]> {
    const chromaFrames: Float32Array[] = [];

    // 각 프레임마다 처리
    for (let i = 0; i < audioData.length - this.fftSize; i += this.hopSize) {
      const frame = audioData.slice(i, i + this.fftSize);

      // Meyda를 사용하여 크로마 계산
      const features = Meyda.extract(['chroma'], frame, {
        bufferSize: this.fftSize,
        sampleRate: this.sampleRate,
      } as any);

      if (features && features.chroma) {
        chromaFrames.push(new Float32Array(features.chroma));
      }
    }

    return chromaFrames;
  }

  // 템플릿과 매칭
  private matchTemplates(chromaFrames: Float32Array[]): { chord: string; confidence: number } {
    if (chromaFrames.length === 0) {
      return { chord: '', confidence: 0 };
    }

    // 각 템플릿과의 유사도 계산
    const similarities: Record<string, number> = {};

    // 평균 크로마 계산
    const avgChroma = new Float32Array(12).fill(0);
    for (const frame of chromaFrames) {
      for (let i = 0; i < 12; i++) {
        avgChroma[i] += frame[i];
      }
    }

    for (let i = 0; i < 12; i++) {
      avgChroma[i] /= chromaFrames.length;
    }

    // 각 템플릿과 비교
    for (const template of this.templates) {
      const templateChroma = template.chroma_profile;

      // 템플릿의 평균 크로마 계산
      const templateAvgChroma = new Float32Array(12).fill(0);
      for (let i = 0; i < templateChroma.length; i++) {
        for (let j = 0; j < 12; j++) {
          templateAvgChroma[j] += templateChroma[i][j];
        }
      }

      for (let i = 0; i < 12; i++) {
        templateAvgChroma[i] /= templateChroma.length;
      }

      // 코사인 유사도 계산
      let dotProduct = 0;
      let normA = 0;
      let normB = 0;

      for (let i = 0; i < 12; i++) {
        dotProduct += avgChroma[i] * templateAvgChroma[i];
        normA += avgChroma[i] * avgChroma[i];
        normB += templateAvgChroma[i] * templateAvgChroma[i];
      }

      const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB) || 1);
      similarities[template.label] = similarity;
    }

    // 가장 높은 유사도를 가진 코드 찾기
    let bestChord = '';
    let bestScore = -Infinity;

    for (const [chord, score] of Object.entries(similarities)) {
      if (score > bestScore) {
        bestScore = score;
        bestChord = chord;
      }
    }

    return {
      chord: bestChord,
      confidence: bestScore,
    };
  }

  // 신뢰도가 충분한지 확인
  public isConfident(confidence: number): boolean {
    return confidence >= this.confidenceThreshold;
  }
}

export default TemplateMatcher;
