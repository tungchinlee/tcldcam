#!/usr/bin/env node
// 專用的web建構腳本，避免參數解析問題

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Starting web build process...');
console.log('📍 Working directory:', process.cwd());

try {
  // 設定環境變數
  process.env.NODE_ENV = 'production';
  process.env.EXPO_NO_CACHE = 'false';
  
  console.log('📦 Running expo export for web platform...');
  
  // 使用最簡單的命令避免參數問題
  const result = execSync('npx expo export -p web', {
    cwd: process.cwd(),
    stdio: 'pipe',
    encoding: 'utf8',
    timeout: 300000 // 5分鐘超時
  });
  
  console.log('Build output:', result);
  console.log('✅ Web build completed successfully');
  process.exit(0);
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  console.error('Error output:', error.stdout || error.stderr);
  process.exit(1);
}