import {useState, useEffect, useCallback} from 'react';
import SoundDetectionService, {
  SoundDetectionConfig,
  SoundLevel,
  SoundDetectionEvent,
} from '../services/SoundDetectionService';

interface UseSoundDetectionReturn {
  isListening: boolean;
  soundLevel: SoundLevel | null;
  config: SoundDetectionConfig;
  detectionCount: number;
  lastDetection: Date | null;
  startListening: () => Promise<boolean>;
  stopListening: () => Promise<void>;
  updateConfig: (config: Partial<SoundDetectionConfig>) => void;
  calibrateEnvironment: () => Promise<number>;
  resetDetectionCount: () => void;
}

export const useSoundDetection = (): UseSoundDetectionReturn => {
  const [isListening, setIsListening] = useState(false);
  const [soundLevel, setSoundLevel] = useState<SoundLevel | null>(null);
  const [config, setConfig] = useState<SoundDetectionConfig>({
    threshold: 50,
    sensitivity: 70,
    enabled: true,
  });
  const [detectionCount, setDetectionCount] = useState(0);
  const [lastDetection, setLastDetection] = useState<Date | null>(null);

  const soundDetectionService = SoundDetectionService.getInstance();

  const handleSoundEvent = useCallback((event: SoundDetectionEvent) => {
    switch (event.type) {
      case 'level_update':
        if (event.level) {
          setSoundLevel(event.level);
        }
        break;
      case 'detection':
        setDetectionCount(prev => prev + 1);
        setLastDetection(new Date(event.timestamp));
        break;
    }
  }, []);

  useEffect(() => {
    // 初始化配置
    const initialConfig = soundDetectionService.getConfig();
    setConfig(initialConfig);

    // 註冊事件監聽
    soundDetectionService.addEventListener(handleSoundEvent);

    return () => {
      soundDetectionService.removeEventListener(handleSoundEvent);
    };
  }, [handleSoundEvent]);

  const startListening = useCallback(async (): Promise<boolean> => {
    try {
      const success = await soundDetectionService.startListening();
      setIsListening(success);
      return success;
    } catch (error) {
      console.error('Failed to start sound detection:', error);
      return false;
    }
  }, []);

  const stopListening = useCallback(async (): Promise<void> => {
    try {
      await soundDetectionService.stopListening();
      setIsListening(false);
      setSoundLevel(null);
    } catch (error) {
      console.error('Failed to stop sound detection:', error);
    }
  }, []);

  const updateConfig = useCallback((newConfig: Partial<SoundDetectionConfig>): void => {
    const updatedConfig = {...config, ...newConfig};
    setConfig(updatedConfig);
    soundDetectionService.updateConfig(updatedConfig);
  }, [config]);

  const calibrateEnvironment = useCallback(async (): Promise<number> => {
    if (!isListening) {
      throw new Error('需要先開始監聽才能校準環境');
    }
    return soundDetectionService.calibrateEnvironment();
  }, [isListening]);

  const resetDetectionCount = useCallback((): void => {
    setDetectionCount(0);
    setLastDetection(null);
  }, []);

  return {
    isListening,
    soundLevel,
    config,
    detectionCount,
    lastDetection,
    startListening,
    stopListening,
    updateConfig,
    calibrateEnvironment,
    resetDetectionCount,
  };
};