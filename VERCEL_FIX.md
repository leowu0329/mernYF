# Vercel SPA 路由問題修復指南

## 問題
訪問 `/reset-password?token=...` 時出現 "Cannot GET /reset-password"

## 解決方案

### 1. 確認 vercel.json 配置

確保 `frontend/vercel.json` 存在且內容如下：

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 2. 檢查 Vercel 專案設定

在 Vercel 控制台中：

1. 進入你的前端專案
2. 進入 **Settings** > **General**
3. 確認以下設定：
   - **Framework Preset**: 應該是 `Vite` 或自動偵測
   - **Root Directory**: 應該是 `frontend`（如果專案在 monorepo 中）
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 3. 檢查建置輸出

確保建置成功且 `dist` 目錄包含：
- `index.html`
- `assets/` 目錄（包含 JS/CSS 文件）

### 4. 重新部署

1. 在 Vercel 控制台點擊 **Redeploy**
2. 或推送新的 commit 觸發自動部署

### 5. 清除快取

如果問題仍然存在：
1. 在瀏覽器中清除快取
2. 或使用無痕模式測試
3. 檢查 Vercel 的部署日誌確認配置是否正確應用

### 6. 驗證配置

部署完成後，檢查：
- 訪問首頁是否正常
- 訪問 `/reset-password`（無 token）是否顯示頁面（即使 token 無效）
- 檢查瀏覽器開發者工具的 Network 標籤，確認請求返回的是 HTML 而不是 404

## 替代方案

如果上述方法仍無法解決，可以嘗試：

### 方案 A: 使用 cleanUrls

```json
{
  "cleanUrls": true,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 方案 B: 明確指定框架

在 Vercel 專案設定中，手動設定：
- Framework: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

### 方案 C: 檢查檔案位置

確保 `vercel.json` 在 `frontend` 目錄的根目錄，而不是專案根目錄。

## 常見問題

**Q: 為什麼還是出現 404？**
A: 可能是 Vercel 沒有正確讀取 `vercel.json`，檢查檔案是否在正確位置。

**Q: 首頁可以訪問，但其他路由不行？**
A: 確認 `rewrites` 規則正確，且 React Router 配置正確。

**Q: 部署後配置沒有生效？**
A: 清除瀏覽器快取，或等待幾分鐘讓 CDN 更新。

