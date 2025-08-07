# 🐳 TCLDCAM Docker 部署狀態

## 最新版本
**v1.0.10** - 2025-08-07 13:54:28

## 部署說明
Fix Render auto-detection - remove conflicting entry files and use proper Node.js config

## Docker 鏡像
- `tcldcam:v1.0.10`
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
docker run -p 8080:8080 tcldcam:v1.0.10
```

## 版本歷史
869dd5b 🐳 Docker Deploy v1.0.9 - Fix Render deployment - use Node.js build instead of Docker, include web build step
473e149 🐳 Docker Deploy v1.0.8 - Include server.js in Docker build - remove from dockerignore
372d10f 🔧 Add postinstall script to generate dist folder
9753743 🔧 Fix static file path for Render deployment
e94a2d9 🔧 Create index.ts wrapper for Render compatibility

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
