# 🐳 TCLDCAM Docker 部署指南

## 🚀 快速部署命令

### Docker版本化部署（推薦）
```bash
# 小版本更新 (1.0.1 → 1.0.2)
./docker-deploy.sh patch "修復Docker健康檢查"

# 功能更新 (1.0.1 → 1.1.0)
./docker-deploy.sh minor "新增Docker優化"

# 重大更新 (1.0.1 → 2.0.0)  
./docker-deploy.sh major "Docker生產就緒"
```

### 傳統npm部署
```bash
# 不使用Docker
./deploy.sh patch "傳統部署方式"
```

## 🐳 Docker 特性

### 多階段構建
- **Build階段**: 安裝依賴、構建應用
- **Production階段**: 僅包含生產依賴和構建產物
- **鏡像大小**: 最小化，安全優化

### 安全特性
- ✅ 非root用戶運行
- ✅ 最小權限原則
- ✅ 安全的Alpine Linux基底
- ✅ dumb-init進程管理

### 健康檢查
- ✅ 內建HTTP健康檢查
- ✅ 30秒間隔監控
- ✅ 自動重啟機制
- ✅ 容器狀態監控

## 📦 Docker 命令

### 本地開發
```bash
# 構建鏡像
docker build -t tcldcam:latest .

# 運行容器
docker run -p 8080:8080 tcldcam:latest

# 使用Docker Compose
docker-compose up -d

# 查看日誌
docker-compose logs -f tcldcam
```

### 生產部署
```bash
# 構建並標記版本
docker build -t tcldcam:v1.0.2 .
docker tag tcldcam:v1.0.2 tcldcam:latest

# 推送到Registry（如需要）
docker push your-registry/tcldcam:v1.0.2
```

## ⚙️ Render.com Docker部署

### 自動檢測
Render會自動檢測到Dockerfile並使用Docker部署模式：

```yaml
# render.yaml
services:
  - type: web
    name: tcldcam
    env: docker
    dockerfilePath: ./Dockerfile
```

### 環境變量
- `NODE_ENV=production`
- `PORT=$PORT` (Render自動設置)

## 🔧 故障排除

### 構建失敗
```bash
# 檢查Dockerfile語法
docker build --no-cache -t tcldcam:debug .

# 查看構建過程
docker build --progress=plain -t tcldcam:debug .
```

### 容器運行問題
```bash
# 查看容器日誌
docker logs container-id

# 進入容器調試
docker exec -it container-id /bin/sh

# 檢查健康狀態
docker inspect container-id | grep Health -A 10
```

### 端口問題
```bash
# 檢查端口占用
lsof -i :8080

# 使用不同端口
docker run -p 3000:8080 tcldcam:latest
```

## 📊 性能優化

### 鏡像大小
- ✅ 多階段構建減少體積
- ✅ Alpine Linux輕量基底
- ✅ 清理npm緩存
- ✅ 僅保留生產依賴

### 運行時優化
- ✅ Node.js性能調優
- ✅ 靜態資源緩存
- ✅ 進程信號處理
- ✅ 內存使用監控

## 🌐 部署選項比較

| 特性 | Docker部署 | 傳統部署 |
|------|------------|----------|
| 一致性 | ✅ 完全一致 | ⚠️ 環境差異 |
| 安全性 | ✅ 容器隔離 | ⚠️ 系統級別 |
| 擴展性 | ✅ 容器編排 | ❌ 手動管理 |
| 資源使用 | ✅ 可控制 | ⚠️ 系統共享 |
| 部署速度 | ⚠️ 需構建時間 | ✅ 較快 |
| 維護性 | ✅ 易於管理 | ⚠️ 依賴管理 |

## 💡 最佳實踐

1. **總是使用版本標籤**: 避免使用`latest`在生產環境
2. **定期更新基礎鏡像**: 安全性和性能改進
3. **監控資源使用**: CPU、記憶體、磁碟空間
4. **備份重要數據**: 容器外持久化存儲
5. **使用健康檢查**: 自動故障恢復

## 🎯 推薦工作流

```bash
# 1. 開發階段
npm start                    # 本地開發

# 2. 測試階段  
npm run build               # 構建測試
docker build -t tcldcam:test . # Docker測試

# 3. 部署階段
./docker-deploy.sh patch "功能描述"  # 版本化部署
```