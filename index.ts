// Render deployment entry point
// This file ensures compatibility with Render's auto-detection
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 TCLDCAM Starting...');
console.log('📍 Current directory:', process.cwd());
console.log('🔧 Node version:', process.version);
console.log('🌍 Environment:', process.env.NODE_ENV);
console.log('🎯 Port:', process.env.PORT);

// Check if dist folder exists, if not, build it
const distPath = path.join(__dirname, 'dist');
console.log('🔍 Checking dist folder at:', distPath);

if (!fs.existsSync(distPath) || !fs.existsSync(path.join(distPath, 'index.html'))) {
  console.log('📦 Building web application...');
  try {
    execSync('npx expo export -p web', { 
      cwd: __dirname, 
      stdio: 'inherit',
      timeout: 300000 // 5 minutes timeout
    });
    console.log('✅ Web build completed successfully');
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
} else {
  console.log('✅ Dist folder already exists');
}

console.log('📦 Loading Express server...');
require('./server.js');