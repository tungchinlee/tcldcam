import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {ModelInfo} from '../types';

const ModelsScreen = () => {
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [downloadingModels, setDownloadingModels] = useState<string[]>([]);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    setLoading(true);
    // TODO: 從本地和雲端載入模型資訊
    // 目前使用模擬資料
    const mockModels: ModelInfo[] = [
      {
        id: 'sound-detection-v2',
        name: '聲音偵測模型 v2.0',
        version: '2.0.1',
        size: 45.2 * 1024 * 1024,
        lastUpdate: new Date('2025-08-01'),
        isLocal: true,
      },
      {
        id: 'visual-detection-v3',
        name: '視覺偵測模型 v3.1',
        version: '3.1.0',
        size: 128.7 * 1024 * 1024,
        lastUpdate: new Date('2025-07-28'),
        isLocal: true,
      },
      {
        id: 'sound-detection-v3',
        name: '聲音偵測模型 v3.0 (Beta)',
        version: '3.0.0-beta.1',
        size: 52.1 * 1024 * 1024,
        lastUpdate: new Date('2025-08-05'),
        isLocal: false,
      },
      {
        id: 'visual-detection-v4',
        name: '視覺偵測模型 v4.0 (Beta)',
        version: '4.0.0-beta.2',
        size: 156.3 * 1024 * 1024,
        lastUpdate: new Date('2025-08-04'),
        isLocal: false,
      },
    ];
    
    setTimeout(() => {
      setModels(mockModels);
      setLoading(false);
    }, 1000);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadModels();
    setRefreshing(false);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('zh-TW');
  };

  const downloadModel = async (model: ModelInfo) => {
    setDownloadingModels(prev => [...prev, model.id]);
    
    // 模擬下載過程
    Alert.alert('開始下載', `正在下載 ${model.name}...`);
    
    setTimeout(() => {
      setDownloadingModels(prev => prev.filter(id => id !== model.id));
      setModels(prev => prev.map(m => 
        m.id === model.id ? {...m, isLocal: true} : m
      ));
      Alert.alert('下載完成', `${model.name} 已成功下載`);
    }, 3000);
  };

  const deleteModel = (model: ModelInfo) => {
    Alert.alert(
      '刪除模型',
      `確定要刪除 ${model.name}？\n刪除後將無法使用此模型進行偵測。`,
      [
        {text: '取消', style: 'cancel'},
        {
          text: '刪除',
          style: 'destructive',
          onPress: () => {
            setModels(prev => prev.map(m => 
              m.id === model.id ? {...m, isLocal: false} : m
            ));
            Alert.alert('已刪除', `${model.name} 已從裝置中移除`);
          },
        },
      ],
    );
  };

  const updateAllModels = () => {
    const updatableModels = models.filter(m => !m.isLocal);
    if (updatableModels.length === 0) {
      Alert.alert('無可用更新', '所有模型已是最新版本');
      return;
    }

    Alert.alert(
      '更新所有模型',
      `將下載 ${updatableModels.length} 個更新的模型`,
      [
        {text: '取消', style: 'cancel'},
        {
          text: '更新',
          onPress: () => {
            updatableModels.forEach(model => downloadModel(model));
          },
        },
      ],
    );
  };

  const renderModelCard = (model: ModelInfo) => {
    const isDownloading = downloadingModels.includes(model.id);
    
    return (
      <View key={model.id} style={styles.modelCard}>
        <View style={styles.modelHeader}>
          <View style={styles.modelInfo}>
            <Text style={styles.modelName}>{model.name}</Text>
            <Text style={styles.modelVersion}>版本 {model.version}</Text>
          </View>
          
          <View style={styles.modelStatus}>
            {model.isLocal ? (
              <View style={[styles.statusBadge, styles.installedBadge]}>
                <Icon name="check-circle" size={16} color="white" />
                <Text style={styles.statusText}>已安裝</Text>
              </View>
            ) : (
              <View style={[styles.statusBadge, styles.availableBadge]}>
                <Icon name="cloud-download" size={16} color="white" />
                <Text style={styles.statusText}>可下載</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.modelDetails}>
          <Text style={styles.modelDetailText}>
            大小: {formatFileSize(model.size)}
          </Text>
          <Text style={styles.modelDetailText}>
            更新時間: {formatDate(model.lastUpdate)}
          </Text>
        </View>

        <View style={styles.modelActions}>
          {model.isLocal ? (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteModel(model)}
            >
              <Icon name="delete" size={20} color="#F44336" />
              <Text style={styles.deleteButtonText}>刪除</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.downloadButton, isDownloading && styles.downloadingButton]}
              onPress={() => downloadModel(model)}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <>
                  <ActivityIndicator size="small" color="white" />
                  <Text style={styles.downloadButtonText}>下載中...</Text>
                </>
              ) : (
                <>
                  <Icon name="download" size={20} color="white" />
                  <Text style={styles.downloadButtonText}>下載</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>載入模型資訊...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const installedModels = models.filter(m => m.isLocal);
  const availableModels = models.filter(m => !m.isLocal);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>AI 模型管理</Text>
          <TouchableOpacity
            style={styles.updateAllButton}
            onPress={updateAllModels}
            disabled={availableModels.length === 0}
          >
            <Icon name="system-update" size={20} color={availableModels.length > 0 ? '#007AFF' : '#ccc'} />
            <Text style={[
              styles.updateAllButtonText,
              {color: availableModels.length > 0 ? '#007AFF' : '#ccc'}
            ]}>
              全部更新
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            已安裝模型 ({installedModels.length})
          </Text>
          {installedModels.length === 0 ? (
            <Text style={styles.emptyText}>尚未安裝任何模型</Text>
          ) : (
            installedModels.map(renderModelCard)
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            可用模型 ({availableModels.length})
          </Text>
          {availableModels.length === 0 ? (
            <Text style={styles.emptyText}>沒有可用的更新</Text>
          ) : (
            availableModels.map(renderModelCard)
          )}
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>模型說明</Text>
          <Text style={styles.infoText}>
            • 聲音偵測模型：用於識別和分析環境聲音{'\n'}
            • 視覺偵測模型：用於分析攝影機畫面內容{'\n'}
            • Beta 版本包含最新功能，但可能不夠穩定{'\n'}
            • 建議保持模型為最新版本以獲得最佳效果
          </Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  updateAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  updateAllButtonText: {
    fontSize: 16,
    marginLeft: 4,
  },
  section: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  modelCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  modelInfo: {
    flex: 1,
  },
  modelName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  modelVersion: {
    fontSize: 14,
    color: '#666',
  },
  modelStatus: {
    marginLeft: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  installedBadge: {
    backgroundColor: '#4CAF50',
  },
  availableBadge: {
    backgroundColor: '#2196F3',
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  modelDetails: {
    marginBottom: 12,
  },
  modelDetailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  modelActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  downloadingButton: {
    backgroundColor: '#999',
  },
  downloadButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F44336',
  },
  deleteButtonText: {
    color: '#F44336',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    padding: 24,
    fontStyle: 'italic',
  },
  infoSection: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default ModelsScreen;