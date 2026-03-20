# 後端部署指南 — 10 分鐘上線

## 步驟一：把後端推上 GitHub

1. 去 github.com → 右上角 "+" → "New repository"
2. 名稱填 `zhangbao-backend`，選 Public，按 "Create repository"
3. Terminal 執行：

```bash
cd ~/Desktop
cp -r /path/to/zhangbao-backend .
cd zhangbao-backend
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/你的帳號/zhangbao-backend.git
git push -u origin main
```

## 步驟二：部署到 Vercel

1. 去 vercel.com，用 GitHub 登入
2. 點 "Add New Project"
3. 選 `zhangbao-backend` repository → Import
4. 不用改任何設定，直接按 "Deploy"
5. 部署完會給你一個網址，例如 `https://zhangbao-backend.vercel.app`

## 步驟三：設定 API Key

1. Vercel 專案裡點 "Settings" → "Environment Variables"
2. 新增一個變數：
   - Name: `ANTHROPIC_API_KEY`
   - Value: 貼上你的 `sk-ant-...` key
3. 按 Save，然後點 "Deployments" → 最新一筆右側 "..." → "Redeploy"

## 步驟四：更新 App 裡的 API 網址

打開 `src/services/invoiceService.ts`，把：
```
const API_BASE = 'https://zhangbao-backend.vercel.app';
```
換成你實際的 Vercel 網址。

## 步驟五：測試

Terminal 跑 `npx expo start`，掃 QR Code，
去掃描頁拍一張真實發票，看看 AI 能不能辨識出來！
