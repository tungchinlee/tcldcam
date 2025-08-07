const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// 簡化配置 - 只保留基本最佳化
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    mangle: false,
  },
};

// 使用所有CPU核心
config.maxWorkers = require('os').cpus().length;

module.exports = config;