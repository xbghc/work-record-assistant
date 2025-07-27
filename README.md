# 工作记录编写助手 (Work Record Assistant)

一个现代化的工作记录编写工具，帮助用户快速生成专业的工作周报和记录文档。

## ✨ 功能特性

- 📝 **智能表单**: 结构化的工作记录输入界面
- 🎨 **实时预览**: 所见即所得的报告预览
- 📤 **多种导出**: 支持PDF、HTML等多种格式导出
- 💾 **本地存储**: 自动保存工作记录，防止数据丢失
- 📱 **响应式设计**: 支持桌面和移动设备

## 📤 导出选项

### 1. 打印PDF

- **兼容性**: 100% 通用兼容
- **适用场景**: 正式汇报、文档存档、打印需求
- **使用方法**: 点击导出后选择"另存为PDF"

### 2. 浏览器HTML (完整文档)

- **兼容性**: 84.85% 邮件客户端支持
- **适用场景**: 网页分享、存档备份、浏览器查看
- **特点**: 完整HTML文档，最佳视觉效果

### 3. 邮件HTML (内联样式)

- **兼容性**: ~95% 邮件客户端支持
- **适用场景**: 直接复制到邮件正文
- **特点**: 内联样式，最高邮件兼容性

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
npm run build

# Runs the end-to-end tests
npm run test:e2e
# Runs the tests only on Chromium
npm run test:e2e -- --project=chromium
# Runs the tests of a specific file
npm run test:e2e -- tests/example.spec.ts
# Runs the tests in debug mode
npm run test:e2e -- --debug
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
