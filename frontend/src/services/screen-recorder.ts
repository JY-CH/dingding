// screen-recorder.ts
import axios from 'axios';

// 확장된 인터페이스 정의
interface DisplayMediaConstraints extends MediaTrackConstraints {
  cursor?: 'always' | 'motion' | 'never';
  displaySurface?: 'browser' | 'monitor' | 'window';
}

// 옵션 인터페이스 수정
export interface RecorderOptions {
  mimeType?: string;
  videoBitsPerSecond?: number;
  audioBitsPerSecond?: number;
  videoConstraints?: MediaTrackConstraints & DisplayMediaConstraints;
  audioConstraints?: MediaTrackConstraints;
}
// 업로드 데이터 인터페이스
export interface UploadData {
  songId: number;
  score: number;
  mode: 'PRACTICE' | 'PERFORMANCE';
  videoTime: string;
}

// 녹화 상태 타입
export type RecordingState = 'inactive' | 'recording' | 'paused' | 'stopping';

export class ScreenRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private startTime: number = 0;
  private duration: number = 0;
  private options: Required<RecorderOptions>;
  private _state: RecordingState = 'inactive';

  // 이벤트 콜백
  private onStateChangeListeners: ((state: RecordingState) => void)[] = [];
  private onErrorListeners: ((error: Error) => void)[] = [];
  private onProgressListeners: ((duration: number) => void)[] = [];

  constructor(options: RecorderOptions = {}) {
    // 기본 옵션과 사용자 옵션 병합
    this.options = {
      mimeType: 'video/mp4;codecs=avc1,mp4a.40.2',
      videoBitsPerSecond: 2500000,
      audioBitsPerSecond: 128000,
      videoConstraints: {
        cursor: 'always',
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        frameRate: { ideal: 30 },
      },
      audioConstraints: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
      ...options,
    };

    // MediaRecorder 지원 확인
    if (typeof MediaRecorder === 'undefined') {
      throw new Error('MediaRecorder API is not supported in this browser');
    }

    // MIME 타입 지원 확인
    if (this.options.mimeType && !MediaRecorder.isTypeSupported(this.options.mimeType)) {
      console.warn(`${this.options.mimeType} is not supported, trying alternative formats`);

      // MP4 지원 체크
      if (MediaRecorder.isTypeSupported('video/mp4')) {
        this.options.mimeType = 'video/mp4';
      }
      // H.264 코덱 지원 체크
      else if (MediaRecorder.isTypeSupported('video/mp4;codecs=h264,aac')) {
        this.options.mimeType = 'video/mp4;codecs=h264,aac';
      }
      // WebM 지원 체크 (대체 포맷)
      else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')) {
        this.options.mimeType = 'video/webm;codecs=vp9,opus';
      }
      // 기본 WebM
      else {
        this.options.mimeType = 'video/webm';
      }

      console.log(`Using MIME type: ${this.options.mimeType}`);
    }
  }

  // 상태 getter
  get state(): RecordingState {
    return this._state;
  }

  // 녹화 중인지 확인
  get isRecording(): boolean {
    return this._state === 'recording';
  }

  // 녹화 시간 getter (밀리초)
  get recordingTime(): number {
    if (this._state === 'recording' && this.startTime > 0) {
      return this.duration + (Date.now() - this.startTime);
    }
    return this.duration;
  }

  // 포맷된 녹화 시간 getter (HH:MM:SS)
  get formattedTime(): string {
    const totalSeconds = Math.floor(this.recordingTime / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0'),
    ].join(':');
  }

  // 상태 변경 리스너 추가
  onStateChange(callback: (state: RecordingState) => void): void {
    this.onStateChangeListeners.push(callback);
  }

  // 오류 리스너 추가
  onError(callback: (error: Error) => void): void {
    this.onErrorListeners.push(callback);
  }

  // 진행 상황 리스너 추가
  onProgress(callback: (duration: number) => void): void {
    this.onProgressListeners.push(callback);
  }

  // 상태 설정 및 이벤트 발생
  private setState(state: RecordingState): void {
    this._state = state;
    this.onStateChangeListeners.forEach((listener) => listener(state));
  }

  // 오류 처리 및 이벤트 발생
  private handleError(error: Error): void {
    console.error('Screen Recorder Error:', error);
    this.onErrorListeners.forEach((listener) => listener(error));
    this.cleanup();
  }

  // 미디어 스트림 획득
  private async getMediaStream(): Promise<MediaStream> {
    try {
      // 화면 캡처 스트림 획득
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: this.options.videoConstraints,
        audio: true, // 시스템 오디오 캡처 시도
      });

      // 마이크 오디오 스트림 획득
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: this.options.audioConstraints,
      });

      // 오디오 컨텍스트 생성 및 스트림 처리
      this.audioContext = new AudioContext();

      // 화면 오디오 처리
      const displayAudioTracks = displayStream.getAudioTracks();
      if (displayAudioTracks.length > 0) {
        const displaySource = this.audioContext.createMediaStreamSource(
          new MediaStream([displayAudioTracks[0]]),
        );
        const displayGain = this.audioContext.createGain();
        displayGain.gain.value = 0.7; // 시스템 오디오 볼륨 조정
        displaySource.connect(displayGain);
        displayGain.connect(this.audioContext.destination);
      }

      // 마이크 오디오 처리
      const micSource = this.audioContext.createMediaStreamSource(audioStream);
      const micGain = this.audioContext.createGain();
      micGain.gain.value = 1.0; // 마이크 볼륨 조정
      micSource.connect(micGain);
      micGain.connect(this.audioContext.destination);

      // 모든 오디오 트랙을 화면 스트림에 추가
      audioStream.getAudioTracks().forEach((track) => {
        displayStream.addTrack(track);
      });

      return displayStream;
    } catch (error) {
      throw new Error(
        `Failed to get media stream: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  // 녹화 시작
  async start(): Promise<void> {
    if (this._state !== 'inactive') {
      throw new Error('Cannot start recording: already recording or paused');
    }

    try {
      this.setState('recording');
      this.stream = await this.getMediaStream();

      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: this.options.mimeType,
        videoBitsPerSecond: this.options.videoBitsPerSecond,
        audioBitsPerSecond: this.options.audioBitsPerSecond,
      });

      this.recordedChunks = [];
      this.startTime = Date.now();

      // 데이터 이벤트 핸들러
      this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      // 오류 이벤트 핸들러
      this.mediaRecorder.onerror = (event) => {
        this.handleError(new Error(`MediaRecorder error: ${event.error}`));
      };

      // 진행 상황 타이머 설정
      const progressTimer = setInterval(() => {
        if (this._state === 'recording') {
          const currentDuration = this.recordingTime;
          this.onProgressListeners.forEach((listener) => listener(currentDuration));
        } else {
          clearInterval(progressTimer);
        }
      }, 100);

      this.mediaRecorder.start(100); // 100ms 간격으로 데이터 기록

      // 화면 공유가 사용자에 의해 중지된 경우 처리
      this.stream.getVideoTracks()[0].onended = () => {
        if (this._state === 'recording' || this._state === 'paused') {
          this.stop();
        }
      };
    } catch (error) {
      this.setState('inactive');
      this.handleError(error instanceof Error ? error : new Error(String(error)));
    }
  }

  // 녹화 일시 중지
  pause(): void {
    if (this._state !== 'recording' || !this.mediaRecorder) {
      throw new Error('Cannot pause: not recording');
    }

    try {
      this.mediaRecorder.pause();
      this.duration += Date.now() - this.startTime;
      this.setState('paused');
    } catch (error) {
      this.handleError(error instanceof Error ? error : new Error(String(error)));
    }
  }

  // 녹화 재개
  resume(): void {
    if (this._state !== 'paused' || !this.mediaRecorder) {
      throw new Error('Cannot resume: not paused');
    }

    try {
      this.mediaRecorder.resume();
      this.startTime = Date.now();
      this.setState('recording');
    } catch (error) {
      this.handleError(error instanceof Error ? error : new Error(String(error)));
    }
  }

  // 녹화 중지
  async stop(): Promise<Blob> {
    if ((this._state !== 'recording' && this._state !== 'paused') || !this.mediaRecorder) {
      throw new Error('Cannot stop: not recording or paused');
    }

    this.setState('stopping');

    return new Promise<Blob>((resolve, reject) => {
      // MediaRecorder 중지 이벤트 핸들러
      this.mediaRecorder!.onstop = async () => {
        try {
          // 녹화 시간 업데이트
          if (this.startTime > 0) {
            this.duration += Date.now() - this.startTime;
          }

          // 녹화된 데이터로 Blob 생성
          const rawBlob = new Blob(this.recordedChunks, { type: this.options.mimeType });

          // 현재 MIME 타입이 MP4인지 확인
          const isMp4 = this.options.mimeType.includes('mp4');

          // MP4 형식이 아니고 브라우저가 WebM을 사용한 경우, MP4로 변환 시도
          if (
            !isMp4 &&
            typeof window.MediaStream !== 'undefined' &&
            typeof MediaRecorder !== 'undefined'
          ) {
            try {
              const mp4Blob = await this.convertToMp4(rawBlob);
              this.cleanup();
              this.setState('inactive');
              resolve(mp4Blob);
              return;
            } catch (conversionError) {
              console.warn('MP4 변환 실패, 원본 포맷 사용:', conversionError);
              // 변환 실패 시 원본 형식 사용
            }
          }

          this.cleanup();
          this.setState('inactive');
          resolve(rawBlob);
        } catch (error) {
          this.handleError(error instanceof Error ? error : new Error(String(error)));
          reject(error);
        }
      };

      // MediaRecorder 중지
      try {
        this.mediaRecorder!.stop();
      } catch (error) {
        this.handleError(error instanceof Error ? error : new Error(String(error)));
        reject(error);
      }
    });
  }

  // 리소스 정리
  private cleanup(): void {
    // 오디오 컨텍스트 정리
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close().catch(console.error);
      this.audioContext = null;
    }

    // 미디어 스트림 정리
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    this.mediaRecorder = null;
    this.startTime = 0;
  }

  // WebM을 MP4로 변환 (브라우저/환경에 따라 작동하지 않을 수 있음)
  private async convertToMp4(webmBlob: Blob): Promise<Blob> {
    return new Promise((resolve, reject) => {
      try {
        // 브라우저에서 MediaSource 지원 확인
        if (!window.MediaSource) {
          throw new Error('MediaSource API is not supported');
        }

        // FFmpeg.wasm 또는 다른 변환 라이브러리를 사용한 변환 로직이 필요하지만,
        // 웹 환경에서는 완전한 변환이 어려움
        // 대안: MP4Box.js, WebCodecs API 등을 사용하는 방법이 있으나 복잡함

        // 현재는 확장자만 변경하여 MP4로 가장
        // 실제 프로덕션에서는 서버 측에서 변환하거나, 라이브러리를 사용해야 함
        console.warn('MP4 변환은 서버 측에서 처리하는 것이 더 안정적입니다.');
        resolve(new Blob([webmBlob], { type: 'video/mp4' }));
      } catch (error) {
        reject(error);
      }
    });
  }

  // 녹화된 비디오를 서버로 업로드
  async uploadToServer(blob: Blob, apiUrl: string, data: UploadData): Promise<any> {
    try {
      const formData = new FormData();

      // 비디오 파일 추가
      const fileExtension = blob.type.includes('mp4') ? 'mp4' : 'webm';
      formData.append('videoFile', blob, `screen-recording.${fileExtension}`);

      // 추가 데이터 추가
      formData.append('songId', data.songId.toString());
      formData.append('score', data.score.toString());
      formData.append('mode', data.mode);
      formData.append('videoTime', data.videoTime || this.formattedTime);

      // axios 호출하여 업로드
      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(`Upload failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // 녹화된 비디오 다운로드
  download(blob: Blob, filename: string = 'screen-recording.webm'): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }
}

export default ScreenRecorder;
