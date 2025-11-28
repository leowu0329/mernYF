# 路由問題診斷

## 程式碼檢查結果

✅ **路由定義正確** (`src/App.jsx`)
- `/reset-password` 路由已正確定義在第 20 行
- `ResetPassword` 組件已正確導入

✅ **Router 配置正確** (`src/main.jsx`)
- `BrowserRouter` 已正確包裹應用

✅ **組件存在** (`src/pages/ResetPassword.jsx`)
- 組件完整且功能正常

✅ **Vercel 配置** (`vercel.json`)
- 已簡化為最簡單的 rewrites 規則

## 問題根源分析

根據 "Cannot GET /reset-password" 錯誤，這**不是程式碼問題**，而是 **Vercel 部署配置問題**。

### 可能的原因：

1. **Root Directory 未設定**
   - Vercel 在專案根目錄尋找文件
   - 找不到 `vercel.json` 和建置輸出

2. **建置輸出目錄錯誤**
   - Vercel 找不到 `dist/index.html`

3. **框架未正確識別**
   - Vercel 沒有識別為 Vite 專案

## 解決方案

### 步驟 1: 確認 Vercel 專案設定

在 Vercel 控制台檢查：

```
Settings > General
├── Root Directory: frontend  ← 必須是這個！
├── Framework Preset: Vite
├── Build Command: npm run build
├── Output Directory: dist
└── Install Command: npm install
```

### 步驟 2: 驗證建置輸出

在 Vercel 部署日誌中應該看到：

```
> npm run build
> vite build

vite v5.x.x building for production...
✓ built in XXXms

dist/index.html                    X.XX kB
dist/assets/index-XXXXX.js         XXX.XX kB
dist/assets/index-XXXXX.css        XX.XX kB
```

### 步驟 3: 測試本地建置

在本地測試建置：

```bash
cd frontend
npm run build
```

檢查 `dist` 目錄：
- 應該有 `index.html`
- 應該有 `assets/` 目錄
- `index.html` 中應該有正確的 script 標籤

### 步驟 4: 檢查部署後的響應

訪問部署後的 URL，檢查響應：

**正確的響應**：
- Status: 200 OK
- Content-Type: text/html
- 響應內容是 HTML（包含 `<div id="root"></div>`）

**錯誤的響應**：
- Status: 404 Not Found
- Content-Type: text/html
- 響應內容是 "Cannot GET /reset-password"

## 驗證方法

### 方法 1: 檢查首頁

訪問：
```
https://你的域名.vercel.app/
```

如果首頁可以正常顯示，但 `/reset-password` 不行，問題在 rewrites 規則。

### 方法 2: 檢查靜態資源

訪問：
```
https://你的域名.vercel.app/assets/index-XXXXX.js
```

如果靜態資源可以訪問，但路由不行，確認是 rewrites 問題。

### 方法 3: 檢查 Vercel 部署日誌

在 Vercel 控制台查看：
1. **Deployments** > 最新部署
2. **Build Logs**
3. 確認：
   - 是否在 `frontend` 目錄執行
   - 是否成功建置
   - 是否有錯誤訊息

## 最終檢查清單

- [ ] Root Directory 設為 `frontend`
- [ ] Framework Preset 是 `Vite`
- [ ] Build Command 是 `npm run build`
- [ ] Output Directory 是 `dist`
- [ ] `frontend/vercel.json` 存在且內容正確
- [ ] 建置日誌顯示成功
- [ ] `dist/index.html` 存在
- [ ] 首頁可以正常訪問
- [ ] 重新部署後測試

## 如果仍然無法解決

請提供以下資訊：

1. Vercel 專案設定截圖（Settings > General）
2. 建置日誌截圖
3. 訪問 `/reset-password` 時的 Network 標籤截圖
4. 訪問首頁 `/` 是否正常

