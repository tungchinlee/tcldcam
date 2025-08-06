export interface DetectionConfig {
  soundEnabled: boolean;
  visualEnabled: boolean;
  soundThreshold: number;
  visualSensitivity: number;
  recordingDuration: number;
}

export interface RecordedFile {
  id: string;
  filename: string;
  path: string;
  duration: number;
  size: number;
  createdAt: Date;
  type: 'audio' | 'video';
  triggerType: 'sound' | 'visual';
}

export interface DetectionStatus {
  isActive: boolean;
  isRecording: boolean;
  soundLevel: number;
  detectionCount: number;
}

export interface ModelInfo {
  id: string;
  name: string;
  version: string;
  size: number;
  lastUpdate: Date;
  isLocal: boolean;
}