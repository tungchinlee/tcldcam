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
  res.sendFile(path.join(staticPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`TCLDCAM server running on port ${PORT}`);
});