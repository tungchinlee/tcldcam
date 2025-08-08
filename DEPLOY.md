# 🐳 TCLDCAM Docker 部署狀態

## 最新版本
**v1.1.2** - 2025-08-08 11:45:20

## 部署說明
Docker deployment

## Docker 鏡像
- `tcldcam:v1.1.2`
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
docker run -p 8080:8080 tcldcam:v1.1.2
```

## 版本歷史
6c7b2aa 🐳 Docker Deploy v1.1.1 - 修復音頻偵測精確度: RMS時域分析, 真實dB轉換, 30dB預設閾值, 實時除錯顯示
8075a8f 🐳 Docker Deploy v1.1.0 - 聲音觸發錄影功能: 完整視頻錄製, 預覽窗口, 檔案管理, 播放/下載功能
7050908 🐳 Docker Deploy v1.0.18 - 修復聲音偵測: 提高敏感度, 降低閾值, 增加除錯資訊, 優化觸發邏輯
03cc803 🐳 Docker Deploy v1.0.17 - 手機版優化: RWD響應式設計, 觸控優化, iOS/Android適配
43cbd96 🎵 REAL FILE RECORDING - Add actual audio recording with MediaRecorder API, localStorage file management, playback & delete

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
