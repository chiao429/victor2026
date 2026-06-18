# 2026 VICTOR《少年日記》MVP 實作計畫

## 現況

- Repository 目前為空目錄。
- 未找到 `spec.md`、活動企劃書或既有 `README.md`。
- 本次以使用者提供的 MVP Prompt 為唯一可執行規格，活動文案與地圖使用可替換的示範內容。

## Phase 1：分析

1. 建立 npm workspace，分離 `client` 與 `server`。
2. 以 TypeScript 型別與 JSON 管理活動及三個示範關卡。
3. 以前端 Context + `useActivityProgress` 統一管理 localStorage。
4. 後端提供 multipart upload API，支援 mock 與 Google Drive OAuth refresh token。
5. 使用 Vitest、Testing Library 與 Supertest 建立關鍵流程測試。

## 預計新增檔案

- Root：workspace 設定、環境變數範例、gitignore、README。
- Client：Vite 設定、活動資料、型別、進度 hook/context、共用 UI、七類頁面、步驟渲染、上傳服務與測試。
- Server：Express app、upload route/controller、Multer middleware、Google Drive service、設定與測試。

## 技術風險

- Google Drive 真實上傳需要有效的 OAuth Client、refresh token 與資料夾權限；預設使用 mock，避免阻塞本機驗證。
- iOS Safari 的 `capture` 行為依裝置與瀏覽器版本不同，仍保留相簿選擇能力。
- localStorage 只適合單機 MVP；清除瀏覽器資料或更換裝置會失去進度。
- 活動地圖、正式影片與企劃書文案尚未提供，目前以 SVG placeholder 與示範文案代替。
- 使用者直接輸入 URL 的解鎖檢查以「目前進度與已完成關卡」為準；此機制不是安全性權限控制。

## 不影響 MVP 的未確認項目

- 正式活動日期、集合地點、關卡實際地址與地圖。
- 完整故事文本、小隊長逐字稿、品牌字型與主視覺。
- Google Drive 檔案是否需要公開讀取權限；MVP 僅回傳 Drive file ID 與檔名。
- `teamId` 的正式產生方式；MVP 固定為 `default-team`。
- 影片來源與播放政策；架構支援 URL，示範資料不依賴外部影片。

## MVP 外範圍

不加入後台、登入、資料庫、即時監控、多場活動、社群自動發文或 CMS。
