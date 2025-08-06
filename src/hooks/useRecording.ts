import {useState, useEffect, useCallback} from 'react';
import RecordingService, {
  RecordingConfig,
  RecordingInfo,
  RecordingEvent,
} from '../services/RecordingService';

interface UseRecordingReturn {
  isRecording: boolean;
  currentRecording: RecordingInfo | null;
  config: RecordingConfig;
  progress: number;
  allRecordings: RecordingInfo[];
  startRecording: (triggerType?: 'sound' | 'visual' | 'manual') => Promise<boolean>;
  stopRecording: () => Promise<RecordingInfo | null>;
  updateConfig: (config: Partial<RecordingConfig>) => void;
  deleteRecording: (filePath: string) => Promise<boolean>;
  refreshRecordings: () => Promise<void>;
  setCamera: (camera: any) => void;
}

export const useRecording = (): UseRecordingReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [currentRecording, setCurrentRecording] = useState<RecordingInfo | null>(null);
  const [config, setConfig] = useState<RecordingConfig>({
    duration: 30,
    audioQuality: 'medium',
    videoQuality: 'medium',
    includeAudio: true,
    includeVideo: true,
  });
  const [progress, setProgress] = useState(0);
  const [allRecordings, setAllRecordings] = useState<RecordingInfo[]>([]);

  const recordingService = RecordingService.getInstance();

  const handleRecordingEvent = useCallback((event: RecordingEvent) => {
    switch (event.type) {
      case 'started':
        setIsRecording(true);
        setCurrentRecording(event.recordingInfo || null);
        setProgress(0);
        break;
      case 'stopped':
        setIsRecording(false);
        setCurrentRecording(null);
        setProgress(0);
        if (event.recordingInfo) {
          setAllRecordings(prev => [event.recordingInfo!, ...prev]);
        }
        break;
      case 'progress':
        if (event.progress !== undefined) {
          setProgress(event.progress);
        }
        break;
      case 'error':
        setIsRecording(false);
        setCurrentRecording(null);
        setProgress(0);
        console.error('Recording error:', event.error);
        break;
    }
  }, []);

  useEffect(() => {
    // 初始化配置
    const initialConfig = recordingService.getConfig();
    setConfig(initialConfig);

    // 註冊事件監聽
    recordingService.addEventListener(handleRecordingEvent);

    // 載入現有錄製檔案
    refreshRecordings();

    return () => {
      recordingService.removeEventListener(handleRecordingEvent);
    };
  }, [handleRecordingEvent]);

  const startRecording = useCallback(async (triggerType: 'sound' | 'visual' | 'manual' = 'manual'): Promise<boolean> => {
    try {
      return await recordingService.startRecording(triggerType);
    } catch (error) {
      console.error('Failed to start recording:', error);
      return false;
    }
  }, []);

  const stopRecording = useCallback(async (): Promise<RecordingInfo | null> => {
    try {
      return await recordingService.stopRecording();
    } catch (error) {
      console.error('Failed to stop recording:', error);
      return null;
    }
  }, []);

  const updateConfig = useCallback((newConfig: Partial<RecordingConfig>): void => {
    const updatedConfig = {...config, ...newConfig};
    setConfig(updatedConfig);
    recordingService.updateConfig(updatedConfig);
  }, [config]);

  const deleteRecording = useCallback(async (filePath: string): Promise<boolean> => {
    try {
      const success = await recordingService.deleteRecording(filePath);
      if (success) {
        setAllRecordings(prev => prev.filter(recording => recording.filePath !== filePath));
      }
      return success;
    } catch (error) {
      console.error('Failed to delete recording:', error);
      return false;
    }
  }, []);

  const refreshRecordings = useCallback(async (): Promise<void> => {
    try {
      const recordings = await recordingService.getAllRecordings();
      setAllRecordings(recordings);
    } catch (error) {
      console.error('Failed to refresh recordings:', error);
    }
  }, []);

  const setCamera = useCallback((camera: any): void => {
    recordingService.setCamera(camera);
  }, []);

  return {
    isRecording,
    currentRecording,
    config,
    progress,
    allRecordings,
    startRecording,
    stopRecording,
    updateConfig,
    deleteRecording,
    refreshRecordings,
    setCamera,
  };
};