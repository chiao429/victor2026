# 2026 VICTOR 維克特體驗活動《少年日記》

手機優先的單隊活動體驗網站。小隊長使用一支手機，自由選擇體驗、帶領討論、輸入文字與選擇照片；已走訪與完成的體驗會保留為活動進度。

## 技術

- Client：React 19、Vite、TypeScript、React Router、原生 CSS
- Server：Node.js、Express、TypeScript
- 進度：瀏覽器 `localStorage`
- 照片：只在目前瀏覽器預覽，不上傳或保存
- 部署：Vercel 靜態前端與 Express Function

## 開始使用

需要 Node.js 20 以上版本。

```bash
npm install
npm run dev
```

- 前端：http://localhost:5173
- API：http://localhost:3001
- 健康檢查：http://localhost:3001/api/health

## 驗證

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## 照片處理

照片步驟接受 JPEG、PNG、WEBP，檔案不可超過 10 MB。選取後只會在目前頁面建立本機預覽，不會送往 API、寫入磁碟或上傳雲端。

重新整理頁面後不會保留照片內容，但瀏覽器會在 `localStorage` 記錄該步驟已選過照片，讓活動可以繼續。

## 部署到 Vercel

Repository 根目錄的 `vercel.json` 已設定：

- Build Command：`npm run build -w client`
- Output Directory：`client/dist`
- `/api/health`：Express Function 健康檢查
- 其他網址：回到 `index.html`，支援 React Router 深層路由

匯入 GitHub repository 後可直接部署，不需要環境變數。之後 push 到 `main` 會觸發 Production deployment。

## 活動內容

活動文案與三個示範體驗位於 `client/src/data/activity.json`。地圖與圖片目前是可替換的 SVG placeholder。

## MVP 限制

- 單一瀏覽器、單一隊伍
- 清除瀏覽器資料或更換裝置會失去進度
- 照片不會保存，重新整理後也無法恢復預覽
- 無登入、後台、資料庫或即時監控
