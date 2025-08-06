# 🚀 手動觸發部署

如果Render沒有自動部署，可以：

## 方法1：創建新commit觸發部署
```bash
# 在當前目錄執行：
echo "# Deploy trigger $(date)" >> DEPLOY.md
git add DEPLOY.md
git commit -m "🚀 Manual deploy trigger $(date)"
git push origin main
```

## 方法2：在Render Dashboard手動部署
1. 前往：https://dashboard.render.com
2. 找到tcldcam服務
3. 點擊 "Manual Deploy" → "Deploy latest commit"

## 方法3：重新創建服務
如果沒有看到tcldcam服務：
1. New Web Service
2. Connect tungchinlee/tcldcam repository
3. 使用以下設置：
   - Build: `npm ci && npx expo export -p web`
   - Start: `node server.js`
   - Node: 18

## 預期結果
✅ 部署成功後訪問：https://tcldcam.onrender.com
✅ 應該看到TCLDCAM應用界面