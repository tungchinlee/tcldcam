import {Platform} from 'react-native';
import { Audio } from 'expo-av';
import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';

export interface RecordingConfig {
  duration: number; // 錄製時長(秒)
  audioQuality: 'low' | 'medium' | 'high';
  videoQuality: 'low' | 'medium' | 'high';
  includeAudio: boolean;
  includeVideo: boolean;
}

export interface RecordingInfo {
  id: string;
  filePath: string;
  duration: number;
  size: number;
  type: 'audio' | 'video' | 'both';
  triggerType: 'sound' | 'visual' | 'manual';
  startTime: Date;
  endTime?: Date;
}

export interface RecordingEvent {
  type: 'started' | 'stopped' | 'error' | 'progress';
  recordingInfo?: RecordingInfo;
  progress?: number; // 0-100
  error?: string;
}

class RecordingService {
  private static instance: RecordingService;
  private audioRecorderPlayer: AudioRecorderPlayer;
  private isRecording: boolean = false;
  private currentRecording: RecordingInfo | null = null;
  private config: RecordingConfig;
  private listeners: ((event: RecordingEvent) => void)[] = [];
  private recordingTimer: NodeJS.Timeout | null = null;
  private progressTimer: NodeJS.Timeout | null = null;
  private camera: Camera | null = null;

  private constructor() {
    this.audioRecorderPlayer = new AudioRecorderPlayer();
    this.config = {
      duration: 30,
      audioQuality: 'medium',
      videoQuality: 'medium',
      includeAudio: true,
      includeVideo: true,
    };
  }

  public static getInstance(): RecordingService {
    if (!RecordingService.instance) {
      RecordingService.instance = new RecordingService();
    }
    return RecordingService.instance;
  }

  public updateConfig(config: Partial<RecordingConfig>): void {
    this.config = {...this.config, ...config};
  }

  public getConfig(): RecordingConfig {
    return {...this.config};
  }

  public addEventListener(listener: (event: RecordingEvent) => void): void {
    this.listeners.push(listener);
  }

  public removeEventListener(listener: (event: RecordingEvent) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  private emitEvent(event: RecordingEvent): void {
    this.listeners.forEach(listener => listener(event));
  }

  public setCamera(camera: Camera): void {
    this.camera = camera;
  }

  public async startRecording(triggerType: 'sound' | 'visual' | 'manual' = 'manual'): Promise<boolean> {
    if (this.isRecording) {
      console.warn('Recording already in progress');
      return false;
    }

    try {
      const recordingId = `recording_${Date.now()}`;
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      
      // 建立檔案路徑
      const recordingDir = await this.ensureRecordingDirectory();
      const baseFileName = `tcldcam_${timestamp}`;
      
      let filePath: string;
      let recordingType: 'audio' | 'video' | 'both';

      if (this.config.includeVideo && this.camera) {
        // 錄影 (包含音訊)
        filePath = `${recordingDir}/${baseFileName}.mp4`;
        recordingType = this.config.includeAudio ? 'both' : 'video';
        await this.startVideoRecording(filePath);
      } else if (this.config.includeAudio) {
        // 純音訊錄製
        filePath = `${recordingDir}/${baseFileName}.aac`;
        recordingType = 'audio';
        await this.startAudioRecording(filePath);
      } else {
        throw new Error('至少需要啟用音訊或視訊錄製');
      }

      // 建立錄製資訊
      this.currentRecording = {
        id: recordingId,
        filePath,
        duration: 0,
        size: 0,
        type: recordingType,
        triggerType,
        startTime: new Date(),
      };

      this.isRecording = true;
      this.startRecordingTimer();
      this.startProgressTimer();

      this.emitEvent({
        type: 'started',
        recordingInfo: this.currentRecording,
      });

      console.log(`Recording started: ${filePath}`);
      return true;

    } catch (error) {
      console.error('Failed to start recording:', error);
      this.emitEvent({
        type: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  }

  public async stopRecording(): Promise<RecordingInfo | null> {
    if (!this.isRecording || !this.currentRecording) {
      return null;
    }

    try {
      this.clearTimers();

      if (this.currentRecording.type === 'audio') {
        await this.stopAudioRecording();
      } else {
        await this.stopVideoRecording();
      }

      // 獲取檔案大小
      const fileInfo = await RNFS.stat(this.currentRecording.filePath);
      const endTime = new Date();
      const duration = Math.round((endTime.getTime() - this.currentRecording.startTime.getTime()) / 1000);

      const finalRecordingInfo: RecordingInfo = {
        ...this.currentRecording,
        duration,
        size: fileInfo.size,
        endTime,
      };

      this.isRecording = false;
      const recordingInfo = this.currentRecording;
      this.currentRecording = null;

      this.emitEvent({
        type: 'stopped',
        recordingInfo: finalRecordingInfo,
      });

      console.log(`Recording stopped: ${finalRecordingInfo.filePath}`);
      return finalRecordingInfo;

    } catch (error) {
      console.error('Failed to stop recording:', error);
      this.emitEvent({
        type: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return null;
    }
  }

  private async startAudioRecording(filePath: string): Promise<void> {
    const audioConfig = this.getAudioRecorderConfig();
    await this.audioRecorderPlayer.startRecorder(filePath, audioConfig);
  }

  private async stopAudioRecording(): Promise<void> {
    await this.audioRecorderPlayer.stopRecorder();
  }

  private async startVideoRecording(filePath: string): Promise<void> {
    if (!this.camera) {
      throw new Error('Camera not available');
    }

    const videoConfig = this.getVideoRecorderConfig();
    // 使用react-native-vision-camera的錄影功能
    await this.camera.startRecording({
      fileType: 'mp4',
      ...videoConfig,
      onRecordingFinished: (video) => {
        console.log('Video recording finished:', video.path);
      },
      onRecordingError: (error) => {
        console.error('Video recording error:', error);
        this.emitEvent({
          type: 'error',
          error: error.message,
        });
      },
    });
  }

  private async stopVideoRecording(): Promise<void> {
    if (!this.camera) {
      throw new Error('Camera not available');
    }

    await this.camera.stopRecording();
  }

  private getAudioRecorderConfig(): any {
    const qualityMap = {
      low: {
        SampleRate: 22050,
        Channels: 1,
        AudioQuality: 'Low',
      },
      medium: {
        SampleRate: 44100,
        Channels: 1,
        AudioQuality: 'Medium',
      },
      high: {
        SampleRate: 48000,
        Channels: 2,
        AudioQuality: 'High',
      },
    };

    return {
      ...qualityMap[this.config.audioQuality],
      AudioEncoding: 'aac',
      OutputFormat: 'aac_adts',
    };
  }

  private getVideoRecorderConfig(): any {
    const qualityMap = {
      low: {
        videoBitRate: 2000000, // 2Mbps
        quality: 'low',
      },
      medium: {
        videoBitRate: 5000000, // 5Mbps
        quality: 'medium',
      },
      high: {
        videoBitRate: 10000000, // 10Mbps
        quality: 'high',
      },
    };

    return qualityMap[this.config.videoQuality];
  }

  private async ensureRecordingDirectory(): Promise<string> {
    const recordingDir = Platform.OS === 'ios' 
      ? `${RNFS.DocumentDirectoryPath}/recordings`
      : `${RNFS.ExternalDirectoryPath}/recordings`;

    if (!(await RNFS.exists(recordingDir))) {
      await RNFS.mkdir(recordingDir);
    }

    return recordingDir;
  }

  private startRecordingTimer(): void {
    this.recordingTimer = setTimeout(() => {
      this.stopRecording();
    }, this.config.duration * 1000);
  }

  private startProgressTimer(): void {
    const startTime = Date.now();
    
    this.progressTimer = setInterval(() => {
      if (!this.isRecording) {
        return;
      }

      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / (this.config.duration * 1000)) * 100);

      this.emitEvent({
        type: 'progress',
        progress: Math.round(progress),
      });
    }, 1000);
  }

  private clearTimers(): void {
    if (this.recordingTimer) {
      clearTimeout(this.recordingTimer);
      this.recordingTimer = null;
    }

    if (this.progressTimer) {
      clearInterval(this.progressTimer);
      this.progressTimer = null;
    }
  }

  public isCurrentlyRecording(): boolean {
    return this.isRecording;
  }

  public getCurrentRecording(): RecordingInfo | null {
    return this.currentRecording;
  }

  public async deleteRecording(filePath: string): Promise<boolean> {
    try {
      if (await RNFS.exists(filePath)) {
        await RNFS.unlink(filePath);
        console.log(`Recording deleted: ${filePath}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to delete recording:', error);
      return false;
    }
  }

  public async getAllRecordings(): Promise<RecordingInfo[]> {
    try {
      const recordingDir = await this.ensureRecordingDirectory();
      const files = await RNFS.readDir(recordingDir);
      
      const recordings: RecordingInfo[] = [];
      
      for (const file of files) {
        if (file.isFile() && (file.name.endsWith('.mp4') || file.name.endsWith('.aac'))) {
          const recordingInfo: RecordingInfo = {
            id: file.name,
            filePath: file.path,
            duration: 0, // 需要從metadata獲取
            size: file.size,
            type: file.name.endsWith('.mp4') ? 'video' : 'audio',
            triggerType: 'manual', // 預設值，實際應從檔案名或metadata獲取
            startTime: new Date(file.mtime!),
          };
          
          recordings.push(recordingInfo);
        }
      }

      return recordings.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
    } catch (error) {
      console.error('Failed to get recordings:', error);
      return [];
    }
  }
}

export default RecordingService;