import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {DetectionStatus} from '../types';
import {usePermissions} from '../hooks/usePermissions';
import {useSoundDetection} from '../hooks/useSoundDetection';
import {useVisualDetection} from '../hooks/useVisualDetection';
import {useRecording} from '../hooks/useRecording';

const {width} = Dimensions.get('window');

const HomeScreen = () => {
  const {permissions, hasAllPermissions, requestPermissions} = usePermissions();
  const {
    isListening: soundListening,
    soundLevel,
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
    progress: recordingProgress,
    startRecording,
    stopRecording,
  } = useRecording();

  const [isDetectionActive, setIsDetectionActive] = useState(false);

  const totalDetectionCount = soundDetectionCount + visualDetectionCount;

  const toggleDetection = async () => {
    // 檢查權限
    if (!hasAllPermissions) {
      const success = await requestPermissions();
      if (!success) {
        Alert.alert('權限不足', '需要攝影機、麥克風和儲存權限才能使用偵測功能');
        return;
      }
    }

    if (isDetectionActive) {
      // 停止所有偵測
      if (soundListening) {
        await stopSoundDetection();
      }
      if (visualActive) {
        stopVisualDetection();
      }
      if (isRecording) {
        await stopRecording();
      }
      
      setIsDetectionActive(false);
      Alert.alert('已停止', '偵測功能已關閉');
    } else {
      // 開始偵測
      const soundStarted = await startSoundDetection();
      const visualStarted = startVisualDetection();
      
      if (soundStarted || visualStarted) {
        setIsDetectionActive(true);
        Alert.alert('已開始', '偵測功能已啟動');
      } else {
        Alert.alert('啟動失敗', '無法啟動偵測功能，請檢查權限設定');
      }
    }
  };

  // 處理偵測觸發錄影
  useEffect(() => {
    if ((soundDetectionCount > 0 || visualDetectionCount > 0) && !isRecording && isDetectionActive) {
      const triggerType = soundDetectionCount > visualDetectionCount ? 'sound' : 'visual';
      startRecording(triggerType);
    }
  }, [soundDetectionCount, visualDetectionCount, isRecording, isDetectionActive, startRecording]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.statusContainer}>
        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>偵測狀態</Text>
          <View style={styles.statusRow}>
            <Icon 
              name={isDetectionActive ? 'visibility' : 'visibility-off'} 
              size={24} 
              color={isDetectionActive ? '#4CAF50' : '#757575'} 
            />
            <Text style={[
              styles.statusText,
              {color: isDetectionActive ? '#4CAF50' : '#757575'}
            ]}>
              {isDetectionActive ? '運行中' : '已停止'}
            </Text>
          </View>
        </View>

        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>錄影狀態</Text>
          <View style={styles.statusRow}>
            <Icon 
              name={isRecording ? 'fiber-manual-record' : 'stop'} 
              size={24} 
              color={isRecording ? '#F44336' : '#757575'} 
            />
            <Text style={[
              styles.statusText,
              {color: isRecording ? '#F44336' : '#757575'}
            ]}>
              {isRecording ? `錄影中 (${recordingProgress}%)` : '待機中'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.metricsContainer}>
        <View style={styles.metricCard}>
          <Text style={styles.metricTitle}>音量等級</Text>
          <Text style={styles.metricValue}>
            {soundLevel ? soundLevel.current.toFixed(1) : '0.0'} dB
          </Text>
          <View style={styles.soundMeter}>
            <View 
              style={[
                styles.soundMeterFill, 
                {width: `${Math.min(soundLevel?.current || 0, 100)}%`}
              ]} 
            />
          </View>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricTitle}>偵測次數</Text>
          <Text style={styles.metricValue}>{totalDetectionCount}</Text>
        </View>
      </View>

      <View style={styles.controlContainer}>
        <TouchableOpacity 
          style={[
            styles.controlButton,
            isDetectionActive ? styles.stopButton : styles.startButton
          ]}
          onPress={toggleDetection}
        >
          <Icon 
            name={isDetectionActive ? 'stop' : 'play-arrow'} 
            size={40} 
            color="white" 
          />
          <Text style={styles.controlButtonText}>
            {isDetectionActive ? '停止偵測' : '開始偵測'}
          </Text>
        </TouchableOpacity>
        
        {!hasAllPermissions && (
          <View style={styles.permissionWarning}>
            <Icon name="warning" size={20} color="#FF9800" />
            <Text style={styles.permissionWarningText}>
              需要權限才能正常運作
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statusCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    flex: 0.48,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  metricCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    flex: 0.48,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 12,
  },
  soundMeter: {
    width: '100%',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  soundMeterFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  controlContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButton: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#F44336',
  },
  controlButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
  },
  permissionWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  permissionWarningText: {
    color: '#FF9800',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
});

export default HomeScreen;