import {Camera, Frame} from 'react-native-vision-camera';

export interface VisualDetectionConfig {
  sensitivity: number; // 敏感度 (0-100)
  motionThreshold: number; // 動作偵測閾值 (0-100)
  objectDetection: boolean; // 物體偵測
  faceDetection: boolean; // 人臉偵測
  enabled: boolean;
}

export interface DetectedObject {
  id: string;
  type: 'face' | 'person' | 'vehicle' | 'animal' | 'unknown';
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface MotionData {
  intensity: number; // 動作強度 (0-100)
  areas: {x: number; y: number; intensity: number}[]; // 動作區域
}

export interface VisualDetectionEvent {
  type: 'motion' | 'object' | 'face';
  objects?: DetectedObject[];
  motion?: MotionData;
  timestamp: number;
  frameInfo?: {
    width: number;
    height: number;
  };
}

class VisualDetectionService {
  private static instance: VisualDetectionService;
  private isActive: boolean = false;
  private config: VisualDetectionConfig;
  private listeners: ((event: VisualDetectionEvent) => void)[] = [];
  private lastFrame: Frame | null = null;
  private frameProcessor: any = null;

  private constructor() {
    this.config = {
      sensitivity: 70,
      motionThreshold: 30,
      objectDetection: true,
      faceDetection: true,
      enabled: true,
    };
  }

  public static getInstance(): VisualDetectionService {
    if (!VisualDetectionService.instance) {
      VisualDetectionService.instance = new VisualDetectionService();
    }
    return VisualDetectionService.instance;
  }

  public updateConfig(config: Partial<VisualDetectionConfig>): void {
    this.config = {...this.config, ...config};
  }

  public getConfig(): VisualDetectionConfig {
    return {...this.config};
  }

  public addEventListener(listener: (event: VisualDetectionEvent) => void): void {
    this.listeners.push(listener);
  }

  public removeEventListener(listener: (event: VisualDetectionEvent) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  private emitEvent(event: VisualDetectionEvent): void {
    this.listeners.forEach(listener => listener(event));
  }

  public startDetection(): boolean {
    if (this.isActive || !this.config.enabled) {
      return false;
    }

    this.isActive = true;
    this.setupFrameProcessor();
    console.log('Visual detection started');
    return true;
  }

  public stopDetection(): void {
    if (!this.isActive) {
      return;
    }

    this.isActive = false;
    this.frameProcessor = null;
    this.lastFrame = null;
    console.log('Visual detection stopped');
  }

  private setupFrameProcessor(): void {
    // 設定幀處理器 - 在實際應用中會使用react-native-vision-camera的frameProcessor
    this.frameProcessor = (frame: Frame) => {
      if (!this.isActive) return;

      // 模擬處理延遲
      setTimeout(() => {
        this.processFrame(frame);
      }, 33); // 約30fps
    };

    // 開始模擬幀處理
    this.startMockFrameProcessing();
  }

  private startMockFrameProcessing(): void {
    // 模擬攝影機幀處理
    const processInterval = setInterval(() => {
      if (!this.isActive) {
        clearInterval(processInterval);
        return;
      }

      // 生成模擬幀數據
      const mockFrame = this.generateMockFrame();
      this.processFrame(mockFrame);
    }, 100); // 每100ms處理一次
  }

  private generateMockFrame(): any {
    return {
      width: 1920,
      height: 1080,
      timestamp: Date.now(),
      // 模擬幀數據
      data: new Uint8Array(1920 * 1080 * 3), // RGB數據
    };
  }

  private async processFrame(frame: any): Promise<void> {
    try {
      // 動作偵測
      if (this.shouldDetectMotion()) {
        const motionData = await this.detectMotion(frame);
        if (motionData && motionData.intensity > this.config.motionThreshold) {
          this.emitEvent({
            type: 'motion',
            motion: motionData,
            timestamp: Date.now(),
            frameInfo: {width: frame.width, height: frame.height},
          });
        }
      }

      // 物體偵測
      if (this.config.objectDetection) {
        const objects = await this.detectObjects(frame);
        if (objects.length > 0) {
          this.emitEvent({
            type: 'object',
            objects,
            timestamp: Date.now(),
            frameInfo: {width: frame.width, height: frame.height},
          });
        }
      }

      // 人臉偵測
      if (this.config.faceDetection) {
        const faces = await this.detectFaces(frame);
        if (faces.length > 0) {
          this.emitEvent({
            type: 'face',
            objects: faces,
            timestamp: Date.now(),
            frameInfo: {width: frame.width, height: frame.height},
          });
        }
      }

      this.lastFrame = frame;
    } catch (error) {
      console.error('Error processing frame:', error);
    }
  }

  private shouldDetectMotion(): boolean {
    return this.lastFrame !== null;
  }

  private async detectMotion(frame: any): Promise<MotionData | null> {
    if (!this.lastFrame) {
      return null;
    }

    // 模擬動作偵測
    const hasMotion = Math.random() < 0.1; // 10%機率偵測到動作
    
    if (!hasMotion) {
      return {intensity: 0, areas: []};
    }

    const intensity = Math.random() * 100;
    const areas = Array.from({length: Math.floor(Math.random() * 3) + 1}, () => ({
      x: Math.random() * frame.width,
      y: Math.random() * frame.height,
      intensity: Math.random() * 100,
    }));

    return {intensity, areas};
  }

  private async detectObjects(frame: any): Promise<DetectedObject[]> {
    // 模擬物體偵測
    const hasObjects = Math.random() < 0.05; // 5%機率偵測到物體
    
    if (!hasObjects) {
      return [];
    }

    const objectTypes: DetectedObject['type'][] = ['person', 'vehicle', 'animal'];
    const numObjects = Math.floor(Math.random() * 2) + 1;

    return Array.from({length: numObjects}, (_, index) => ({
      id: `object_${Date.now()}_${index}`,
      type: objectTypes[Math.floor(Math.random() * objectTypes.length)],
      confidence: 0.5 + Math.random() * 0.5,
      boundingBox: {
        x: Math.random() * frame.width * 0.8,
        y: Math.random() * frame.height * 0.8,
        width: 50 + Math.random() * 200,
        height: 50 + Math.random() * 200,
      },
    }));
  }

  private async detectFaces(frame: any): Promise<DetectedObject[]> {
    // 模擬人臉偵測
    const hasFaces = Math.random() < 0.03; // 3%機率偵測到人臉
    
    if (!hasFaces) {
      return [];
    }

    const numFaces = Math.floor(Math.random() * 2) + 1;

    return Array.from({length: numFaces}, (_, index) => ({
      id: `face_${Date.now()}_${index}`,
      type: 'face',
      confidence: 0.7 + Math.random() * 0.3,
      boundingBox: {
        x: Math.random() * frame.width * 0.8,
        y: Math.random() * frame.height * 0.8,
        width: 80 + Math.random() * 120,
        height: 80 + Math.random() * 120,
      },
    }));
  }

  public isCurrentlyActive(): boolean {
    return this.isActive;
  }

  // 獲取幀處理器用於Camera組件
  public getFrameProcessor(): any {
    return this.frameProcessor;
  }

  // 校準環境 - 學習正常狀態下的畫面
  public async calibrateEnvironment(): Promise<void> {
    if (!this.isActive) {
      throw new Error('需要先開始偵測才能校準環境');
    }

    // 收集30秒的背景畫面數據
    const calibrationData: any[] = [];
    
    return new Promise((resolve) => {
      const calibrationListener = (event: VisualDetectionEvent) => {
        if (event.type === 'motion') {
          calibrationData.push(event.motion);
          
          if (calibrationData.length >= 300) { // 30秒的數據
            this.removeEventListener(calibrationListener);
            
            // 分析背景動作並調整閾值
            const averageIntensity = calibrationData
              .filter(d => d)
              .reduce((sum, d) => sum + d.intensity, 0) / calibrationData.length;
            
            const suggestedThreshold = Math.max(20, averageIntensity * 2);
            this.updateConfig({motionThreshold: suggestedThreshold});
            
            console.log(`環境校準完成，建議動作閾值: ${suggestedThreshold}`);
            resolve();
          }
        }
      };

      this.addEventListener(calibrationListener);
    });
  }
}

export default VisualDetectionService;