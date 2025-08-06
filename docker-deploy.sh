#!/bin/bash

# 🐳 TCLDCAM Docker 版本化部署腳本
# 使用方法: ./docker-deploy.sh [patch|minor|major] "部署說明"

set -e

VERSION_TYPE=${1:-patch}
DEPLOY_MESSAGE=${2:-"Docker deployment"}
CURRENT_VERSION=$(node -p "require('./package.json').version")

echo "🐳 TCLDCAM Docker 版本化部署開始..."
echo "📦 當前版本: v$CURRENT_VERSION"
echo "⬆️  版本類型: $VERSION_TYPE"
echo "💬 部署說明: $DEPLOY_MESSAGE"
echo ""

# 1. 更新版本號
echo "🔢 更新版本號..."
npm version $VERSION_TYPE --no-git-tag-version
NEW_VERSION=$(node -p "require('./package.json').version")
echo "✅ 新版本: v$NEW_VERSION"

# 2. 構建Docker鏡像
echo "🔨 構建Docker鏡像..."
docker build -t tcldcam:v$NEW_VERSION .
docker tag tcldcam:v$NEW_VERSION tcldcam:latest

echo "✅ Docker鏡像構建完成:"
echo "   - tcldcam:v$NEW_VERSION"
echo "   - tcldcam:latest"

# 3. 本地測試Docker容器
echo "🧪 本地測試Docker容器..."
docker-compose down --remove-orphans 2>/dev/null || true

export VERSION=$NEW_VERSION
if docker-compose up -d; then
    echo "✅ Docker容器啟動成功"
    echo "🌐 本地測試: http://localhost:8080"
    
    # 等待容器啟動
    sleep 5
    
    # 健康檢查
    if curl -sf http://localhost:8080 > /dev/null 2>&1; then
        echo "✅ 健康檢查通過"
        docker-compose down
    else
        echo "❌ 健康檢查失敗"
        docker-compose logs tcldcam
        docker-compose down
        exit 1
    fi
else
    echo "❌ Docker容器啟動失敗"
    exit 1
fi

# 4. 更新部署文件
echo "📝 更新部署信息..."
cat > DEPLOY.md << EOF
# 🐳 TCLDCAM Docker 部署狀態

## 最新版本
**v$NEW_VERSION** - $(date '+%Y-%m-%d %H:%M:%S')

## 部署說明
$DEPLOY_MESSAGE

## Docker 鏡像
- \`tcldcam:v$NEW_VERSION\`
- \`tcldcam:latest\`

## 部署URL
- 生產環境: https://tcldcam.onrender.com
- 本地測試: http://localhost:8080
- GitHub: https://github.com/tungchinlee/tcldcam

## 快速啟動
\`\`\`bash
# 使用Docker Compose
docker-compose up -d

# 或直接運行
docker run -p 8080:8080 tcldcam:v$NEW_VERSION
\`\`\`

## 版本歷史
$(git log --oneline -5)

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
EOF

# 5. 更新Render配置為Docker
echo "📝 更新Render配置..."
cat > render.yaml << EOF
services:
  - type: web
    name: tcldcam
    env: docker
    dockerfilePath: ./Dockerfile
    region: oregon
    plan: free
    healthCheckPath: /
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: \$PORT
EOF

# 6. 提交並推送
echo "📤 提交並推送到GitHub..."
git add .
git commit -m "🐳 Docker Deploy v$NEW_VERSION - $DEPLOY_MESSAGE

📦 Version: v$CURRENT_VERSION → v$NEW_VERSION
📅 Date: $(date '+%Y-%m-%d %H:%M:%S')
💬 Message: $DEPLOY_MESSAGE
🐳 Docker: Multi-stage optimized build
🔧 Health: Comprehensive health checks
🌐 URL: https://tcldcam.onrender.com

✨ Docker Features:
- Multi-stage build optimization
- Non-root user security
- Health checks included
- Production-ready configuration
- Auto-restart capability

🔧 Technical Updates:
- Sound detection & recording
- Visual pattern detection
- File management system
- AI model management
- Responsive web interface"

git push origin main

echo ""
echo "🎉 Docker部署完成！"
echo "🐳 鏡像版本: v$NEW_VERSION"
echo "🌐 訪問: https://tcldcam.onrender.com"
echo "📱 本地測試: docker-compose up -d"
echo "⏰ 預計5-10分鐘後生效"

# 7. 顯示有用命令
echo ""
echo "🚀 常用命令:"
echo "  docker-compose up -d          # 啟動服務"
echo "  docker-compose down           # 停止服務"
echo "  docker-compose logs tcldcam   # 查看日誌"
echo "  docker images | grep tcldcam  # 查看鏡像"