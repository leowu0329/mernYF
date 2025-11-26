# Vercel 環境變數設定指南

## 問題說明

重設密碼郵件中的連結顯示 `http://localhost:3000`，這是因為後端沒有正確讀取到前端的生產環境 URL。

## 解決方案

### 後端環境變數設定

在 Vercel 後端的 **Settings > Environment Variables** 中，必須設定：

```
FRONTEND_URL=https://你的前端域名.vercel.app
```

**重要**：
- 不要包含結尾的斜線 `/`
- 使用 `https://` 協議
- 這是你的**前端**部署的完整 URL

### 範例

如果你的前端部署在 `https://mern-auth-frontend.vercel.app`，則設定：

```
FRONTEND_URL=https://mern-auth-frontend.vercel.app
```

### 完整後端環境變數清單

確保以下環境變數都已設定：

```
MONGODB_URI=你的MongoDB連接字串
JWT_SECRET=你的JWT密鑰
JWT_EXPIRE=30d
FRONTEND_URL=https://你的前端域名.vercel.app  ← 這個很重要！
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=你的郵箱
EMAIL_PASS=你的應用程式密碼
FROM_EMAIL=你的郵箱
```

## 設定步驟

1. 登入 Vercel
2. 選擇你的**後端**專案
3. 進入 **Settings** > **Environment Variables**
4. 新增或編輯 `FRONTEND_URL`
5. 輸入你的前端完整 URL（例如：`https://mern-auth-frontend.vercel.app`）
6. 選擇環境（Production、Preview、Development）
7. 點擊 **Save**
8. **重新部署**後端（或等待下次自動部署）

## 驗證

設定完成並重新部署後：

1. 測試重設密碼功能
2. 檢查收到的郵件
3. 確認連結中的 URL 是正確的前端生產環境 URL，而不是 `localhost:3000`

## 注意事項

- 如果前端和後端都在 Vercel 上，確保 `FRONTEND_URL` 指向正確的前端專案 URL
- 每次修改環境變數後，Vercel 會自動觸發重新部署
- 可以在 Vercel 的部署日誌中查看 `console.log('Reset password URL:', resetUrl)` 來確認 URL 是否正確

