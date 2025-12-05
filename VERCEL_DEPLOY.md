# 🚀 Vercel 部署快速指南

## 📋 部署前準備

### 1. 確保代碼已提交到 GitHub
```bash
git add .
git commit -m "準備部署"
git push origin main
```

### 2. 準備環境變量

**前端需要的環境變量：**
```
VITE_API_URL=https://your-backend-url.com/api
```

**後端需要的環境變量：**
```
PORT=5000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend.vercel.app
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FROM_EMAIL=your-email@gmail.com
```

## 🎯 步驟 1：部署前端到 Vercel

### 方法 A：使用 Vercel 網站（最簡單）

1. **訪問 https://vercel.com 並登入**

2. **點擊 "Add New..." → "Project"**

3. **導入 GitHub 倉庫**
   - 選擇您的倉庫
   - 點擊 "Import"

4. **配置項目設置**
   - **Framework Preset**: 選擇 "Vite"（或保持 "Other"）
   - **Root Directory**: 設置為 `frontend` ⚠️ **重要**
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **添加環境變量**
   - 在 "Environment Variables" 部分
   - 添加 `VITE_API_URL`
   - 值暫時設為 `http://localhost:5000/api`（部署後端後再更新）

6. **點擊 "Deploy"**

### 方法 B：使用 Vercel CLI

```bash
# 安裝 Vercel CLI
npm i -g vercel

# 登入
vercel login

# 進入前端目錄
cd frontend

# 部署
vercel

# 按照提示操作
# 當詢問是否要覆蓋設置時，選擇 No
```

## 🖥️ 步驟 2：部署後端（Railway 推薦）

### 使用 Railway 部署後端

1. **訪問 https://railway.app 並登入（使用 GitHub）**

2. **創建新項目**
   - 點擊 "New Project"
   - 選擇 "Deploy from GitHub repo"
   - 選擇您的倉庫

3. **配置服務**
   - 點擊新創建的服務
   - 進入 "Settings"
   - 設置 **Root Directory** 為 `backend`

4. **添加環境變量**
   在 "Variables" 標籤中添加：
   ```
   PORT=5000
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   FRONTEND_URL=https://your-frontend.vercel.app
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   FROM_EMAIL=your-email@gmail.com
   ```

5. **部署**
   - Railway 會自動檢測並部署
   - 等待部署完成
   - 複製生成的 URL（例如：`https://your-app.railway.app`）

## 🔄 步驟 3：更新前端環境變量

1. **回到 Vercel 項目設置**

2. **更新環境變量**
   - 進入 "Settings" → "Environment Variables"
   - 編輯 `VITE_API_URL`
   - 更新為：`https://your-backend-url.railway.app/api`
   - 保存

3. **重新部署**
   - 進入 "Deployments"
   - 點擊最新部署右側的 "..." → "Redeploy"

## ✅ 步驟 4：驗證部署

1. **訪問前端 URL**（Vercel 會提供，例如：`https://your-app.vercel.app`）

2. **測試功能**
   - 註冊新用戶
   - 檢查郵箱驗證碼
   - 登入
   - 訪問受保護的頁面

3. **檢查控制台**
   - 打開瀏覽器開發者工具
   - 查看 Network 標籤
   - 確認 API 請求都成功

## 🔧 常見問題解決

### 問題 1：環境變量未生效
**解決方案：**
- 確保變量名以 `VITE_` 開頭（前端）
- 重新部署項目
- 清除瀏覽器緩存

### 問題 2：CORS 錯誤
**解決方案：**
- 檢查後端的 `FRONTEND_URL` 環境變量
- 確保包含完整的前端 URL（包括 `https://`）
- 重新部署後端

### 問題 3：API 請求 404
**解決方案：**
- 檢查 `VITE_API_URL` 是否正確
- 確保後端 URL 包含 `/api` 前綴
- 檢查後端路由是否正確

### 問題 4：構建失敗
**解決方案：**
- 檢查 Vercel 構建日誌
- 確保 `package.json` 中有 `build` 腳本
- 檢查 Node.js 版本兼容性

## 📝 部署檢查清單

- [ ] 代碼已推送到 GitHub
- [ ] 前端已部署到 Vercel
- [ ] 後端已部署到 Railway/Render
- [ ] 所有環境變量已設置
- [ ] 前端 `VITE_API_URL` 指向後端 URL
- [ ] 後端 `FRONTEND_URL` 指向前端 URL
- [ ] MongoDB 連接字符串已配置
- [ ] 郵箱配置已設置
- [ ] 測試註冊功能
- [ ] 測試登入功能
- [ ] 檢查控制台無錯誤

## 🎉 完成！

部署完成後，您的應用應該可以正常運行了！

**前端 URL**: `https://your-app.vercel.app`  
**後端 URL**: `https://your-app.railway.app`

如有問題，請檢查：
- Vercel 部署日誌
- Railway 部署日誌
- 瀏覽器控制台
- 網絡請求

