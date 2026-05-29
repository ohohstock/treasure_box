執行以下步驟，將專案部署到 Vercel 正式環境並回報 URL：

1. 執行 `npm run build` 建置前端
2. 執行 `vercel --prod --yes` 部署到 Vercel production
3. 從輸出中擷取正式網址（`https://...vercel.app`）並顯示給使用者
