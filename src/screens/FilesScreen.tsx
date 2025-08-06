import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {RecordedFile} from '../types';

const FilesScreen = () => {
  const [files, setFiles] = useState<RecordedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    setLoading(true);
    // TODO: 從本地檔案系統載入檔案清單
    // 目前使用模擬資料
    const mockFiles: RecordedFile[] = [
      {
        id: '1',
        filename: 'detection_2025-08-06_10-30-15.mp4',
        path: '/storage/tcldcam/detection_2025-08-06_10-30-15.mp4',
        duration: 45,
        size: 12.5 * 1024 * 1024,
        createdAt: new Date('2025-08-06T10:30:15'),
        type: 'video',
        triggerType: 'sound',
      },
      {
        id: '2',
        filename: 'detection_2025-08-06_09-15-22.mp4',
        path: '/storage/tcldcam/detection_2025-08-06_09-15-22.mp4',
        duration: 30,
        size: 8.3 * 1024 * 1024,
        createdAt: new Date('2025-08-06T09:15:22'),
        type: 'video',
        triggerType: 'visual',
      },
    ];
    
    setTimeout(() => {
      setFiles(mockFiles);
      setLoading(false);
    }, 1000);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleString('zh-TW');
  };

  const toggleSelection = (fileId: string) => {
    if (selectedFiles.includes(fileId)) {
      setSelectedFiles(prev => prev.filter(id => id !== fileId));
    } else {
      setSelectedFiles(prev => [...prev, fileId]);
    }
  };

  const deleteSelectedFiles = () => {
    if (selectedFiles.length === 0) return;

    Alert.alert(
      '刪除檔案',
      `確定要刪除選中的 ${selectedFiles.length} 個檔案？`,
      [
        {text: '取消', style: 'cancel'},
        {
          text: '刪除',
          style: 'destructive',
          onPress: () => {
            setFiles(prev => prev.filter(file => !selectedFiles.includes(file.id)));
            setSelectedFiles([]);
            setIsSelectionMode(false);
            Alert.alert('完成', '檔案已刪除');
          },
        },
      ],
    );
  };

  const playFile = (file: RecordedFile) => {
    Alert.alert('播放檔案', `播放: ${file.filename}`);
    // TODO: 實作檔案播放功能
  };

  const shareFile = (file: RecordedFile) => {
    Alert.alert('分享檔案', `分享: ${file.filename}`);
    // TODO: 實作檔案分享功能
  };

  const renderFileItem = ({item}: {item: RecordedFile}) => {
    const isSelected = selectedFiles.includes(item.id);
    
    return (
      <TouchableOpacity
        style={[styles.fileItem, isSelected && styles.selectedFileItem]}
        onPress={() => {
          if (isSelectionMode) {
            toggleSelection(item.id);
          } else {
            playFile(item);
          }
        }}
        onLongPress={() => {
          setIsSelectionMode(true);
          toggleSelection(item.id);
        }}
      >
        <View style={styles.fileInfo}>
          <View style={styles.fileHeader}>
            <Icon 
              name={item.type === 'video' ? 'videocam' : 'mic'} 
              size={24} 
              color="#007AFF" 
            />
            <View style={styles.triggerBadge}>
              <Icon 
                name={item.triggerType === 'sound' ? 'hearing' : 'visibility'} 
                size={12} 
                color="white" 
              />
            </View>
          </View>
          <Text style={styles.fileName}>{item.filename}</Text>
          <View style={styles.fileDetails}>
            <Text style={styles.fileDetailText}>
              {formatDuration(item.duration)} • {formatFileSize(item.size)}
            </Text>
            <Text style={styles.fileDate}>{formatDate(item.createdAt)}</Text>
          </View>
        </View>

        {!isSelectionMode && (
          <TouchableOpacity
            style={styles.shareButton}
            onPress={() => shareFile(item)}
          >
            <Icon name="share" size={20} color="#666" />
          </TouchableOpacity>
        )}

        {isSelectionMode && (
          <View style={styles.checkbox}>
            <Icon 
              name={isSelected ? 'check-box' : 'check-box-outline-blank'} 
              size={24} 
              color={isSelected ? '#007AFF' : '#ccc'} 
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>載入檔案中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          已錄製檔案 ({files.length})
        </Text>
        
        {isSelectionMode ? (
          <View style={styles.selectionActions}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => {
                setIsSelectionMode(false);
                setSelectedFiles([]);
              }}
            >
              <Text style={styles.headerButtonText}>取消</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.headerButton, styles.deleteButton]}
              onPress={deleteSelectedFiles}
              disabled={selectedFiles.length === 0}
            >
              <Icon name="delete" size={20} color="white" />
              <Text style={styles.deleteButtonText}>刪除 ({selectedFiles.length})</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setIsSelectionMode(true)}
          >
            <Icon name="select-all" size={20} color="#007AFF" />
            <Text style={styles.headerButtonText}>選擇</Text>
          </TouchableOpacity>
        )}
      </View>

      {files.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="folder-open" size={64} color="#ccc" />
          <Text style={styles.emptyText}>尚無錄製檔案</Text>
          <Text style={styles.emptySubtext}>開始偵測後，錄製的檔案將顯示在這裡</Text>
        </View>
      ) : (
        <FlatList
          data={files}
          renderItem={renderFileItem}
          keyExtractor={item => item.id}
          style={styles.fileList}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  headerButtonText: {
    color: '#007AFF',
    fontSize: 16,
    marginLeft: 4,
  },
  selectionActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    marginLeft: 8,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 4,
  },
  fileList: {
    flex: 1,
    padding: 16,
  },
  fileItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedFileItem: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  fileInfo: {
    flex: 1,
  },
  fileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  triggerBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 2,
    marginLeft: 8,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  fileDetails: {
    flexDirection: 'column',
  },
  fileDetailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  fileDate: {
    fontSize: 12,
    color: '#999',
  },
  shareButton: {
    padding: 8,
  },
  checkbox: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default FilesScreen;