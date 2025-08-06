import {Platform, Alert} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';

export interface PermissionStatus {
  camera: boolean;
  microphone: boolean;
  storage: boolean;
}

class PermissionService {
  private static instance: PermissionService;

  public static getInstance(): PermissionService {
    if (!PermissionService.instance) {
      PermissionService.instance = new PermissionService();
    }
    return PermissionService.instance;
  }

  private getPermissions(): {
    camera: any;
    microphone: any;
    storage: any;
  } {
    if (Platform.OS === 'web') {
      return {
        camera: 'camera',
        microphone: 'microphone',
        storage: 'storage',
      };
    }
    
    if (!permissionsModule) return { camera: null, microphone: null, storage: null };
    
    const { PERMISSIONS } = permissionsModule;
    if (Platform.OS === 'ios') {
      return {
        camera: PERMISSIONS.IOS.CAMERA,
        microphone: PERMISSIONS.IOS.MICROPHONE,
        storage: PERMISSIONS.IOS.PHOTO_LIBRARY,
      };
    } else {
      return {
        camera: PERMISSIONS.ANDROID.CAMERA,
        microphone: PERMISSIONS.ANDROID.RECORD_AUDIO,
        storage: PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      };
    }
  }

  public async checkAllPermissions(): Promise<PermissionStatus> {
    try {
      const [cameraStatus, audioStatus, mediaStatus] = await Promise.all([
        Camera.getCameraPermissionsAsync(),
        Audio.getPermissionsAsync(),
        MediaLibrary.getPermissionsAsync(),
      ]);

      return {
        camera: cameraStatus.status === 'granted',
        microphone: audioStatus.status === 'granted',
        storage: mediaStatus.status === 'granted',
      };
    } catch (error) {
      console.error('Error checking permissions:', error);
      return {
        camera: false,
        microphone: false,
        storage: false,
      };
    }
  }

  public async requestAllPermissions(): Promise<PermissionStatus> {
    try {
      const [cameraResult, audioResult, mediaResult] = await Promise.all([
        Camera.requestCameraPermissionsAsync(),
        Audio.requestPermissionsAsync(),
        MediaLibrary.requestPermissionsAsync(),
      ]);

      return {
        camera: cameraResult.status === 'granted',
        microphone: audioResult.status === 'granted',
        storage: mediaResult.status === 'granted',
      };
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return {
        camera: false,
        microphone: false,
        storage: false,
      };
    }
  }

  private async requestPermissionsSequentially(permissions: {
    camera: any;
    microphone: any;
    storage: any;
  }) {
    if (!permissionsModule) return { camera: 'denied', microphone: 'denied', storage: 'denied' };
    
    const { check, RESULTS } = permissionsModule;
    const results: any = {};

    // 請求攝影機權限
    if (await check(permissions.camera) !== RESULTS.GRANTED) {
      results.camera = await this.requestWithDialog(
        permissions.camera,
        '攝影機權限',
        '此應用需要使用攝影機進行畫面偵測和錄影功能'
      );
    } else {
      results.camera = RESULTS.GRANTED;
    }

    // 請求麥克風權限
    if (await check(permissions.microphone) !== RESULTS.GRANTED) {
      results.microphone = await this.requestWithDialog(
        permissions.microphone,
        '麥克風權限',
        '此應用需要使用麥克風進行聲音偵測和錄音功能'
      );
    } else {
      results.microphone = RESULTS.GRANTED;
    }

    // 請求儲存權限
    if (await check(permissions.storage) !== RESULTS.GRANTED) {
      results.storage = await this.requestWithDialog(
        permissions.storage,
        '儲存權限',
        '此應用需要儲存權限來保存錄製的檔案'
      );
    } else {
      results.storage = RESULTS.GRANTED;
    }

    return results;
  }

  private async requestWithDialog(
    permission: any,
    title: string,
    message: string
  ): Promise<string> {
    if (!permissionsModule) return 'denied';
    
    const { request, RESULTS } = permissionsModule;
    return new Promise((resolve) => {
      Alert.alert(
        title,
        message,
        [
          {
            text: '拒絕',
            style: 'cancel',
            onPress: () => resolve(RESULTS.DENIED),
          },
          {
            text: '允許',
            onPress: async () => {
              const result = await request(permission);
              resolve(result);
            },
          },
        ]
      );
    });
  }

  public async checkCameraPermission(): Promise<boolean> {
    try {
      const status = await Camera.getCameraPermissionsAsync();
      return status.status === 'granted';
    } catch (error) {
      return false;
    }
  }

  public async checkMicrophonePermission(): Promise<boolean> {
    try {
      const status = await Audio.getPermissionsAsync();
      return status.status === 'granted';
    } catch (error) {
      return false;
    }
  }

  public async checkStoragePermission(): Promise<boolean> {
    try {
      const status = await MediaLibrary.getPermissionsAsync();
      return status.status === 'granted';
    } catch (error) {
      return false;
    }
  }

  public showPermissionDeniedAlert(permissionType: string) {
    Alert.alert(
      '權限被拒絕',
      `${permissionType}權限被拒絕，某些功能可能無法正常使用。請前往設定中手動開啟權限。`,
      [
        {text: '確定', style: 'default'},
      ]
    );
  }

  public showPermissionRequiredAlert() {
    Alert.alert(
      '需要權限',
      '此應用需要攝影機、麥克風和儲存權限才能正常運作。請授予必要的權限。',
      [
        {text: '稍後再說', style: 'cancel'},
        {
          text: '設定權限',
          onPress: () => this.requestAllPermissions(),
        },
      ]
    );
  }
}

export default PermissionService;