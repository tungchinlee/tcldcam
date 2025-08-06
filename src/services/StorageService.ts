import {Platform, Alert, Share} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Web-compatible file system handling
let RNFS: any = null;
try {
  if (Platform.OS !== 'web') {
    RNFS = require('react-native-fs');
  }
} catch (error) {
  console.log('react-native-fs not available on web');
}

export interface StorageInfo {
  totalSpace: number;
  freeSpace: number;
  usedByApp: number;
  recordingsCount: number;
}

export interface FileMetadata {
  id: string;
  originalPath: string;
  filename: string;
  size: number;
  type: 'audio' | 'video';
  triggerType: 'sound' | 'visual' | 'manual';
  createdAt: Date;
  duration: number;
  tags?: string[];
  thumbnail?: string;
}

class StorageService {
  private static instance: StorageService;
  private readonly METADATA_KEY = 'tcldcam_file_metadata';
  private readonly APP_DIR_NAME = 'tcldcam';

  private constructor() {}

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  // 獲取應用程式存儲目錄
  private getAppDirectory(): string {
    if (Platform.OS === 'web') {
      return `/tcldcam`;
    }
    
    if (!RNFS) return '/tcldcam';
    
    return Platform.OS === 'ios' 
      ? `${RNFS.DocumentDirectoryPath}/${this.APP_DIR_NAME}`
      : `${RNFS.ExternalDirectoryPath}/${this.APP_DIR_NAME}`;
  }

  private getRecordingsDirectory(): string {
    return `${this.getAppDirectory()}/recordings`;
  }

  private getModelsDirectory(): string {
    return `${this.getAppDirectory()}/models`;
  }

  private getThumbnailsDirectory(): string {
    return `${this.getAppDirectory()}/thumbnails`;
  }

  // 初始化存儲目錄
  public async initializeStorage(): Promise<void> {
    try {
      const directories = [
        this.getAppDirectory(),
        this.getRecordingsDirectory(),
        this.getModelsDirectory(),
        this.getThumbnailsDirectory(),
      ];

      for (const dir of directories) {
        if (!(await RNFS.exists(dir))) {
          await RNFS.mkdir(dir);
          console.log(`Created directory: ${dir}`);
        }
      }
    } catch (error) {
      console.error('Failed to initialize storage:', error);
      throw error;
    }
  }

  // 獲取存儲空間資訊
  public async getStorageInfo(): Promise<StorageInfo> {
    try {
      const freeSpace = await RNFS.getFSInfo();
      const appDir = this.getAppDirectory();
      
      let usedByApp = 0;
      let recordingsCount = 0;

      if (await RNFS.exists(appDir)) {
        const files = await this.getAllFilesRecursive(appDir);
        usedByApp = files.reduce((sum, file) => sum + file.size, 0);
        
        const recordingsDir = this.getRecordingsDirectory();
        if (await RNFS.exists(recordingsDir)) {
          const recordings = await RNFS.readDir(recordingsDir);
          recordingsCount = recordings.filter(f => f.isFile()).length;
        }
      }

      return {
        totalSpace: freeSpace.totalSpace,
        freeSpace: freeSpace.freeSpace,
        usedByApp,
        recordingsCount,
      };
    } catch (error) {
      console.error('Failed to get storage info:', error);
      throw error;
    }
  }

  private async getAllFilesRecursive(dirPath: string): Promise<RNFS.ReadDirItem[]> {
    const allFiles: RNFS.ReadDirItem[] = [];
    
    try {
      const items = await RNFS.readDir(dirPath);
      
      for (const item of items) {
        if (item.isFile()) {
          allFiles.push(item);
        } else if (item.isDirectory()) {
          const subFiles = await this.getAllFilesRecursive(item.path);
          allFiles.push(...subFiles);
        }
      }
    } catch (error) {
      console.error(`Failed to read directory ${dirPath}:`, error);
    }
    
    return allFiles;
  }

  // 檔案元數據管理
  public async saveFileMetadata(metadata: FileMetadata): Promise<void> {
    try {
      const existingMetadata = await this.getAllFileMetadata();
      const updatedMetadata = existingMetadata.filter(m => m.id !== metadata.id);
      updatedMetadata.push(metadata);
      
      await AsyncStorage.setItem(this.METADATA_KEY, JSON.stringify(updatedMetadata));
    } catch (error) {
      console.error('Failed to save file metadata:', error);
      throw error;
    }
  }

  public async getAllFileMetadata(): Promise<FileMetadata[]> {
    try {
      const metadataJson = await AsyncStorage.getItem(this.METADATA_KEY);
      if (!metadataJson) {
        return [];
      }
      
      const metadata = JSON.parse(metadataJson);
      return metadata.map((m: any) => ({
        ...m,
        createdAt: new Date(m.createdAt),
      }));
    } catch (error) {
      console.error('Failed to get file metadata:', error);
      return [];
    }
  }

  public async getFileMetadata(fileId: string): Promise<FileMetadata | null> {
    try {
      const allMetadata = await this.getAllFileMetadata();
      return allMetadata.find(m => m.id === fileId) || null;
    } catch (error) {
      console.error('Failed to get file metadata:', error);
      return null;
    }
  }

  public async deleteFileMetadata(fileId: string): Promise<void> {
    try {
      const existingMetadata = await this.getAllFileMetadata();
      const updatedMetadata = existingMetadata.filter(m => m.id !== fileId);
      
      await AsyncStorage.setItem(this.METADATA_KEY, JSON.stringify(updatedMetadata));
    } catch (error) {
      console.error('Failed to delete file metadata:', error);
      throw error;
    }
  }

  // 檔案操作
  public async moveFileToRecordings(sourcePath: string, filename: string): Promise<string> {
    try {
      await this.initializeStorage();
      
      const targetDir = this.getRecordingsDirectory();
      const targetPath = `${targetDir}/${filename}`;
      
      // 確保檔案名不重複
      const finalPath = await this.ensureUniqueFilename(targetPath);
      
      await RNFS.moveFile(sourcePath, finalPath);
      return finalPath;
    } catch (error) {
      console.error('Failed to move file to recordings:', error);
      throw error;
    }
  }

  public async copyFile(sourcePath: string, targetPath: string): Promise<void> {
    try {
      await RNFS.copyFile(sourcePath, targetPath);
    } catch (error) {
      console.error('Failed to copy file:', error);
      throw error;
    }
  }

  public async deleteFile(filePath: string): Promise<void> {
    try {
      if (await RNFS.exists(filePath)) {
        await RNFS.unlink(filePath);
        console.log(`File deleted: ${filePath}`);
      }
    } catch (error) {
      console.error('Failed to delete file:', error);
      throw error;
    }
  }

  private async ensureUniqueFilename(filePath: string): Promise<string> {
    if (!(await RNFS.exists(filePath))) {
      return filePath;
    }

    const directory = filePath.substring(0, filePath.lastIndexOf('/'));
    const filename = filePath.substring(filePath.lastIndexOf('/') + 1);
    const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.'));
    const extension = filename.substring(filename.lastIndexOf('.'));

    let counter = 1;
    let newPath: string;
    
    do {
      const newFilename = `${nameWithoutExt}_${counter}${extension}`;
      newPath = `${directory}/${newFilename}`;
      counter++;
    } while (await RNFS.exists(newPath));

    return newPath;
  }

  // 檔案分享
  public async shareFile(filePath: string): Promise<void> {
    try {
      if (!(await RNFS.exists(filePath))) {
        throw new Error('檔案不存在');
      }

      await Share.share({
        url: Platform.OS === 'ios' ? filePath : `file://${filePath}`,
        title: '分享錄製檔案',
      });
    } catch (error) {
      console.error('Failed to share file:', error);
      throw error;
    }
  }

  // 匯出檔案到系統相簿或檔案管理器
  public async exportFile(filePath: string, targetName?: string): Promise<string> {
    try {
      if (!(await RNFS.exists(filePath))) {
        throw new Error('檔案不存在');
      }

      const filename = targetName || filePath.substring(filePath.lastIndexOf('/') + 1);
      let targetDir: string;

      if (Platform.OS === 'ios') {
        // iOS: 匯出到 Documents 目錄
        targetDir = RNFS.DocumentDirectoryPath;
      } else {
        // Android: 匯出到 Downloads 目錄
        targetDir = RNFS.DownloadDirectoryPath;
      }

      const targetPath = `${targetDir}/${filename}`;
      const finalPath = await this.ensureUniqueFilename(targetPath);
      
      await this.copyFile(filePath, finalPath);
      return finalPath;
    } catch (error) {
      console.error('Failed to export file:', error);
      throw error;
    }
  }

  // 清理過期檔案
  public async cleanupOldFiles(daysOld: number = 30): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const allMetadata = await this.getAllFileMetadata();
      let deletedCount = 0;

      for (const metadata of allMetadata) {
        if (metadata.createdAt < cutoffDate) {
          try {
            await this.deleteFile(metadata.originalPath);
            await this.deleteFileMetadata(metadata.id);
            
            // 刪除縮圖
            if (metadata.thumbnail) {
              await this.deleteFile(metadata.thumbnail);
            }
            
            deletedCount++;
          } catch (error) {
            console.error(`Failed to delete old file ${metadata.originalPath}:`, error);
          }
        }
      }

      console.log(`Cleaned up ${deletedCount} old files`);
      return deletedCount;
    } catch (error) {
      console.error('Failed to cleanup old files:', error);
      return 0;
    }
  }

  // 獲取模型檔案路徑
  public getModelPath(modelId: string): string {
    return `${this.getModelsDirectory()}/${modelId}.model`;
  }

  // 檢查模型是否存在
  public async hasModel(modelId: string): Promise<boolean> {
    const modelPath = this.getModelPath(modelId);
    return await RNFS.exists(modelPath);
  }

  // 格式化檔案大小
  public formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // 檢查存儲空間是否充足
  public async hasEnoughSpace(requiredBytes: number): Promise<boolean> {
    try {
      const storageInfo = await this.getStorageInfo();
      return storageInfo.freeSpace >= requiredBytes;
    } catch (error) {
      console.error('Failed to check available space:', error);
      return false;
    }
  }

  // 顯示存儲空間警告
  public async checkStorageAndWarn(requiredBytes: number = 100 * 1024 * 1024): Promise<boolean> {
    const hasSpace = await this.hasEnoughSpace(requiredBytes);
    
    if (!hasSpace) {
      Alert.alert(
        '存儲空間不足',
        '裝置存儲空間不足，可能會影響錄製功能。請清理一些檔案釋放空間。',
        [
          {text: '稍後處理', style: 'cancel'},
          {text: '清理檔案', onPress: () => this.showCleanupOptions()},
        ]
      );
    }

    return hasSpace;
  }

  private showCleanupOptions(): void {
    Alert.alert(
      '清理選項',
      '請選擇清理方式：',
      [
        {text: '取消', style: 'cancel'},
        {
          text: '刪除30天前的檔案',
          onPress: () => this.cleanupOldFiles(30),
        },
        {
          text: '刪除7天前的檔案',
          onPress: () => this.cleanupOldFiles(7),
        },
      ]
    );
  }
}

export default StorageService;