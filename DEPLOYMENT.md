# Vercel 部署指南

## 前端部署到 Vercel

### 方法一：使用 Vercel CLI（推薦）

1. **安裝 Vercel CLI**
```bash
npm i -g vercel
```

2. **登入 Vercel**
```bash
vercel login
```

3. **在 frontend 目錄中部署**
```bash
cd frontend
vercel
```

4. **設置環境變量**
在 Vercel 儀表板中，進入項目設置 → Environment Variables，添加：
```
VITE_API_URL=https://your-backend-url.com/api
```
（將 `your-backend-url.com` 替換為您的後端部署地址）

### 方法二：使用 GitHub 集成

1. **將代碼推送到 GitHub**
```bash
git add .
git commit -m "準備部署到 Vercel"
git push origin main
```

2. **在 Vercel 網站上**
   - 訪問 https://vercel.com
   - 點擊 "New Project"
   - 導入您的 GitHub 倉庫
   - **重要**：設置 Root Directory 為 `frontend`
   - 添加環境變量 `VITE_API_URL`

3. **構建設置**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

## 後端部署（重要）

⚠️ **注意**：Vercel 主要用於前端靜態網站。後端需要部署到其他平台：

### 推薦選項：

#### 1. Railway（推薦）
- 訪問 https://railway.app
- 連接 GitHub 倉庫
- 設置 Root Directory 為 `backend`
- 添加環境變量：
  ```
  PORT=5000
  MONGODB_URI=your-mongodb-connection-string
  JWT_SECRET=your-secret-key
  JWT_EXPIRE=7d
  EMAIL_HOST=smtp.gmail.com
  EMAIL_PORT=587
  EMAIL_USER=your-email@gmail.com
  EMAIL_PASS=your-app-password
  FROM_EMAIL=your-email@gmail.com
  ```

#### 2. Render
- 訪問 https://render.com
- 創建新的 Web Service
- 連接 GitHub 倉庫
- 設置 Root Directory 為 `backend`
- 添加相同的環境變量

#### 3. Heroku
- 訪問 https://heroku.com
- 創建新應用
- 連接 GitHub 倉庫
- 設置環境變量

## 部署後步驟

1. **更新前端環境變量**
   在 Vercel 中將 `VITE_API_URL` 更新為後端的實際 URL

2. **測試部署**
   - 訪問前端 URL
   - 測試註冊、登入等功能
   - 檢查控制台是否有錯誤

3. **配置 CORS**
   確保後端的 CORS 設置允許前端域名：
   ```javascript
   app.use(cors({
     origin: ['https://your-frontend.vercel.app', 'http://localhost:3000']
   }));
   ```

## 常見問題

### 問題：環境變量未生效
- 確保變量名以 `VITE_` 開頭（Vite 要求）
- 重新部署項目

### 問題：API 請求失敗
- 檢查後端是否正常運行
- 檢查 CORS 設置
- 檢查環境變量中的 API URL 是否正確

### 問題：構建失敗
- 檢查 Node.js 版本（Vercel 自動檢測）
- 檢查 package.json 中的構建腳本
- 查看 Vercel 構建日誌

