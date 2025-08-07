// Render deployment entry point
// This file ensures compatibility with Render's auto-detection
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 TCLDCAM Starting...');
console.log('📍 Current directory:', process.cwd());
console.log('🔧 Node version:', process.version);
console.log('🌍 Environment:', process.env.NODE_ENV);
console.log('🎯 Port:', process.env.PORT);

// Check if dist folder exists
const distPath = path.join(__dirname, 'dist');
console.log('🔍 Checking dist folder at:', distPath);

// 低資源模式 - 跳過React Native建構以節省RAM和CPU
console.log('💾 低資源模式啟動 (512MB RAM, 0.1 CPU)');
console.log('⚡ 使用即時靜態Web應用，跳過建構過程');
console.log('📦 Loading Express server...');
require('./server.js');