import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import StorageService from './StorageService';

export interface ModelInfo {
  id: string;
  name: string;
  version: string;
  size: number;
  lastUpdate: Date;
  isLocal: boolean;
  type: 'sound' | 'visual';
  downloadUrl?: string;
  checksum?: string;
  description?: string;
}

export interface UpdateProgress {
  modelId: string;
  progress: number; // 0-100
  status: 'downloading' | 'installing' | 'completed' | 'failed';
  error?: string;
}

export interface FeatureDatabase {
  id: string;
  type: 'sound' | 'visual';
  version: string;
  features: any[];
  size: number;
  lastUpdate: Date;
  isCompressed: boolean;
}

class ModelUpdateService {
  private static instance: ModelUpdateService;
  private readonly MODELS_KEY = 'tcldcam_models';
  private readonly FEATURES_KEY = 'tcldcam_features';
  private readonly UPDATE_CHECK_INTERVAL = 24 * 60 * 60 * 1000; // 24小時
  private storageService: StorageService;
  private updateListeners: ((progress: UpdateProgress) => void)[] = [];

  private constructor() {
    this.storageService = StorageService.getInstance();
  }

  public static getInstance(): ModelUpdateService {
    if (!ModelUpdateService.instance) {
      ModelUpdateService.instance = new ModelUpdateService();
    }
    return ModelUpdateService.instance;
  }

  public addEventListener(listener: (progress: UpdateProgress) => void): void {
    this.updateListeners.push(listener);
  }

  public removeEventListener(listener: (progress: UpdateProgress) => void): void {
    const index = this.updateListeners.indexOf(listener);
    if (index > -1) {
      this.updateListeners.splice(index, 1);
    }
  }

  private emitProgress(progress: UpdateProgress): void {
    this.updateListeners.forEach(listener => listener(progress));
  }

  // 獲取所有模型資訊
  public async getAllModels(): Promise<ModelInfo[]> {
    try {
      const modelsJson = await AsyncStorage.getItem(this.MODELS_KEY);
      if (!modelsJson) {
        return this.getDefaultModels();
      }
      
      const models = JSON.parse(modelsJson);
      return models.map((m: any) => ({
        ...m,
        lastUpdate: new Date(m.lastUpdate),
      }));
    } catch (error) {
      console.error('Failed to get models:', error);
      return this.getDefaultModels();
    }
  }

  private getDefaultModels(): ModelInfo[] {
    return [
      {
        id: 'sound-detection-v2',
        name: '聲音偵測模型 v2.0',
        version: '2.0.1',
        size: 45.2 * 1024 * 1024,
        lastUpdate: new Date('2025-08-01'),
        isLocal: false,
        type: 'sound',
        downloadUrl: 'https://api.tcldcam.com/models/sound-detection-v2.model',
        description: '基礎聲音識別和偵測模型',
      },
      {
        id: 'visual-detection-v3',
        name: '視覺偵測模型 v3.1',
        version: '3.1.0',
        size: 128.7 * 1024 * 1024,
        lastUpdate: new Date('2025-07-28'),
        isLocal: false,
        type: 'visual',
        downloadUrl: 'https://api.tcldcam.com/models/visual-detection-v3.model',
        description: '物體識別和動作偵測模型',
      },
    ];
  }

  // 檢查模型更新
  public async checkForUpdates(): Promise<ModelInfo[]> {
    try {
      // 模擬API呼叫檢查更新
      const availableModels = await this.fetchAvailableModels();
      const localModels = await this.getAllModels();
      
      const updates: ModelInfo[] = [];
      
      for (const availableModel of availableModels) {
        const localModel = localModels.find(m => m.id === availableModel.id);
        
        if (!localModel || this.isNewerVersion(availableModel.version, localModel.version)) {
          updates.push(availableModel);
        }
      }

      return updates;
    } catch (error) {
      console.error('Failed to check for updates:', error);
      return [];
    }
  }

  private async fetchAvailableModels(): Promise<ModelInfo[]> {
    // 模擬從伺服器獲取可用模型
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'sound-detection-v3',
            name: '聲音偵測模型 v3.0 (Beta)',
            version: '3.0.0-beta.1',
            size: 52.1 * 1024 * 1024,
            lastUpdate: new Date('2025-08-05'),
            isLocal: false,
            type: 'sound',
            downloadUrl: 'https://api.tcldcam.com/models/sound-detection-v3.model',
            description: '最新的聲音偵測模型，支持更多音頻類型',
          },
          {
            id: 'visual-detection-v4',
            name: '視覺偵測模型 v4.0 (Beta)',
            version: '4.0.0-beta.2',
            size: 156.3 * 1024 * 1024,
            lastUpdate: new Date('2025-08-04'),
            isLocal: false,
            type: 'visual',
            downloadUrl: 'https://api.tcldcam.com/models/visual-detection-v4.model',
            description: '增強的視覺偵測，支持更精確的物體識別',
          },
        ]);
      }, 1000);
    });
  }

  private isNewerVersion(newVersion: string, currentVersion: string): boolean {
    // 簡單的版本比較邏輯
    const parseVersion = (version: string) => {
      return version.split('.').map(part => {
        const num = parseInt(part.replace(/[^\d]/g, ''), 10);
        return isNaN(num) ? 0 : num;
      });
    };

    const newParts = parseVersion(newVersion);
    const currentParts = parseVersion(currentVersion);
    
    for (let i = 0; i < Math.max(newParts.length, currentParts.length); i++) {
      const newPart = newParts[i] || 0;
      const currentPart = currentParts[i] || 0;
      
      if (newPart > currentPart) return true;
      if (newPart < currentPart) return false;
    }
    
    return false;
  }

  // 下載模型
  public async downloadModel(model: ModelInfo): Promise<boolean> {
    try {
      this.emitProgress({
        modelId: model.id,
        progress: 0,
        status: 'downloading',
      });

      // 檢查存儲空間
      const hasSpace = await this.storageService.hasEnoughSpace(model.size);
      if (!hasSpace) {
        throw new Error('存儲空間不足');
      }

      const modelPath = this.storageService.getModelPath(model.id);
      
      // 模擬下載過程
      await this.simulateDownload(model, modelPath);

      // 更新模型資訊
      await this.updateLocalModelInfo(model);

      this.emitProgress({
        modelId: model.id,
        progress: 100,
        status: 'completed',
      });

      console.log(`Model downloaded: ${model.id}`);
      return true;

    } catch (error) {
      console.error(`Failed to download model ${model.id}:`, error);
      this.emitProgress({
        modelId: model.id,
        progress: 0,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  }

  private async simulateDownload(model: ModelInfo, targetPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15 + 5; // 5-20% 每次
        progress = Math.min(progress, 95);

        this.emitProgress({
          modelId: model.id,
          progress: Math.round(progress),
          status: 'downloading',
        });

        if (progress >= 95) {
          clearInterval(interval);
          
          // 模擬寫入檔案
          setTimeout(async () => {
            try {
              // 建立空檔案作為模型檔案
              await RNFS.writeFile(targetPath, 'mock_model_data', 'utf8');
              resolve();
            } catch (error) {
              reject(error);
            }
          }, 500);
        }
      }, 200);

      // 模擬可能的下載失敗
      setTimeout(() => {
        if (Math.random() < 0.05) { // 5% 失敗率
          clearInterval(interval);
          reject(new Error('網路連線錯誤'));
        }
      }, 2000);
    });
  }

  private async updateLocalModelInfo(model: ModelInfo): Promise<void> {
    try {
      const models = await this.getAllModels();
      const updatedModels = models.filter(m => m.id !== model.id);
      updatedModels.push({
        ...model,
        isLocal: true,
        lastUpdate: new Date(),
      });

      await AsyncStorage.setItem(this.MODELS_KEY, JSON.stringify(updatedModels));
    } catch (error) {
      console.error('Failed to update local model info:', error);
      throw error;
    }
  }

  // 刪除模型
  public async deleteModel(modelId: string): Promise<boolean> {
    try {
      const modelPath = this.storageService.getModelPath(modelId);
      
      if (await RNFS.exists(modelPath)) {
        await RNFS.unlink(modelPath);
      }

      // 更新模型狀態
      const models = await this.getAllModels();
      const updatedModels = models.map(m => 
        m.id === modelId ? {...m, isLocal: false} : m
      );

      await AsyncStorage.setItem(this.MODELS_KEY, JSON.stringify(updatedModels));
      
      console.log(`Model deleted: ${modelId}`);
      return true;
    } catch (error) {
      console.error(`Failed to delete model ${modelId}:`, error);
      return false;
    }
  }

  // 特徵資料庫管理
  public async getFeatureDatabase(type: 'sound' | 'visual'): Promise<FeatureDatabase | null> {
    try {
      const featuresJson = await AsyncStorage.getItem(`${this.FEATURES_KEY}_${type}`);
      if (!featuresJson) {
        return null;
      }

      const features = JSON.parse(featuresJson);
      return {
        ...features,
        lastUpdate: new Date(features.lastUpdate),
      };
    } catch (error) {
      console.error(`Failed to get feature database for ${type}:`, error);
      return null;
    }
  }

  public async updateFeatureDatabase(database: FeatureDatabase): Promise<boolean> {
    try {
      await AsyncStorage.setItem(
        `${this.FEATURES_KEY}_${database.type}`,
        JSON.stringify(database)
      );
      
      console.log(`Feature database updated: ${database.type}`);
      return true;
    } catch (error) {
      console.error(`Failed to update feature database ${database.type}:`, error);
      return false;
    }
  }

  // 壓縮特徵資料
  public compressFeatures(features: any[]): any[] {
    // 簡單的特徵壓縮邏輯
    return features.map(feature => {
      if (Array.isArray(feature)) {
        // 數值陣列壓縮：保留重要特徵
        return feature.filter((_, index) => index % 2 === 0);
      }
      return feature;
    });
  }

  // 自動更新檢查
  public async scheduleAutoUpdates(): Promise<void> {
    const lastCheck = await AsyncStorage.getItem('last_update_check');
    const now = Date.now();
    
    if (!lastCheck || now - parseInt(lastCheck) > this.UPDATE_CHECK_INTERVAL) {
      try {
        const updates = await this.checkForUpdates();
        if (updates.length > 0) {
          console.log(`Found ${updates.length} model updates`);
          // 可以選擇自動下載或提醒使用者
        }
        
        await AsyncStorage.setItem('last_update_check', now.toString());
      } catch (error) {
        console.error('Auto update check failed:', error);
      }
    }
  }

  // 獲取模型統計資訊
  public async getModelStats(): Promise<{
    totalModels: number;
    installedModels: number;
    totalSize: number;
    lastUpdate: Date | null;
  }> {
    try {
      const models = await this.getAllModels();
      const installedModels = models.filter(m => m.isLocal);
      const totalSize = installedModels.reduce((sum, m) => sum + m.size, 0);
      
      const lastUpdate = installedModels.length > 0 
        ? new Date(Math.max(...installedModels.map(m => m.lastUpdate.getTime())))
        : null;

      return {
        totalModels: models.length,
        installedModels: installedModels.length,
        totalSize,
        lastUpdate,
      };
    } catch (error) {
      console.error('Failed to get model stats:', error);
      return {
        totalModels: 0,
        installedModels: 0,
        totalSize: 0,
        lastUpdate: null,
      };
    }
  }
}

export default ModelUpdateService;