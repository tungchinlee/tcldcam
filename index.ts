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

if (!fs.existsSync(distPath) || !fs.existsSync(path.join(distPath, 'index.html'))) {
  console.log('📦 Building web application in background...');
  
  // Start server first to avoid timeout
  console.log('🚀 Starting server immediately to avoid timeout...');
  require('./server.js');
  
  // Build in background
  const buildProcess = spawn('npx', ['expo', 'export', '-p', 'web'], {
    cwd: __dirname,
    stdio: 'pipe'
  });
  
  buildProcess.stdout.on('data', (data) => {
    console.log(`Build: ${data}`);
  });
  
  buildProcess.stderr.on('data', (data) => {
    console.error(`Build Error: ${data}`);
  });
  
  buildProcess.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Web build completed successfully');
    } else {
      console.error('❌ Build failed with code:', code);
    }
  });
  
} else {
  console.log('✅ Dist folder already exists');
  console.log('📦 Loading Express server...');
  require('./server.js');
}