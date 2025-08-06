import {NativeEventEmitter, NativeModules} from 'react-native';
import { Audio } from 'expo-av';

export interface SoundDetectionConfig {
  threshold: number; // 音量閾值 (0-100)
  sensitivity: number; // 敏感度 (0-100)
  enabled: boolean;
}

export interface SoundLevel {
  current: number;
  average: number;
  peak: number;
}

export interface SoundDetectionEvent {
  type: 'detection' | 'level_update';
  level?: SoundLevel;
  timestamp: number;
}

class SoundDetectionService {
  private static instance: SoundDetectionService;
  private recording: Audio.Recording | null = null;
  private isListening: boolean = false;
  private config: SoundDetectionConfig;
  private listeners: ((event: SoundDetectionEvent) => void)[] = [];
  private soundLevels: number[] = [];
  private detectionTimer: NodeJS.Timeout | null = null;

  private constructor() {
    this.recording = null;
    this.config = {
      threshold: 50,
      sensitivity: 70,
      enabled: true,
    };
  }

  public static getInstance(): SoundDetectionService {
    if (!SoundDetectionService.instance) {
      SoundDetectionService.instance = new SoundDetectionService();
    }
    return SoundDetectionService.instance;
  }

  public updateConfig(config: Partial<SoundDetectionConfig>): void {
    this.config = {...this.config, ...config};
  }

  public getConfig(): SoundDetectionConfig {
    return {...this.config};
  }

  public addEventListener(listener: (event: SoundDetectionEvent) => void): void {
    this.listeners.push(listener);
  }

  public removeEventListener(listener: (event: SoundDetectionEvent) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  private emitEvent(event: SoundDetectionEvent): void {
    this.listeners.forEach(listener => listener(event));
  }

  public async startListening(): Promise<boolean> {
    if (this.isListening || !this.config.enabled) {
      return false;
    }

    try {
      // 開始錄音監聽 (只監聽不儲存)
      await this.audioRecorderPlayer.startRecorder(undefined, {
        SampleRate: 22050,
        Channels: 1,
        AudioQuality: 'Low',
        AudioEncoding: 'aac',
        OutputFormat: 'aac_adts',
      });

      this.isListening = true;
      this.startLevelMonitoring();
      
      console.log('Sound detection started');
      return true;
    } catch (error) {
      console.error('Failed to start sound detection:', error);
      return false;
    }
  }

  public async stopListening(): Promise<void> {
    if (!this.isListening) {
      return;
    }

    try {
      await this.audioRecorderPlayer.stopRecorder();
      this.isListening = false;
      this.stopLevelMonitoring();
      this.soundLevels = [];
      
      console.log('Sound detection stopped');
    } catch (error) {
      console.error('Failed to stop sound detection:', error);
    }
  }

  private startLevelMonitoring(): void {
    // 模擬音量監測 (實際應用中需要使用原生模組)
    this.detectionTimer = setInterval(() => {
      if (!this.isListening) {
        return;
      }

      // 生成模擬音量數據
      const mockLevel = this.generateMockSoundLevel();
      this.processSoundLevel(mockLevel);
    }, 100); // 每100ms檢查一次
  }

  private stopLevelMonitoring(): void {
    if (this.detectionTimer) {
      clearInterval(this.detectionTimer);
      this.detectionTimer = null;
    }
  }

  private generateMockSoundLevel(): number {
    // 模擬環境噪音 + 偶爾的高音量
    const baseNoise = 20 + Math.random() * 15; // 20-35 基礎噪音
    const spike = Math.random() < 0.05 ? Math.random() * 60 : 0; // 5%機率高音量
    return Math.min(100, baseNoise + spike);
  }

  private processSoundLevel(level: number): void {
    // 維護音量歷史
    this.soundLevels.push(level);
    if (this.soundLevels.length > 50) { // 保留最近5秒的數據
      this.soundLevels.shift();
    }

    // 計算統計數據
    const current = level;
    const average = this.soundLevels.reduce((a, b) => a + b, 0) / this.soundLevels.length;
    const peak = Math.max(...this.soundLevels);

    const soundLevel: SoundLevel = {current, average, peak};

    // 發送音量更新事件
    this.emitEvent({
      type: 'level_update',
      level: soundLevel,
      timestamp: Date.now(),
    });

    // 檢查是否觸發偵測
    if (this.shouldTriggerDetection(soundLevel)) {
      this.emitEvent({
        type: 'detection',
        level: soundLevel,
        timestamp: Date.now(),
      });
    }
  }

  private shouldTriggerDetection(soundLevel: SoundLevel): boolean {
    // 基於閾值和敏感度的偵測邏輯
    const {threshold, sensitivity} = this.config;
    
    // 當前音量超過閾值
    const currentTrigger = soundLevel.current > threshold;
    
    // 基於敏感度的動態閾值
    const dynamicThreshold = threshold - (sensitivity / 100) * 20;
    const sensitivityTrigger = soundLevel.current > dynamicThreshold && 
                              soundLevel.current > soundLevel.average * 1.5;

    return currentTrigger || sensitivityTrigger;
  }

  public isCurrentlyListening(): boolean {
    return this.isListening;
  }

  public getCurrentSoundLevel(): SoundLevel | null {
    if (this.soundLevels.length === 0) {
      return null;
    }

    const current = this.soundLevels[this.soundLevels.length - 1];
    const average = this.soundLevels.reduce((a, b) => a + b, 0) / this.soundLevels.length;
    const peak = Math.max(...this.soundLevels);

    return {current, average, peak};
  }

  // 用於訓練/學習環境噪音的方法
  public async calibrateEnvironment(): Promise<number> {
    if (!this.isListening) {
      throw new Error('需要先開始監聽才能校準環境');
    }

    // 收集10秒的環境噪音數據
    const calibrationData: number[] = [];
    
    return new Promise((resolve) => {
      const calibrationListener = (event: SoundDetectionEvent) => {
        if (event.type === 'level_update' && event.level) {
          calibrationData.push(event.level.current);
          
          if (calibrationData.length >= 100) { // 10秒的數據
            this.removeEventListener(calibrationListener);
            
            // 計算建議閾值 (平均值 + 2倍標準差)
            const average = calibrationData.reduce((a, b) => a + b, 0) / calibrationData.length;
            const variance = calibrationData.reduce((a, b) => a + Math.pow(b - average, 2), 0) / calibrationData.length;
            const stdDev = Math.sqrt(variance);
            const suggestedThreshold = Math.min(100, Math.max(30, average + 2 * stdDev));
            
            resolve(Math.round(suggestedThreshold));
          }
        }
      };

      this.addEventListener(calibrationListener);
    });
  }
}

export default SoundDetectionService;