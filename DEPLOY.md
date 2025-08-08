# 🐳 TCLDCAM Docker 部署狀態

## 最新版本
**v1.1.6** - 2025-08-08 18:15:19

## 部署說明
Docker deployment

## Docker 鏡像
- `tcldcam:v1.1.6`
- `tcldcam:latest`

## 部署URL
- 生產環境: https://tcldcam.onrender.com
- 本地測試: http://localhost:8080
- GitHub: https://github.com/tungchinlee/tcldcam

## 快速啟動
```bash
# 使用Docker Compose
docker-compose up -d

# 或直接運行
docker run -p 8080:8080 tcldcam:v1.1.6
```

## 版本歷史
cb02d05 🐳 Docker Deploy v1.1.5 - Docker deployment
1579641 🐳 Docker Deploy v1.1.4 - Docker deployment
76f6ac4 🐳 Docker Deploy v1.1.3 - Docker deployment
a4da3d5 🐳 Docker Deploy v1.1.2 - Docker deployment
6c7b2aa 🐳 Docker Deploy v1.1.1 - 修復音頻偵測精確度: RMS時域分析, 真實dB轉換, 30dB預設閾值, 實時除錯顯示

## 技術棧
- React Native + Expo
- TypeScript  
- Express.js服務器
- Docker容器化
- 自動化版本管理

## 功能特性
- 聲音偵測與錄製
- 視覺模式偵測
- 檔案管理系統
- AI模型管理
- 響應式Web界面
- Docker部署支持
