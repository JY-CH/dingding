import apiClient from './dashboardapi';
import ScreenRecorder, { UploadData } from './screen-recorder';

interface ReplayResponse {
  success: boolean;
  message: string;
  data?: {
    replayId: number;
    url: string;
    createdAt: string;
  };
}

class RecordingService {
  private recorder: ScreenRecorder;
  private recordedBlob: Blob | null = null;

  constructor(options = {}) {
    this.recorder = new ScreenRecorder(options);

    // 상태 변경 리스너 설정
    this.recorder.onStateChange((state) => {
      console.log(`Recording state changed: ${state}`);
    });

    // 오류 리스너 설정
    this.recorder.onError((error) => {
      console.error('Recording error:', error);
    });
  }

  /**
   * 녹화 상태 가져오기
   */
  get state() {
    return this.recorder.state;
  }

  /**
   * 녹화 시간 가져오기 (HH:MM:SS 형식)
   */
  get recordingTime() {
    return this.recorder.formattedTime;
  }

  /**
   * 녹화 시작하기
   */
  async startRecording(): Promise<boolean> {
    try {
      await this.recorder.start();
      return true;
    } catch (error) {
      console.error('Failed to start recording:', error);
      return false;
    }
  }

  /**
   * 녹화 일시 중지
   */
  pauseRecording(): boolean {
    try {
      this.recorder.pause();
      return true;
    } catch (error) {
      console.error('Failed to pause recording:', error);
      return false;
    }
  }

  /**
   * 녹화 재개
   */
  resumeRecording(): boolean {
    try {
      this.recorder.resume();
      return true;
    } catch (error) {
      console.error('Failed to resume recording:', error);
      return false;
    }
  }

  /**
   * 녹화 중지
   */
  async stopRecording(): Promise<Blob | null> {
    try {
      this.recordedBlob = await this.recorder.stop();
      return this.recordedBlob;
    } catch (error) {
      console.error('Failed to stop recording:', error);
      return null;
    }
  }

  /**
   * 녹화된 영상 업로드
   */
  async uploadRecording(data: UploadData): Promise<ReplayResponse> {
    if (!this.recordedBlob) {
      throw new Error('No recording available to upload');
    }

    try {
      const formData = new FormData();

      // 비디오 파일 추가 (MP4 또는 WebM)
      const fileExtension = this.recordedBlob.type.includes('mp4') ? 'mp4' : 'webm';
      formData.append('videoFile', this.recordedBlob, `screen-recording.${fileExtension}`);

      // 추가 데이터 추가
      formData.append('songId', data.songId.toString());
      formData.append('score', data.score.toString());
      formData.append('mode', data.mode);
      formData.append('videoTime', data.videoTime || this.recorder.formattedTime);

      // API 호출
      const response = await apiClient.post<ReplayResponse>('/replay', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  }

  /**
   * 녹화된 영상 미리보기용 URL 생성
   */
  createPreviewUrl(): string | null {
    if (!this.recordedBlob) {
      return null;
    }

    return URL.createObjectURL(this.recordedBlob);
  }

  /**
   * 녹화된 영상 다운로드
   */
  downloadRecording(filename: string = 'recording.webm'): void {
    if (!this.recordedBlob) {
      throw new Error('No recording available to download');
    }

    this.recorder.download(this.recordedBlob, filename);
  }

  /**
   * 프로그레스 이벤트 리스너 추가
   */
  onProgress(callback: (duration: number) => void): void {
    this.recorder.onProgress(callback);
  }

  /**
   * 상태 변경 이벤트 리스너 추가
   */
  onStateChange(callback: (state: string) => void): void {
    this.recorder.onStateChange(callback);
  }

  /**
   * 오류 이벤트 리스너 추가
   */
  onError(callback: (error: Error) => void): void {
    this.recorder.onError(callback);
  }
}

export default RecordingService;
