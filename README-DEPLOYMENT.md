# 🚀 TCLDCAM Render 部署指南

## 快速部署步驟

### 1. 初始化Git倉庫
```bash
git init
git add .
git commit -m "Initial commit for TCLDCAM Expo"
```

### 2. 推送到GitHub
```bash
# 創建GitHub倉庫後
git remote add origin https://github.com/yourusername/tcldcam-expo.git
git branch -M main
git push -u origin main
```

### 3. 部署到Render

1. **登入Render**: https://render.com
2. **New Web Service**
3. **Connect GitHub repository**: `tcldcam-expo`
4. **配置設置**:
   - **Name**: `tcldcam-expo`
   - **Environment**: `Node`
   - **Build Command**: `npm ci && npx expo export -p web`
   - **Start Command**: `npx serve dist -l $PORT -s`
   - **Plan**: Free

### 4. 環境變量設置

在Render Dashboard中添加：
```
NODE_VERSION=18
NPM_CONFIG_PRODUCTION=false
```

## 🔧 本地測試

測試生產構建：
```bash
# 構建Web版本
npm run build

# 本地預覽
npm run serve
```

訪問: http://localhost:8080

## 📱 功能測試

部署後測試這些功能：
- ✅ 主頁面加載
- ✅ 導航切換（主頁、設定、檔案、模型）
- ✅ 響應式設計
- ✅ 權限提示（網頁版）

## 🌐 部署後訪問

- **Production URL**: https://tcldcam-expo.onrender.com
- **Dashboard**: https://dashboard.render.com

## 📋 部署檢查清單

- [x] `render.yaml` 配置文件
- [x] 構建腳本設置
- [x] Git倉庫初始化
- [ ] GitHub推送
- [ ] Render連接
- [ ] 生產環境測試

## 🔄 更新部署

推送代碼到main分支會自動觸發重新部署：
```bash
git add .
git commit -m "Update TCLDCAM features"
git push origin main
```

## 🚨 故障排除

### 構建失敗
```bash
# 本地測試構建
npm run build
```

### 服務啟動錯誤
- 檢查 `package.json` 中的 `serve` 腳本
- 確認端口配置正確

### 權限錯誤
- 網頁版使用模擬權限
- 實際功能需要在移動設備上測試