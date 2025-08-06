import {useState, useEffect, useCallback} from 'react';
import VisualDetectionService, {
  VisualDetectionConfig,
  VisualDetectionEvent,
  DetectedObject,
  MotionData,
} from '../services/VisualDetectionService';

interface UseVisualDetectionReturn {
  isActive: boolean;
  config: VisualDetectionConfig;
  detectionCount: number;
  lastDetection: Date | null;
  lastDetectedObjects: DetectedObject[];
  lastMotionData: MotionData | null;
  startDetection: () => boolean;
  stopDetection: () => void;
  updateConfig: (config: Partial<VisualDetectionConfig>) => void;
  calibrateEnvironment: () => Promise<void>;
  resetDetectionCount: () => void;
  getFrameProcessor: () => any;
}

export const useVisualDetection = (): UseVisualDetectionReturn => {
  const [isActive, setIsActive] = useState(false);
  const [config, setConfig] = useState<VisualDetectionConfig>({
    sensitivity: 70,
    motionThreshold: 30,
    objectDetection: true,
    faceDetection: true,
    enabled: true,
  });
  const [detectionCount, setDetectionCount] = useState(0);
  const [lastDetection, setLastDetection] = useState<Date | null>(null);
  const [lastDetectedObjects, setLastDetectedObjects] = useState<DetectedObject[]>([]);
  const [lastMotionData, setLastMotionData] = useState<MotionData | null>(null);

  const visualDetectionService = VisualDetectionService.getInstance();

  const handleVisualEvent = useCallback((event: VisualDetectionEvent) => {
    setDetectionCount(prev => prev + 1);
    setLastDetection(new Date(event.timestamp));

    switch (event.type) {
      case 'motion':
        if (event.motion) {
          setLastMotionData(event.motion);
        }
        break;
      case 'object':
      case 'face':
        if (event.objects) {
          setLastDetectedObjects(event.objects);
        }
        break;
    }
  }, []);

  useEffect(() => {
    // 初始化配置
    const initialConfig = visualDetectionService.getConfig();
    setConfig(initialConfig);

    // 註冊事件監聽
    visualDetectionService.addEventListener(handleVisualEvent);

    return () => {
      visualDetectionService.removeEventListener(handleVisualEvent);
    };
  }, [handleVisualEvent]);

  const startDetection = useCallback((): boolean => {
    try {
      const success = visualDetectionService.startDetection();
      setIsActive(success);
      return success;
    } catch (error) {
      console.error('Failed to start visual detection:', error);
      return false;
    }
  }, []);

  const stopDetection = useCallback((): void => {
    try {
      visualDetectionService.stopDetection();
      setIsActive(false);
      setLastDetectedObjects([]);
      setLastMotionData(null);
    } catch (error) {
      console.error('Failed to stop visual detection:', error);
    }
  }, []);

  const updateConfig = useCallback((newConfig: Partial<VisualDetectionConfig>): void => {
    const updatedConfig = {...config, ...newConfig};
    setConfig(updatedConfig);
    visualDetectionService.updateConfig(updatedConfig);
  }, [config]);

  const calibrateEnvironment = useCallback(async (): Promise<void> => {
    if (!isActive) {
      throw new Error('需要先開始偵測才能校準環境');
    }
    return visualDetectionService.calibrateEnvironment();
  }, [isActive]);

  const resetDetectionCount = useCallback((): void => {
    setDetectionCount(0);
    setLastDetection(null);
    setLastDetectedObjects([]);
    setLastMotionData(null);
  }, []);

  const getFrameProcessor = useCallback(() => {
    return visualDetectionService.getFrameProcessor();
  }, []);

  return {
    isActive,
    config,
    detectionCount,
    lastDetection,
    lastDetectedObjects,
    lastMotionData,
    startDetection,
    stopDetection,
    updateConfig,
    calibrateEnvironment,
    resetDetectionCount,
    getFrameProcessor,
  };
};