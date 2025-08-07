const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

// 靜態文件服務 - 處理Render路徑問題
const distPath = path.join(__dirname, 'dist');
const distPathParent = path.join(__dirname, '../dist');

// 嘗試當前目錄的dist，如果不存在則嘗試父目錄
const fs = require('fs');
let staticPath = distPath;
if (!fs.existsSync(distPath) && fs.existsSync(distPathParent)) {
  staticPath = distPathParent;
  console.log('📁 Using dist from parent directory:', distPathParent);
} else {
  console.log('📁 Using dist from current directory:', distPath);
}

app.use(express.static(staticPath));

// SPA路由處理 - 所有路由都返回index.html
app.get('*', (req, res) => {
  const indexPath = path.join(staticPath, 'index.html');
  
  // 檢查index.html是否存在
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    // 提供臨時載入頁面
    res.send(`
      <!DOCTYPE html>
      <html lang="zh-TW">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>🎥 TCLDCAM - 智能聲音與視覺偵測</title>
          <style>
              body { 
                  margin: 0; 
                  padding: 40px; 
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: white;
                  min-height: 100vh;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  text-align: center;
              }
              .container { max-width: 600px; }
              .logo { font-size: 4em; margin-bottom: 20px; }
              h1 { font-size: 2.5em; margin-bottom: 20px; }
              .description { font-size: 1.2em; margin-bottom: 30px; opacity: 0.9; }
              .loading { 
                  display: inline-block; 
                  width: 40px; 
                  height: 40px; 
                  border: 3px solid rgba(255,255,255,.3);
                  border-radius: 50%;
                  border-top-color: white;
                  animation: spin 1s ease-in-out infinite;
                  margin: 20px 0;
              }
              @keyframes spin { to { transform: rotate(360deg); } }
              .status { font-size: 1.1em; margin-top: 20px; }
              .features { text-align: left; margin: 30px 0; }
              .feature { margin: 10px 0; }
              .version { opacity: 0.7; font-size: 0.9em; margin-top: 20px; }
          </style>
          <script>
              setTimeout(() => window.location.reload(), 10000); // 10秒後自動重新載入
          </script>
      </head>
      <body>
          <div class="container">
              <div class="logo">🎥</div>
              <h1>TCLDCAM</h1>
              <div class="description">智能聲音與視覺偵測應用程式</div>
              
              <div class="features">
                  <div class="feature">🎵 聲音偵測 - 智能識別特定聲音模式</div>
                  <div class="feature">👁️ 視覺偵測 - AI驅動的畫面分析</div>
                  <div class="feature">📹 自動錄製 - 偵測到目標時自動錄音錄影</div>
                  <div class="feature">🤖 AI模型 - 雲端更新與本地緩存</div>
              </div>
              
              <div class="loading"></div>
              <div class="status">🚀 應用程式正在建構中...</div>
              <div class="status">📦 Metro bundler 正在編譯 React Native 模組</div>
              <div class="status">⏳ 預計需要 2-3 分鐘完成</div>
              
              <div class="version">版本 v1.0.12 | 自動重新載入中...</div>
          </div>
      </body>
      </html>
    `);
  }
});

app.listen(PORT, () => {
  console.log(`TCLDCAM server running on port ${PORT}`);
});