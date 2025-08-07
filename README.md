# 🎥 TCLDCAM - 智能聲音與視覺偵測應用程式

一個功能強大的跨平台應用程式，專為自動偵測特定聲音和視覺模式，並觸發錄音錄影功能而設計。

## 🌟 主要功能

### 🎵 聲音偵測
- **即時音頻分析** - 持續監控環境音頻
- **自定義聲音閾值** - 可調整靈敏度設定
- **模式識別** - 智能識別特定聲音模式
- **自動觸發錄音** - 偵測到目標聲音時自動開始錄音

### 👁️ 視覺偵測  
- **即時畫面分析** - 使用攝像頭持續分析視覺內容
- **動態偵測** - 識別畫面中的運動和變化
- **智能模式匹配** - AI驅動的視覺模式識別
- **自動觸發錄影** - 偵測到目標視覺模式時自動錄影

### 🤖 AI模型管理
- **雲端模型更新** - 自動從雲端下載最新AI模型
- **本地模型緩存** - 離線時使用本地存儲的模型
- **模型版本控制** - 智能管理不同版本的偵測模型
- **自動優化** - 根據使用情況優化模型效能

### 📁 檔案管理
- **本地存儲** - 所有錄製檔案存儲在設備本地
- **智能分類** - 按日期和類型自動整理檔案
- **預覽功能** - 內建音頻和視頻播放器
- **存儲空間管理** - 監控和管理存儲空間使用

## 🌐 部署資訊

### 線上版本
- **Web應用**: https://tcldcam.onrender.com
- **當前版本**: v1.0.10
- **部署平台**: Render.com
- **更新頻率**: 自動部署，程式碼推送後5-10分鐘生效

### 本地開發
```bash
# 安裝依賴
npm install

# 啟動開發服務器 (Expo)
npm run dev

# 啟動Web版本
npm run web

# 建構生產版本
npm run build

# 啟動Express服務器
npm start
```

### 移動設備測試
```bash
# iOS模擬器
npm run ios

# Android模擬器  
npm run android

# 或使用Expo Go掃描QR碼
```

## 🏗️ 技術架構

### 前端技術
- **React Native** - 跨平台移動應用框架
- **Expo** - 簡化的React Native開發工具鏈
- **React Navigation** - 導航和路由管理
- **TypeScript** - 類型安全的JavaScript
- **React Native Web** - Web平台支持

### 後端技術
- **Express.js** - Web服務器框架
- **Node.js** - 服務器端JavaScript運行環境
- **靜態檔案服務** - SPA路由支持

### AI與多媒體
- **Expo AV** - 音頻視頻處理
- **Expo Camera** - 攝像頭控制
- **Expo Media Library** - 媒體檔案管理
- **AI模型** - 自定義聲音和視覺識別模型

### 部署與運維
- **Docker** - 容器化部署
- **GitHub Actions** - 自動化CI/CD
- **Render.com** - 雲端部署平台
- **自動版本控制** - 語義化版本管理

## 📱 用戶界面

### 🏠 主頁面 (Home)
- 偵測狀態實時顯示
- 音量等級視覺指示器
- 一鍵開始/停止偵測
- 即時狀態更新和通知

### ⚙️ 設定頁面 (Settings)
- 聲音偵測閾值調整
- 視覺偵測靈敏度設定
- 錄製品質選項 (720p/1080p/4K)
- 自動錄製開關和參數

### 📁 檔案頁面 (Files)  
- 按時間排序的檔案清單
- 內建播放器支援預覽
- 檔案刪除和分享功能
- 存儲空間使用統計

### 🤖 模型頁面 (Models)
- AI模型清單和狀態
- 雲端更新檢查
- 模型下載進度
- 本地緩存管理

## 🛠️ 開發指南

### 專案結構
```
TCLDCAMExpo/
├── src/
│   ├── components/          # 可重用組件
│   │   └── DetectionEngine.tsx
│   ├── screens/             # 頁面組件  
│   │   ├── HomeScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   ├── FilesScreen.tsx
│   │   └── ModelsScreen.tsx
│   ├── services/            # 業務邏輯服務
│   │   ├── SoundDetectionService.ts
│   │   ├── VisualDetectionService.ts
│   │   ├── RecordingService.ts
│   │   ├── ModelUpdateService.ts
│   │   └── StorageService.ts
│   ├── hooks/               # React Hooks
│   │   ├── useSoundDetection.ts
│   │   ├── useVisualDetection.ts
│   │   └── useRecording.ts
│   ├── types/               # TypeScript類型定義
│   └── utils/               # 工具函數
├── assets/                  # 資源檔案
├── dist/                   # Web建構輸出
├── server.js               # Express服務器
├── Dockerfile              # Docker配置
├── docker-compose.yml      # Docker Compose
└── render.yaml             # Render部署配置
```

### 添加新功能
1. **建立對應的Service類** - 在 `src/services/` 中實現業務邏輯
2. **建立React Hook** - 在 `src/hooks/` 中封裝狀態管理
3. **更新UI組件** - 在相應的Screen中添加用戶界面
4. **添加類型定義** - 在 `src/types/` 中定義TypeScript類型
5. **撰寫測試** - 確保功能正常運作

### 版本發布流程
```bash
# 小修復 (v1.0.10 → v1.0.11)
./docker-deploy.sh patch "修復說明"

# 新功能 (v1.0.11 → v1.1.0) 
./docker-deploy.sh minor "功能說明"

# 重大更新 (v1.1.0 → v2.0.0)
./docker-deploy.sh major "更新說明"
```

## 🔧 環境配置

### 開發環境要求
- **Node.js** >= 18.0.0
- **npm** >= 8.0.0
- **Expo CLI** >= 6.0.0
- **Xcode** (iOS開發)
- **Android Studio** (Android開發)

### 環境變數
```bash
NODE_ENV=production          # 生產環境
PORT=8080                   # 服務器端口
EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0  # 開發工具監聽地址
```

### 權限要求
- **攝像頭權限** - 用於視覺偵測和錄影
- **麥克風權限** - 用於聲音偵測和錄音  
- **存儲權限** - 用於檔案保存和管理
- **網路權限** - 用於模型更新和雲端同步

## 🚀 部署選項

### 🌐 Web部署 (當前)
- **平台**: Render.com  
- **URL**: https://tcldcam.onrender.com
- **自動部署**: GitHub推送時觸發
- **建構**: `npm ci && npx expo export -p web`
- **啟動**: `node server.js`

### 📱 移動應用部署

#### iOS App Store
```bash
# 建構iOS應用
npx expo build:ios

# 上傳到App Store Connect
# 使用Xcode或Application Loader
```

#### Google Play Store  
```bash
# 建構Android應用
npx expo build:android

# 簽名並上傳到Google Play Console
```

### 🐳 Docker部署
```bash
# 建構Docker鏡像
docker build -t tcldcam:latest .

# 運行容器
docker-compose up -d

# 查看日誌
docker-compose logs tcldcam
```

## 📊 監控與維護

### 性能監控
- **Render Dashboard** - 服務狀態和資源使用
- **GitHub Actions** - CI/CD管道監控  
- **應用程式日誌** - 錯誤追蹤和調試資訊

### 定期維護任務
- **每週**: 檢查服務運行狀態
- **每月**: 更新npm依賴和安全漏洞修復
- **季度**: AI模型更新和性能優化

### 故障排除
1. **網站無法訪問** - 檢查Render服務狀態
2. **功能異常** - 查看瀏覽器控制台錯誤
3. **性能問題** - 分析網路請求和資源載入
4. **移動設備問題** - 檢查權限設定和兼容性

## 🎯 未來發展規劃

### 短期目標 (1-3個月)
- [ ] **離線模式** - 完全離線時的功能支持
- [ ] **推送通知** - 偵測事件的即時通知
- [ ] **雲端同步** - 檔案和設定的雲端備份
- [ ] **多語言支持** - 國際化和本地化

### 中期目標 (3-6個月)
- [ ] **進階AI模型** - 更精確的聲音和視覺識別
- [ ] **實時串流** - 即時影音串流功能
- [ ] **智能分析** - 自動生成偵測報告和統計
- [ ] **API接口** - 開放API供第三方整合

### 長期目標 (6-12個月)
- [ ] **企業版功能** - 多用戶管理和權限控制  
- [ ] **邊緣AI** - 設備端AI推理優化
- [ ] **AR/VR支持** - 擴增和虛擬實境整合
- [ ] **IoT整合** - 智能家居設備連動

## 📞 技術支持

### 問題回報
- **GitHub Issues**: https://github.com/tungchinlee/tcldcam/issues
- **電子郵件**: 技術支援團隊

### 開發者資源
- **API文檔**: `/docs/api`
- **開發指南**: `/docs/development`  
- **最佳實踐**: `/docs/best-practices`

### 社群支持
- **開發者論壇**: 技術討論和經驗分享
- **社交媒體**: 最新消息和更新通知
- **用戶群組**: 使用教學和問題解答

## 📄 授權資訊

本專案採用 MIT 授權條款，詳見 [LICENSE](LICENSE) 檔案。

---

**TCLDCAM** - 讓AI驅動的聲音與視覺偵測變得簡單而強大 🎯

*最後更新: 2025年8月*
*版本: v1.0.10*