import {Platform, Alert} from 'react-native';

export interface PermissionStatus {
  camera: boolean;
  microphone: boolean;
  storage: boolean;
}

class WebPermissionService {
  private static instance: WebPermissionService;

  public static getInstance(): WebPermissionService {
    if (!WebPermissionService.instance) {
      WebPermissionService.instance = new WebPermissionService();
    }
    return WebPermissionService.instance;
  }

  public async checkAllPermissions(): Promise<PermissionStatus> {
    return {
      camera: true,
      microphone: true,
      storage: true,
    };
  }

  public async requestAllPermissions(): Promise<PermissionStatus> {
    return {
      camera: true,
      microphone: true,
      storage: true,
    };
  }

  public async checkCameraPermission(): Promise<boolean> {
    return true;
  }

  public async checkMicrophonePermission(): Promise<boolean> {
    return true;
  }

  public async checkStoragePermission(): Promise<boolean> {
    return true;
  }

  public showPermissionDeniedAlert(permissionType: string) {
    Alert.alert(
      '權限提示',
      `在網頁版中，${permissionType}權限由瀏覽器管理。`,
      [
        {text: '確定', style: 'default'},
      ]
    );
  }

  public showPermissionRequiredAlert() {
    Alert.alert(
      '權限提示',
      '在網頁版中測試時，權限由瀏覽器自動管理。',
      [
        {text: '確定', style: 'default'},
      ]
    );
  }
}

export default WebPermissionService;