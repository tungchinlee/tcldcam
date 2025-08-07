# 🐳 TCLDCAM Docker 部署狀態

## 最新版本
**v1.0.18** - 2025-08-08 00:49:37

## 部署說明
修復聲音偵測: 提高敏感度, 降低閾值, 增加除錯資訊, 優化觸發邏輯

## Docker 鏡像
- `tcldcam:v1.0.18`
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
docker run -p 8080:8080 tcldcam:v1.0.18
```

## 版本歷史
03cc803 🐳 Docker Deploy v1.0.17 - 手機版優化: RWD響應式設計, 觸控優化, iOS/Android適配
43cbd96 🎵 REAL FILE RECORDING - Add actual audio recording with MediaRecorder API, localStorage file management, playback & delete
03bdbb9 💾 LOW RESOURCE MODE - 512MB RAM & 0.1 CPU optimized, lightweight web app, skip all builds
263f285 🚀 INSTANT WEB APP - Add complete static HTML/JS version, skip React Native build entirely
577b5f7 🔧 Simplify metro config - remove problematic cache module dependency

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
