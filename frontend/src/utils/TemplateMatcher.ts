// src/utils/TemplateMatcher.ts
import Meyda from 'meyda';

interface RawTemplateData {
  label: string;
  label_idx: number;
  features: {
    chroma: number[][];
    mel: number[];
  };
}

import { TemplateData } from '../types/guitar-chord';

class TemplateMatcher {
  private templates: TemplateData[] = [];
  // private duration: number = 1.0;
  private confidenceThreshold: number = 0.7;
  private fftSize: number = 2048;
  private hopSize: number = 1024;

  constructor(
    templates: RawTemplateData[],
    confidenceThreshold: number = 0.7,
    _sampleRate: number = 22050,
  ) {
    if (!Array.isArray(templates)) {
      console.error('템플릿 데이터가 배열이 아닙니다:', templates);
      throw new Error('템플릿 데이터가 배열이 아닙니다');
    }

    if (templates.length === 0) {
      console.error('템플릿 데이터가 비어있습니다');
      throw new Error('템플릿 데이터가 비어있습니다');
    }

    // 새로운 데이터 구조로 변환
    this.templates = templates.map(template => ({
      label: template.label,
      label_idx: template.label_idx,
      features: template.features,
      duration: 1.0,
      chroma_profile: template.features.chroma,
      mel_profile: template.features.mel
    }));

    console.log('변환된 템플릿 데이터:', this.templates[0]);

    this.confidenceThreshold = confidenceThreshold;
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

    // 오디오 데이터 리샘플링 (48000Hz -> 22050Hz)
    const resampledData = this.resampleAudio(audioData, 48000, 22050);
    console.log('리샘플링된 오디오 데이터:', {
      originalLength: audioData.length,
      resampledLength: resampledData.length,
    });

    // 각 프레임마다 처리
    for (let i = 0; i < resampledData.length - this.fftSize; i += this.hopSize) {
      const frame = resampledData.slice(i, i + this.fftSize);

      // Meyda를 사용하여 크로마 계산
      const features = Meyda.extract(['chroma'], frame, {
        bufferSize: this.fftSize,
        sampleRate: 22050,
      } as any);

      if (features && features.chroma) {
        // 크로마 값을 정규화
        const chroma = new Float32Array(features.chroma);
        const maxValue = Math.max(...chroma);
        if (maxValue > 0) {
          for (let j = 0; j < chroma.length; j++) {
            chroma[j] /= maxValue;
          }
        }
        chromaFrames.push(chroma);
      }
    }

    console.log('추출된 크로마 프레임 수:', chromaFrames.length);
    return chromaFrames;
  }

  // 오디오 리샘플링
  private resampleAudio(audioData: Float32Array, originalSampleRate: number, targetSampleRate: number): Float32Array {
    const ratio = originalSampleRate / targetSampleRate;
    const newLength = Math.round(audioData.length / ratio);
    const result = new Float32Array(newLength);

    for (let i = 0; i < newLength; i++) {
      const position = i * ratio;
      const index = Math.floor(position);
      const fraction = position - index;

      if (index + 1 < audioData.length) {
        result[i] = audioData[index] * (1 - fraction) + audioData[index + 1] * fraction;
      } else {
        result[i] = audioData[index];
      }
    }

    return result;
  }

  // 템플릿과 매칭
  private matchTemplates(chromaFrames: Float32Array[]): { chord: string; confidence: number } {
    if (chromaFrames.length === 0) {
      console.error('크로마 프레임이 비어있습니다');
      return { chord: '', confidence: 0 };
    }

    console.log('매칭할 템플릿 수:', this.templates.length);
    console.log('크로마 프레임 수:', chromaFrames.length);

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

    console.log('평균 크로마:', Array.from(avgChroma));

    // 각 템플릿과 비교
    const similarities: Record<string, number> = {};
    let bestScore = -Infinity;
    let bestChord = '';

    for (const template of this.templates) {
      const templateChroma = template.chroma_profile;
      // const templateMel = template.mel_profile;

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

      const chromaSimilarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB) || 1);

      // 상관관계 계산
      const chromaCorrelation = this.calculateCorrelation(avgChroma, templateAvgChroma);

      // 종합 점수 계산 (크로마에 더 높은 가중치)
      const score = 0.7 * chromaCorrelation + 0.3 * chromaSimilarity;
      similarities[template.label] = score;

      if (score > bestScore) {
        bestScore = score;
        bestChord = template.label;
      }
    }

    console.log('템플릿 유사도:', similarities);
    console.log('최종 결과:', { chord: bestChord, confidence: bestScore });

    return {
      chord: bestChord,
      confidence: bestScore,
    };
  }

  // 상관관계 계산
  private calculateCorrelation(a: Float32Array, b: Float32Array): number {
    const meanA = a.reduce((sum, val) => sum + val, 0) / a.length;
    const meanB = b.reduce((sum, val) => sum + val, 0) / b.length;

    let numerator = 0;
    let denomA = 0;
    let denomB = 0;

    for (let i = 0; i < a.length; i++) {
      const diffA = a[i] - meanA;
      const diffB = b[i] - meanB;
      numerator += diffA * diffB;
      denomA += diffA * diffA;
      denomB += diffB * diffB;
    }

    return numerator / (Math.sqrt(denomA) * Math.sqrt(denomB) || 1);
  }

  // 신뢰도가 충분한지 확인
  public isConfident(confidence: number): boolean {
    return confidence >= this.confidenceThreshold;
  }
}

export default TemplateMatcher;
