import React, {useEffect, useRef} from 'react';
import {Alert} from 'react-native';
import {useSoundDetection} from '../hooks/useSoundDetection';
import {useVisualDetection} from '../hooks/useVisualDetection';
import {useRecording} from '../hooks/useRecording';
import {usePermissions} from '../hooks/usePermissions';

interface DetectionEngineProps {
  isActive: boolean;
  onStatusChange?: (status: {
    soundDetecting: boolean;
    visualDetecting: boolean;
    recording: boolean;
    detectionCount: number;
  }) => void;
}

const DetectionEngine: React.FC<DetectionEngineProps> = ({
  isActive,
  onStatusChange,
}) => {
  const {hasAllPermissions} = usePermissions();
  const {
    isListening: soundListening,
    detectionCount: soundDetectionCount,
    startListening: startSoundDetection,
    stopListening: stopSoundDetection,
  } = useSoundDetection();
  
  const {
    isActive: visualActive,
    detectionCount: visualDetectionCount,
    startDetection: startVisualDetection,
    stopDetection: stopVisualDetection,
  } = useVisualDetection();
  
  const {
    isRecording,
    startRecording,
    stopRecording,
  } = useRecording();

  const previousDetectionCount = useRef(0);

  // 主控制邏輯
  useEffect(() => {
    if (isActive && hasAllPermissions) {
      startDetectionServices();
    } else {
      stopDetectionServices();
    }

    return () => {
      stopDetectionServices();
    };
  }, [isActive, hasAllPermissions]);

  // 監控偵測觸發
  useEffect(() => {
    const currentDetectionCount = soundDetectionCount + visualDetectionCount;
    
    // 如果有新的偵測事件且未在錄影
    if (currentDetectionCount > previousDetectionCount.current && !isRecording) {
      const triggerType = soundDetectionCount > visualDetectionCount ? 'sound' : 'visual';
      handleDetectionTrigger(triggerType);
    }
    
    previousDetectionCount.current = currentDetectionCount;
  }, [soundDetectionCount, visualDetectionCount, isRecording]);

  // 狀態變化通知
  useEffect(() => {
    if (onStatusChange) {
      onStatusChange({
        soundDetecting: soundListening,
        visualDetecting: visualActive,
        recording: isRecording,
        detectionCount: soundDetectionCount + visualDetectionCount,
      });
    }
  }, [
    soundListening,
    visualActive,
    isRecording,
    soundDetectionCount,
    visualDetectionCount,
    onStatusChange,
  ]);

  const startDetectionServices = async () => {
    try {
      console.log('Starting detection services...');
      
      // 啟動聲音偵測
      const soundStarted = await startSoundDetection();
      if (!soundStarted) {
        console.warn('Failed to start sound detection');
      }

      // 啟動視覺偵測
      const visualStarted = startVisualDetection();
      if (!visualStarted) {
        console.warn('Failed to start visual detection');
      }

      if (!soundStarted && !visualStarted) {
        Alert.alert('警告', '偵測服務啟動失敗');
      } else {
        console.log('Detection services started successfully');
      }
    } catch (error) {
      console.error('Error starting detection services:', error);
      Alert.alert('錯誤', '啟動偵測服務時發生錯誤');
    }
  };

  const stopDetectionServices = async () => {
    try {
      console.log('Stopping detection services...');
      
      // 停止錄影
      if (isRecording) {
        await stopRecording();
      }

      // 停止聲音偵測
      if (soundListening) {
        await stopSoundDetection();
      }

      // 停止視覺偵測
      if (visualActive) {
        stopVisualDetection();
      }

      console.log('Detection services stopped');
    } catch (error) {
      console.error('Error stopping detection services:', error);
    }
  };

  const handleDetectionTrigger = async (triggerType: 'sound' | 'visual') => {
    try {
      console.log(`Detection triggered by: ${triggerType}`);
      
      // 開始錄影
      const recordingStarted = await startRecording(triggerType);
      
      if (recordingStarted) {
        console.log(`Recording started (triggered by ${triggerType})`);
      } else {
        console.warn('Failed to start recording');
        Alert.alert('警告', '無法開始錄影');
      }
    } catch (error) {
      console.error('Error handling detection trigger:', error);
    }
  };

  // 這個組件不渲染任何UI，只處理邏輯
  return null;
};

export default DetectionEngine;