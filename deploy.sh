#!/bin/bash

# TCLDCAM 自動化版本部署腳本
# 使用方法: ./deploy.sh [patch|minor|major] "部署說明"

set -e

VERSION_TYPE=${1:-patch}
DEPLOY_MESSAGE=${2:-"Auto deployment"}
CURRENT_VERSION=$(node -p "require('./package.json').version")

echo "🚀 TCLDCAM 版本化部署開始..."
echo "📦 當前版本: v$CURRENT_VERSION"
echo "⬆️  版本類型: $VERSION_TYPE"
echo "💬 部署說明: $DEPLOY_MESSAGE"
echo ""

# 1. 更新版本號
echo "🔢 更新版本號..."
npm version $VERSION_TYPE --no-git-tag-version
NEW_VERSION=$(node -p "require('./package.json').version")
echo "✅ 新版本: v$NEW_VERSION"

# 2. 構建生產版本
echo "📦 構建生產版本..."
npm run build

# 3. 更新版本信息文件
echo "📝 更新部署信息..."
cat > DEPLOY.md << EOF
# 🚀 TCLDCAM 部署狀態

## 最新版本
**v$NEW_VERSION** - $(date '+%Y-%m-%d %H:%M:%S')

## 部署說明
$DEPLOY_MESSAGE

## 部署URL
- 生產環境: https://tcldcam.onrender.com
- GitHub: https://github.com/tungchinlee/tcldcam

## 版本歷史
$(git log --oneline -5)

## 技術棧
- React Native + Expo
- TypeScript
- Express.js服務器
- 自動化版本管理

## 功能特性
- 聲音偵測與錄製
- 視覺模式偵測
- 檔案管理系統
- AI模型管理
- 響應式Web界面
EOF

# 4. 提交並推送
echo "📤 提交並推送到GitHub..."
git add .
git commit -m "🚀 Deploy v$NEW_VERSION - $DEPLOY_MESSAGE

📦 Version: v$CURRENT_VERSION → v$NEW_VERSION
📅 Date: $(date '+%Y-%m-%d %H:%M:%S')
💬 Message: $DEPLOY_MESSAGE
🔧 Build: Production optimized
🌐 URL: https://tcldcam.onrender.com

✨ Features updated:
- Sound detection & recording
- Visual pattern detection  
- File management
- Model management
- Responsive web interface"

git push origin main

echo ""
echo "🎉 部署完成！"
echo "🌐 訪問: https://tcldcam.onrender.com"
echo "📱 版本: v$NEW_VERSION"
echo "⏰ 預計5-10分鐘後生效"