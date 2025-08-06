import {useState, useEffect} from 'react';
import {Platform} from 'react-native';
import {PermissionStatus} from '../services/PermissionService';

// Dynamic import based on platform
let PermissionService: any;
if (Platform.OS === 'web') {
  PermissionService = require('../services/WebPermissionService').default;
} else {
  PermissionService = require('../services/PermissionService').default;
}

interface UsePermissionsReturn {
  permissions: PermissionStatus;
  loading: boolean;
  requestPermissions: () => Promise<void>;
  checkPermissions: () => Promise<void>;
  hasAllPermissions: boolean;
}

export const usePermissions = (): UsePermissionsReturn => {
  const [permissions, setPermissions] = useState<PermissionStatus>({
    camera: false,
    microphone: false,
    storage: false,
  });
  const [loading, setLoading] = useState(true);

  const permissionService = PermissionService.getInstance();

  const checkPermissions = async () => {
    setLoading(true);
    try {
      const status = await permissionService.checkAllPermissions();
      setPermissions(status);
    } catch (error) {
      console.error('Error checking permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const requestPermissions = async () => {
    setLoading(true);
    try {
      const status = await permissionService.requestAllPermissions();
      setPermissions(status);
    } catch (error) {
      console.error('Error requesting permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkPermissions();
  }, []);

  const hasAllPermissions = permissions.camera && permissions.microphone && permissions.storage;

  return {
    permissions,
    loading,
    requestPermissions,
    checkPermissions,
    hasAllPermissions,
  };
};