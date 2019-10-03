# Gulp Workflow

此專案為預設專案，整合了 Gulp 與傳統網頁開發的資料夾配置，即 HTML、styles 與 scripts。

### 資料夾配置：
- src  為開發用資料夾
- dist 為輸出的資料夾

### 支援語法：
- template 支援 HTML、Pug 及 EJS
- styles 支援 CSS 及 SCSS
- scripts 支援 JavaScript 與 TypeScript

### 注意事項
- 使用 Gulp 前，務必先輸入 `npm install -g gulp-cli` 在全域安裝 Gulp-cli 才能正常使用。
- 在開始開發前，務必先輸入 `npm install` 指令來載入 node_modules。
- 為避免使用 Pug 或 EJS 等模板語言時傳值產生編譯錯誤，主頁面預設都放至 src 目錄下（HTML 亦同），分離的模板元件才放至 views 底下。

### npm 指令
- `npm run clean`：清除 dist 資料夾
- `npm run serve`：進入開發模式，包含 Hot Reload 功能
- `npm run build`：輸出專案，會自動壓縮所有檔案
