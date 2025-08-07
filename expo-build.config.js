// 快速建構配置
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// 極速建構模式
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    mangle: false,
    compress: false, // 跳過壓縮
  },
};

// 跳過不必要的步驟
config.resolver = {
  ...config.resolver,
  sourceExts: ['js', 'jsx', 'ts', 'tsx'], // 只處理必要檔案
};

// 關閉額外處理
config.serializer = {
  ...config.serializer,
  createModuleIdFactory: () => (path) => path, // 簡化模組ID
};

module.exports = config;