# 🐳 TCLDCAM Docker 部署狀態

## 最新版本
**v1.0.14** - 2025-08-07 18:22:00

## 部署說明
Fix web compatibility - add AudioRecorderPlayer and RNFS mocks for web platform

## Docker 鏡像
- `tcldcam:v1.0.14`
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
docker run -p 8080:8080 tcldcam:v1.0.14
```

## 版本歷史
bc5d9ea 🚀 Deploy v1.0.13 - Fix Render timeout with background build and loading page
802a2b9 🐳 Docker Deploy v1.0.12 - Fix Render build issue - auto-build web app in index.ts if dist missing
bde7896 🐳 Docker Deploy v1.0.11 - Add missing index.ts and comprehensive README.md for Render compatibility
ec73e03 🐳 Docker Deploy v1.0.10 - Fix Render auto-detection - remove conflicting entry files and use proper Node.js config
869dd5b 🐳 Docker Deploy v1.0.9 - Fix Render deployment - use Node.js build instead of Docker, include web build step

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
