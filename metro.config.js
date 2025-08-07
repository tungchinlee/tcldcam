const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// 優化建構速度
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    mangle: false, // 跳過變數名混淆以加速
  },
};

// 快取設置
config.cacheStores = [
  {
    name: 'filesystem',
    get: require('@expo/metro-cache/filesystem'),
  },
];

// 排除不需要的檔案來減少建構時間
config.resolver.blacklistRE = /node_modules\/.*\/(android|ios|__tests__)/;

// 優化平行處理
config.maxWorkers = require('os').cpus().length;

// 簡化輸出來減少I/O時間
config.reporter = {
  update: () => {}, // 跳過進度更新
};

module.exports = config;