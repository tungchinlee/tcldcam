import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Slider,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {DetectionConfig} from '../types';

const SettingsScreen = () => {
  const [config, setConfig] = useState<DetectionConfig>({
    soundEnabled: true,
    visualEnabled: true,
    soundThreshold: 50,
    visualSensitivity: 70,
    recordingDuration: 30,
  });

  const updateConfig = (key: keyof DetectionConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const saveSettings = () => {
    // TODO: 儲存設定到本地存儲
    Alert.alert('已儲存', '設定已成功儲存');
  };

  const resetSettings = () => {
    Alert.alert(
      '重設設定',
      '確定要重設所有設定為預設值？',
      [
        {text: '取消', style: 'cancel'},
        {
          text: '重設',
          style: 'destructive',
          onPress: () => {
            setConfig({
              soundEnabled: true,
              visualEnabled: true,
              soundThreshold: 50,
              visualSensitivity: 70,
              recordingDuration: 30,
            });
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>偵測功能</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Icon name="mic" size={24} color="#007AFF" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>聲音偵測</Text>
                <Text style={styles.settingDescription}>
                  監聽環境聲音並觸發錄製
                </Text>
              </View>
            </View>
            <Switch
              value={config.soundEnabled}
              onValueChange={value => updateConfig('soundEnabled', value)}
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={config.soundEnabled ? '#007AFF' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Icon name="visibility" size={24} color="#007AFF" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>畫面偵測</Text>
                <Text style={styles.settingDescription}>
                  分析畫面內容並觸發錄製
                </Text>
              </View>
            </View>
            <Switch
              value={config.visualEnabled}
              onValueChange={value => updateConfig('visualEnabled', value)}
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={config.visualEnabled ? '#007AFF' : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>偵測靈敏度</Text>
          
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>聲音觸發閾值</Text>
            <Text style={styles.sliderValue}>{config.soundThreshold} dB</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              value={config.soundThreshold}
              onValueChange={value => updateConfig('soundThreshold', Math.round(value))}
              minimumTrackTintColor="#007AFF"
              maximumTrackTintColor="#d3d3d3"
              thumbStyle={{backgroundColor: '#007AFF'}}
              disabled={!config.soundEnabled}
            />
          </View>

          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>畫面偵測敏感度</Text>
            <Text style={styles.sliderValue}>{config.visualSensitivity}%</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              value={config.visualSensitivity}
              onValueChange={value => updateConfig('visualSensitivity', Math.round(value))}
              minimumTrackTintColor="#007AFF"
              maximumTrackTintColor="#d3d3d3"
              thumbStyle={{backgroundColor: '#007AFF'}}
              disabled={!config.visualEnabled}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>錄製設定</Text>
          
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>錄製時長</Text>
            <Text style={styles.sliderValue}>{config.recordingDuration} 秒</Text>
            <Slider
              style={styles.slider}
              minimumValue={5}
              maximumValue={300}
              step={5}
              value={config.recordingDuration}
              onValueChange={value => updateConfig('recordingDuration', value)}
              minimumTrackTintColor="#007AFF"
              maximumTrackTintColor="#d3d3d3"
              thumbStyle={{backgroundColor: '#007AFF'}}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
            <Icon name="save" size={24} color="white" />
            <Text style={styles.buttonText}>儲存設定</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resetButton} onPress={resetSettings}>
            <Icon name="refresh" size={24} color="#F44336" />
            <Text style={[styles.buttonText, {color: '#F44336'}]}>重設</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  sliderContainer: {
    marginVertical: 8,
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  sliderValue: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 0.45,
  },
  resetButton: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F44336',
    flex: 0.45,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default SettingsScreen;