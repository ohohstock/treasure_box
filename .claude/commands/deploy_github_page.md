# 部署到 GitHub Pages

目標倉庫：`https://github.com/ohohstock/treasure_box.git`
部署分支：`gh-pages`
正式網址：`https://ohohstock.github.io/treasure_box/`

執行以下所有步驟，每步完成後向使用者回報狀態。遇到錯誤時停下來說明原因並引導解決。

---

## 步驟一：檢查必要工具

依序執行以下檢查：

1. **檢查 git**
   ```
   git --version
   ```
   若失敗：告知使用者至 https://git-scm.com/downloads 安裝 Git，安裝完畢後重新執行指令。

2. **檢查 gh CLI**
   ```
   gh --version
   ```
   若失敗：告知使用者執行 `winget install --id GitHub.cli` 安裝 GitHub CLI，或至 https://cli.github.com 下載。安裝完畢後重新執行指令。

3. **檢查 Node.js / npm**
   ```
   node --version
   npm --version
   ```
   若失敗：告知使用者至 https://nodejs.org 安裝 Node.js LTS 版本。

---

## 步驟二：GitHub 登入驗證

執行：
```
gh auth status
```

若輸出包含 `Logged in to github.com`：顯示「已登入 GitHub，繼續下一步」。

若未登入（輸出含 `not logged`）：
- 告知使用者需要登入 GitHub
- 請使用者在終端機執行：`! gh auth login`（選擇 GitHub.com → HTTPS → Login with a web browser）
- 等待使用者確認登入完成後，再次執行 `gh auth status` 驗證

---

## 步驟三：確認 / 建立 GitHub 倉庫

1. 檢查倉庫是否已存在：
   ```
   gh repo view ohohstock/treasure_box --json name,url,defaultBranchRef
   ```

2. **若倉庫存在**：顯示倉庫資訊，繼續下一步。

3. **若倉庫不存在**（錯誤含 `Could not resolve`）：
   建立公開倉庫：
   ```
   gh repo create ohohstock/treasure_box --public --description "Interactive Treasure Box Game" --source . --remote origin
   ```
   若 `--source .` 因為尚未 git init 而失敗，先執行步驟四再回來建立 remote。

---

## 步驟四：初始化本地 Git 倉庫

1. 檢查是否已初始化：
   ```
   git status
   ```

2. **若尚未初始化**（`not a git repository`）：
   ```
   git init
   git branch -M main
   ```

3. 確認 remote origin 是否正確設定：
   ```
   git remote -v
   ```

4. **若 remote origin 不存在或不正確**：
   ```
   git remote remove origin
   git remote add origin https://github.com/ohohstock/treasure_box.git
   ```
   若 remove 失敗（不存在）就直接 add。

5. 驗證 remote：
   ```
   git remote -v
   ```
   確認顯示 `origin  https://github.com/ohohstock/treasure_box.git`

---

## 步驟五：設定 Vite base 路徑（GitHub Pages 必須）

讀取 `vite.config.ts`，確認 `base` 設定：

- **若已有 `base: '/treasure_box/'`**：略過此步驟。
- **若沒有 `base` 設定**：在 `defineConfig({` 內、`plugins:` 之前加入：
  ```typescript
  base: '/treasure_box/',
  ```
  修改後確認 vite.config.ts 內容正確。

---

## 步驟六：安裝 gh-pages 套件

檢查 package.json 的 devDependencies 是否已有 `gh-pages`：

- **若已有**：略過。
- **若沒有**：
  ```
  npm install --save-dev gh-pages
  ```

---

## 步驟七：設定 package.json 部署腳本

讀取 `package.json`，確認 scripts 區塊：

- **若已有 `"deploy"` 腳本**：略過。
- **若沒有**：在 scripts 加入：
  ```json
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
  ```

---

## 步驟八：確認 .gitignore 設定正確

讀取 `.gitignore`，確認：
- `node_modules/` 已被排除 ✓
- `build/` 已被排除 ✓（gh-pages 會處理，不需 commit）
- `.env.local` 或 `.env.*` 已被排除 ✓（保護敏感金鑰）

若發現 `.env.local` 未被忽略，立即加入 .gitignore。

---

## 步驟九：建置專案

```
npm run build
```

若建置失敗：
- 顯示完整錯誤訊息
- 嘗試判斷原因（TypeScript 錯誤、缺少依賴等）
- 提供修復建議，不要強制繼續

建置成功後確認 `build/` 目錄存在且包含 `index.html`。

---

## 步驟十：部署到 gh-pages 分支

```
npm run deploy
```

這會自動執行 build（predeploy）並將 `build/` 目錄推送到 `gh-pages` 分支。

若失敗並顯示權限錯誤：
- 確認 gh auth 登入狀態
- 確認 remote URL 正確
- 若需要 token：執行 `gh auth token` 取得，再設定 remote：
  ```
  git remote set-url origin https://$(gh auth token)@github.com/ohohstock/treasure_box.git
  ```
  然後重試 `npm run deploy`

---

## 步驟十一：推送原始碼到 main 分支

1. 建立 .gitignore 確保敏感檔案不上傳（已在步驟八確認）。

2. 暫存所有檔案：
   ```
   git add .
   ```

3. 確認即將 commit 的檔案清單（避免包含 node_modules、.env.local 等）：
   ```
   git status
   ```
   若看到不應上傳的檔案，先修正 .gitignore。

4. 建立 commit：
   ```
   git commit -m "feat: initial treasure box game"
   ```
   若沒有任何變更（already up to date），略過 commit。

5. 推送到 main：
   ```
   git push -u origin main
   ```
   若推送失敗（remote 已有內容）：
   ```
   git pull origin main --allow-unrelated-histories
   git push -u origin main
   ```

---

## 步驟十二：啟用 GitHub Pages

確認 GitHub Pages 已設定為從 `gh-pages` 分支提供服務：

```
gh api repos/ohohstock/treasure_box/pages --method POST -f source[branch]=gh-pages -f source[path]=/ 2>&1 || gh api repos/ohohstock/treasure_box/pages --method PUT -f source[branch]=gh-pages -f source[path]=/
```

若 API 回傳 409（已存在）或 200：表示設定成功，繼續。
若失敗：請使用者手動至 `https://github.com/ohohstock/treasure_box/settings/pages` → Source → Deploy from a branch → 選 `gh-pages` → `/(root)` → Save

---

## 步驟十三：驗證部署結果

1. 查看 Pages 設定：
   ```
   gh api repos/ohohstock/treasure_box/pages --jq '{url: .html_url, status: .status}'
   ```

2. 顯示部署資訊給使用者：
   - 倉庫網址：`https://github.com/ohohstock/treasure_box`
   - 正式網址：`https://ohohstock.github.io/treasure_box/`
   - 說明：GitHub Pages 通常需要 1~3 分鐘才能生效，若網站尚未出現請稍候再試。

3. 顯示最終成功訊息：
   ```
   ✅ 部署完成！
   📦 原始碼：https://github.com/ohohstock/treasure_box
   🌐 遊戲網址：https://ohohstock.github.io/treasure_box/
   ```

---

## 注意事項

- 每次更新遊戲後，只需再執行 `npm run deploy` 即可重新部署
- `.env.local` 內的 Supabase 金鑰**絕對不能** commit 到 GitHub
- 若要在 GitHub Pages 上使用 Supabase，需將環境變數設為 `VITE_` 前綴且在 build 時注入（未來實作登入功能時處理）
