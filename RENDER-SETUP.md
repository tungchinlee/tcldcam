# 🚀 Render 手動部署指南

## 步驟1：檢查GitHub倉庫
✅ 確認倉庫已更新：https://github.com/tungchinlee/tcldcam
- 最新commit：Docker Deploy v1.0.3
- render.yaml 已配置
- Dockerfile 已準備

## 步驟2：創建Render服務

### 前往Render Dashboard
1. 打開：https://dashboard.render.com
2. 登入你的帳號

### 創建新的Web服務
1. 點擊 **"New +"** 按鈕
2. 選擇 **"Web Service"**
3. 點擊 **"Build and deploy from a Git repository"**

### 連接GitHub倉庫
1. 選擇 **"Connect GitHub"**（如果尚未連接）
2. 在搜索框中輸入：**`tcldcam`**
3. 點擊 **"Connect"** 連接 `tungchinlee/tcldcam` 倉庫

### 配置服務設置
```
Name: tcldcam
Environment: Docker
Region: Oregon (US West)
Branch: main
Root Directory: 留空

Build Command: 留空 (使用Dockerfile)
Start Command: 留空 (使用Dockerfile)

Plan: Free
```

### 高級設置（展開）
```
Dockerfile Path: ./Dockerfile
Environment Variables:
- NODE_ENV = production
- PORT = $PORT (Render自動設置)
```

### 健康檢查
```
Health Check Path: /
```

## 步驟3：開始部署
1. 點擊 **"Create Web Service"**
2. Render開始構建Docker鏡像
3. 等待部署完成（約10-15分鐘）

## 步驟4：監控部署
在Render Dashboard中查看：
- 📊 **Build logs** - Docker構建過程
- 🔄 **Deploy logs** - 容器啟動過程
- 📈 **Service logs** - 應用運行日誌

## 預期結果

### 成功標誌
- ✅ Status: **"Live"** (綠色)
- ✅ URL: **https://tcldcam.onrender.com**
- ✅ Health check: **Passing**

### 部署時間線
```
⏰ 0-5分鐘：Clone repository
⏰ 5-10分鐘：Docker build
⏰ 10-15分鐘：Container deploy
⏰ 15分鐘後：Service live
```

## 常見問題解決

### 問題1：找不到倉庫
- 確認倉庫是public
- 重新授權GitHub連接

### 問題2：Docker構建失敗
- 檢查Dockerfile語法
- 查看Build logs錯誤信息

### 問題3：服務無法啟動
- 確認PORT環境變量
- 檢查健康檢查路徑

## 備用方案

如果Docker部署有問題，可以切換回Node.js模式：

### 更新render.yaml
```yaml
services:
  - type: web
    name: tcldcam
    env: node
    buildCommand: npm ci && npx expo export -p web
    startCommand: node server.js
    region: oregon
    plan: free
    healthCheckPath: /
    envVars:
      - key: NODE_VERSION
        value: 18
```

然後推送更新：
```bash
git add render.yaml
git commit -m "Switch to Node.js deployment"
git push origin main
```

## 🎯 下一步

部署成功後：
1. 訪問 https://tcldcam.onrender.com
2. 測試TCLDCAM所有功能
3. 確認響應式界面工作正常