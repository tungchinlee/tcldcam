#!/usr/bin/env node

// TCLDCAM Render Compatibility - src/index.ts
// Render is looking for /opt/render/project/src/index.ts
// Let's give it what it wants and redirect to our server!

console.log('🎯 TCLDCAM src/index.ts entry point reached!');
console.log('🔄 Redirecting to main server...');

// Load the main server from parent directory
require('../server.js');