# 📦 TCLDCAM 版本管理指南

## 🚀 快速部署命令

### 方法1：使用部署腳本（推薦）
```bash
# 小版本更新 (1.0.0 → 1.0.1)
./deploy.sh patch "修復聲音偵測bug"

# 功能更新 (1.0.0 → 1.1.0) 
./deploy.sh minor "新增視覺偵測功能"

# 重大更新 (1.0.0 → 2.0.0)
./deploy.sh major "全新UI設計"
```

### 方法2：使用npm腳本
```bash
# 小版本部署
npm run deploy:patch

# 中版本部署  
npm run deploy:minor

# 大版本部署
npm run deploy:major
```

### 方法3：手動版本管理
```bash
# 1. 更新版本
npm run version:patch  # 或 version:minor, version:major

# 2. 構建
npm run build

# 3. 提交部署
git add .
git commit -m "🚀 Deploy v$(node -p "require('./package.json').version")"
git push origin main
```

## 📋 版本號規則

### Semantic Versioning (語義化版本)
- **MAJOR** (主版本): 重大功能變更，不向後兼容
  - 例: 1.0.0 → 2.0.0
  - 使用: 完全重構、API大改
  
- **MINOR** (次版本): 新功能，向後兼容
  - 例: 1.0.0 → 1.1.0  
  - 使用: 新增功能、介面改進
  
- **PATCH** (修訂版): 錯誤修復，向後兼容
  - 例: 1.0.0 → 1.0.1
  - 使用: bug修復、小改進

## 🔄 自動化流程

每次部署會自動：
1. ⬆️  **更新版本號**
2. 📦 **構建生產版本**
3. 📝 **更新DEPLOY.md文件**
4. 📤 **提交到GitHub**
5. 🚀 **觸發Render自動部署**

## 📊 部署記錄

所有部署都會記錄在：
- `DEPLOY.md` - 最新部署狀態
- Git commit messages - 詳細變更記錄
- `package.json` - 當前版本號

## 🌐 部署URL

- **生產環境**: https://tcldcam.onrender.com
- **GitHub倉庫**: https://github.com/tungchinlee/tcldcam

## 💡 最佳實踐

1. **小改動使用patch**: bug修復、文字調整
2. **新功能使用minor**: 新增頁面、功能改進  
3. **重大更新使用major**: 架構變更、設計重構
4. **總是寫清楚的部署說明**
5. **部署前先本地測試**: `npm run build && npm run serve`

## ⚡ 快速範例

```bash
# 修復bug
./deploy.sh patch "修復錄音權限問題"

# 新功能
./deploy.sh minor "新增檔案分享功能"

# 重大更新
./deploy.sh major "升級到React Native 0.75"
```