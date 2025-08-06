#!/usr/bin/env node

// TCLDCAM Production Start Script
// This ensures Render uses the correct server startup

console.log('🚀 Starting TCLDCAM Production Server...');
console.log('📁 Working Directory:', process.cwd());
console.log('🔧 Node Version:', process.version);
console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
console.log('🎯 Port:', process.env.PORT || 8080);

// Import and start the Express server
require('./server.js');