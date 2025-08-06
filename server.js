const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

// 靜態文件服務
app.use(express.static(path.join(__dirname, 'dist')));

// SPA路由處理 - 所有路由都返回index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`TCLDCAM server running on port ${PORT}`);
});