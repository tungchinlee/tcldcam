# 🐳 TCLDCAM Docker 部署狀態

## 最新版本
**v1.0.4** - 2025-08-07 00:59:21

## 部署說明
Fix Render startup command definitively

## Docker 鏡像
- `tcldcam:v1.0.4`
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
docker run -p 8080:8080 tcldcam:v1.0.4
```

## 版本歷史
7c8bc00 🔧 Fix Render startup command
d610620 🧪 Test automatic Render deployment
d4767c8 🔧 Switch to Node.js deployment for better Render compatibility
f48b68a 🐳 Docker Deploy v1.0.3 - Demonstrate Docker versioning system
ed4d32f 🐳 Docker Deploy v1.0.2 - Add Docker containerization support

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
