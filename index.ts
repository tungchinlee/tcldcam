#!/usr/bin/env node

// TCLDCAM Render Compatibility Wrapper
// Since Render insists on running 'node index.ts', we'll give it what it wants!

console.log('🚀 TCLDCAM Starting via index.ts wrapper...');
console.log('📍 Current directory:', process.cwd());
console.log('🔧 Node version:', process.version);
console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
console.log('🎯 Port:', process.env.PORT || 8080);

// Import and execute the main server
console.log('📦 Loading Express server...');
require('./server.js');