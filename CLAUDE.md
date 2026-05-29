# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

全改成中文溝通

## Commands

```bash
npm install      # 安裝相依套件
npm run dev      # 啟動開發伺服器 http://localhost:3000
npm run build    # 建置正式版本（輸出至 /build）
```

無 lint 或測試腳本。

## Architecture

單頁 React + TypeScript 尋寶遊戲，所有遊戲邏輯集中在 **`src/App.tsx`**。

### 遊戲狀態（`src/App.tsx`）

- `boxes: Box[]` — 3 個寶箱，每個有 `id`, `isOpen`, `hasTreasure`
- `score: number` — 當前分數
- `gameEnded: boolean` — 找到寶藏或全部開完時為 true

### 核心函式

- **`initializeGame()`** — 隨機將寶藏分配給其中一個箱子；掛載時與重置時呼叫
- **`openBox(boxId)`** — 開箱、播音效、更新分數（+$100 寶藏 / -$50 骷髏）、判斷結束條件

### 動畫與音效

- 動畫：**Framer Motion**（從 `motion/react` 匯入）
- 音效：`src/audios/chest_open.mp3`（寶藏）、`chest_open_with_evil_laugh.mp3`（骷髏）
- 自訂游標：開箱前顯示 `src/assets/key.png` 為游標圖示

### UI 元件

- `src/components/ui/` — 46 個預建 **shadcn/ui** 元件（Radix UI + Tailwind）。需要新 UI 時從這裡匯入，勿引入新 UI 函式庫。
- `src/components/figma/ImageWithFallback.tsx` — 有 fallback 的圖片包裝元件
- CSS 變數定義於 `src/styles/globals.css`（設計 token：顏色、字級等）

### Path Aliases

- `@` 對應 `./src`（設定於 `vite.config.ts`）
